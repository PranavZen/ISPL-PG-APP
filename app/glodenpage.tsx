// import TimeSlot from "@/components/goldenpagecomponents/TimeSlot";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
// import animationData from "../components/anime/confitee.json";
import LottieView from "lottie-react-native";
import GreenMessage from "@/components/goldenpagecomponents/GreenMessage";
import RejectedMessagee from "@/components/goldenpagecomponents/RejectedMessage";
import NotAttended from "@/components/goldenpagecomponents/NotAttended";
import RenderHTML from "react-native-render-html";
import TimeSlot from "@/components/goldenpagecomponents/TimeSlot";

const GoldenPage: React.FC = () => {
  const [playerName, setPlayerName] = useState<string>("");
  const [isplId, setIsplId] = useState<string>("");
  const [userNameSlot, setUserNameSlot] = useState<string | null>(null);
  const [userSlotId, setUserSlotId] = useState<string>("");
  const [playerId, setPlayerId] = useState<string>("");
  const [cityName, setCityName] = useState<string>("");
  const [zoneName, setzoneName] = useState<string>("");
  const [seasonTypes, setSeasonTypes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSlotDate, setSelectedSlotDate] = useState<string | null>(null);
  const [selectedSlotStartTime, setSelectedSlotStartTime] = useState<
    string | null
  >(null);
  const [selectedSlotEndTime, setSelectedSlotEndTime] = useState<string | null>(
    null
  );
  const [isSlotAvailable, setIsSlotAvailable] = useState<boolean>(false);
  const [isTicketId, setIsTicketId] = useState<number>(0);
  const [slotTimeFuture, setSlotTimeFuture] = useState<number>(0);
  const [slotTimePassed, setSlotTimePassed] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isticketTitle, setIsticketTitle] = useState("");
  const [isticketDescription, setIsticketDescription] = useState("");
  const [isticketName, setIsticketName] = useState("");
  const [isticketImage, setIsticketImage] = useState("");

  const generateQRCodeData = useCallback(
    () => JSON.stringify(userNameSlot),
    [userNameSlot]
  );
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("apiToken");
      return token ? token : null;
    } catch (error) {
      console.error("Error retrieving token", error);
      return null;
    }
  };

  const fetchData = async () => {
    const token = await getToken();
    if (!token) {
      console.error("No token found. User is not authenticated.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "https://my.ispl.popopower.com/api/user-dashboard-api",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Dummy response : ", response.data);
      const userData = response.data.user_data;
      const slot_time_future = response.data.slot_time_future;
      const slot_time_passed = response.data.slot_time_passed;
      if (
        response.data.user_slots_master &&
        response.data.user_slots_master.length > 0
      ) {
        const slotMaster = response.data.user_slots_master[0];

        setSelectedSlotDate(response.data.formatted_date || "");
        setSelectedSlotStartTime(response.data.formatted_start_time || "");
        setSelectedSlotEndTime(response.data.formatted_end_time || "");
        setUserNameSlot(slotMaster.user_name || "");
        setUserSlotId(response.data.venue_name || "");
        setIsSlotAvailable(true);
      } else {
        setIsSlotAvailable(false);
      }

      setPlayerName(`${userData.first_name} ${userData.surname}`);
      setPlayerId(userData.user_name);
      const cityNameArray = JSON.parse(userData.cities_states_names);
      setCityName(cityNameArray[0]);
      setzoneName(response.data.users.zone_name);
      setSeasonTypes(response.data.season);
      setIsTicketId(userData.ticket_id);
      setIsticketTitle(response.data.ticket_title);
      setIsticketDescription(response.data.ticket_description);
      setIsticketName(response.data.ticket_name);
      setIsticketImage(response.data.ticket_image);
      setSlotTimeFuture(slot_time_future);
      setSlotTimePassed(slot_time_passed);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      if (error.response && error.response.status === 401) {
        console.warn("Unauthorized access - please log in again.");
      }
    }
  };
  const { width } = Dimensions.get("window");

  const handleRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    await fetchData();
    setRefreshing(false);
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);
  const tagsStyles = useMemo(
    () => ({
      p: styles.paragraph,
    }),
    []
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.contentContainer}>
        <View style={styles.messageContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              {(() => {
                if (
                  (isTicketId === 0 || isTicketId === 1 || isTicketId === 4) &&
                  slotTimePassed === 0
                ) {
                  return <TimeSlot />;
                } else if (isTicketId === 2 && slotTimeFuture === 0) {
                  return <TimeSlot />;
                } else {
                  return null;
                }
              })()}
            </>
          )}
        </View>

        <View style={styles.emailContent}>
          <View style={styles.header}>
            <Image
              style={styles.logo}
              source={{
                uri: "https://my.ispl.popopower.com/assets/img/logo.png",
              }}
              alt="Logo"
            />
            <Text style={styles.welcomeText}>
              Welcome to Indian Street Premiere League!...
            </Text>
          </View>
          <Text style={styles.gTitleText}>
            {isTicketId === 2 ? (
              <>
                {isticketTitle} {playerName}
              </>
            ) : isTicketId === 5 ? (
              isticketTitle
            ) : isTicketId === 6 ? (
              isticketTitle
            ) : (
              isticketTitle
            )}
          </Text>
          <View style={styles.body}>
            <Text style={styles.respText}>
              Dear <Text style={styles.playerName}>{playerName}</Text>,
            </Text>

            <>
              {isTicketId === 2 ? (
                <>
                  <GreenMessage isticketDescription={isticketDescription} />
                  <Text style={styles.paragraph}>
                    Congratulations once again, {playerName}! We await your
                    brilliance, and we’re counting down the days until you take
                    the stage!
                  </Text>
                </>
              ) : isTicketId === 5 ? (
                <RejectedMessagee isticketDescription={isticketDescription} />
              ) : isTicketId === 6 ? (
                <NotAttended isticketDescription={isticketDescription} />
              ) : (
                <RenderHTML
                  contentWidth={width}
                  source={{ html: isticketDescription }}
                  tagsStyles={tagsStyles}
                />
              )}
            </>
          </View>

          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <View style={styles.ticketContainer}>
              <Image
                source={{
                  uri: `https://my.ispl.popopower.com/assets/img/${isticketImage}`,
                }}
                style={styles.ticketImage}
              />
              {isTicketId === 2 ? (
                <View style={styles.lottieWrap}>
                  <LottieView
                    source={require("../components/anime/confitee.json")}
                    autoPlay
                    loop
                    style={{ width: 400, height: 400 }}
                  />
                </View>
              ) : (
                ""
              )}
              <View style={styles.ticketTextContainer}>
                <Text style={styles.ticketText}>{isticketName}</Text>
                <Text style={styles.seasonText}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    `Season ${seasonTypes}`
                  )}
                </Text>
                <Text style={styles.playerInfo}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    `MR. ${playerName}`
                  )}
                </Text>
                <View style={styles.hr} />

                {isTicketId === 5 || isTicketId === 6 ? (
                  ""
                ) : (
                  <View style={styles.qrCodeWrap}>
                    {userNameSlot === null ? (
                      ""
                    ) : (
                      <QRCode
                        value={generateQRCodeData()}
                        size={110}
                        backgroundColor="transparent"
                      />
                    )}
                  </View>
                )}
                <Text style={styles.playerId}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    playerId
                  )}{" "}
                  <Text style={styles.cityName}>
                    (
                    {loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : isTicketId === 2 ? (
                      `${zoneName} Zone`
                    ) : (
                      cityName
                    )}
                    )
                  </Text>
                </Text>
                {isTicketId === 5 || isTicketId === 6 ? null : (
                  <Text style={styles.finalTextSlotTicket}>
                    {userSlotId}{" "}
                    {isSlotAvailable ? (
                      <>
                        {selectedSlotDate}
                        {"\n"}
                        {selectedSlotStartTime} to {selectedSlotEndTime}
                      </>
                    ) : (
                      <Text></Text>
                    )}
                  </Text>
                )}
              </View>
            </View>
          )}

          <View style={styles.body}>
            <Text style={styles.finalNote}>
              Best regards,
              {"\n"}
              Indian Street Premiere League Team
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  ticketTextContainer: {
    position: "absolute",
    top: "5%",
    height: "100%",
    justifyContent: "center",
  },

  contentContainer: {
    backgroundColor: "#1c1c1c",
    padding: 15,
    flex: 1,
    position: "relative",
    paddingBottom: 40,
    paddingTop: 40,
  },

  messageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  goldenMsg: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },
  emailContent: {
    marginTop: 10,
  },
  header: {
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  welcomeText: {
    color: "#fff",
    fontSize: 22,
    marginTop: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  gTitleText: {
    color: "#fbe29a",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
    fontWeight: "bold",
    lineHeight: 24,
  },
  body: {
    marginTop: 20,
  },
  respText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  playerName: {
    color: "#fff",
    fontWeight: "bold",
  },
  paragraph: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 24,
  },
  ticketContainer: {
    marginTop: 130,
    marginBottom: 110,
    alignItems: "center",
    position: "relative",
  },
  lottieWrap: {
    position: "absolute",
  },
  ticketImage: {
    width: 600,
    height: 380,
    resizeMode: "contain",
    transform: [{ rotate: "90deg" }],
  },
  ticketText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 24,
    textAlign: "center",
    marginVertical: 5,
  },
  seasonText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  playerInfo: {
    color: "#000",
    fontWeight: "900",
    fontSize: 20,
    marginBottom: 0,
    textAlign: "center",
  },
  hr: {
    width: "100%",
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    marginVertical: 5,
  },
  qrCodeWrap: {
    alignItems: "center",
    marginVertical: 10,
  },
  playerId: {
    color: "#000",
    fontWeight: "900",
    fontSize: 20,
    marginBottom: 5,
    textAlign: "center",
  },
  cityName: {
    color: "#000",
    fontWeight: "900",
    fontSize: 20,
    marginBottom: 5,
    textAlign: "center",
  },
  finalTextSlotTicket: {
    color: "#000",
    fontWeight: "900",
    fontSize: 14,
    marginBottom: 0,
    textAlign: "center",
    lineHeight: 22,
  },
  finalNote: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
  },
  skeleton: {
    height: 100,
    width: 800,
    backgroundColor: "#ccc",
    borderRadius: 8,
  },
});

export default GoldenPage;

