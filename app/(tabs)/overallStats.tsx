import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";
import RNPickerSelect from "react-native-picker-select";

interface Player {
  team_name: string;
  first_name: string;
  last_name: string;
  runs_batting: number;
  balls_batting: number;
  fours: number;
  sixs: number;
  strike_rate: string;
  over_bowling: number;
  matches_bowling: number;
  runs_bowling: number;
  wickets: number;
}

const OverallStats: React.FC = () => {
  const [playerStats, setPlayerStats] = useState<Player[]>([]);
  const [filteredStats, setFilteredStats] = useState<Player[]>([]);
  const [filterType, setFilterType] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recordsPerPage] = useState<number>(15); // Number of records per page

  useEffect(() => {
    setLoading(true);
    const fetchPlayerStats = async () => {
      try {
        const response = await axios.get(
          "https://my.ispl.popopower.com/api/player-stat"
        );
        const sortedPlayerStats = response.data.data.player_stat.sort(
          (a: Player, b: Player) => b.runs_batting - a.runs_batting
        );
        setPlayerStats(sortedPlayerStats);
        setFilteredStats(sortedPlayerStats);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching player stats:", error);
        setLoading(false);
      }
    };

    fetchPlayerStats();
  }, []);

  useEffect(() => {
    const applyFilter = () => {
      let filteredData = [...playerStats];

      switch (filterType) {
        case "top_batsman":
          filteredData = filteredData.sort(
            (a, b) => b.runs_batting - a.runs_batting
          );
          break;
        case "top_bowlers":
          filteredData = filteredData.sort((a, b) => b.wickets - a.wickets);
          break;
        case "top_fours":
          filteredData = filteredData.sort((a, b) => b.fours - a.fours);
          break;
        case "top_sixes":
          filteredData = filteredData.sort((a, b) => b.sixs - a.sixs);
          break;
        case "top_strike_rates":
          filteredData = filteredData.sort(
            (a, b) => parseFloat(b.strike_rate) - parseFloat(a.strike_rate)
          );
          break;
        default:
          // No filter selected, use original data
          filteredData = playerStats;
      }

      setFilteredStats(filteredData);
    };

    applyFilter();
  }, [filterType, playerStats]);

  // Calculate paginated data
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredStats.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handleFilterChange = (itemValue: string) => {
    setFilterType(itemValue);
    setCurrentPage(1);
    // setShowPicker(false);
  };

  const handlePageChange = (direction: "next" | "prev") => {
    setCurrentPage((prevPage) => {
      if (direction === "next") {
        return Math.min(
          prevPage + 1,
          Math.ceil(filteredStats.length / recordsPerPage)
        );
      } else {
        return Math.max(prevPage - 1, 1);
      }
    });
  };

  const renderItem = ({ item, index }: { item: Player; index: number }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.headerNumText]}>
        {index + 1 + indexOfFirstRecord}
      </Text>
      <Text style={[styles.cell, styles.headerTeamText]}>{item.team_name}</Text>
      <Text style={[styles.cell, styles.headerTeamText]}>
        {item.first_name}
      </Text>
      <Text style={[styles.cell, styles.headerTeamText]}>{item.last_name}</Text>
      <Text style={[styles.cell, styles.headerNumText]}>
        {item.runs_batting}
      </Text>
      <Text style={[styles.cell, styles.headerNumText]}>
        {item.balls_batting}
      </Text>
      <Text style={[styles.cell, styles.headerNumText]}>{item.fours}</Text>
      <Text style={[styles.cell, styles.headerNumText]}>{item.sixs}</Text>
      <Text style={[styles.cell, styles.headerTeamText]}>
        {item.strike_rate}
      </Text>
      <Text style={[styles.cell, styles.headerNumText]}>
        {item.over_bowling}
      </Text>
      <Text style={[styles.cell, styles.headerNumText]}>
        {item.matches_bowling}
      </Text>
      <Text style={[styles.cell, styles.headerNumText]}>
        {item.runs_bowling}
      </Text>
      <Text style={[styles.cell, styles.headerNumText]}>{item.wickets}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pgTtile}>Player Stats</Text>
      <RNPickerSelect
        onValueChange={(value) => handleFilterChange(value)}
        items={[
          { label: "Top Batsman Scorers", value: "top_batsman" },
          { label: "Top Wicket Takers", value: "top_bowlers" },
          { label: "Top 4's", value: "top_fours" },
          { label: "Top 6's", value: "top_sixes" },
          { label: "Top Strike Rates", value: "top_strike_rates" },
        ]}
        style={{
          inputIOS: {
            color: "#fff",
            fontSize: 18,
            fontWeight: 600,
          },
          inputAndroid: {
            color: "#fff",
            fontSize: 18,
            fontWeight: 600,
          },
          placeholder: {
            color: "#fff",
            fontSize: 18,
            fontWeight: 600,
          },
        }}
        value={filterType}
        Icon={() => (
          <Icon
            name="filter-list"
            size={30}
            color="#fff"
            style={styles.iconContainer}
          />
        )}
        placeholder={{
          label: "-- Select Filter --",
          value: "",
        }}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#003899" />
      ) : (
        <ScrollView style={styles.tableContainer}>
          <View style={styles.table}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              <View style={styles.tableContent}>
                <View style={styles.headerRow}>
                  <Text style={[styles.headerCell, styles.headerNumText]}>
                    Sr No.
                  </Text>
                  <Text style={[styles.headerCell, styles.headerTeamText]}>
                    Team Name
                  </Text>
                  <Text style={[styles.headerCell, styles.headerTeamText]}>
                    Name
                  </Text>
                  <Text style={[styles.headerCell, styles.headerTeamText]}>
                    Last Name
                  </Text>
                  <Text style={[styles.headerCell, styles.headerNumText]}>
                    R
                  </Text>
                  <Text style={[styles.headerCell, styles.headerNumText]}>
                    B
                  </Text>
                  <Text style={[styles.headerCell, styles.headerNumText]}>
                    4s
                  </Text>
                  <Text style={[styles.headerCell, styles.headerNumText]}>
                    6s
                  </Text>
                  <Text style={[styles.headerCell, styles.headerTeamText]}>
                    Strike rate
                  </Text>
                  <Text style={[styles.headerCell, styles.headerNumText]}>
                    Ov
                  </Text>
                  <Text style={[styles.headerCell, styles.headerNumText]}>
                    M
                  </Text>
                  <Text style={[styles.headerCell, styles.headerNumText]}>
                    R
                  </Text>
                  <Text style={[styles.headerCell, styles.headerNumText]}>
                    W
                  </Text>
                </View>
                <FlatList
                  data={currentRecords}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </ScrollView>
          </View>
          <View style={styles.pagination}>
            <TouchableOpacity
              onPress={() => handlePageChange("prev")}
              disabled={currentPage === 1}
              style={styles.sqrBtn}
            >
              <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>
            <Text style={styles.pageInfo}>Page {currentPage}</Text>
            <TouchableOpacity
              onPress={() => handlePageChange("next")}
              disabled={
                currentPage === Math.ceil(filteredStats.length / recordsPerPage)
              }
              style={styles.sqrBtn}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#002458",
  },
  pgTtile: {
    textAlign: "center",
    marginVertical: 20,
    marginBottom: 0,
    fontSize: 22,
    fontWeight: "bold",
    color: "#fbe29a",
  },
  filterContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  tableContainer: {
    flex: 1,
  },
  table: {
    width: Dimensions.get("window").width,
  },
  tableContent: {
    flexDirection: "column",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#002458",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  headerCell: {
    color: "#fff",
    padding: 10,
    textAlign: "center",
    fontWeight: "bold",
    borderRightWidth: 1,
    borderColor: "#ccc",
    fontSize: 18,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  cell: {
    padding: 10,
    width: Dimensions.get("window").width,
    flex: 1,
    textAlign: "center",
    borderRightWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
    color: "#fff",
  },
  headerNumText: {
    width: 75,
  },
  headerTeamText: {
    width: 200,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  pageInfo: {
    alignSelf: "center",
    color: "#fbe29a",
    fontSize: 18,
  },
  iconContainer: {
    top: 15,
    right: 15,
  },
  placeholder: {
    color: "#fff",
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
    height: 49,
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
    width: "auto",
  },
});

export default OverallStats;
