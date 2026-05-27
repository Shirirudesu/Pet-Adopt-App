import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { db } from "../../config/FirebaseConfig";
import Category from "./Category";
import PetListItem from "./PetListItem";

export default function PetListByCategory() {
  const [petList, setPetList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    GetPetList("Rodents");
  }, []);

  // const GetPetList = async (category) => {
  //   setLoader(true);
  //   setPetList([]);
  //   const q = query(collection(db, "Pets"), where("category", "==", category));
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     setPetList((petList) => [...petList, doc.data()]);
  //   });
  //   setLoader(false);
  // };

  const GetPetList = async (category) => {
    setLoader(true);

    const q = query(collection(db, "Pets"), where("category", "==", category));
    const querySnapshot = await getDocs(q);

    const result = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setPetList(result);
    setLoader(false);
  };

  return (
    <View>
      <Category onCategorySelect={(value) => GetPetList(value)} />
      <FlatList
        style={{
          marginTop: 10,
        }}
        data={petList}
        horizontal={true}
        refreshing={loader}
        onRefresh={() => GetPetList("Rodents")}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <PetListItem pet={item} />}
      />
    </View>
  );
}
