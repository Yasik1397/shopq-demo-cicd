//<--------------------------Libraries--------------------------->
import PropTypes from "prop-types";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

//<--------------------------Screens-------------------------->
import LoginScreen from "../../screens/Auth/Login";
import Signup from "../../screens/Auth/Signup";
import OTPScreen from "../../screens/Auth/OTP";

import ChangeMobile from "../../screens/Auth/ChangeMobile";
import NewMobile from "../../screens/Auth/ChangeMobile/Newmobile";
import Terms from "../../screens/User/Profile/HelpCenter/Terms";
import TermsDetails from "../../screens/User/Profile/HelpCenter/Terms/details";

// Initialize Stack
const Stack = createNativeStackNavigator();

const AuthStack = ({ onAuthStateChanged }) => {
  return (
    <NavigationContainer >
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Login">
          {(props) => (
            <LoginScreen {...props} onAuthStateChanged={onAuthStateChanged} />
          )}
        </Stack.Screen>

        <Stack.Screen options={{ headerShown: false, animation: "slide_from_right" }} name="ChangeMobile">
          {(props) => (
            <ChangeMobile {...props} onAuthStateChanged={onAuthStateChanged} />
          )}
        </Stack.Screen>

        <Stack.Screen options={{ headerShown: false }} name="OTPScreen">
          {(props) => (
            <OTPScreen {...props} onAuthStateChanged={onAuthStateChanged} />
          )}
        </Stack.Screen>

        <Stack.Screen options={{ headerShown: false }} name="NewNumber">
          {(props) => (
            <NewMobile {...props} onAuthStateChanged={onAuthStateChanged} />
          )}
        </Stack.Screen>

        <Stack.Screen options={{ headerShown: false }} name="Signup">
          {(props) => (
            <Signup {...props} onAuthStateChanged={onAuthStateChanged} />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="Terms"
          component={Terms}
          options={{ headerShown: false }}
        />
                <Stack.Screen
                  name="TermsDetails"
                  component={TermsDetails}
                  options={{ headerShown: false, animation: "slide_from_right" }}
                />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
AuthStack.propTypes = {
  onAuthStateChanged: PropTypes.func,
};
export default React.memo(AuthStack);
