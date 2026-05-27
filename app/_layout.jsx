import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";

const tokenCache = {
  async getToken(key) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return await SecureStore.setItemAsync(key, value);
    } catch {}
  },
};

function InitialLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || segments.length === 0) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isSignedIn && !inAuthGroup) {
      router.replace("/(auth)/login");
    }

    if (isSignedIn && inAuthGroup) {
      router.replace("/(tabs)/home");
    }
  }, [isSignedIn, segments, isLoaded]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const [fontsLoaded] = useFonts({
    outfit: require("../assets/fonts/Outfit-Regular.ttf"),
    "outfit-medium": require("../assets/fonts/Outfit-Medium.ttf"),
    "outfit-bold": require("../assets/fonts/Outfit-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <InitialLayout />
    </ClerkProvider>
  );
}

// import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
// import { useFonts } from "expo-font";
// import { Stack, useRouter, useSegments } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { useEffect, useState } from "react";

// const tokenCache = {
//   async getToken(key) {
//     try {
//       return await SecureStore.getItemAsync(key);
//     } catch (err) {
//       return null;
//     }
//   },
//   async saveToken(key, value) {
//     try {
//       return await SecureStore.setItemAsync(key, value);
//     } catch (err) {
//       return;
//     }
//   },
// };

// // Внутренний компонент, который управляет логикой переходов
// function InitialLayout() {
//   const { isLoaded, isSignedIn } = useAuth();
//   const segments = useSegments();
//   const router = useRouter();
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   const allowedOutsideTabs = [
//     "pet-details",
//     "add-new-pet",
//     "chat",
//     "user-post",
//   ];

//   useEffect(() => {
//     if (!isLoaded || !isMounted) return;

//     const inTabsGroup = segments.includes("(tabs)");
//     const inAllowedScreens = segments.some((seg) =>
//       allowedOutsideTabs.includes(seg),
//     );

//     if (isSignedIn && !inTabsGroup && !inAllowedScreens) {
//       router.replace("/(tabs)/home");
//     } else if (!isSignedIn && currentRoute !== "login") {
//       router.replace("/login");
//     }
//   }, [isSignedIn, isLoaded, segments, isMounted]);
//   return <Stack screenOptions={{ headerShown: false }} />;
// }

// export default function RootLayout() {
//   const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

//   const [fontsLoaded] = useFonts({
//     outfit: require("../assets/fonts/Outfit-Regular.ttf"),
//     "outfit-medium": require("../assets/fonts/Outfit-Medium.ttf"),
//     "outfit-bold": require("../assets/fonts/Outfit-Bold.ttf"),
//   });

//   if (!publishableKey) {
//     throw new Error(
//       "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
//     );
//   }

//   if (!fontsLoaded) {
//     return <Stack screenOptions={{ headerShown: false }} />;
//   }

//   return (
//     <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
//       <InitialLayout />
//     </ClerkProvider>
//   );
// }
////////////////////////////////

//OLD CODE
// import { ClerkProvider } from "@clerk/clerk-expo";
// import { useFonts } from "expo-font";
// import { Stack } from "expo-router";
// import * as SecureStore from "expo-secure-store";

// const tokenCache = {
//   async getToken(key) {
//     return await SecureStore.getItemAsync(key);
//   },
//   async saveToken(key, value) {
//     return await SecureStore.setItemAsync(key, value);
//   },
// };

// export default function RootLayout() {
//   const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

//   const [loaded] = useFonts({
//     outfit: require("../assets/fonts/Outfit-Regular.ttf"),
//     "outfit-medium": require("../assets/fonts/Outfit-Medium.ttf"),
//     "outfit-bold": require("../assets/fonts/Outfit-Bold.ttf"),
//   });

//   if (!loaded) return null;

//   if (!publishableKey) return null;

//   return (
//     <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
//       <Stack screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="index" />
//         <Stack.Screen name="(tabs)" />
//       </Stack>
//     </ClerkProvider>
//   );
// }
