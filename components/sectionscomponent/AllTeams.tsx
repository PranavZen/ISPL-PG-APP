import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AllTeams() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchTeams() {
      try {
        const response = await fetch(
          "https://my.ispl.popopower.com/api/team/team-list-mobile"
        );
        const data = await response.json();

        // Check if the data structure is as expected and update teams state
        if (data.status === "success" && Array.isArray(data.data.teams_data)) {
          setTeams(data.data.teams_data); // Access the correct teams data
        } else {
          console.error("Failed to fetch teams, unexpected data structure:", data);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoading(false); // Set loading to false regardless of fetch success
      }
    }

    fetchTeams();
  }, []);

  const handleTeamPress = (team) => {
    navigation.navigate("TeamDetail", { team });
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.sectionTitle}>All Teams</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#003899" />
      ) : (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {teams.length > 0 ? ( // Check if teams array is not empty
            teams.map((team) => (
              <TouchableOpacity
                key={team.team_name}
                onPress={() => handleTeamPress(team)} // Pass the entire team object
                style={styles.boxWrap}
              >
                <View style={styles.box}>
                  <Image
                    source={{
                      uri: `https://my.ispl.popopower.com/images/team-master/teams/${team.team_logo}`,
                    }}
                    style={styles.boxImg}
                  />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noTeamsText}>No teams available</Text> // Message if no teams found
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 8,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    fontStyle: "italic",
    color: "#fff",
    marginBottom: 10,
    paddingHorizontal: 10,
    textTransform: "uppercase",
  },
  boxWrap: {
    width: 75,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginHorizontal: 20,
  },
  box: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  boxImg: {
    width: 70,
    height: 70,
    objectFit: "contain",
  },
  noTeamsText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
});
