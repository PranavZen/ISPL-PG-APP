import { Picker } from "@react-native-picker/picker";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Icon from "react-native-vector-icons/MaterialIcons";
// Custom Spinner component (if needed)
const Spinner = () => (
  <View style={styles.spinnerContainer}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);

type ZoneData = {
  City: string;
  "Sr No.": number;
  From: string;
  To: string;
};

const TrailDates: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<string>("westzone");
  const [zoneData, setZoneData] = useState<Record<string, ZoneData[]>>({});
  const [filteredData, setFilteredData] = useState<Array<ZoneData>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch the data from the API
    const fetchZoneData = async () => {
      try {
        const response = await fetch(
          "https://my.ispl.popopower.com/api/slots-by-zone"
        );
        const data = await response.json();
        setZoneData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching zone data:", error);
        setLoading(false);
      }
    };
    fetchZoneData();
  }, []);

  useEffect(() => {
    if (zoneData[selectedZone]) {
      setFilteredData(zoneData[selectedZone]);
    } else {
      setFilteredData([]);
    }
  }, [selectedZone, zoneData]);

  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      {/* Zone Picker */}
      <RNPickerSelect
        onValueChange={(itemValue) => setSelectedZone(itemValue)}
        items={[
          { label: "South Zone", value: "southzone" },
          { label: "North Zone", value: "northzone" },
          { label: "East Zone", value: "eastzone" },
          { label: "Central Zone", value: "centralzone" },
          { label: "West Zone", value: "westzone" },
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
            backgroundColor: "#263574",
          },
          placeholder: {
            color: "#fff",
            fontSize: 18,
            fontWeight: 600,
          },
        }}
        value={selectedZone}
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

      {/* Table data */}
      <ScrollView horizontal style={styles.horizontalScroll}>
        <View style={{ width: screenWidth * 1.68 }}>
          <View style={styles.headerRow}>
            <Text style={[styles.headerCell, { width: screenWidth * 0.2 }]}>
              Sr No.
            </Text>
            <Text style={[styles.headerCell, { width: screenWidth * 0.5 }]}>
              City
            </Text>
            <Text style={[styles.headerCell, { width: screenWidth * 0.5 }]}>
              From
            </Text>
            <Text style={[styles.headerCell, { width: screenWidth * 0.5 }]}>
              To
            </Text>
          </View>

          {loading ? (
            <Spinner />
          ) : filteredData.length > 0 ? (
            <FlatList
              data={filteredData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.headerRow}>
                  <Text
                    style={[styles.headerCell, { width: screenWidth * 0.2 }]}
                  >
                    {item["Sr No."]}
                  </Text>
                  <Text
                    style={[styles.headerCell, { width: screenWidth * 0.5 }]}
                  >
                    {item.City}
                  </Text>
                  <Text
                    style={[styles.headerCell, { width: screenWidth * 0.5 }]}
                  >
                    {item.From}
                  </Text>
                  <Text
                    style={[styles.headerCell, { width: screenWidth * 0.5 }]}
                  >
                    {item.To}
                  </Text>
                </View>
              )}
            />
          ) : (
            <Text>No data available for this zone.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#002458",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  horizontalScroll: {
    flex: 1,
  },
  tableContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#002458",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  selectOptWrap:{
    backgroundColor: "#002458",
  },
  headerCell: {
    color: "#fff",
    padding: 10,
    textAlign: "center",
    fontWeight: "bold",
    borderRightWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    top: 17 ,
    right: 15,
  },
});

export default TrailDates;
