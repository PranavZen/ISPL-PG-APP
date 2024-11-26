import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import WebView from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";

interface Slot {
  start_time: string;
  end_time: string;
  user_slots_count: number;
}

interface TimeSlots {
  [date: string]: {
    [batchKey: string]: Slot;
  };
}

const TimeSlot = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<Record<string, any>>({}); // Use Record for a generic object
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [mobileOtp, setMobileOtp] = useState<string>("");
  const [emailOtp, setEmailOtp] = useState<string>("");
  const [cityId, setCityId] = useState<string>("");
  const [venuNameTop, setVenuNameTop] = useState<string>("");
  const [savedTimeSlot, setSavedTimeSlot] = useState<string>("");
  const [savedTimeSlotUser, setSavedTimeSlotUser] = useState<string>("");
  const [checkSlot, setCheckSlot] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [lastCountSlot, setLastCountSlot] = useState<boolean>(false);
  const [shouldReload, setShouldReload] = useState<boolean>(false);
  const [isCheckTimeSlot, setIsCheckTimeSlot] = useState<number>(0);
  const [isTimeSlotVeifyOtp, setTimeSlotVeifyOtp] = useState<number>(0);
  const [isUserDataOuter, setIsUserDataOuter] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();

  // console.log("selectedDate : ", selectedDate)
  // console.log("selectedBatch : ", selectedBatch)

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleConfirm = async () => {
    setLoading(true);
    if (isChecked) {
      try {
        const apiToken = await AsyncStorage.getItem("apiToken"); // Use AsyncStorage for token storage
        if (!apiToken) {
          throw new Error("API token is missing");
        }

        const response = await fetch(
          "https://my.ispl.popopower.com/api/check-disclaimer-slots",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiToken}`,
            },
            body: JSON.stringify({ is_check_disclaimer_slot: 1 }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Failed to update disclaimer slot: ${
              errorData.message || "Unknown error"
            }`
          );
        }
        setIsConfirmed(true);
        setCurrentSection(2);
        setLoading(false);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Disclaimer slot updated successfully!",
        });
      } catch (error) {
        console.error("Error:", error.message);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message,
        });
      }
    } else {
      Toast.show({
        type: "info",
        text1: "Warning",
        text2: "Please check the disclaimer before confirming.",
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const apiToken = await AsyncStorage.getItem("apiToken");
      if (!apiToken) {
        throw new Error("API token is missing");
      }

      const response = await fetch(
        `https://my.ispl.popopower.com/api/get-time-slots?city_id=${cityId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch time slots");
      }

      const data = await response.json();
      setTimeSlots(data.time_slots);

      // Find the selected slot
      const selectedSlot =
        data.time_slots[selectedDate] &&
        Object.values(data.time_slots[selectedDate]).find(
          (slot) => `${slot.start_time} | ${slot.end_time}` === selectedBatch
        );

      if (selectedSlot) {
        if (selectedSlot.user_slots_count === 0) {
          Toast.show({
            type: "error",
            text1: "No Slots Available",
            text2: "No slots available for the selected batch.",
          });
          return; // Exit the function early if no slots are available
        }

        // Update the state for disabled and last count slot
        setIsDisabled(selectedSlot.user_slots_count === 0);
        setLastCountSlot(selectedSlot.user_slots_count === 5);

        // Proceed to the next section if a batch is selected
        if (selectedBatch) {
          setCurrentSection(3);
          setLoading(false);
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Invalid Batch",
          text2: "Selected batch is invalid.",
        });
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    }
  };

  const payClicked = async () => {
    try {
      // Save session info if needed
      saveToSession(cityId, selectedDate, selectedBatch);
  
      const token = await AsyncStorage.getItem("apiToken");
      if (!token) {
        Alert.alert("Authorization token is missing.");
        return;
      }
  
      const response = await axios.get(
        "https://my.ispl.popopower.com/api/user-dashboard-api",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const user_name_ecp = response.data?.user_name_ecp;
      if (!user_name_ecp) {
        console.error("user_name_ecp is missing in the response.");
        return;
      }
  
      const paymentRequestResponse = await axios.post(
        `https://my.ispl.popopower.com/api/payment-time-slot-request-test/${user_name_ecp}`
      );
      console.log("paymentRequestResponse", paymentRequestResponse);
  
      if (paymentRequestResponse.data.status === "Successful") {
        const { encrypted_data, access_code, order_id, amount } = paymentRequestResponse.data;
  
        // Construct the payment URL with orderId and amount as query params
        const paymentUrl = `https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${encrypted_data}&access_code=${access_code}&orderId=${order_id}&amount=${amount}`;
  
        // Navigate to the PaymentScreen with the payment URL as a parameter
        router.push(`/weviewpage?paymentUrl=${encodeURIComponent(paymentUrl)}`);
      } else {
        Alert.alert("Payment request failed. Please try again.");
        router.push("/paymentfailed");
      }
    } catch (error) {
      console.error("An error occurred during payment initiation:", error);
    }
  };
  

  const saveToSession = async (
    cityId: string,
    selectedDate: string,
    selectedBatch: string
  ) => {
    try {
      await AsyncStorage.setItem('cityId', cityId);
      await AsyncStorage.setItem('selectedDate', selectedDate);
      await AsyncStorage.setItem('selectedBatch', selectedBatch);
    } catch (error) {
      console.error('Error saving data to AsyncStorage', error);
    }
  };
  const handleConfirmationYes = async () => {
    setLoading(true);
    try {
      const apiToken = await AsyncStorage.getItem("apiToken");
      if (!apiToken) {
        throw new Error("API token is missing");
      }

      // Ensure email and mobile number are defined
      if (!email || !mobileNumber) {
        throw new Error("Email or mobile number is missing");
      }

      const otpResponse = await fetch(
        "https://my.ispl.popopower.com/api/timeslot_send_otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiToken}`,
          },
          body: JSON.stringify({
            email,
            mobile_number: mobileNumber,
          }),
        }
      );

      if (!otpResponse.ok) {
        const errorData = await otpResponse.json();
        throw new Error(
          `Failed to send OTP: ${errorData.message || "Unknown error"}`
        );
      }

      // Show success toast message
      Toast.show({
        text1: "Success",
        text2: "OTP has been sent successfully!",
        type: "success",
      });

      setOtpSent(true);
      setLoading(false);
      setCurrentSection(4);
      startTimer();
    } catch (error) {
      console.error("Error:", error.message);
      // Show error toast message
      Toast.show({
        text1: "Error",
        text2: error.message,
        type: "error",
      });
    }
  };

  const handleConfirmationNo = () => {
    setCurrentSection(2);
    setOtpSent(false);
  };

  const handleResendOtp = async () => {
    await handleConfirmationYes();
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const apiToken = await AsyncStorage.getItem("apiToken");
      if (!apiToken) {
        throw new Error("API token is missing");
      }

      const response = await fetch(
        "https://my.ispl.popopower.com/api/timeslot_verify_otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiToken}`,
          },
          body: JSON.stringify({
            mobile_otp: mobileOtp,
            email_otp: emailOtp,
          }),
        }
      );

      const textResponse = await response.text();
      if (textResponse.trim() === "") {
        throw new Error("Empty response from the server.");
      }

      const errorData = JSON.parse(textResponse);

      if (!response.ok) {
        throw new Error(
          `Failed to verify OTP: ${errorData.message || "Unknown error"}`
        );
      }

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "OTP verified successfully!",
      });
      setLoading(false);
      const saveSlotResponse = await fetch(
        "https://my.ispl.popopower.com/api/save-time-slots",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiToken}`,
          },
          body: JSON.stringify({
            city_id: cityId,
            venue_date: selectedDate,
            time_slot: selectedBatch,
          }),
        }
      );

      const saveSlotTextResponse = await saveSlotResponse.text();
      if (saveSlotTextResponse.trim() === "") {
        throw new Error("Empty response while saving time slot.");
      }

      const saveTimeSlotData = JSON.parse(saveSlotTextResponse);

      if (!saveSlotResponse.ok) {
        const errorData = saveTimeSlotData;
        throw new Error(
          `Failed to save time slot: ${errorData.message || "Unknown error"}`
        );
      }

      setSavedTimeSlot(saveTimeSlotData);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Time Slot Saved Successfully",
      });

      setCurrentSection(5);
      setMobileOtp("");
      setEmailOtp("");
    } catch (error) {
      console.error("Error:", error.message);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `Failed to verify OTP or save time slot: ${error.message}. Please try again.`,
      });
    }
  };

  const handleCloseModal = () => {
    if (shouldReload) {
      // setRefreshing(true);
    }
    setShowModal(false);
    // setRefreshing(false);
  };

  useEffect(() => {
    setShouldReload(currentSection === 5);
  }, [currentSection]);

  const handleRechangeSlot = () => {
    setCurrentSection(2);
  };

  const startTimer = () => {
    setTimer(120);
    setIsActive(true);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsActive(false); // Stop the timer when it reaches 0
    }

    return () => {
      if (interval) {
        clearInterval(interval); // Cleanup the interval on component unmount
      }
    };
  }, [isActive, timer]);

  useEffect(() => {
    if (currentSection === 2 && selectedDate) {
      setSelectedDate(selectedDate);
    }
  }, [currentSection, selectedDate]);

  const fetchTimeSlots = async (cityId: string) => {
    try {
      const apiToken = await AsyncStorage.getItem("apiToken");

      if (!apiToken) {
        Alert.alert("Error", "API token not found");
        return;
      }

      const response = await fetch(
        `https://my.ispl.popopower.com/api/get-time-slots?city_id=${cityId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );

      

      if (!response.ok) {
        throw new Error("Failed to fetch time slots");
      }

      const data = await response.json();
      // Assuming you have setTimeSlots defined in your component
      // console.log("responseresponseresponse: ", data);
      setTimeSlots(data.time_slots);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      Alert.alert("Error", "Error fetching time slots: " + error.message);
    }
  };

  useEffect(() => {
    const fetchDisclaimerStatus = async () => {
      try {
        const apiToken = await AsyncStorage.getItem("apiToken");
        if (!apiToken) {
          throw new Error("API token is missing");
        }

        const response = await fetch(
          "https://my.ispl.popopower.com/api/user-dashboard-api",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiToken}`,
            },
          }
        );
        // console.log("Dummy response : ", response)

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const cityName = data.users.cities_states_name;
        const setvenuNameTopName = data.venue_name;
        const checkSlotConfirm = data.users.is_time_slot_confirmed;
        const userTimeSlotDatas = data.user_slots_master[0];
        const userOuterData = data;
        const isCheckDisclaimerSlot = data.users.is_check_disclaimer_slot;
        const setTimeSlotVerifyOtp_slot = data.users.is_time_slot_otp_confirmed;

        setIsUserDataOuter(userOuterData);
        setIsCheckTimeSlot(isCheckDisclaimerSlot);
        setSavedTimeSlotUser(userTimeSlotDatas);
        setCheckSlot(checkSlotConfirm);
        setTimeSlotVeifyOtp(setTimeSlotVerifyOtp_slot);
        setVenuNameTop(setvenuNameTopName);
        setEmail(data.users.email);
        setMobileNumber(data.users.mobile_number);

        if (isCheckDisclaimerSlot === 1) {
          setCurrentSection(2);
        } else {
          setCurrentSection(1);
        }

        if (checkSlotConfirm === 1 && isCheckDisclaimerSlot === 1) {
          setCurrentSection(6);
        }

        if (cityName) {
          setCityId(cityName);
          fetchTimeSlots(cityName);
        }
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Error", error.message);
      }
    };

    fetchDisclaimerStatus();
  }, [showModal]);

  const sectionTitles: { [key: number]: string } = {
    1: "Disclaimer",
    2: "Select Time Slot",
    3: "Confirm Selection",
    4: "OTP Verification",
    5: "Trial Time Slot Booked",
    6: "Your Trial Details",
  };

  const title = sectionTitles[currentSection] || "";

  return (
    <>
      <Pressable style={styles.sqrBtn} onPress={() => setShowModal(true)}>
        <Text style={styles.buttonText}>Time Slot</Text>
      </Pressable>
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={[styles.modalWrap]}>
          <ScrollView
            contentContainerStyle={[
              styles.slotWrap,
              currentSection === 6 && styles.bgGolden,
            ]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[
                  styles.modalTitle,
                  currentSection === 6 && styles.darkText,
                ]}
              >
                {title}
              </Text>
              <Pressable onPress={handleCloseModal}>
                <Text
                  style={{
                    color: currentSection === 6 ? "#172046" : "#172046",
                  }}
                >
                  <AntDesign
                    name="closesquareo"
                    size={28}
                    style={{
                      color: currentSection === 6 ? "#172046" : "#fff",
                    }}
                  />
                </Text>
              </Pressable>
            </View>

            {/* Section 1 */}
            {currentSection === 1 && (
              <View style={styles.contentWrap}>
                <Text style={styles.mainPara}>
                  To secure your city trials, please book your slot exclusively
                  through the official website at{" "}
                  <Text
                    style={styles.link}
                    onPress={() => Linking.openURL("https://ispl-t10.com/")}
                  >
                    www.ispl-t10.com
                  </Text>
                  . City trial slots will open one hour before the selected time
                  and close two hours before the trial begins.
                </Text>
                <Text style={styles.mainPara}>
                  Booking confirmations will be sent via OTP to your registered
                  mobile number. Slot availability is limited, so check
                  availability before booking.
                </Text>
                <Text style={styles.mainPara}>
                  If you need to change your slot timing after confirmation, an
                  additional fee of ₹599 + GST will apply for each change,
                  subject to availability.
                </Text>

                <View style={styles.checkboxContainer}>
                  <Pressable
                    onPress={handleCheckboxChange}
                    style={styles.checkboxLabelWrap}
                  >
                    <Text style={styles.checkboxLabel}>I agree</Text>
                    <View
                      style={[
                        styles.checkbox,
                        isChecked && styles.checkboxChecked,
                      ]}
                    >
                      {isChecked && (
                        <Ionicons name="checkmark" size={24} color="white" />
                      )}
                    </View>
                  </Pressable>

                  <Pressable
                    style={[styles.sqrBtn, styles.sqrBtnMT]}
                    onPress={handleConfirm}
                    disabled={!isChecked}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Confirm</Text>
                    )}
                  </Pressable>
                </View>
              </View>
            )}

            {/* Section 2 */}
            {currentSection === 2 && (
              <View style={styles.slotForm}>
                <View style={styles.cityBox}>
                  <Text style={styles.cityText}>City: {cityId}</Text>
                  <Text style={styles.cityText}>Venue Name: {venuNameTop}</Text>
                </View>
                <Text style={styles.label}>Select Date</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={selectedDate}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedDate(itemValue)}
                  >
                    <Picker.Item label="Select Date" value="" />
                    {Object.keys(timeSlots).map((date) => (
                      <Picker.Item key={date} label={date} value={date} />
                    ))}
                  </Picker>
                </View>
                {selectedDate && (
                  <View>
                    <Text style={styles.label}>Select Time</Text>
                    <View style={styles.timeBox}>
                      {timeSlots[selectedDate] &&
                        Object.keys(timeSlots[selectedDate]).map(
                          (batchKey, index) => {
                            const slot = timeSlots[selectedDate][batchKey];

                            let availabilityMessage;
                            if (slot.user_slots_count === 0) {
                              availabilityMessage = "Fully Booked";
                            } else if (slot.user_slots_count <= 3) {
                              availabilityMessage = "Almost Full";
                            } else if (slot.user_slots_count <= 5) {
                              availabilityMessage = "Filling Fast...";
                            }

                            const isDisabled = slot.user_slots_count === 0;
                            const lastCountSlot = slot.user_slots_count === 5;

                            return (
                              <TouchableOpacity
                                key={index}
                                style={[
                                  styles.card,
                                  isDisabled
                                    ? styles.bgDisabled
                                    : styles.cardActive,
                                  selectedBatch ===
                                    `${slot.start_time} | ${slot.end_time}` &&
                                    styles.selectedCard,
                                ]}
                                disabled={isDisabled}
                                onPress={() =>
                                  setSelectedBatch(
                                    `${slot.start_time} | ${slot.end_time}`
                                  )
                                }
                              >
                                <View style={styles.cardBody}>
                                  <Text style={styles.cardTitle}>
                                    {batchKey}
                                  </Text>
                                  <Text style={styles.cardText}>
                                    {slot.start_time} - {slot.end_time}
                                  </Text>
                                  {/* Display when user_slots_count is less than 5 */}
                                  {!lastCountSlot && (
                                    <Text style={styles.slotInfo}>
                                      Available Slots: {slot.user_slots_count}
                                    </Text>
                                  )}
                                  {/* Display availability message */}
                                  {isDisabled ? null : (
                                    <Text style={styles.availabilityMessage}>
                                      {availabilityMessage}
                                    </Text>
                                  )}
                                </View>
                              </TouchableOpacity>
                            );
                          }
                        )}
                    </View>
                  </View>
                )}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.sqrBtn, styles.sqrBtnMT]}
                    onPress={
                      isTimeSlotVeifyOtp === 0 ? handleSubmit : payClicked
                    }
                    disabled={!selectedBatch}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>
                        {isTimeSlotVeifyOtp === 0
                          ? "Continue"
                          : "Rechange Time Slots"}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Section 3 */}
            {currentSection === 3 && (
              <View style={styles.contentWrap}>
                <Text style={styles.confirmationText}>
                  You have selected the date and time slot. Please confirm your
                  selection.
                </Text>
                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    style={[styles.sqrBtn, styles.sqrBtnMT]}
                    onPress={handleConfirmationYes}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Confirm</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.sqrBtn, styles.sqrBtnMT]}
                    onPress={handleConfirmationNo}
                  >
                    <Text style={styles.buttonText}>Change</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Section 4 */}
            {currentSection === 4 && (
              <View style={styles.contentWrap}>
                {otpSent ? (
                  <View>
                    <Text
                      style={[
                        styles.confirmationText,
                        styles.confirmationTextLeft,
                      ]}
                    >
                      OTP has been sent to your mobile number and Email.
                    </Text>
                    <TextInput
                      value={emailOtp}
                      onChangeText={setEmailOtp}
                      style={styles.input}
                    />
                    {timer > 0 ? (
                      <Text style={styles.linkText}>
                        OTP expires in {Math.floor(timer / 60)}:{timer % 60}
                      </Text>
                    ) : (
                      <Text onPress={handleResendOtp} style={styles.linkText}>
                        Resend OTP
                      </Text>
                    )}
                    <TouchableOpacity
                      style={[styles.sqrBtn, styles.sqrBtnMT]}
                      onPress={handleVerifyOtp}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.buttonText}>Verify OTP</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text>Please wait while we send you an OTP.</Text>
                )}
              </View>
            )}

            {/* Section 5 */}
            {currentSection === 5 && savedTimeSlot && (
              <View style={styles.contentWrap}>
                <Text
                  style={[styles.confirmationText, styles.confirmationTextLeft]}
                >
                  Your time slot is booked in{" "}
                  {savedTimeSlot?.data?.user?.cities_name} on{" "}
                  {savedTimeSlot?.data?.formatted_date}. The slot is scheduled
                  from {savedTimeSlot?.data?.formatted_start_time} to{" "}
                  {savedTimeSlot?.data?.formatted_end_time}. Please ensure to
                  arrive on time.
                </Text>
                <Text
                  style={[styles.confirmationText, styles.confirmationTextLeft]}
                >
                  Your golden ticket will be sent via WhatsApp in the next 3
                  working days.
                </Text>
              </View>
            )}

            {/* Section 6 */}
            {currentSection === 6 && savedTimeSlotUser && (
              <View style={styles.contentWrap}>
                <Text
                  style={[
                    styles.confirmationText,
                    styles.confirmationTextLeft,
                    currentSection === 6 && styles.darkTextFont,
                  ]}
                >
                  You have successfully booked your trial slot in{" "}
                  <Text>{savedTimeSlotUser.cities_name}</Text> at{" "}
                  <Text>{savedTimeSlotUser.venue_name}</Text> on{" "}
                  <Text>{isUserDataOuter.formatted_date}</Text>. The trial is
                  scheduled to take place from{" "}
                  <Text>{isUserDataOuter.formatted_start_time}</Text> to{" "}
                  <Text>{isUserDataOuter.formatted_end_time}</Text>.{" "}
                  {isUserDataOuter.formatted_start_time === "09:00 AM"
                    ? "Please note that entry to the venue will be open from 8:00 a.m. and will close at 11:30 a.m. We request that you arrive on time to ensure a smooth and efficient trial process."
                    : "Please note that entry to the venue will be open from 12:30 p.m. and will close at 3:00 p.m. We request that you arrive on time to ensure a smooth and efficient trial process."}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.sqrBtn,
                    styles.sqrBtnMT,
                    currentSection === 6 && styles.darksqrBtnMT,
                  ]}
                  onPress={handleRechangeSlot}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      currentSection === 6 && styles.darkbuttonText,
                    ]}
                  >
                    Change Slot
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
          <Toast />
        </View>
      </Modal>
    </>
  );
};
const styles = StyleSheet.create({
  modalWrap: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
    position: "relative",
  },
  slotWrap: {
    backgroundColor: "#182046",
    borderRadius: 10,
    padding: 20,
  },
  bgGolden: {
    backgroundColor: "#fbe29a",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  darksqrBtnMT: {
    borderColor: "#182046",
  },
  buttonContainer: {
    justifyContent: "center",
    marginTop: 20,
  },
  sqrBtnMT: {
    marginTop: 0,
  },
  buttonText: {
    color: "#fbe29a",
    fontSize: 20,
    fontWeight: "600",
  },
  darkbuttonText: {
    color: "#182046",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fbe29a",
  },
  darkText: {
    color: "#172046",
  },
  darkTextFont: {
    color: "#182046",
    fontWeight: "600",
  },
  contentWrap: {
    marginVertical: 10,
  },
  mainPara: {
    marginBottom: 10,
    color: "#fff",
    fontSize: 16,
    lineHeight: 24,
  },
  link: {
    color: "#fbe29a",
    textDecorationLine: "underline",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkbox: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  checkboxLabel: {
    color: "#fbe29a",
    fontSize: 18,
  },
  checkboxLabelWrap: {
    flexDirection: "row",
    gap: 10,
  },
  checkboxChecked: {
    backgroundColor: "green",
  },
  slotForm: {
    marginVertical: 10,
  },
  cityBox: {
    backgroundColor: "#fbe29a",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 20,
  },
  cityText: {
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 32,
  },
  card: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 5,
  },
  bgDisabled: {
    backgroundColor: "#d3d3d3",
    borderColor: "#a9a9a9",
  },

  selectedCard: {
    borderColor: "#fbe29a",
    backgroundColor: "green",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 10,
  },
  visible: {
    color: "green",
  },
  hidden: {
    color: "green",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 28,
  },
  slotInfo: {
    color: "#fff",
  },
  availabilityMessage: {
    color: "#fff",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  confirmationText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
    color: "#fff",
    lineHeight: 24,
  },
  confirmationTextLeft: {
    textAlign: "left",
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
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },
  linkText: {
    color: "#fbe29a",
    textAlign: "right",
    marginBottom: 16,
    fontWeight: "700",
    fontSize: 16,
  },
  pickerWrapper: {
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
  },
  picker: {
    color: "#fbe29a",
    fontSize: 20,
  },
});

export default TimeSlot;
