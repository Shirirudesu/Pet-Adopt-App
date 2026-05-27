import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Colors from "../../constants/Colors";

export default function AboutPet({ pet }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <View
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
        About {pet?.name}
      </Text>
      <Text
        numberOfLines={expanded ? 0 : 2}
        style={{
          fontFamily: "outfit",
          fontSize: 14,
        }}
      >
        {pet?.about}
      </Text>
      <Pressable onPress={() => setExpanded(!expanded)}>
        <Text
          style={{
            fontFamily: "outfit-medium",
            fontSize: 14,
            color: Colors.SECONDARY,
          }}
        >
          {expanded ? "Read Less" : "Read More"}
        </Text>
      </Pressable>
    </View>
  );
}
