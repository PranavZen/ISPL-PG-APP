import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  BackHandler,
  View,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { RouteProp } from '@react-navigation/native';

// Define the types for the navigation and route props
type RootStackParamList = {
  Home: undefined;
  StatusPage: { objJson: string };
};

type StatusPageNavigationProp = StackNavigationProp<RootStackParamList, 'StatusPage'>;
type StatusPageRouteProp = RouteProp<RootStackParamList, 'StatusPage'>;

interface StatusPageProps {
  navigation: StatusPageNavigationProp;
  route: StatusPageRouteProp;
}

const StatusPage: React.FC<StatusPageProps> = ({ navigation, route }) => {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const backPressHandler = () => {
      // Handle back button press and navigate to Home
      navigation.navigate('index');
      return true; // Return true to prevent the default behavior
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backPressHandler);

    return () => backHandler.remove(); // Clean up the event listener
  }, [navigation]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          <Text>{route.params.objJson}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default StatusPage;
