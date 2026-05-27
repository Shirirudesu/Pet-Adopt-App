import { useUser } from "@clerk/clerk-expo";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import PetListItem from "../../../components/Home/PetListItem";
import { db } from "../../../config/FirebaseConfig";
import Colors from "../../../constants/Colors";

export default function UserPost() {
  const { user } = useUser();
  const [userPostList, setUserPostList] = useState([]);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    user && GetUserPost();
  }, [user]);

  const GetUserPost = async () => {
    setLoader(true);
    const q = query(
      collection(db, "Pets"),
      where("email", "==", user?.primaryEmailAddress?.emailAddress),
    );
    const querySnapshot = await getDocs(q);
    const posts = [];

    querySnapshot.forEach((docSnap) => {
      posts.push({
        id: docSnap.id,
        ...docSnap.data(),
      });
    });
    setUserPostList(posts);
    setLoader(false);
  };

  const OnDeletePost = (docId) => {
    Alert.alert(
      "Do you want to delete this post?",
      "Do you really want to delete this post?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Click"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deletePost(docId),
        },
      ],
    );
  };

  const deletePost = async (docId) => {
    await deleteDoc(doc(db, "Pets", docId));
    GetUserPost();
  };

  return (
    <View
      style={{
        padding: 20,
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-medium",
          fontSize: 30,
        }}
      >
        UserPost
      </Text>

      <FlatList
        data={userPostList}
        refreshing={loader}
        onRefresh={GetUserPost}
        renderItem={({ item, index }) => (
          <View>
            <PetListItem key={index} pet={item} />
            <Pressable
              onPress={() => OnDeletePost(item?.id)}
              style={styles.deleteBtn}
            >
              <Text
                style={{
                  fontFamily: "outfit",
                  textAlign: "center",
                }}
              >
                Delete
              </Text>
            </Pressable>
          </View>
        )}
      />

      {userPostList?.length == 0 && <Text>No Posts Found</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  deleteBtn: {
    backgroundColor: Colors.LIGHT_PRIMARY,
    padding: 5,
    marginTop: 5,
    borderRadius: 7,
    marginRight: 10,
  },
});
