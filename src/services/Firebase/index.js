/* eslint-disable no-console */
import messaging from "@react-native-firebase/messaging";

import { GetValue, StoreValue } from "../../utils/storageutils";

export const getFcmToken = async () => {
  let { status, data: fcmToken } = await GetValue("fcmtoken");

  if (status === "success" && fcmToken) {
    console.log(fcmToken, "<-------FCM token------->");
    return fcmToken;
  } else {
    try {
      const granted = await messaging().requestPermission({
        alert: true,
        announcement: false,
        badge: true,
        carPlay: true,
        provisional: false,
        sound: true,
        criticalAlert: true,
      });

      if (granted) {
        fcmToken = await messaging().getToken();
        await StoreValue("fcmtoken", fcmToken);
        console.log(fcmToken, "New FCM token stored.");
        return fcmToken;
      } else {
        console.log("User declined messaging permissions :(");
      }
    } catch (error) {
      console.error("Error fetching FCM token:", error);
    }
  }
};
