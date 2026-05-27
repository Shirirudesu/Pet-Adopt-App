import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/(tabs)/home" />;
}
// const { user } = useUser();
{
  /* {user ? <Redirect href="/(tabs)/home" /> : <Redirect href="/login" />} */
}
