//<--------------------------Libraries--------------------------->
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
//<--------------------------Components------------------------->
import Categories from '../../screens/User/Categories';
import DashBoard from '../../screens/User/Dashboard';
import Profile from '../../screens/User/Profile';
import WishList from '../../screens/User/Wishlist';
//<--------------------------Assets----------------------------->
// import categoryEmpty from "../../assets/BottomBar/category_empty.svg";
// import categoryFill from "../../assets/BottomBar/category_fill.svg";

// import homeEmpty from "../../assets/BottomBar/home_empty.svg";
// import homeFill from "../../assets/BottomBar/home_fill.svg";

// import profileEmpty from "../../assets/BottomBar/profile_empty.svg";
// import profileFill from "../../assets/BottomBar/profile_fill.svg";

// import wishlistEmpty from "../../assets/BottomBar/wishlist_empty.svg";
// import wishlistFill from "../../assets/BottomBar/wishlist_fill.svg";

// import ArrowIndicator from "../../assets/BottomBar/indicator.svg";
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';
//<--------------------------Constants-------------------------->
import {COLORS, FONTS} from '../../constants/Theme';
import {adjustColorTone, getContrastColor} from '../../utils/colors';
import {RFValue} from '../../utils/responsive';

//Initialize Tab
const Tab = createBottomTabNavigator();

const BottomNavigator = ({onAuthStateChanged}) => {
  const settingsData = useSelector(state => state?.settings?.data);
  const backgroundColor =
    settingsData?.records?.site_settings?.header?.background_color || '#fff';

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          height: 60,
          backgroundColor: backgroundColor,
        },
        tabBarLabelStyle: {
          fontFamily: FONTS.BOLD,
          fontSize: RFValue(12),
        },
        tabBarActiveTintColor: getContrastColor(backgroundColor),
        tabBarInactiveTintColor: adjustColorTone(COLORS.GREY),
        tabBarLabel: ({focused}) => (
          <View style={styles.tabLabelContainer}>
            <Text
              style={[
                styles.tabBarLabel,
                {
                  color: focused
                    ? getContrastColor(backgroundColor)
                    : COLORS.GREY,
                },
              ]}>
              {route.name}
            </Text>
            {focused && <View style={styles.triangleIndicator} />}
          </View>
        ),
      })}>
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({focused}) => (
            <Octicons
              name="home"
              size={24}
              color={focused ? getContrastColor(backgroundColor) : COLORS.GREY}
            />
          ),
        }}>
        {props => (
          <DashBoard {...props} onAuthStateChanged={onAuthStateChanged} />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Categories"
        options={{
          tabBarIcon: ({focused}) => (
            <Entypo
              name="grid"
              style={styles.iconContainer}
              size={30}
              color={focused ? getContrastColor(backgroundColor) : COLORS.GREY}
            />
          ),
        }}>
        {props => (
          <Categories {...props} onAuthStateChanged={onAuthStateChanged} />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Wishlist"
        options={{
          tabBarIcon: ({focused}) => (
            <Octicons
              name="heart"
              size={24}
              color={focused ? getContrastColor(backgroundColor) : COLORS.GREY}
            />
          ),
        }}>
        {props => (
          <WishList {...props} onAuthStateChanged={onAuthStateChanged} />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({focused}) => (
            <Octicons
              name="person"
              size={24}
              color={focused ? getContrastColor(backgroundColor) : COLORS.GREY}
            />
          ),
        }}>
        {props => (
          <Profile {...props} onAuthStateChanged={onAuthStateChanged} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    gap: 4,
  },
  tabLabelContainer: {
    alignItems: 'center',
  },
  triangleIndicator: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.PRIMARY,
    borderBottomColor: COLORS.PRIMARY,
    marginTop: 2,
  },
  tabBarLabel: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: RFValue(12),
    lineHeight: 17,
  },
});

BottomNavigator.propTypes = {
  onAuthStateChanged: PropTypes.func,
};
export default React.memo(BottomNavigator);
