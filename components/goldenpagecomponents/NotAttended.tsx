import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import RenderHTML from "react-native-render-html";

interface NotAttendedProps {
  isticketDescription: string;
}

const NotAttended: React.FC<NotAttendedProps> = ({
  isticketDescription = "No description available",
}) => {
  const tagsStyles = {
    p: styles.paragraph, // Apply your paragraph styles
    // You can define styles for other HTML tags if needed
  };
  const { width } = Dimensions.get("window");

  return (
    <View>
      {isticketDescription ? (
        <RenderHTML
          contentWidth={width}
          source={{ html: isticketDescription }}
          tagsStyles={tagsStyles}
        />
      ) : (
        <Text style={styles.errorMessage}>No description available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  paragraph: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 24,
  },
  errorMessage: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

export default NotAttended;
