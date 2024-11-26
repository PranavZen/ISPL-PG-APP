import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface Player {
  player_id: string;
  player_name: string;
  player_image: string;
  specializations_name: string;
}

interface Team {
  team_name: string[];
  match_center: Player[];
}

interface TeamPlayersData {
  team_1: Team;
  team_2: Team;
}

const { width } = Dimensions.get("window");

const TeamPlayers: React.FC = () => {
  const route = useRoute();
  const { id } = route.params as { id: string };
  const [teamPlayers, setTeamPlayers] = useState<TeamPlayersData | null>(null);

  useEffect(() => {
    const fetchTeamPlayers = async () => {
      try {
        const response = await axios.get(
          `https://my.ispl.popopower.com/api/matches/match-center/${id}`
        );
        setTeamPlayers(response.data.data);
      } catch (error) {
        console.error("Error fetching team players:", error);
      }
    };

    fetchTeamPlayers();
  }, [id]);

  if (!teamPlayers) return <ActivityIndicator size="large" color="#0000ff" />;

  const organizePlayersBySpecialization = (team: Team) => {
    const organizedData: { [key: string]: Player[] } = {};

    team.match_center.forEach((player) => {
      if (!organizedData[player.specializations_name]) {
        organizedData[player.specializations_name] = [];
      }
      organizedData[player.specializations_name].push(player);
    });

    return organizedData;
  };

  const renderPlayerItem = ({ item }: { item: Player }) => {
    const imageUrl = `https://my.ispl.popopower.com/images/team-master/players/${item.player_image}`;
    const specialization = item.specializations_name
      .replace(/\s+/g, " ") // Replace multiple spaces with a single space
      .trim(); // Trim leading and trailing spaces

    let icon;
    switch (specialization) {
      case "Batter":
      case "Batters": // Handle the specific case for Batters
        icon = (
          <View style={styles.icoWrap}>
            <Image
              source={{
                uri: "https://www.ispl-t10.com/battter.png",
              }}
              style={[styles.ico, styles.icobat]}
            />
          </View>
        );
        break;
      case "Bowler":
      case "Bowlers": // Handle the specific case for Bowlers
        icon = (
          <View style={styles.icoWrap}>
            <Image
              source={{
                uri: "https://www.ispl-t10.com/redball.png",
              }}
              style={styles.ico}
            />
          </View>
        );
        break;
      case "All-Rounder":
      case "All Rounders": // Handle the specific case for All Rounders
        icon = (
          <View style={styles.icoWrap}>
            <Image
              source={{
                uri: "https://www.ispl-t10.com/battter.png",
              }}
              style={[styles.ico, styles.icobat]}
            />
            <Image
              source={{
                uri: "https://www.ispl-t10.com/redball.png",
              }}
              style={styles.ico}
            />
          </View>
        );
        break;
      default:
        icon = <MaterialIcons name="error-outline" size={24} color="red" />; // Default icon for unknown specialization
        console.warn(`Unknown specialization: ${specialization}`); // Log the unknown specialization
    }

    return (
      <View style={styles.playerContainer}>
        {icon}
        <Image
          source={{ uri: imageUrl }}
          style={styles.playerImage}
          onError={() => console.error(`Failed to load image: ${imageUrl}`)}
        />
        <Text style={styles.playerName}>{item.player_name}</Text>
      </View>
    );
  };

  const renderSpecializationBlock = (
    specialization: string,
    players: Player[]
  ) => {
    return (
      <View style={styles.specializationBlock} key={specialization}>
        <View style={styles.specializationHeader}>
          <Text style={styles.specializationTitle}>{specialization}</Text>
        </View>
        <FlatList
          data={players}
          renderItem={renderPlayerItem}
          keyExtractor={(player, index) =>
            `${specialization}-${player.player_name}-${index}`
          }
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.columnWrapper}
        />
      </View>
    );
  };

  const renderTeamSection = (team: Team) => {
    const organizedPlayers = organizePlayersBySpecialization(team);
    const teamName =
      team.team_name.length > 0 ? team.team_name[0].team_name : "Unknown Team";

    return (
      <View style={styles.teamSection}>
        <Text style={styles.teamTitle}>{teamName}</Text>
        {Object.entries(organizedPlayers).map(([specialization, players]) =>
          renderSpecializationBlock(specialization, players)
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderTeamSection(teamPlayers.team_1)}
      {renderTeamSection(teamPlayers.team_2)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#002458",
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  ico: {
    width: 20,
    height: 20,
  },
  icobat: {
    width: 22,
    height: 22,
  },
  icoWrap: {
    justifyContent: "flex-end",
    flexDirection: "row",
    width: "100%",
  },
  teamSection: {
    marginBottom: 20,
  },
  teamTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#fbe29a",
  },
  specializationBlock: {
    marginBottom: 20,
  },
  specializationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  specializationTitle: {
    color: "#fff",
    marginLeft: 10, // Space between icon and text
    fontSize: 22,
  },
  playerContainer: {
    alignItems: "center",
    flex: 1,
    marginBottom: 10,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    padding: 3,
    borderRadius: 6,
  },
  playerImage: {
    width: width / 2,
    height: width / 2,
  },
  playerName: {
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
    textTransform: "capitalize",
    backgroundColor: "#002458",
    width: "100%",
    paddingVertical: 8,
    borderRadius: 4,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});

export default TeamPlayers;
