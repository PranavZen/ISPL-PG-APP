import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Pressable,
  Linking,
  Modal,
  Button,
  ActivityIndicator, // Import Button for modal buttons
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useIsFocused,
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";
import axios from "axios";

// Define types for the navigation
interface RootStackParamList {
  allvideos: undefined;
  newsnevents: undefined;
  allTeams: undefined;
  matches: undefined;
  login: undefined;
  glodenpage: undefined;
  index: undefined;
  traildates: undefined;
  homepageview: undefined;
}

interface MenuItem {
  id: string;
  title: string;
  screen: keyof RootStackParamList;
}

const allMenuItems: MenuItem[] = [
  { id: "2", title: "News", screen: "newsnevents" },
  { id: "3", title: "Teams", screen: "allTeams" },
  { id: "4", title: "Match Center", screen: "matches" },
  { id: "5", title: "Trail Dates", screen: "traildates" },
  { id: "6", title: "Login", screen: "login" },
  { id: "7", title: "Dashboard", screen: "glodenpage" },
  { id: "8", title: "Logout", screen: "index" },
  // { id: "9", title: "Payment Page", screen: "homepageview" },
];

const More: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("apiToken");
      setIsLoggedIn(!!token); // Set isLoggedIn based on the token
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (isFocused) {
      const checkLoginStatus = async () => {
        const token = await AsyncStorage.getItem("apiToken");
        setIsLoggedIn(!!token);
      };
      checkLoginStatus();
    }
  }, [isFocused]);

  const handlePress = (screen: keyof RootStackParamList) => {
    if (screen === "index") {
      handleLogout();
      navigation.navigate("index");
    } else {
      navigation.navigate(screen);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("apiToken");
    setIsLoggedIn(false);
    Alert.alert("Logged out", "You have been successfully logged out.");
    navigation.navigate("login"); // Navigate to login screen after logout
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("apiToken");

      // Make POST request to delete account with token in headers
      const response = await axios.post(
        "https://my.ispl.popopower.com/api/delete-account",
        {}, // Include any necessary data here, if required
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      // Clear local storage
      await AsyncStorage.removeItem("apiToken");
      setIsLoggedIn(false);
      setLoading(false);
      // Display server-side message
      Alert.alert(
        "Account Deleted",
        response.data.message || "Your account has been deleted successfully."
      );

      // Redirect to index
      navigation.navigate("index");
    } catch (error) {
      console.error("Error deleting account:", error);
      Alert.alert(
        "Error",
        "There was an error deleting your account. Please try again."
      );
    } finally {
      setModalVisible(false); // Close the modal
    }
  };

  const getFilteredMenuItems = (): MenuItem[] => {
    if (isLoggedIn) {
      return allMenuItems.filter((item) => item.title !== "Login");
    } else {
      return allMenuItems.filter(
        (item) => item.title !== "Dashboard" && item.title !== "Logout"
      );
    }
  };

  const renderItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      onPress={() =>
        handlePress(item.title === "Logout" ? "index" : item.screen)
      }
      style={[
        styles.menuItem,
        item.title === "Login" || item.title === "Logout"
          ? styles.specialMenuItem
          : null,
      ]}
    >
      <Text
        style={[
          styles.menuText,
          item.title === "Login" || item.title === "Logout"
            ? styles.specialMenuText
            : null,
        ]}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={getFilteredMenuItems()}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View style={styles.linkTextWrap}>
        {/* Conditionally render "Delete My Account" button if the user is logged in */}
        {isLoggedIn && (
          <Pressable onPress={() => setModalVisible(true)}>
            <Text style={[styles.linkText]}>Delete My Account</Text>
          </Pressable>
        )}
        <Pressable
          onPress={() => handleLinkPress("https://www.ispl-t10.com/contact-us")}
        >
          <Text style={styles.linkText}>Contact Us</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            handleLinkPress("https://www.ispl-t10.com/privacy-policy")
          }
        >
          <Text style={styles.linkText}>Privacy & Policy</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            handleLinkPress("https://www.ispl-t10.com/terms-condition")
          }
        >
          <Text style={styles.linkText}>Terms & Condition</Text>
        </Pressable>
      </View>

      {/* Modal for account deletion confirmation */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete your account?
            </Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                onPress={handleDeleteAccount}
                style={[styles.sqrBtn, styles.sqrBtnMT]}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Yes</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.sqrBtn, styles.sqrBtnMT]}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#182046",
    padding: 16,
  },
  menuItem: {
    backgroundColor: "#fbe29a",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 0,
    width: "100%",
  },
  sqrBtn: {
    alignItems: "center",
    borderColor: "#fbe29a",
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    marginTop: 30,
    height: 49,
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
    width: "auto",
  },
  sqrBtnMT: {
    marginTop: 0,
  },
  buttonText: {
    color: "#fbe29a",
    fontSize: 20,
    fontWeight: "600",
  },
  menuText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#182046",
    textAlign: "center",
  },
  specialMenuItem: {
    backgroundColor: "#fff",
  },
  specialMenuText: {
    color: "#182046",
  },
  linkTextWrap: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
  },
  linkText: {
    color: "#fff",
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#002458",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    paddingVertical: 15,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    color: "#fff",
  },
});

export default More;
