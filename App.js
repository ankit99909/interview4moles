import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Linking, LogBox } from 'react-native';
import GolfScorecardScreen from './Src/Screen/GolfScorecardScreen';
import GolfScorecard from './Src/Screen/GolfScorecard';
import { requestUserPermission } from './Src/Componets/requestUserPermission';

// LogBox to suppress any warnings
LogBox.ignoreLogs([
  'Warning: ...', // Replace with the exact warning message you want to suppress
]);

const Stack = createNativeStackNavigator();

// Deep linking configuration
const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      Home: 'home',
      Profile: 'profile/:userId', // Dynamic userId parameter
      Settings: 'settings',
    },
  },
};

export default function App() {
  useEffect(() => {
    // Request push notification permission on app startup
    requestUserPermission();
  }, []);

  useEffect(() => {
    // Foreground notification handling
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const url = remoteMessage.data?.url;
      if (url) {
        console.log('Foreground Notification - URL:', url);
        Linking.openURL(url); // Open deep link URL
      }
    });
    return unsubscribe; // Clean up the listener when the component is unmounted
  }, []);

  useEffect(() => {
    // Handle background and quit-state messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background Notification:', remoteMessage.notification);
      const url = remoteMessage.data?.url;
      if (url) {
        console.log('Background Notification - URL:', url);
        Linking.openURL(url); // Open deep link URL
      }
    });

    // Notification tap (when app is in background/quit state)
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened from background:', remoteMessage.notification);
      const url = remoteMessage.data?.url;
      if (url) {
        console.log('Notification opened - URL:', url);
        Linking.openURL(url); // Open deep link URL
      }
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage.notification);
          const url = remoteMessage.data?.url;
          if (url) {
            console.log('Quit-state Notification - URL:', url);
            Linking.openURL(url); // Open deep link URL
          }
        }
      });
  }, []);

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="GolfScorecardScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="GolfScorecardScreen" component={GolfScorecardScreen} />
        <Stack.Screen name="GolfScorecard" component={GolfScorecard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
