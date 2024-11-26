import React, { useEffect, useRef } from "react";
import { Animated, Easing, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { type IconProps } from "@expo/vector-icons/build/createIconSet";
import { type ComponentProps } from "react";

interface AnimatedIconProps
  extends IconProps<ComponentProps<typeof Ionicons>["name"]> {
  focused: boolean;
}

export function TabBarIcon({ style, focused, name, color }: AnimatedIconProps) {
  // Create refs for the animations
  const scaleAnim = useRef(new Animated.Value(focused ? 1.1 : 1)).current;
  const translateYAnim = useRef(new Animated.Value(focused ? -10 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? 1.2 : 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: focused ? -15 : 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
        marginBottom: 0,
        backgroundColor: focused ? '#283474' : 'transparent',
        borderRadius: 50,
        height : 50,
        width: 50,
        justifyContent: "center",
        alignItems : "center"
      }}
    >
      <Ionicons name={name} size={24} color={color} />
    </Animated.View>
  );
}
