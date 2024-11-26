import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ImageBackground,
  ScrollView,
} from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { KeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";
import { RefreshControl } from "react-native";

interface ErrorState {
  email: string;
  password: string;
  otp: string; 
  general: string;
}

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<ErrorState>({
    email: "",
    password: "",
    otp: "",
    general: "",
  });
  const [showOTP, setShowOTP] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [showResendButton, setShowResendButton] = useState<boolean>(false);
  const navigation = useNavigation<any>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showVerifyModal, setVerifyModal] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setShowResendButton(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateMobile = (mobile: string): boolean => {
    const re = /^[0-9]{10}$/;
    return re.test(String(mobile));
  };

  const handleSubmit = async (event: {
    preventDefault: () => void;
  }): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    setError({ email: "", password: "", otp: "", general: "" });

    if (!validateEmail(email) && !validateMobile(email)) {
      setLoading(false);
      setError((prevError) => ({
        ...prevError,
        email: "Please enter a valid email address",
      }));
      return;
    }

    try {
      const response = await axios.post(
        "https://my.ispl.popopower.com/api/post-login",
        { email, password }
      );

      if (response.status === 200) {
        const token = response.data.data.token;
        await AsyncStorage.setItem("apiToken", token);

        Toast.show({
          type: "success",
          text1: "Login successful",
        });
        clearInputs();
        const { completed_status } = response.data.data.user;
        const form_city_edit = response.data.form_city_edit;

        let redirectPath = "glodenpage";
        if (completed_status === 1 && form_city_edit === true) {
          redirectPath = "glodenpage";
        }
        if (completed_status === 1 && form_city_edit === false) {
          redirectPath = "glodenpage";
        }

        setTimeout(() => {
          navigation.navigate(redirectPath);
        }, 2000);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        Alert.alert("Error", "Session expired. Please login again.");
        await AsyncStorage.removeItem("apiToken");
        navigation.dispatch(
          CommonActions.navigate({
            name: "login",
          })
        );
      } else if (
        err.response &&
        err.response.status === 400 &&
        err.response.data.pay_request_id
      ) {
        Toast.show({
          type: "error",
          text1:
            "Since you did not complete the payment and registration is now closed, we regret to inform you that you are unable to log in at this time.",
        });
      } else {
        const errorMessage =
          err.response?.data?.error_message ||
          "Incorrect Details Please Try Again !!!";
        setError((prevError) => ({
          ...prevError,
          email: "Invalid email or password",
          password: "Invalid email or password",
        }));
        Toast.show({
          type: "error",
          text1: errorMessage,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (): Promise<void> => {
    if (!validateEmail(email) && !validateMobile(email)) {
      setError((prevError) => ({
        ...prevError,
        email: "Please enter a valid email address",
      }));
      return;
    }

    setLoading(true);
    setError({ email: "", password: "", otp: "", general: "" });

    try {
      const response = await axios.post(
        "https://my.ispl.popopower.com/api/send-otp",
        { email }
      );

      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: response.data.message,
        });
        setShowOTP(true);
        setTimer(120);
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to send OTP. Please try again.",
        });
      }
    } catch {
      Toast.show({
        type: "error",
        text1: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (): Promise<void> => {
    setLoading(true);
    setError({ email: "", password: "", otp: "", general: "" });

    try {
      const response = await axios.post(
        "https://my.ispl.popopower.com/api/verify-otp",
        { otp, email }
      );

      if (response.data.status) {
        Toast.show({
          type: "success",
          text1: response.data.message,
        });

        const token = response.data.data.token;
        await AsyncStorage.setItem("apiToken", token);

        try {
          const response = await axios.get(
            "https://my.ispl.popopower.com/api/user-dashboard-api",
            {
              headers: {
                Authorization: `Bearer ${await AsyncStorage.getItem(
                  "apiToken"
                )}`,
              },
            }
          );

          const userData = response.data.users;
          const is_city_updated = response.data.users.is_city_updated;
          const { completed_status, form_city_edit } = response.data;
          const is_email_verify = response.data.users.is_email_verify;
          const is_mobile_verify = response.data.users.is_mobile_verify;

          if (completed_status === 1 && form_city_edit === true) {
            setShowModal(true);
          }
          if (is_email_verify === 0 && is_mobile_verify === 0) {
            setVerifyModal(true);
          }
          if (
            (is_city_updated === 1 && completed_status === 1) ||
            (response.data.personal_info_status === "created" &&
              response.data.playing_details_status === "created") ||
            (response.data.personal_info_status === "updated" &&
              response.data.playing_details_status === "updated")
          ) {
            navigation.dispatch(
              CommonActions.navigate({
                name: "glodenpage",
              })
            );
          } else {
            navigation.dispatch(
              CommonActions.navigate({
                name: "glodenpage",
              })
            );
          }
        } catch {
          Toast.show({
            type: "error",
            text1: "Error fetching user data",
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to verify OTP. Please try again.",
        });
      }
    } catch (err: any) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.message &&
        err.response.data.message.failed
      ) {
        Toast.show({
          type: "error",
          text1: err.response.data.message.failed[0],
        });
      } else {
        Toast.show({
          type: "error",
          text1: "An error occurred. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithPassword = (): void => {
    setShowOTP(false);
  };
  const clearInputs = () => {
    setEmail("");
    setPassword("");
    setOtp("");
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      clearInputs();
    }, 1000);
  };
  return (
    <ImageBackground
      source={require("../assets/images/latestBg.webp")}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <Text style={styles.title}>Login Here</Text>
          <Text style={styles.label}>Email Address or Mobile Number</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (!validateEmail(text) && !validateMobile(text)) {
                setError((prevError) => ({
                  ...prevError,
                  email: "Please enter a valid email address or mobile number",
                }));
              } else {
                setError((prevError) => ({ ...prevError, email: "" }));
              }
            }}
          />
          {error.email ? <Text style={styles.error}>{error.email}</Text> : null}

          {showOTP ? (
            <>
              <Text style={styles.label}>OTP</Text>
              <TextInput
                style={styles.input}
                value={otp}
                onChangeText={setOtp}
              />
              {error.otp ? <Text style={styles.error}>{error.otp}</Text> : null}

              <Pressable onPress={handleLoginWithPassword}>
                <Text style={styles.linkText}>Login with password</Text>
              </Pressable>

              {timer > 0 ? (
                <Text style={styles.linkText}>
                  OTP expires in {Math.floor(timer / 60)}:
                  {(timer % 60).toString().padStart(2, "0")}
                </Text>
              ) : (
                showResendButton && (
                  <Pressable onPress={handleSendOTP}>
                    <Text style={styles.linkText}>
                      {" "}
                      {loading ? "Resending OTP..." : "Resend OTP"}
                    </Text>
                  </Pressable>
                )
              )}
            </>
          ) : (
            <>
              <Pressable onPress={handleSendOTP}>
                <Text style={styles.linkText}>Login with OTP</Text>
              </Pressable>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              {error.password ? (
                <Text style={styles.error}>{error.password}</Text>
              ) : null}
            </>
          )}

          <Pressable
            style={styles.sqrBtn}
            onPress={showOTP ? handleVerifyOTP : handleSubmit}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {showOTP ? "Verify OTP" : "Login Now"}
              </Text>
            )}
          </Pressable>
          <Toast />
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    margin: 0,
    padding: 10,
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#fff",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#fff",
  },
  input: {
    height: 55,
    borderColor: "#fff",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    color: "#fbe29a",
    fontSize: 18,
  },
  error: {
    color: "red",
    marginBottom: 12,
  },
  linkText: {
    color: "#fbe29a",
    textAlign: "right",
    marginBottom: 16,
    fontWeight: "700",
    fontSize: 16,
  },
  timerContainer: {
    marginTop: 16,
    alignItems: "flex-end",
  },
  timerText: {
    textAlign: "center",
    marginBottom: 16,
  },
  resendButton: {
    alignItems: "center",
    borderColor: "#fbe29a",
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    marginTop: 30,
    height: 49,
    justifyContent: "center",
    paddingHorizontal: 20,
    width: "auto",
  },
  buttonText: {
    color: "#fbe29a",
    fontSize: 16,
    fontWeight: "600",
  },
  sqrBtn: {
    alignItems: "center",
    borderColor: "#fbe29a",
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    marginTop: 30,
    height: 49,
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
    width: "auto",
  },
});

export default LoginForm;
