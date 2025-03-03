// Src/Components/requestUserPermission.js
import messaging from '@react-native-firebase/messaging';

export const requestUserPermission = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Push Notification Permission Granted:', authStatus);
      await getToken();
    } else {
      console.log('Push Notification Permission Denied');
    }
  } catch (error) {
    console.error('Error requesting push notification permission:', error);
  }
};

export const getToken = async () => {
  try {
    const token = await messaging().getToken();
    if (token) {
      console.log('FCM Token:', token);
    } else {
      console.log('No FCM Token available');
    }
    return token;
  } catch (error) {
    console.error('Error fetching FCM token:', error);
  }
};
