//<--------------------------Libraries--------------------------->
import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PropTypes from "prop-types";
import React, { useState } from "react";

//<--------------------------Screens-------------------------->
import SplashScreen from "../../components/SplashScreen";
import BottomBar from "../BottomBar";

import Notification from "../../screens/User/Notification";
import SearchScreen from "../../screens/User/Search";

import ProdutDetails from "../../screens/User/Products/ProductDetails";
import ProductListing from "../../screens/User/Products/ProductListing";
import ReviewsScreen from "../../screens/User/Products/Reviews";

import MyCart from "../../screens/User/MyCart";

import OrderConfirmation from "../../screens/User/Order/Confirmation";
import PaymentSuccess from "../../screens/User/Order/Status/Success";
import PaymentFailure from "../../screens/User/Order/Status/Failure";

import MyAddresses from "../../screens/User/Profile/MyAddresses";
import MyProfile from "../../screens/User/Profile/MyProfile";

import AddAddress from "../../screens/User/Address/Add";
import EditAddress from "../../screens/User/Address/Edit";

import MyOrders from "../../screens/User/Profile/MyOrders";
import MyOrderDetails from "../../screens/User/Profile/MyOrders/MyOrderDetails";

import AboutUs from "../../screens/User/Profile/HelpCenter/About";
import Contactus from "../../screens/User/Profile/HelpCenter/Contactus";
import FAQs from "../../screens/User/Profile/HelpCenter/FAQs";
import Terms from "../../screens/User/Profile/HelpCenter/Terms";
import TermsDetails from "../../screens/User/Profile/HelpCenter/Terms/details";

import linking from "../../linking";

// Navigation Ref
export const navigationRef = createNavigationContainerRef();
export const navigate = (name, params) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};

const UserStack = ({ onAuthStateChanged }) => {
  const [initial, setinitial] = useState(true);

  const Stack = createNativeStackNavigator();
  if (initial) {
    return <SplashScreen setinitial={setinitial} />;
  }
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false, animation: "fade_from_bottom" }}
          name="BottomBar"
        >
          {(props) => (
            <BottomBar {...props} onAuthStateChanged={onAuthStateChanged} />
          )}
        </Stack.Screen>

        {/* DashBoard */}
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{ headerShown: false, animation: "fade" }}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={{ headerShown: false, animation: "fade" }}
        />

        <Stack.Screen
          name="ProductList"
          component={ProductListing}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="ProductDetails" options={{ headerShown: false }}>
          {(props) => (
            <ProdutDetails {...props} onAuthStateChanged={onAuthStateChanged} />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Reviews"
          component={ReviewsScreen}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />

        <Stack.Screen
          name="Cart"
          options={{ headerShown: false, animation: "flip" }}
        >
          {(props) => (
            <MyCart {...props} onAuthStateChanged={onAuthStateChanged} />
          )}
        </Stack.Screen>

        {/* Profile */}
        <Stack.Screen
          name="Myprofile"
          options={{ headerShown: false, animation: "slide_from_right" }}
        >
          {(props) => (
            <MyProfile {...props} onAuthStateChanged={onAuthStateChanged} />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Myorders"
          component={MyOrders}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="OrderinfoScreen"
          component={MyOrderDetails}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="Myaddress"
          component={MyAddresses}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />

        {/* HelpCenter */}
        <Stack.Screen
          name="Terms"
          component={Terms}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="TermsDetails"
          component={TermsDetails}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />

        <Stack.Screen
          name="Contactus"
          component={Contactus}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />

        <Stack.Screen
          name="Faqscreen"
          component={FAQs}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />

        <Stack.Screen
          name="AboutUs"
          component={AboutUs}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />

        {/* Address */}
        <Stack.Screen
          name="AddAddress"
          component={AddAddress}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditAddress"
          component={EditAddress}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="OrderConfirmation"
          component={OrderConfirmation}
          options={{ headerShown: false }}
        />

        {/* Order Result */}
        <Stack.Screen
          name="PaymentSuccess"
          component={PaymentSuccess}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PaymentFailure"
          component={PaymentFailure}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

UserStack.propTypes = {
  onAuthStateChanged: PropTypes.func,
};
export default React.memo(UserStack);
