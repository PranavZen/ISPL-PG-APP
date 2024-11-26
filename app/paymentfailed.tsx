import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Dimensions, StyleSheet, Text, View } from "react-native";

const FailedScreen = () => {
  const [cityId, setCityId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const navigation = useNavigation();

  // Fetch session values from AsyncStorage on screen load
  useEffect(() => {
    const loadSessionValues = async () => {
      try {
        const storedCityId = await AsyncStorage.getItem("cityId");
        const storedSelectedDate = await AsyncStorage.getItem("selectedDate");
        const storedSelectedBatch = await AsyncStorage.getItem("selectedBatch");

        // Set state with the retrieved values
        setCityId(storedCityId);
        setSelectedDate(storedSelectedDate);
        setSelectedBatch(storedSelectedBatch);

        // Handle missing session values if needed
        // if (!storedCityId || !storedSelectedDate || !storedSelectedBatch) {
        //   Alert.alert(
        //     "Missing session values",
        //     "Some session values are missing."
        //   );
        //   return;
        // }

        // Clear session values if payment failed
        await AsyncStorage.removeItem("cityId");
        await AsyncStorage.removeItem("selectedDate");
        await AsyncStorage.removeItem("selectedBatch");

        // Redirect to golden screen after clearing session values
        // navigation.navigate("glodenpage");
      } catch (error) {
        console.error("Error clearing session data:", error);
        Alert.alert("Error", error.message || "Failed to clear session data.");
      }
    };

    loadSessionValues();
    
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.lottieWrap}>
        <Text style={styles.title}>Payment was unsuccessful!</Text>
      </View>
    </View>
  );
};

export default FailedScreen;

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#182046",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  text: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 5,
    textAlign: "center",
  },
  lottie: {
    width: 300,
    height: 300,
    marginTop: 20,
  },
});
