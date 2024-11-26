import React from "react";
import { StyleSheet, View } from "react-native";
import RenderHTML from "react-native-render-html";

interface GreenMessageProps {
  isticketDescription: string;
}

const GreenMessage: React.FC<GreenMessageProps> = ({
  isticketDescription = "No description available",
}) => {
  const tagsStyles = {
    p: styles.paragraph, // Apply your paragraph styles
    // You can define styles for other HTML tags if needed
  };

  return (
    <View>
      <RenderHTML
        contentWidth={800}
        source={{ html: isticketDescription }}
        tagsStyles={tagsStyles}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  paragraph: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 24
  },
});

export default GreenMessage;
