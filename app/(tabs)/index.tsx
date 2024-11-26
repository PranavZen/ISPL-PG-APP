import BannerSlider from "@/components/BannerSlider";
import AllTeams from "@/components/sectionscomponent/AllTeams";
import HeighlightsSection from "@/components/sectionscomponent/HeighlightsSection";
import MagicMomentsSection from "@/components/sectionscomponent/MagicMomentsSection";
import NewsnEvents from "@/components/sectionscomponent/NewsnEvents";
import WhatAreLookingFor from "@/components/sectionscomponent/WhatAreLookingFor";
import TopSlider from "@/components/topslider/TopSlider";
import { useState } from "react";
import { StatusBar } from "react-native";
import { RefreshControl } from "react-native";
import { StyleSheet, ScrollView } from "react-native";


export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <TopSlider />
        <BannerSlider />
        <HeighlightsSection />
        <MagicMomentsSection />
        <WhatAreLookingFor />
        <NewsnEvents />
        <AllTeams />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#182046",
  },
});
