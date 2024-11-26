import React, { useState } from 'react';
import { View, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';

const CCAvenuePayment = () => {
    const [loading, setLoading] = useState(false);
    const [paymentUrl, setPaymentUrl] = useState('');

    const payClicked = async () => {
        setLoading(true);
        const formData = new FormData();

        formData.append("merchant_id", "3887940");
        formData.append("order_id", "2121212");
        formData.append("amount", "100.00");
        formData.append("currency", "INR");
        formData.append("redirect_url", "https://test.ccavenue.com/transaction.do");
        formData.append("cancel_url", "YOUR_CANCEL_URL");
        formData.append("language", "EN");

        try {
            const encryptionResponse = await axios.post(
                "http://122.182.6.212:8080/MobPHPKit/india/init_payment.php",
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );

            // console.log("encryptionResponse data:", encryptionResponse.data);

            const encryptedData = encryptionResponse.data.encryptedData;
            if (!encryptedData) throw new Error("Encrypted data not found in response.");

            const paymentGatewayUrl = `https://test.ccavenue.com/transaction.do?command=initiateTransaction&encRequest=${encodeURIComponent(encryptedData)}&access_code=ATRF25LJ78BD47FRDB`;

            setPaymentUrl(paymentGatewayUrl);
        } catch (error) {
            console.error("Error during payment:", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {loading && <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />}
            {!paymentUrl && (
                <Button
                    title="Pay Now"
                    onPress={payClicked}
                    disabled={loading}
                />
            )}
            {paymentUrl !== '' && (
                <WebView
                    source={{ uri: paymentUrl }}
                    onLoadEnd={() => setLoading(false)}
                    onNavigationStateChange={(navState) => {
                        const { url } = navState;
                        if (url.includes("transaction.do")) {
                            // console.log("Payment Completed:", url);
                        }
                    }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
    },
});

export default CCAvenuePayment;
