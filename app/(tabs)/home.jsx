import { useAuth } from "@clerk/clerk-expo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Header from "../../components/Home/Header";
import PetListByCategory from "../../components/Home/PetListByCategory";
import Slider from "../../components/Home/Slider";
import Colors from "../../constants/Colors";

export default function Home() {
  const { signOut } = useAuth();

  return (
    <View
      style={{
        padding: 20,
        marginTop: 20,
      }}
    >
      {/* Header */}
      <Header />
      {/* Slider */}
      <Slider />
      {/*  List Of Pets + Category */}
      <PetListByCategory />
      {/* /* Add New Pet Option */}

      <Link href="/add-new-pet" style={styles.addNewPetContainer}>
        <MaterialIcons name="pets" size={24} color={Colors.PRIMARY} />
        <Text
          style={{
            fontFamily: "outfit-medium",
            color: Colors.PRIMARY,
            fontSize: 18,
          }}
        >
          Add New Pet
        </Text>
      </Link>

      {/* <Pressable onPress={() => signOut()} style={styles.logoutButton}>
        <Text style={{ color: "white", textAlign: "center" }}>Logout</Text>
      </Pressable> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // logoutButton: {
  //   padding: 12,
  //   backgroundColor: "red",
  //   borderRadius: 10,
  //   marginTop: 20,
  //   width: 200,
  // },
  addNewPetContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 20,
    marginTop: 20,
    backgroundColor: Colors.LIGHT_PRIMARY,
    textAlign: "center",
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 15,
    borderStyle: "dashed",
    justifyContent: "center",
  },
});
