import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

interface TabProps {
  label: string;
  spanImg?: string;
  children: React.ReactNode;
}

interface TabsProps {
  children: React.ReactElement<TabProps>[];
}

const Tabs: React.FC<TabsProps> = ({ children }) => {
  // Ensure children is an array
  const tabsArray = React.Children.toArray(
    children
  ) as React.ReactElement<TabProps>[];

  const route = useRoute();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<string | null>(
    tabsArray.length > 0 ? tabsArray[0].props.label : null
  );

  useEffect(() => {
    const hash = route.params?.tab ?? "";
    if (hash) {
      const tabToActivate = tabsArray.find((tab) => tab.props.label === hash);
      if (tabToActivate) {
        setActiveTab(hash);
      }
    }
  }, [route.params?.tab, tabsArray]);

  const handleTabClick = (label: string) => {
    setActiveTab(label);
    navigation.navigate(route.name, { tab: label });
  };
  return (
    <View style={styles.mainTabsWrap}>
      <View style={styles.sectionWrap}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.tabs}>
          {tabsArray.map((child) => {
            const { label, spanImg } = child.props;
            return (
              <Pressable
                key={label}
                style={[styles.tab, activeTab === label && styles.activeTab]}
                onPress={() => handleTabClick(label)}
              >
                {spanImg && <Text style={styles.spanImg}>{spanImg}</Text>}
                <Text style={styles.btnName}>{label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      <View style={styles.tabContent}>
        {tabsArray.map((child) => {
          if (child.props.label !== activeTab) return null;
          return child.props.children;
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainTabsWrap: {
    flex: 1,
  },
  sectionWrap: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 15,
    height: 40,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#263574",
    borderRadius: 100,
    width: "auto",
    flexDirection: "row",
    gap: 5,
    alignItems: "center"
  },
  btnName:{
    fontSize: 16,
    fontWeight: "600"
  },
  activeTab: {
    backgroundColor: "#fbe29a",
  },
  spanImg: {
    // Add styles if spanImg is used, depending on your needs
  },
  tabContent: {
    flex: 1,
  },
});

export default Tabs;
