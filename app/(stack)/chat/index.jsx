import { useUser } from "@clerk/clerk-expo";
import { useHeaderHeight } from "@react-navigation/elements";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../../config/FirebaseConfig";

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation();
  const { user } = useUser();
  const [otherUser, setOtherUser] = useState(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const chatId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : null;

  useEffect(() => {
    if (!chatId || !user) return;
    GetUserDetails();

    const q = query(
      collection(db, "Chat", chatId, "Messages"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId, user]);

  const GetUserDetails = async () => {
    // const chatId = Array.isArray(params.id) ? params.id[0] : params.id;
    const docRef = doc(db, "Chat", chatId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("❌ Chat not found");
      return;
    }
    const result = docSnap.data();

    const other = result?.users?.find(
      (item) => item.email !== user?.primaryEmailAddress?.emailAddress,
    );

    setOtherUser(other);

    navigation.setOptions({
      title: other?.name || "Chat",
      headerRight: () => (
        <Image
          source={{ uri: other?.imageUrl }}
          style={{ width: 30, height: 30, borderRadius: 15 }}
        />
      ),
    });
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    if (!chatId) return;

    await addDoc(collection(db, "Chat", chatId, "Messages"), {
      text,
      createdAt: serverTimestamp(),
      userId: user?.primaryEmailAddress?.emailAddress,
      name: user?.fullName,
      avatar: user?.imageUrl,
    });

    setText("");
  };

  const renderItem = ({ item }) => {
    const isMe = item.userId === user?.primaryEmailAddress?.emailAddress;

    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myContainer : styles.otherContainer,
        ]}
      >
        {!isMe && (
          <Image
            source={{ uri: item.avatar || "https://via.placeholder.com/150" }}
            style={styles.avatar}
          />
        )}

        <View
          style={[
            styles.messageBubble,
            isMe ? styles.myBubble : styles.otherBubble,
          ]}
        >
          <Text style={isMe ? styles.myMessageText : styles.otherMessageText}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        inverted
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Message..."
          style={styles.input}
        />

        <TouchableOpacity onPress={sendMessage} style={styles.button}>
          <Text style={{ color: "white" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eaeaea",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
    backgroundColor: "#fafafa",
  },
  button: {
    marginLeft: 10,
    backgroundColor: "#4f46e5",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 4,
    alignItems: "flex-end",
    maxWidth: "80%",
  },
  myContainer: {
    alignSelf: "flex-end",
  },
  otherContainer: {
    alignSelf: "flex-start",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 2,
  },
  messageBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  myBubble: {
    backgroundColor: "#4f46e5",
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },
  myMessageText: {
    color: "#ffffff",
    fontSize: 16,
  },
  otherMessageText: {
    color: "#1f2937",
    fontSize: 16,
  },
});

// import { useUser } from "@clerk/clerk-expo";
// import { useHeaderHeight } from "@react-navigation/elements";
// import { useLocalSearchParams, useNavigation } from "expo-router";
// import { addDoc, collection, getDoc } from "firebase/firestore";
// import { useEffect, useState } from "react";
// // import { GiftedChat } from "react-native-gifted-chat";

// export default function ChatScreen() {
//   const params = useLocalSearchParams();
//   const headerHeight = useHeaderHeight();
//   const navigation = useNavigation();
//   const { user } = useUser();
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     GetUserDetails();
//   }, []);

//   const GetUserDetails = async () => {
//     const chatId = Array.isArray(params.id) ? params.id[0] : params.id;
//     const docSnap = await getDoc(chatId);
//     if (!docSnap.exists()) {
//       console.log("❌ Chat not found");
//       return;
//     }
//     const result = docSnap.data();
//     console.log(result);
//     const otherUser = result?.users.filter(
//       (item) => item.email != user?.primaryEmailAddress.emailAddress,
//     );
//     if (!otherUser || otherUser.length === 0) {
//       console.log("⚠️ No other user found");
//       return;
//     }
//     console.log(otherUser);
//     navigation.setOptions({
//       title: otherUser[0]?.name || "Chat",
//     });
//   };

//   const onSend = async (newMessage) => {
//     setMessages((previousMessage) =>
//       GiftedChat.append(previousMessage, newMessage),
//     );
//     await addDoc(collection(db, "Chat", params.id, "Messages"), newMessage[0]);
//   };
//   return (
//     <GiftedChat
//       messages={messages}
//       onSend={(messages) => onSend(messages)}
//       showUserAvatar={true}
//       user={{
//         _id: user?.primaryEmailAddress?.emailAddress,
//         name: user?.fullName,
//         avatar: user?.imageUrl,
//       }}
//       keyboardAvoidingViewProps={{ keyboardVerticalOffset: headerHeight }}
//     />
//   );
// }
