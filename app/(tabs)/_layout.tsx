import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Text } from "react-native";

interface AnimatedTabLabelProps {
  label: string;
  focused: boolean;
}

const AnimatedTabLabel: React.FC<AnimatedTabLabelProps> = ({
  label,
  focused,
}) => {
  const translateXAnim = useRef(new Animated.Value(focused ? 0 : 40)).current;

  useEffect(() => {
    Animated.timing(translateXAnim, {
      toValue: focused ? 0 : 0,
      duration: 300,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ translateX: translateXAnim }] }}>
      <Text
        style={{
          fontSize: 16,
          color: focused ? Colors.dark.tint : Colors.light.tint,
        }}
      >
        {label}
      </Text>
    </Animated.View>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false); // State to track if component is mounted

  useEffect(() => {
    // Set mounted to true after the component mounts
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      router.replace("/feeds"); // Navigate to feeds tab after component has mounted
    }
  }, [isMounted, router]);
  return (
    <Tabs
      
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#283474",
          borderTopWidth: 0,
          elevation: 0,
          paddingBottom: 8,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: ({ focused }) => (
            <AnimatedTabLabel label="Home" focused={focused} />
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          tabBarLabel: ({ focused }) => (
            <AnimatedTabLabel label="Matches" focused={focused} />
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "tennisball" : "tennisball-outline"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="feeds"
        options={{
          headerShown: true,
          tabBarLabel: ({ focused }) => (
            <AnimatedTabLabel label="Feeds" focused={focused} />
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "stats-chart" : "stats-chart-outline"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="overallStats"
        options={{
          tabBarLabel: ({ focused }) => (
            <AnimatedTabLabel label="Stats" focused={focused} />
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "stats-chart" : "stats-chart-outline"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          tabBarLabel: ({ focused }) => (
            <AnimatedTabLabel label="More" focused={focused} />
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "settings" : "settings-outline"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
