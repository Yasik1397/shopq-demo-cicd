/* eslint-disable no-console */
import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from '@notifee/react-native'
import { navigate } from "../navigation/UserStack";
import { PermissionsAndroid, Platform } from "react-native";
import { StoreValue } from "./storageutils";

export const requestUserPermission = async () => {
  try {
    const authStatus = await messaging().requestPermission();

    if (Platform.OS === "android" && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log("POST_NOTIFICATIONS permission denied");
        return false;
      }
    }

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log(
        "Notification permissions granted. Authorization status:",
        authStatus
      );
    } else {
      console.log("Notification permissions not granted");
    }

    return enabled;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};

export const NotificationListener = () => {
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log("Notification Foreground caused app to open ", remoteMessage);
    if (remoteMessage?.data?.order_id) {
      navigate("OrderinfoScreen", {
        order_id: remoteMessage?.data?.notification,
      });
    }
  });

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          "Notification caused app to open from quit state ",
          remoteMessage
        );
        if (remoteMessage?.data?.order_id) {
          navigate("OrderinfoScreen", {
            order_id: remoteMessage?.data?.notification,
          });
        }
      }
    });

  messaging().onMessage(async (remoteMessage) => {
    await displayNotification({
      title: remoteMessage?.notification?.title,
      message: remoteMessage?.notification?.body,
      data: remoteMessage?.data,
    });
  });
};

export const displayNotification = async (data) => {
  try {
    await notifee.displayNotification({
      title: data?.title,
      body: data?.body,
      android: {
        importance: AndroidImportance.HIGH,
        channelId: "shopq-notifications",
        smallIcon: "ic_small_icon",
        showTimestamp: true,
        sound: "default",
        pressAction: {
          id: "shopq-notifications",
        },
      },
      data: {
        id: data?.data?.id,
      },
      ios: {
        sound: "1",
        badge: 1,
      },
    });
  } catch (error) {
    console.error("Error displaying notification:", error);
  }
};

export const createNotificationChannel = async () => {
  try {
    const channelId = await notifee.createChannel({
      id: "shopq",
      name: "Default Channel",
      importance: AndroidImportance.HIGH,
      sound: "default",
    });
    StoreValue(channelId, "channelId");
    console.log("Notification channel created", channelId);
  } catch (error) {
    console.error("Error creating notification channel:", error);
  }
};