import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";
import SectionTitle from "./SectionTitle";

export default function NewsnEvents() {
  // Function to handle link presses
  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  return (
    <View style={styles.container}>
      <SectionTitle
        titleText="News & Events"
        readMore="Read More"
        targetScreen="newsnevents"
      />
      <View style={styles.wrap}>
        {/* Uncomment and replace with your image source if needed */}
        {/* <Image
          source={require("../../assets/images/news1.jpg")}
          style={styles.newsImg}
        /> */}
        <View style={styles.newsTextWrap}>
          <TouchableOpacity
            onPress={() =>
              handleLinkPress(
                "https://www.aninews.in/news/sports/cricket/my-hope-that-the-league-continues-to-grow-batting-maestro-sachin-tendulkar-on-ispl-future20240818230443/"
              )
            }
          >
            <Text style={styles.newsTag}>News</Text>
            <Text style={styles.newsDesc}>
              My hope that the league continues to grow: Batting maestro Sachin
              Tendulkar on ISPL future{" "}
              <Text style={styles.newsLink}>(ANI)</Text>
            </Text>

            <Text style={styles.newsLink}>Read More &gt;&gt;</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.wrap}>
        {/* Uncomment and replace with your image source if needed */}
        {/* <Image
          source={require("../../assets/images/news1.jpg")}
          style={styles.newsImg}
        /> */}
        <View style={styles.newsTextWrap}>
          <TouchableOpacity
            onPress={() =>
              handleLinkPress(
                "https://www.aninews.in/news/entertainment/bollywood/kareena-saif-make-stylish-appearance-at-ispl-season-2-launch20240818194741/"
              )
            }
          >
            <Text style={styles.newsTag}>News</Text>
            <Text style={styles.newsDesc}>
              Kareena, Saif make stylish appearance at ISPL season 2 launch{" "}
              <Text style={styles.newsLink}>(ANI)</Text>
            </Text>

            <Text style={styles.newsLink}>Read More &gt;&gt;</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.wrap}>
        {/* Uncomment and replace with your image source if needed */}
        {/* <Image
          source={require("../../assets/images/news1.jpg")}
          style={styles.newsImg}
        /> */}
        <View style={styles.newsTextWrap}>
          <TouchableOpacity
            onPress={() =>
              handleLinkPress(
                "https://www.hindustantimes.com/cricket/sachin-tendulkar-reveals-how-he-used-to-improve-his-skills-to-tackle-reverse-swing-used-to-tape-the-ball-up-101724066954059.html"
              )
            }
          >
            <Text style={styles.newsTag}>News</Text>
            <Text style={styles.newsDesc}>
              Sachin Tendulkar reveals how he used to improve his skills to
              tackle reverse swing: Used to tape the ball up...{" "}
              <Text style={styles.newsLink}>(Hindustan Times)</Text>
            </Text>

            <Text style={styles.newsLink}>Read More &gt;&gt;</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.wrap}>
        {/* Uncomment and replace with your image source if needed */}
        {/* <Image
          source={require("../../assets/images/news1.jpg")}
          style={styles.newsImg}
        /> */}
        <View style={styles.newsTextWrap}>
          <TouchableOpacity
            onPress={() =>
              handleLinkPress(
                "https://english.jagran.com/cricket/indian-street-premier-league-returns-with-season-two-to-begin-from-january-26-in2025-10181654"
              )
            }
          >
            <Text style={styles.newsTag}>News</Text>
            <Text style={styles.newsDesc}>
              Indian Street Premier League Returns With Season Two, To Begin
              From January 6, 2025 (Dainik Jagran)
              <Text style={styles.newsLink}>(Dainik Jagran)</Text>
            </Text>

            <Text style={styles.newsLink}>Read More &gt;&gt;</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 0,
  },
  wrap: {
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
  },
  newsImg: {
    height: "100%",
    width: "27%",
    borderRadius: 8,
    objectFit: "cover",
  },
  newsTextWrap: {
    width: "100%",
  },
  newsTag: {
    color: "#fbe29a",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
  },
  newsDesc: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 5,
    lineHeight: 24,
  },
  newsLink: {
    color: "#fbe29a",
    fontSize: 14,
    fontWeight: "500",
  },
});
