import { useUser } from "@clerk/clerk-expo";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AboutPet from "../../../components/PetDetails/AboutPet";
import OwnerInfo from "../../../components/PetDetails/OwnerInfo";
import PetInfo from "../../../components/PetDetails/PetInfo";
import PetSubInfo from "../../../components/PetDetails/PetSubInfo";
import { db } from "../../../config/FirebaseConfig";
import Colors from "../../../constants/Colors";

export default function PetDetails() {
  const { pet } = useLocalSearchParams();
  const parsedPet = JSON.parse(pet);
  const { user } = useUser();
  const router = useRouter();
  // const navigation = useNavigation();

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerTransparent: true,
  //     headerTitle: "",
  //   });
  // }, []);

  const InitiateChat = async () => {
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    const petEmail = parsedPet?.email;

    if (!userEmail || !petEmail) return;

    if (userEmail === petEmail) {
      console.log("❌ Cannot chat with yourself");
      return;
    }

    const chatId = [userEmail, petEmail].sort().join("_");

    const docRef = doc(db, "Chat", chatId);
    const docSnap = await getDocs(
      query(collection(db, "Chat"), where("id", "==", chatId)),
    );

    if (docSnap.empty) {
      await setDoc(docRef, {
        id: chatId,
        userIds: [userEmail, petEmail],
        users: [
          {
            email: userEmail,
            imageUrl: user?.imageUrl || "",
            name: user?.fullName || "User",
          },
          {
            email: petEmail,
            imageUrl: parsedPet?.userImage || "",
            name: parsedPet?.userName || "Owner",
          },
        ],
      });
    }

    router.push({
      pathname: "/chat",
      params: { id: chatId },
    });
  };

  return (
    <View>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
        }}
      />
      <ScrollView>
        {/* Pet Info */}
        <PetInfo pet={parsedPet} />

        {/* Pet Properties */}
        <PetSubInfo pet={parsedPet} />

        {/* About Pet */}
        <AboutPet pet={parsedPet} />

        {/* Owner Details */}
        <OwnerInfo pet={parsedPet} InitiateChat={InitiateChat} />
        <View
          style={{
            height: 70,
          }}
        ></View>
      </ScrollView>
      {/* Adopt me button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={InitiateChat} style={styles.adoptBtn}>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "outfit-medium",
              fontSize: 20,
            }}
          >
            Adopt Me
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  adoptBtn: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
  },
  bottomContainer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
});
