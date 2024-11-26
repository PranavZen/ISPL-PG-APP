import HighlightsCard from "@/components/cardcomponents/SliderCard";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ImageStyle,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface HighlightsVideo {
  title: string;
  thumbnail: string;
  date: string;
  video_link: string;
  category_names: string;
}

const HighlightsMainScreen = () => {
  const [highlightsVideos, setHighlightsVideos] = useState<HighlightsVideo[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://my.ispl.popopower.com/api/video-master/all-vedios")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const filteredVideos = data.data["all-video"].filter(
          (video: HighlightsVideo) => video.category_names === "Highlights"
        );
        setHighlightsVideos(filteredVideos);
      })
      .catch((error) => console.error("Error fetching videos:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView showsHorizontalScrollIndicator={false} style={styles.container}>
      <View style={styles.grid}>
        {loading ? (
          <View style={styles.loadingBox}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          highlightsVideos.map((video, index) => {
            const { width } = Dimensions.get("window");
            const customWidthStyle: ViewStyle = {
              width: width * 0.47,
              height: 270,
              marginBottom: 20,
            };
            const customImgHeightStyle: ImageStyle = { height: 180 };
            const customTitleSize: TextStyle = { fontSize: 14 };
            const customPadding: ViewStyle = { paddingHorizontal: 0 };
            return (
              <HighlightsCard
                key={index}
                mainTitle={video.title}
                backgroundImg={`https://my.ispl.popopower.com/images/videos/thumbnail/${video.thumbnail}`}
                date={video.date}
                matchLink={video.video_link}
                title={""}
                customWidth={customWidthStyle}
                imageHeight={customImgHeightStyle}
                titleSize={customTitleSize}
                padLeft={customPadding}
              />
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#182046",
    flex: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
    paddingBottom: 20,
  },
  loadingBox: {
    height: 80,
    width: 400,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "500",
    textAlign: "center",
  },
});

export default HighlightsMainScreen;
