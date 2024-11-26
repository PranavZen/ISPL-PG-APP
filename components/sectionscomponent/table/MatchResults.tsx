import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select"; // Import the Picker component

interface Match {
  id: number;
  from_team_name: string;
  to_team_name: string;
  team_one_scrore: number;
  team_two_scrore: number;
  team_one_wicket: number;
  team_two_wicket: number;
  team_one_over: number;
  team_two_over: number;
  stadium_name: string;
  from_team_logo: string;
  to_team_logo: string;
  cat_id: number;
  category_name: string;
}

const MatchRows: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [seasons, setSeasons] = useState<string[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(
          "https://my.ispl.popopower.com/api/matches/results"
        );
        const data = await response.json();
        if (data.status === "success") {
          const fetchedSeasons = Object.keys(data.data.result);
          setSeasons(fetchedSeasons);

          // Automatically select the first season
          const defaultSeason = fetchedSeasons[0];
          setSelectedSeason(defaultSeason);
          setMatches(data.data.result[defaultSeason]);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching match data:", error);
      }
    };

    fetchMatches();
  }, []);

  const handleSeasonChange = (newSeason: string) => {
    setLoading(true);
    setSelectedSeason(newSeason);

    fetchMatchesForSeason(newSeason);
  };

  const fetchMatchesForSeason = async (season: string) => {
    try {
      const response = await fetch(
        "https://my.ispl.popopower.com/api/matches/results"
      );
      const data = await response.json();
      if (data.status === "success") {
        setMatches(data.data.result[season]);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching match data:", error);
      setLoading(false);
    }
  };

  const getWinMessage = (match) => {
    if (match.team_one_scrore > match.team_two_scrore) {
      return `${match.from_team_name.toUpperCase()} WON BY ${
        match.team_one_scrore - match.team_two_scrore
      } RUNS`;
    } else if (match.team_one_scrore < match.team_two_scrore) {
      return `${match.to_team_name.toUpperCase()} WON BY ${
        match.team_two_scrore - match.team_one_scrore
      } RUNS`;
    }
    return "MATCH TIED";
  };

  const getCategoryName = (match) => {
    if (match.cat_id === 3) {
      return "LEAGUE MATCH";
    } else if (match.category_name === "QUALIFIER 1") {
      return "SEMIFINAL 1";
    } else if (match.category_name === "QUALIFIER 2") {
      return "SEMIFINAL 2";
    } else if (match.category_name === "FINAL") {
      return "FINAL";
    }
    return match.category_name;
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View>
      <RNPickerSelect
        onValueChange={handleSeasonChange}
        items={seasons.map((season) => ({
          label: season,
          value: season,
        }))}
        value={selectedSeason}
      />
      {matches.map((match) => (
        <View key={match.id} style={styles.matchContainer}>
          <Text style={styles.categoryText}>{getCategoryName(match)}</Text>
          <View style={styles.categoryContainer}>
            <Text style={styles.stadiumText}>[ {match.stadium_name} ]</Text>
          </View>
          <View style={styles.teamsContainer}>
            <View style={styles.teamsContainerFlex}>
              <Image
                source={{
                  uri: `https://my.ispl.popopower.com/images/team-master/teams/${match.from_team_logo}`,
                }}
                style={styles.teamLogo}
              />
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>{match.from_team_name}</Text>
                <Text style={styles.teamScore}>
                  {match.team_one_scrore} / {match.team_one_wicket}
                </Text>
                <Text style={styles.teamOver}>{match.team_one_over} OV</Text>
              </View>
            </View>
            <Text style={styles.vsText}>VS</Text>
            <View style={styles.teamsContainerFlex}>
              <Image
                source={{
                  uri: `https://my.ispl.popopower.com/images/team-master/teams/${match.to_team_logo}`,
                }}
                style={styles.teamLogo}
              />
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>{match.to_team_name}</Text>
                <Text style={styles.teamScore}>
                  {match.team_two_scrore} / {match.team_two_wicket}
                </Text>
                <Text style={styles.teamOver}>{match.team_two_over} OV</Text>
              </View>
            </View>
          </View>
          <Text style={styles.winMessage}>{getWinMessage(match)}</Text>
          <View style={styles.btnPad}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("matchcenter", { id: match.id })
              }
              style={styles.sqrBtn}
            >
              <Text style={styles.buttonText}>Match Center</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  matchContainer: {
    paddingBottom: 20,
  },
  categoryContainer: {
    marginBottom: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryText: {
    backgroundColor: "#fff",
    color: "#002458",
    paddingVertical: 10,
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  stadiumText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  winMessage: {
    color: "#fbe29a",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    marginTop: 15,
  },
  teamsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  teamsContainerFlex: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  teamLogo: {
    width: 80,
    height: 80,
    backgroundColor: "#fff",
    borderRadius: 50,
  },
  teamInfo: {
    marginHorizontal: 10,
    marginTop: 20,
  },
  teamName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 3,
    textAlign: "center",
  },
  teamOver: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 3,
    textAlign: "center",
  },
  teamScore: {
    color: "#fbe29a",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 3,
    textAlign: "center",
  },
  vsText: {
    marginHorizontal: 10,
    color: "#fbe29a",
    fontSize: 24,
    fontWeight: "bold",
  },
  matchCenterButton: {
    backgroundColor: "#263574",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fbe29a",
    fontSize: 16,
    fontWeight: "bold",
  },
  btnPad: {
    marginTop: 10,
  },
});

export default MatchRows;
