import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

export default function WhatAreLookingFor() {
  const navigation = useNavigation();

  // Unified navigation handler
  const handlePress = (screen: string) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(177,40,71,1)", "rgba(40,52,116,1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <Text style={styles.sectionTitle}>What are you looking for..?</Text>
        <View style={styles.parent}>
          <Pressable style={[styles.box]} onPress={() => handlePress("matches")}>
            <Image
              style={styles.vectorIcon1}
              source={require("../../assets/images/matchesicon.png")}
            />
            <Text style={styles.boxTitle}>Matches</Text>
          </Pressable>
          <Pressable style={[styles.box]} onPress={() => handlePress("pointsTable")}>
            <Image
              style={styles.vectorIcon1}
              source={require("../../assets/images/pticon.png")}
            />
            <Text style={styles.boxTitle}>Points Table</Text>
          </Pressable>
          <Pressable style={[styles.box]} onPress={() => handlePress("overallStats")}>
            <Image
              style={styles.vectorIcon1}
              source={require("../../assets/images/staticon.png")}
            />
            <Text style={styles.boxTitle}>Overall Stats</Text>
          </Pressable>
          <Pressable style={[styles.box]} onPress={() => handlePress("allTeams")}>
            <Image
              style={styles.vectorIcon1}
              source={require("../../assets/images/teamicon.png")}
            />
            <Text style={styles.boxTitle}>All Teams</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    borderRadius: 8,
    paddingBottom: 45,
    marginTop: 10,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "48%",
    height: "50%",
  },
  vectorIcon1: { width: 28, height: 28 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    fontStyle: "italic",
    color: "#fff",
    textTransform: "uppercase",
    textAlign: "center",
    paddingTop: 20,
    paddingBottom: 10,
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#283474",
    textTransform: "uppercase",
    textAlign: "center",
  },
  parent: {
    flexDirection: "row",
    gap: 5,
    flexWrap: "wrap",
    width: "100%",
    height: 200,
    rowGap: 15,
    justifyContent: "space-between",
    paddingTop: 10,
  },
});
