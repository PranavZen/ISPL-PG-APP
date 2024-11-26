import React from "react";
import { Image, StyleSheet, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack"; // Adjust based on your navigator

// Define a type for your navigation prop
type RootStackParamList = {
  login: undefined; // Define other routes in your navigator as needed
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'login'>;

export default function Topbar() {
  const navigation = useNavigation<NavigationProps>();

  const handlePress = () => {
    navigation.navigate("login");
  };

  return (
    <View style={styles.topBar}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.vectorIcon1}
          source={require("../assets/images/ISPL-season2-logo.png")}
        />
        <View style={styles.leftBox}>
          <Pressable onPress={handlePress}>
            <Image
              source={require("../assets/images/profilePic.png")}
              style={[styles.vectorIcon2, { borderColor: "#fbe29a" }]}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { // Fixed typo from 'topBor' to 'topBar'
    backgroundColor: "#263572",
    paddingTop: 35,
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  leftBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    gap: 20,
    display : "none"
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
  },
  vectorIcon1: {
    width: 30,
    height: 45,
  },
  vectorIcon2: {
    width: 35,
    height: 35,
    borderWidth: 3,
    borderRadius: 50,
  },
});
