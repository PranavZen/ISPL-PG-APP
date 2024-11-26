import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import axios from "axios";
import MatchCard from "@/components/MatchCard"; // Adjust path as needed
import TeamPlayers from "@/components/TeamPlayers"; // Adjust path as needed
import { useRoute } from "@react-navigation/native";

// Helper function to format the date
function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-IN", options);
}

// Helper function to format the time
function formatTime(timeString: string | undefined): string {
  if (!timeString) return "Time Not Available"; // Handle undefined time string
  let [hours, minutes] = timeString.split(":");
  hours = parseInt(hours, 10).toString();
  const period = parseInt(hours) >= 12 ? "PM" : "AM";

  if (hours === "0") {
    hours = "12";
  } else if (parseInt(hours) > 12) {
    hours = (parseInt(hours) - 12).toString();
  }

  return `${hours}:${minutes} ${period}`;
}

// Main component
const TeamDetails: React.FC = () => {
  const route = useRoute();
  const { id, season_id } = route.params as { id: string, season_id : string | undefined }; // Type-checking for ID
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [teamPlayers, setTeamPlayers] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [seasons, setSeasons] = useState([]);
  const [fetchedSeasons, setFetchedSeasons] = useState(new Set()); // Cache for fetched seasons

  useEffect(() => {
    const fetchMatches = async () => {
      if (fetchedSeasons.has(selectedSeason)) {
        console.log(`Data for season ${selectedSeason} already fetched.`);
        return; // Avoid refetching data for the same season
      }

      try {
        setLoading(true);
        const response = await axios.get("https://my.ispl.popopower.com/api/matches/results");
        const data = response.data;

        if (data.status === "success" && data.data?.result) {
          const availableSeasons = Object.keys(data.data.result);
          setSeasons(availableSeasons);

          if (availableSeasons.length > 0) {
            const season = selectedSeason || availableSeasons[0];
            setSelectedSeason(season);

            const seasonMatches = data.data.result[season] || [];
            const match = seasonMatches.find((match) => match.id === parseInt(id));
            setMatches(match ? [match] : []);

            // Mark season as fetched
            setFetchedSeasons((prev) => new Set(prev).add(season));
          } else {
            console.error("No seasons found in the API response");
          }
        } else {
          console.error("Invalid API response structure", data);
        }
      } catch (error) {
        console.error("Error fetching match data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [id, selectedSeason, fetchedSeasons]);

  useEffect(() => {
    const fetchTeamPlayers = async () => {
      try {
        const response = await axios.get(
          `https://my.ispl.popopower.com/api/matches/match-center/${id}/${season_id}`
        );

        const seasonKey = Object.keys(response.data.data)[0];
        if (seasonKey) {
          setSeasons(Object.keys(response.data.data));
          setTeamPlayers(response.data.data[seasonKey]);
          setSelectedSeason(seasonKey);
        }
      } catch (error) {
        console.error("Error fetching team players:", error);
      }
    };

    fetchTeamPlayers();
  }, [id, season_id]);

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

  return (
    <ScrollView>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : matches.length === 0 ? (
        <Text>No match found</Text>
      ) : (
        <>
          <MatchCard
            key={matches[0].id}
            team_one_scrore={matches[0].team_one_scrore}
            team_one_wicket={matches[0].team_one_wicket}
            team_one_over={matches[0].team_one_over}
            team_two_scrore={matches[0].team_two_scrore}
            team_two_wicket={matches[0].team_two_wicket}
            team_two_over={matches[0].team_two_over}
            match_date={formatDate(matches[0].match_date)}
            match_time={formatTime(matches[0].match_time)}
            win_message={getWinMessage(match)}
            stadium_name={matches[0].stadium_name}
            to_team_name={matches[0].to_team_name}
            to_team_logo={matches[0].to_team_logo}
            from_team_logo={matches[0].from_team_logo}
          />
          <TeamPlayers teamPlayers={teamPlayers} />
        </>
      )}
    </ScrollView>
  );
};

export default TeamDetails;
