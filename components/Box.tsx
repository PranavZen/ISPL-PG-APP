import React from "react";
import { StyleSheet, View } from "react-native";

interface BoxProps {
  backgroundColor: string;
}

const Box: React.FC<BoxProps> = ({ backgroundColor }) => {
  return <View style={[styles.viewBox, { backgroundColor }]}></View>;
};

const styles = StyleSheet.create({
  viewBox: {
    height: 100,
    width: 100,
  },
});

export default Box;
