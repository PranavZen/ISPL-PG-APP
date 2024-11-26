import * as React from "react";
import { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Animated, PanResponder } from "react-native";
import Table from "../sectionscomponent/table/Table";
import PlayerStatsTable from "../sectionscomponent/table/PlayerStatsTable";
import MatchRows from "../sectionscomponent/table/MatchResults";

const windowWidth = Dimensions.get("window").width;

const TabViewExample: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  // PanResponder for handling manual swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) > 20,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 30 && activeTab > 0) {
          // Swipe Right
          const newIndex = activeTab - 1;
          setActiveTab(newIndex);
          scrollRef.current?.scrollTo({ x: windowWidth * newIndex, animated: true });
        } else if (gestureState.dx < -30 && activeTab < 2) {
          // Swipe Left
          const newIndex = activeTab + 1;
          setActiveTab(newIndex);
          scrollRef.current?.scrollTo({ x: windowWidth * newIndex, animated: true });
        }
      },
    })
  ).current;

  // Function to handle tab click
  const onTabPress = (index: number) => {
    setActiveTab(index);
    scrollRef.current?.scrollTo({ x: windowWidth * index, animated: true });
  };

  // Syncing the scrolling position to the tab indicator
  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {["Results", "Points Table", "Player Stats"].map((tab, index) => (
          <TouchableOpacity key={index} style={styles.tabItem} onPress={() => onTabPress(index)}>
            <Text style={[styles.tabText, activeTab === index && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
        {/* Animated Indicator */}
        <Animated.View
          style={[
            styles.indicator,
            {
              transform: [
                {
                  translateX: scrollX.interpolate({
                    inputRange: [0, windowWidth, 2 * windowWidth],
                    outputRange: [0, windowWidth / 3, (2 * windowWidth) / 3],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      {/* Scrollable Tab Content */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        ref={scrollRef}
        onMomentumScrollEnd={(event) => {
          const pageIndex = Math.round(event.nativeEvent.contentOffset.x / windowWidth);
          setActiveTab(pageIndex);
        }}
      >
        {/* Content for each tab */}
        <View style={styles.tabContent}>
          <MatchRows />
        </View>
        <View style={styles.tabContent}>
          <Table />
        </View>
        <View style={styles.tabContent}>
          <PlayerStatsTable />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#002458",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#263574",
    paddingVertical: 10,
    position: "relative",
  },
  tabItem: {
    paddingVertical: 10,
    width: windowWidth / 3,
    alignItems: "center",
  },
  tabText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#fbe29a",
    fontWeight: "bold",
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 4,
    width: windowWidth / 3,
    backgroundColor: "#fbe29a",
  },
  tabContent: {
    width: windowWidth,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#002458",
    paddingVertical: 10,
  },
});

export default TabViewExample;
