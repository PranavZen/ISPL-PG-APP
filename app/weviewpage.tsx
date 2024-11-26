import React, { useState } from "react";
import { View, Alert, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { useRouter, useLocalSearchParams } from "expo-router";

const PaymentScreen = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { paymentUrl } = useLocalSearchParams();

  const handleNavigationStateChange = (navState: { url: any; }) => {
    const { url } = navState;
    console.log("Navigated to URL:", url);

    if (url.includes("Successful")) {
      const urlParams = new URLSearchParams(url.split("?")[1]);
      const orderId = urlParams.get("order_id");
      const amount = urlParams.get("amount");

      Alert.alert("Payment was successful!");
      router.push({
        pathname: "/successscreen",
        params: { orderId, amount, paymentStatus: "Successful" },
      });
    } else if (url.includes("Unsuccessful")) {
      const urlParams = new URLSearchParams(url.split("?")[1]);
      const orderId = urlParams.get("order_id");
      const amount = urlParams.get("amount");

      Alert.alert("Payment was unsuccessful. Please try again.");
      router.push({
        pathname: "/paymentfailed",
        params: { orderId, amount, paymentStatus: "Unsuccessful" },
      });
    }else if (url.includes("Aborted")) {

      Alert.alert("Payment was Aborted. Please try again.");
      router.push({
        pathname: "/paymentfailed",
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: [{ translateX: -25 }, { translateY: -25 }],
          }}
        />
      )}
      <WebView
        source={{ uri: paymentUrl }}
        javaScriptEnabled
        cacheEnabled
        allowFileAccessFromFileURLs
        setSupportMultipleWindows
        domStorageEnabled
        mixedContentMode="always"
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={handleNavigationStateChange}
        originWhitelist={["*"]}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("HTTP error: ", nativeEvent);
        }}
      />
    </View>
  );
};

export default PaymentScreen;
