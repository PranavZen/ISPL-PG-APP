// SectionTitle.tsx
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
import { Text, StyleSheet, View } from "react-native";

interface SectionTitleProps {
  titleText: string;
  readMore: string;
  targetScreen: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  titleText,
  readMore,
  targetScreen,
}) => {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate(targetScreen);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{titleText}</Text>
      <Pressable onPress={handlePress}>
        <Text style={styles.linkText}>{readMore} &gt;&gt;</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom:15,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    fontStyle: "italic",
    color: "#fff",
    textTransform: "uppercase",
  },
  linkText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#fff",
    textTransform: "capitalize",
  },
});

export default SectionTitle;
