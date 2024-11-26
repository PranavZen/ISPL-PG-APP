import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface MatchCardProps {
  team_one_scrore: number;
  team_one_wicket: number;
  team_one_over: number;
  team_two_scrore: number;
  team_two_wicket: number;
  team_two_over: number;
  match_date: string;
  match_time: string;
  win_message: string;
  stadium_name: string;
  to_team_name: string;
  to_team_logo: string;
  from_team_logo: string;
}

const MatchCard: React.FC<MatchCardProps> = ({
  team_one_scrore,
  team_one_wicket,
  team_one_over,
  team_two_scrore,
  team_two_wicket,
  team_two_over,
  match_date,
  match_time,
  win_message,
  stadium_name,
  to_team_name,
  to_team_logo,
  from_team_logo,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ISPL T-10 Latest Winner</Text>
      </View>
      <View style={styles.matchInfo}>
        <View style={styles.teamContainer}>
          <Image
            source={{
              uri: `https://my.ispl.popopower.com/images/team-master/teams/${from_team_logo}`,
            }}
            style={styles.teamLogo}
          />
          <Text style={styles.teamScore}>
            {team_one_scrore} / {team_one_wicket}{" "}
            <Text style={styles.oversText}>({team_one_over} ov)</Text>
          </Text>
        </View>

        <Text style={styles.vsText}>VS</Text>

        <View style={styles.teamContainer}>
          <Image
            source={{
              uri: `https://my.ispl.popopower.com/images/team-master/teams/${to_team_logo}`,
            }}
            style={styles.teamLogo}
          />
          <Text style={styles.teamScore}>
            {team_two_scrore} / {team_two_wicket}{" "}
            <Text style={styles.oversText}>({team_two_over} ov)</Text>
          </Text>
        </View>
      </View>

      <View style={styles.matchDetails}>
        <Text style={styles.stadiumName}>{stadium_name}</Text>
        <Text style={styles.matchDate}>{match_date}</Text>
        <Text style={styles.matchTime}>{match_time}</Text>
      </View>

      <View style={styles.winMessageContainer}>
        <Text style={styles.winMessage}>{win_message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#263574",
  },
  matchInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 10,
  },
  teamContainer: {
    alignItems: "center",
  },
  teamLogo: {
    width: 80,
    height: 80,
  },
  teamScore: {
    fontSize: 22,
    fontWeight: "600",
    color: "#263574",
  },
  oversText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#555",
  },
  vsText: {
    marginHorizontal: 10,
    color: "#263574",
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  vsImage: {
    width: 50,
    height: 50,
  },
  matchDetails: {
    alignItems: "center",
    marginVertical: 10,
  },
  stadiumName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#263574",
    marginBottom: 0,
  },
  matchDate: {
    fontSize: 16,
    fontWeight: "800",
    color: "#263574",
    marginBottom: 2,
  },
  matchTime: {
    fontSize: 16,
    fontWeight: "800",
    color: "#263574",
  },
  winMessageContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  winMessage: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#263574",
  },
});

export default MatchCard;
