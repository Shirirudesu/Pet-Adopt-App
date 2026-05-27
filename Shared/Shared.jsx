import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";

const GetFavList = async (user) => {
  const email = user?.primaryEmailAddress?.emailAddress;
  const docRef = doc(db, "UserFavPet", email);
  const docSnap = await getDoc(docRef);

  if (docSnap?.exists()) {
    return docSnap.data();
  } else {
    const newData = {
      email,
      favorites: [],
    };
    await setDoc(docRef, newData);
    return newData;
  }
};

const UpdateFav = async (user, favorites) => {
  const email = user?.primaryEmailAddress?.emailAddress;
  const docRef = doc(db, "UserFavPet", email);

  try {
    await updateDoc(docRef, {
      favorites: favorites,
    });
  } catch (e) {
    console.log("Update error", e);
  }
};

export default {
  GetFavList,
  UpdateFav,
};
