import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { ScrollView, View } from "react-native";
import { useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const TeamDetail = () => {
  const route = useRoute();
  const { team } = route.params;

  // If no team is found, show loading indicator
  if (!team) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.teamLogoContainer}>
        <View style={styles.teamLogoContainerWrap}>
          <View style={styles.teamLogoWrap}>
            <Image
              source={{
                uri: `https://my.ispl.popopower.com/images/team-master/teams/${team.team_logo}`,
              }}
              style={styles.teamLogo}
            />
          </View>

          <Text style={styles.teamNameText}>{team.team_name}</Text>
        </View>

        <View style={styles.teamDetailContainer}>
          <Text>
            <Text style={styles.detailLabel}>Owner</Text>{" "}
            <Text style={styles.detailValue}>- {team.team_owner}</Text>
          </Text>
          <Text>
            <Text style={styles.detailLabel}>Coach</Text>{" "}
            <Text style={styles.detailValue}>- {team.team_coach}</Text>
          </Text>
          <Text>
            <Text style={styles.detailLabel}>Venue</Text>{" "}
            <Text style={styles.detailValue}>- {team.venue}</Text>
          </Text>
          <Text>
            <Text style={styles.detailLabel}>Captain</Text>{" "}
            <Text style={styles.detailValue}>- {team.captain_name}</Text>
          </Text>
        </View>
      </View>

      {/* Players List Section */}
      <View style={styles.playersContainer}>
        {team.players && team.players.length > 0 ? (
          team.players.map((player, index) => (
            <View key={index} style={styles.playerContainer}>
              <Image
                source={{
                  uri: `https://my.ispl.popopower.com/images/team-master/players/${player.player_image}`, // Adjust the image URL if necessary
                }}
                style={styles.playerImage}
              />
              <View style={styles.playerNameWrap}>
                <Text style={styles.playerName}>{player.player_name}</Text>
                <Text style={[styles.playerName, styles.playerNameSpec]}>
                  {player.specialization_name}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noPlayersText}>No players available</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#002458",
  },
  teamLogoContainer: {
    width: "100%",
    backgroundColor: "#fbe29a",
    paddingHorizontal: 15,
    paddingVertical: 15,
    paddingTop: 10,
  },
  teamLogoContainerWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  teamDetailContainer: {
    flexDirection: "column",
    gap: 5,
    marginTop: 10,
  },
  playersContainer: {
    paddingHorizontal: 10,
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  playerContainer: {
    width: "48%",
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 3,
    borderRadius: 6,
    alignItems: "center",
  },
  playerImage: {
    width: "100%",
    height: width / 2,
    borderRadius: 4,
  },
  playerName: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    textTransform: "capitalize",
  },
  playerNameSpec: {
    textAlign: "center",
    color: "#fbe29a",
    fontSize: 16,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  playerNameWrap: {
    backgroundColor: "#002458",
    width: "100%",
    paddingVertical: 8,
    borderRadius: 4,
    flexDirection: "column",
    gap: 5,
  },
  noPlayersText: {
    color: "#002458",
    textAlign: "center",
    marginTop: 10,
  },
  teamLogo: {
    width: 60,
    height: 60,
  },
  teamLogoWrap: {
    width: 80,
    height: 80,
    backgroundColor: "#002458",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  teamNameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#002458",
  },
  detailLabel: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#002458",
  },
  detailValue: {
    fontWeight: "400",
    fontSize: 16,
    color: "#002458",
  },
});

export default TeamDetail;
