import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from "react-native-permissions";
export const requestCameraPermission = async () => {
  if (Platform.OS === "android") {
    const cameraApprove = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "Camera Access Required",
        message: "Qbace wants to access your camera",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );

    if (cameraApprove === "granted") {
      return true;
    } else if (
      cameraApprove === "denied" ||
      cameraApprove === "never_ask_again"
    ) {
      Alert.alert(
        "Permission Denied",
        "Please enable Camera permission in settings to use this feature.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings(),
          },
        ]
      );
      return false;
    }
  } else if (Platform.OS === "ios") {
    return true;
  }
};
export const requestGalleryPermission = async () => {
  if (Platform.OS === "android") {
    try {
      const permission =
        Platform.Version >= 33
          ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES // For Android 13 and above
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE; // For Android 12 and below

      // Check the current permission status
      const result = await check(permission);

      if (result === RESULTS.GRANTED) {
        return true; // Permission is granted
      } else if (result === RESULTS.DENIED) {
        // Permission is denied, request it
        const requestResult = await request(permission);
        return requestResult === RESULTS.GRANTED;
      } else if (result === RESULTS.BLOCKED) {
        // Permission is permanently denied, show an alert
        Alert.alert(
          "Permission Required",
          "Please enable gallery permissions in settings to use this feature.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: openSettings },
          ]
        );
        return false; // Permission blocked, return false
      }
      return false; // For other cases, return false
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
      return false;
    }
  } else if (Platform.OS === "ios") {
    return true;
  }
};
