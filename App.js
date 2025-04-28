//<--------------------------Libraries--------------------------->
import React, { useEffect } from "react";
import {
  Linking,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback,
} from "react-native";
import { Provider } from "react-redux";
import { MenuProvider } from "react-native-popup-menu";
import Config from "react-native-config";
//<--------------------------Screens---------------------------->
import AppStack from "./src/navigation";
import OfflineScreen from "./src/screens/Offline";

import store from "./src/redux/store";
import {
  NotificationListener,
createNotificationChannel,  requestUserPermission,
} from "./src/utils/pushnotification";
import { getFcmToken } from "./src/services/Firebase";
//<--------------------------Hooks---------------------------->
import { useNetworkStatus } from "./src/hooks/useNetworkStatus";
import { firebase } from "@react-native-firebase/messaging";
const App = () => {
  console.log(Config, "Config");
  const isConnected = useNetworkStatus();

  const handleDeepLink = async () => {
    const url = await Linking.getInitialURL();
    if (url) {
      console.log("Received Deep Link:", url);
      Linking.openURL(url);
    }
  };

  useEffect(() => {
    requestUserPermission();
    getFcmToken();
    NotificationListener();
    createNotificationChannel();
    handleDeepLink();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isConnected ? (
        <MenuProvider>
          <Provider store={store}>
            <SafeAreaView style={{ flex: 1 }}>
              <StatusBar backgroundColor="white" barStyle={"dark-content"} />
              <TouchableWithoutFeedback>
                <AppStack />
              </TouchableWithoutFeedback>
            </SafeAreaView>
          </Provider>
        </MenuProvider>
      ) : (
        <OfflineScreen />
      )}
    </SafeAreaView>
  );
};

export default App;
