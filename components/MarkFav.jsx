import { useUser } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Shared from "./../Shared/Shared";

export default function MarkFav({ pet, color }) {
  const { user } = useUser();
  const [favList, setFavList] = useState([]);

  useEffect(() => {
    user && GetFav();
  }, [user]);

  const GetFav = async () => {
    const result = await Shared.GetFavList(user);
    console.log(result);
    setFavList(result?.favorites ? result?.favorites : []);
  };

  const toggleFav = async () => {
    let newFavList = [];

    if (favList.includes(pet.id)) {
      newFavList = favList.filter((id) => id !== pet.id);
    } else {
      newFavList = [...favList, pet.id];
    }
    await Shared.UpdateFav(user, newFavList);

    GetFav();
  };

  //   const AddToFav = async () => {
  //     const newFavList = [...favList, pet.id];
  //     await Shared.UpdateFav(user, newFavList);
  //     setFavList(newFavList);
  //   };

  //   const RemoveFromFav = async () => {
  //     const newFavList = favList.filter((id) => id !== pet.id);
  //     await Shared.UpdateFav(user, newFavList);
  //     setFavList(newFavList);
  //   };

  return (
    <View>
      <Pressable onPress={toggleFav}>
        <Ionicons
          name={favList?.includes(pet.id) ? "heart" : "heart-outline"}
          size={30}
          color={favList?.includes(pet.id) ? "red" : color}
        />
      </Pressable>
    </View>
  );
}
