import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import SectionTitle from "./SectionTitle";
import HighlightsCard from "../cardcomponents/SliderCard";

interface Video {
  title: string;
  thumbnail: string;
  date: string;
  video_link: string;
  category_names: string;
}

export default function MagicMommentSection() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://my.ispl.popopower.com/api/video-master/all-vedios")
      .then((response) => response.json())
      .then((data) => {
        const magicMomentVideos = data.data["all-video"].filter(
          (video: Video) => video.category_names === "Magic-Moments"
        );
        setVideos(magicMomentVideos);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching videos:", error));
    setLoading(false);
  }, []);

  return (
    <View style={styles.mainWrap}>
      <View style={styles.mainContainer}>
        <SectionTitle
          titleText="Magic Moments"
          readMore="Read More"
          targetScreen="magicmomentsmainscreen"
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {videos.map((video, index) => (
              <HighlightsCard
                mainTitle={video.title}
                backgroundImg={`https://my.ispl.popopower.com/images/videos/thumbnail/${video.thumbnail}`}
                date={video.date}
                matchLink={video.video_link}
                key={index}
                title={""}
                customWidth={{ width: 300 }}
                padLeft={{ paddingHorizontal: 5 }}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrap: {
    height: 420,
    paddingTop: 10,
  },
  mainContainer: {
    paddingTop: 8,
    height: "100%",
  },
});
