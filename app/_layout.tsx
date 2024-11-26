import {
  DarkTheme,
  DefaultTheme,
  NavigationProp,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
// import "react-native-reanimated"; 

import Topbar from "@/components/Topbar";
import { useColorScheme } from "@/hooks/useColorScheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";

enableScreens();

SplashScreen.preventAutoHideAsync();
interface CustomHeaderProps {
  navigation: NavigationProp<any>;
  title: string;
}

function CustomHeader({ navigation, title }: CustomHeaderProps) {
  const handleBackPress = async () => {
    navigation.navigate("index"); // Redirect to home screen (tabs)
    // await Updates.reloadAsync(); // Reload the app
  };

  return (
    <View
      style={{
        height: 60,
        backgroundColor: "#182046",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
      }}
    >
      <TouchableOpacity
        onPress={handleBackPress} // Use custom back press handler
        style={{ paddingRight: 10 }}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <Text style={{ color: "#fff", fontSize: 20 }}>{title}</Text>
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider
        value={colorScheme === "light" ? DarkTheme : DefaultTheme}
        children={undefined}
      >
        <Topbar />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
          <Stack.Screen
            name="login"
            options={({ navigation }) => ({
              header: () => (
                <CustomHeader navigation={navigation} title="Login" />
              ),
            })}
          />
          <Stack.Screen
            name="glodenpage"
            options={({ navigation }) => ({
              header: () => (
                <CustomHeader navigation={navigation} title="Dashboard" />
              ),
            })}
          />
          <Stack.Screen
            name="matchcenter"
            options={({ navigation }) => ({
              header: () => (
                <CustomHeader navigation={navigation} title="Match Center" />
              ),
            })}
          />
          <Stack.Screen
            name="traildates"
            options={({ navigation }) => ({
              header: () => (
                <CustomHeader navigation={navigation} title="Trail Dates" />
              ),
            })}
          />
          <Stack.Screen
            name="allTeams"
            options={({ navigation }) => ({
              header: () => (
                <CustomHeader navigation={navigation} title="All Tems" />
              ),
            })}
          />
          <Stack.Screen
            name="allvideos"
            options={({ navigation }) => ({
              header: () => (
                <CustomHeader navigation={navigation} title="All Videos" />
              ),
            })}
          />
          <Stack.Screen
            name="pointsTable"
            options={({ navigation }) => ({
              header: () => (
                <CustomHeader navigation={navigation} title="Points Table" />
              ),
            })}
          />
          <Stack.Screen
            name="newsnevents"
            options={({ navigation }) => ({
              header: () => (
                <CustomHeader navigation={navigation} title="All News" />
              ),
            })}
          />
          <Stack.Screen
            name="TeamDetail"
            options={({ navigation }) => ({
              header: () => (
                <CustomHeader navigation={navigation} title="Team Details" />
              ),
            })}
          />
          <Stack.Screen
            name="highlightsmainscreen"
            options={({ navigation }) => ({
              header: () => (
                <CustomHeader navigation={navigation} title="Highlights" />
              ),
            })}
          />
          <Stack.Screen
            name="magicmomentsmainscreen"
            options={({ navigation }) => ({
              header: () => (
                <CustomHeader navigation={navigation} title="Magic Moments" />
              ),
            })}
          />
          {/* <Stack.Screen
            name="homepageview"
            options={({ navigation }) => ({
              header: () => (
                <CustomHeader navigation={navigation} title="Payment Home" />
              ),
            })}
          /> */}
          <Stack.Screen
            name="weviewpage"
            options={({ navigation }) => ({
              header: () => (
                <CustomHeader navigation={navigation} title="Payment" />
              ),
            })}
          />
          <Stack.Screen
            name="successscreen"
            options={({ navigation }) => ({
              header: () => (
                <CustomHeader navigation={navigation} title="Success Payment" />
              ),
            })}
          />
          <Stack.Screen
            name="paymentfailed"
            options={({ navigation }) => ({
              header: () => (
                <CustomHeader navigation={navigation} title="Failed Payment" />
              ),
            })}
          />

          {/* <Stack.Screen
            name="status"
            options={({ navigation }) => ({
              header: () => (
                <CustomHeader navigation={navigation} title="Payment Status" />
              ),
            })}
          />
          
           */}
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
