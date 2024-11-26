import React, { useEffect, useState } from "react";
import { Text, View, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import { Dimensions } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";

const SuccessScreen = () => {
  const [cityId, setCityId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const navigation = useNavigation(); 
  const { orderId, amount, paymentStatus } = useLocalSearchParams();

  // console.log("orderId", orderId);
  // console.log("amount", amount);
  // console.log("paymentStatus", paymentStatus);

  useEffect(() => {
    const loadSessionValues = async () => {
      try {
        const storedCityId = await AsyncStorage.getItem("cityId");
        const storedSelectedDate = await AsyncStorage.getItem("selectedDate");
        const storedSelectedBatch = await AsyncStorage.getItem("selectedBatch");

        setCityId(storedCityId);
        setSelectedDate(storedSelectedDate);
        setSelectedBatch(storedSelectedBatch);

        if (!storedCityId || !storedSelectedDate || !storedSelectedBatch) {
          Alert.alert(
            "Missing session values",
            "Some session values are missing."
          );
          return;
        }

        const apiToken = await AsyncStorage.getItem("apiToken");
        const saveSlotResponse = await fetch(
          "https://my.ispl.popopower.com/api/save-time-slots",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiToken}`,
            },
            body: JSON.stringify({
              city_id: storedCityId,
              venue_date: storedSelectedDate,
              time_slot: storedSelectedBatch,
            }),
          }
        );

        const saveSlotTextResponse = await saveSlotResponse.text();
        if (saveSlotTextResponse.trim() === "") {
          throw new Error("Empty response while saving time slot.");
        }

        const saveTimeSlotData = JSON.parse(saveSlotTextResponse);

        if (!saveSlotResponse.ok) {
          const errorData = saveTimeSlotData;
          throw new Error(
            `Failed to save time slot: ${errorData.message || "Unknown error"}`
          );
        }

        Alert.alert("Success", "Time slot saved successfully!");
      } catch (error) { 
        console.error("Error saving data:", error);
        Alert.alert("Error", error.message || "Failed to save time slot.");
      }
    };

    loadSessionValues();

    const redirectTimeout = setTimeout(async () => {
      await AsyncStorage.removeItem("cityId");
      await AsyncStorage.removeItem("selectedDate");
      await AsyncStorage.removeItem("selectedBatch");
      navigation.navigate("more");
    }, 10000);

    return () => clearTimeout(redirectTimeout);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.lottieWrap}>
        <Text style={styles.title}>Payment was successful!..</Text>
        <Text style={styles.text}>Order ID: {orderId}</Text>
        <Text style={styles.text}>Amount: ₹{amount}</Text>
        <LottieView
          source={require("../components/anime/confitee.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>
    </View>
  );
};

export default SuccessScreen;

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#182046",
  },
  lottieWrap: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
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
