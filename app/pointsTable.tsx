import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const data = [
  {
    no: 1,
    team: "Majhi Mumbai (Q)",
    m: 5,
    w: 3,
    l: 2,
    t: 0,
    nr: 0,
    pts: 6,
    netRR: 1.247,
  },
  {
    no: 2,
    team: "Tigers Of Kolkata (Q)",
    m: 5,
    w: 3,
    l: 2,
    t: 0,
    nr: 0,
    pts: 6,
    netRR: 0.5,
  },
  {
    no: 3,
    team: "Srinagar Ke Veer (Q)",
    m: 5,
    w: 3,
    l: 2,
    t: 0,
    nr: 0,
    pts: 6,
    netRR: 0.156,
  },
  {
    no: 4,
    team: "Chennai Singhams (Q)",
    m: 5,
    w: 3,
    l: 2,
    t: 0,
    nr: 0,
    pts: 6,
    netRR: -0.017,
  },
  {
    no: 5,
    team: "Bangalore Strikers",
    m: 5,
    w: 2,
    l: 3,
    t: 0,
    nr: 0,
    pts: 4,
    netRR: -1.013,
  },
  {
    no: 6,
    team: "Falcon Risers Hyderabad",
    m: 5,
    w: 1,
    l: 4,
    t: 0,
    nr: 0,
    pts: 2,
    netRR: -0.688,
  },
];

const PointsTable: React.FC = () => {
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      nestedScrollEnabled={true}
    >
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, styles.headerNumText]}>No</Text>
          <Text style={[styles.headerText, styles.headerTeamText]}>Team</Text>
          <Text style={[styles.headerText, styles.headerNumText]}>M</Text>
          <Text style={[styles.headerText, styles.headerNumText]}>W</Text>
          <Text style={[styles.headerText, styles.headerNumText]}>L</Text>
          <Text style={[styles.headerText, styles.headerNumText]}>T</Text>
          <Text style={[styles.headerText, styles.headerNumText]}>N/R</Text>
          <Text style={[styles.headerText, styles.headerNumText]}>PTS</Text>
          <Text
            style={[
              styles.headerText,
              styles.headerNumText,
              styles.headerRRText,
            ]}
          >
            Net RR
          </Text>
        </View>
        {data.map((row, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.rowText, styles.headerNumText]}>{row.no}</Text>
            <Text style={[styles.rowText, styles.headerTeamText]}>
              {row.team}
            </Text>
            <Text style={[styles.rowText, styles.headerNumText]}>{row.m}</Text>
            <Text style={[styles.rowText, styles.headerNumText]}>{row.w}</Text>
            <Text style={[styles.rowText, styles.headerNumText]}>{row.l}</Text>
            <Text style={[styles.rowText, styles.headerNumText]}>{row.t}</Text>
            <Text style={[styles.rowText, styles.headerNumText]}>{row.nr}</Text>
            <Text style={[styles.rowText, styles.headerNumText]}>
              {row.pts}
            </Text>
            <Text
              style={[
                styles.rowText,
                styles.headerNumText,
                styles.headerRRText,
              ]}
            >
              {row.netRR}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#002458",
  },
  table: {
    width: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#002458",
  },
  headerText: {
    color: "#fff",
    padding: 10,
    paddingVertical: 10,
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  headerTeamText: {
    width: 200,
  },
  headerNumText: {
    width: 55,
  },
  headerRRText: {
    width: 80,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 5,
  },
  rowText: {
    padding: 10,
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
  },
});

export default PointsTable;
