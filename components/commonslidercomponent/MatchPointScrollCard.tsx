import React, { useEffect, useState } from "react";
import axios from "axios";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import MatchResultCard from "@/components/cardcomponents/MatchResultCard";

function formatDate(dateString: string | number | Date) {
  const options = { day: "numeric", month: "short", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-IN", options);
}

function formatTime(timeString: { split: (arg0: string) => [any, any]; }) {
  let [hours, minutes] = timeString.split(":");
  hours = parseInt(hours, 10);
  const period = hours >= 12 ? "PM" : "AM";

  if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours -= 12;
  }

  return `${hours}:${minutes} ${period}`;
}

export default function MatchPointScrollCard() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(
          "https://my.ispl.popopower.com/api/matches/results"
        );
        setMatches(response.data.data.result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching matches:", error);
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const getWinMessage = (match: never) => {
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

  const getCategoryName = (match: never) => {
    if (match.cat_id === 3) {
      return "LEAGUE MATCH";
    } else if (match.category_name === "QUALIFIER 1") {
      return "SEMIFINAL 1";
    } else if (match.category_name === "QUALIFIER 2") {
      return "SEMIFINAL 2";
    } else if (match.category_name === "FINAL") {
      return "FINAL";
    } else {
      return match.category_name;
    }
  };

  return (
    <View style={styles.wrapperBox}>
      <Text style={styles.titleText}>Recent Matches</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingBox}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          matches.map((match) => (
            <MatchResultCard
              key={match.id}
              matchStatus={getCategoryName(match)}
              team1finalScore={match.team_one_scrore}
              team1Out={match.team_one_wicket}
              team1Over={match.team_one_over}
              team2finalScore={match.team_two_scrore}
              team2Out={match.team_two_wicket}
              team2Over={match.team_two_over}
              dateTime={formatDate(match.match_date)}
              mTime={formatTime(match.match_time)}
              finalresult={getWinMessage(match)}
              location={match.stadium_name}
              to_team_name={match.to_team_name}
              team1Logo={match.from_team_logo}
              team2Logo={match.to_team_logo}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapperBox: {
    // flex: 1,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  loadingBox: {
    height: 80,
    width: 400,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
  },
  loadingText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "500",
    textAlign: "center",
  },
});
