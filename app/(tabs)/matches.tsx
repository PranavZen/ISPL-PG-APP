import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import MatchPointScrollCard from "@/components/commonslidercomponent/MatchPointScrollCard";
import TabsContent from "@/components/commonslidercomponent/TabsContent";

export default function Matches() {
  return (
    <ScrollView style={styles.container}>
      <TabsContent />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#182046",
  },
});
