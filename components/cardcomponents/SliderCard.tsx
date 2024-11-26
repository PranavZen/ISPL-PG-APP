import React from "react";
import { ImageStyle, Pressable, TextStyle, ViewStyle } from "react-native";
import { View, Text, Image, StyleSheet, Linking } from "react-native";

interface HeighlightsCardProps {
  title: string;
  mainTitle: string;
  backgroundImg: string;
  date: string;
  matchLink: string;
  customWidth?: ViewStyle;
  imageHeight?: ImageStyle;
  titleSize?: TextStyle;
  padLeft?: ViewStyle;
  // onPress: () => void;
}

const HeighlightsCard: React.FC<HeighlightsCardProps> = ({
  mainTitle,
  backgroundImg,
  date,
  matchLink,
  customWidth = {},
  imageHeight = {},
  titleSize = {},
  padLeft={}
  // onPress,
}) => {
  const handlePress = () => {
    Linking.openURL(matchLink);
  };

  return (
    <View style={[styles.container, padLeft]}>
      <Pressable style={[styles.cardInner, customWidth]} onPress={handlePress}>
        <View style={styles.imgWrap}>
          <Image
            source={{ uri: backgroundImg }}
            style={[styles.image, imageHeight]}
          />
        </View>
        <View style={styles.midBox}>
          <Text style={[styles.mainTitle, titleSize]} numberOfLines={2} ellipsizeMode="tail">
            {mainTitle}
          </Text>
        </View>
        <View style={styles.footBox}>
          <Text style={styles.dateBox}>{date}</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginHorizontal: 5,
  },
  cardInner: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
    width: 340,
    height: 340,
  },
  imgWrap: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 240,
    resizeMode: "cover",
  },
  playBtn: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  icon: {
    width: 40,
    height: 40,
  },
  midBox: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    color: "#333",
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  footBox: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    paddingBottom: 10,
  },
  dateBox: {
    fontSize: 12,
    color: "#888",
  },
  shareBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  timeText: {
    fontSize: 12,
    color: "#888",
    marginLeft: 5,
  },
});

export default HeighlightsCard;
