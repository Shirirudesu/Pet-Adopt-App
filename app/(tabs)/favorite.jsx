import { useUser } from "@clerk/clerk-expo";
import { Picker } from "@react-native-picker/picker";
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import Shared from "../../Shared/Shared";
import PetListItem from "../../components/Home/PetListItem";
import { db } from "../../config/FirebaseConfig";
import Colors from "../../constants/Colors";

export default function Favorite() {
  const { user } = useUser();
  const [favIds, setFavIds] = useState([]);
  const [favPetList, setFavPetList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [filteredPets, setFilteredPets] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  //filters
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  useEffect(() => {
    GetCategories();
  }, []);

  const GetCategories = async () => {
    const snapshot = await getDocs(collection(db, "Category"));
    const list = snapshot.docs.map((doc) => doc.data());
    setCategoryList(list);
  };

  useEffect(() => {
    user && GetFavPetIds();
  }, [user]);

  const GetFavPetIds = async () => {
    setLoader(true);
    const result = await Shared.GetFavList(user);
    const ids = result?.favorites || [];
    setFavIds(ids);
    setLoader(false);
    GetFavPetList(ids);
    console.log("FAV IDS:", ids);
  };

  const GetFavPetList = async (ids) => {
    try {
      setLoader(true);

      if (!ids || ids.length === 0) {
        setFavPetList([]);
        return;
      }
      const cleanIds = ids.filter((id) => id && id.length > 10);

      const q = query(
        collection(db, "Pets"),
        where(documentId(), "in", cleanIds),
      );

      const querySnapshot = await getDocs(q);
      const pets = [];
      querySnapshot.forEach((doc) => {
        console.log("DOC:", doc.id, doc.data());
        pets.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setFavPetList(pets);
    } catch (e) {
      console.log("ERROR:", e);
    } finally {
      setLoader(false);
    }
  };

  const applyFilters = () => {
    let data = favPetList;

    if (searchText) {
      const text = searchText.toLowerCase();

      data = data.filter(
        (pet) =>
          pet.name?.toLowerCase().includes(text) ||
          pet.breed?.toLowerCase().includes(text),
      );
    }
    if (selectedCategory) {
      data = data.filter((pet) => pet.category === selectedCategory);
    }
    if (selectedGender) {
      data = data.filter((pet) => pet.sex === selectedGender);
    }
    setFilteredPets(data);
  };

  useEffect(() => {
    applyFilters();
  }, [searchText, selectedCategory, selectedGender, favPetList]);

  return (
    <View
      style={{
        padding: 20,
        marginTop: 20,
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-medium",
          fontSize: 30,
        }}
      >
        Favorites
      </Text>
      <TextInput
        placeholder="Search"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      {favPetList?.length == 0 && <Text>No Favorite Pets</Text>}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Choose Pet Category</Text>
        <Picker
          style={styles.input}
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        >
          <Picker.Item label="All" value="" />
          {categoryList.map((category, index) => (
            <Picker.Item
              key={index}
              label={category.name}
              value={category.name}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Choose Pet Gender</Text>
        <Picker
          style={styles.input}
          selectedValue={selectedGender}
          onValueChange={(itemValue) => setSelectedGender(itemValue)}
        >
          <Picker.Item label="All" value="" />
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
        </Picker>
      </View>

      <FlatList
        data={filteredPets}
        numColumns={2}
        onRefresh={GetFavPetIds}
        refreshing={loader}
        renderItem={({ item, index }) => (
          <View>
            <PetListItem pet={item} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 5,
  },
  input: {
    padding: 10,
    backgroundColor: Colors.WHITE,
    borderRadius: 7,
    fontFamily: "outfit",
  },
  label: {
    marginVertical: 5,
    fontFamily: "outfit",
  },
  button: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 7,
    marginVertical: 10,
    marginBottom: 50,
  },
});
