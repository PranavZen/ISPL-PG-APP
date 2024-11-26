import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AllVideos() {
  return (
    <View style={styles.container}>
      <Text>All Videos Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#182046",
    }, 
  });