import { useUser } from "@clerk/clerk-expo";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { addDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../../config/FirebaseConfig";
import Colors from "../../../constants/Colors";

export default function AddNewPet({ pet }) {
  const [formData, setFormData] = useState({
    category: "Dogs",
    sex: "Male",
  });
  const [gender, setGender] = useState();

  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [image, setImage] = useState();
  const [loader, setLoader] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    GetCategories();
  }, []);

  const GetCategories = async () => {
    const snapshot = await getDocs(collection(db, "Category"));
    const list = snapshot.docs.map((doc) => doc.data());
    setCategoryList(list);

    if (list.length > 0) {
      setFormData((prev) => ({
        ...prev,
        category: list[0].name,
      }));
    }
  };

  const imagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const onSubmit = async () => {
    if (Object.keys(formData).length != 8) {
      ToastAndroid.show("Enter All Information", ToastAndroid.SHORT);
      return;
    }
    setLoader(true);

    try {
      const imageUrl = await uploadToCloudinary();
      console.log("IMAGE URL:", imageUrl);

      const docRef = await addDoc(collection(db, "Pets"), {
        ...formData,
        imageUrl: imageUrl,
        createdAt: new Date(),
        userName: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        userImage: user?.imageUrl,
      });

      await updateDoc(docRef, {
        id: docRef.id,
      });

      ToastAndroid.show("Pet Added!", ToastAndroid.SHORT);
    } catch (e) {
      console.log(e);
    } finally {
      setLoader(false);
      router.replace("/(tabs)/home");
    }
  };

  const uploadToCloudinary = async () => {
    const data = new FormData();

    data.append("file", {
      uri: image,
      type: "image/jpeg",
      name: "pet.jpg",
    });

    data.append("upload_preset", "petApp");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/df0tnwb8g/image/upload",
      {
        method: "POST",
        body: data,
      },
    );
    const result = await res.json();
    return result.secure_url;
  };

  return (
    <ScrollView
      style={{
        padding: 20,
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-medium",
          fontSize: 20,
        }}
      >
        Add New Pet for adoption
      </Text>

      <Pressable onPress={imagePicker}>
        {!image ? (
          <Image
            source={require("../../../assets/images/add-pet.png")}
            style={{
              width: 100,
              height: 100,
              borderRadius: 15,
              borderWidth: 1,
              borderColor: Colors.GRAY,
            }}
          />
        ) : (
          <Image
            style={{
              width: 100,
              height: 100,
              borderRadius: 15,
            }}
            source={{ uri: image }}
          />
        )}
      </Pressable>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pet Name *</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleInputChange("name", value)}
          placeholder="Pet Name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pet Category *</Text>
        <Picker
          style={styles.input}
          selectedValue={formData.category}
          onValueChange={(itemValue) => {
            handleInputChange("category", itemValue);
          }}
        >
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
        <Text style={styles.label}>Breed *</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleInputChange("breed", value)}
          placeholder="Pet Breed"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Age *</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric-pad"
          onChangeText={(value) => handleInputChange("age", value)}
          placeholder="Pet Age"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Gender *</Text>
        <Picker
          style={styles.input}
          selectedValue={gender}
          onValueChange={(itemValue, itemIndex) => {
            setGender(itemValue);
            handleInputChange("sex", itemValue);
          }}
        >
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Weight *</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric-pad"
          onChangeText={(value) => handleInputChange("weight", value)}
          placeholder="Pet Weight"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Address *</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleInputChange("address", value)}
          placeholder="Address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>About Pet *</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline={true}
          onChangeText={(value) => handleInputChange("about", value)}
          placeholder="Details about pet"
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        disabled={loader}
        onPress={onSubmit}
      >
        {loader ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <Text
            style={{
              fontFamily: "outfit-medium",
              textAlign: "center",
            }}
          >
            Submit
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
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
