import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import InstaStory from "react-native-insta-story";

interface Story {
  story_id: number;
  story_image: string;
  onPress?: () => void;
}

interface User {
  user_id: number;
  user_image: string;
  user_name: string;
  stories: Story[];
}

function TopSlider({
  duration = 10,
  avatarSize = 60,
  unPressedBorderColor = "green",
  pressedBorderColor = "#fbe29a",
  unPressedAvatarTextColor = "#fff",
  pressedAvatarTextColor = "#fff",
}) {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [seenStories, setSeenStories] = useState<Set<number>>(new Set());

  // Fetch data from API
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch("https://my.ispl.popopower.com/api/stories/show-images");
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stories:", error);
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const updateSeenStories = useCallback(
    ({ story: { story_id } }: { story: { story_id: number } }) => {
      setSeenStories((prevSet) => {
        if (!prevSet.has(story_id)) {
          const newSet = new Set(prevSet);
          newSet.add(story_id);
          return newSet;
        }
        return prevSet;
      });
    },
    []
  );

  const handleSeenStories = async (item: any) => {
    const storyIds = [...seenStories];
    if (storyIds.length > 0) {
      await fetch("myApi", {
        method: "POST",
        body: JSON.stringify({ storyIds }),
      });
      setSeenStories(new Set());
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <InstaStory
        data={data.map(user => ({
          user_id: user.user_id,
          user_image: `https://my.ispl.popopower.com/assets/img/${user.user_image}`, // Assuming user images are stored here
          user_name: user.user_name,
          stories: user.stories.map(story => ({
            story_id: story.story_id,
            story_image: story.story_image,
          }))
        }))}
        duration={duration}
        avatarSize={avatarSize}
        unPressedBorderColor={unPressedBorderColor}
        pressedBorderColor={pressedBorderColor}
        unPressedAvatarTextColor={unPressedAvatarTextColor}
        pressedAvatarTextColor={pressedAvatarTextColor}
        swipeText="."
        onStart={(item) => {
          // Your logic when a story starts can be added here
        }}
        onClose={handleSeenStories}
        onStorySeen={updateSeenStories}
        renderTextComponent={({ profileName }) => (
          <View>
            <Text style={styles.texColor}>{profileName}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 8,
    backgroundColor: "#182046",
    height: 100,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#182046",
  },
  texColor: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default TopSlider;
