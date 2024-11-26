import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";

const Feeds: React.FC = () => {
  const accessToken =
    "EAB5cKR9w18gBOz7KlvXpy4CA7vZCOzgLi7McimPoHoEhSopFB2TO2jZAC8IroYfZCb7DLZALgXQZBuUmzrzU7eins3shME7KPbYnuy8IZA4hsXgxGtXaUbOcEY3X7MsNOOdMOuFdliZBoZBRxzEuN4dUS2mdVSGZCpfOBaJIspKK8GGEnAQp8InQ0CzlTYpuiuSUcUyG2A0VaXntPMM9pdrgZD"; // Replace with a valid access token
  const userId = "2814126342099186"; // Replace with your user ID

  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v21.0/${userId}?fields=feed&access_token=${accessToken}`
      );

      const textResponse = await response.text();

      if (!response.ok) {
        setError("Error fetching feed: " + textResponse);
        return;
      }

      const feedData = JSON.parse(textResponse)?.feed?.data;
      // console.log("Feed data:", feedData);

      if (feedData) {
        setData(feedData);
        setLoaded(true);
      } else {
        setError("No posts available.");
      }
    } catch (error) {
      console.error("Error fetching feed:", error);
      setError("Error fetching feed.");
    }
  };

  const createPost = (postInfo: any) => {
    const { created_time, message, id } = postInfo;
    return (
      <View key={id} style={styles.postContainer}>
        <Text style={styles.postMessage}>
          {message || "No message for this post"}
        </Text>
        <Text style={styles.postTime}>
          Created on: {new Date(created_time).toLocaleString()}
        </Text>
      </View>
    );
  };

  if (!loaded) {
    return (
      <View style={styles.container}>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => createPost(item)}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ecf0f1",
  },
  postContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  postMessage: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  postTime: {
    fontSize: 14,
    color: "#888",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    margin: 20,
  },
});

export default Feeds;
