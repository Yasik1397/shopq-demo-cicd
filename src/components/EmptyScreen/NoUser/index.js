import PropTypes from "prop-types";
import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import NoUser from "../../../assets/Generals/no_user.svg";
import PrimaryButton from "../../Buttons/Primary";
import { FONTS } from "../../../constants/Theme";
import { RFValue } from "../../../utils/responsive";

const NoUserComponent = ({ onPress }) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <NoUser />
      <Text
        style={{
          fontSize: RFValue(14),
          fontFamily: FONTS.MEDIUM,
          marginTop: 20,
          color: "#A3A6A8",
        }}
      >
        You are missing out on some things
      </Text>
      <View style={{ marginTop: 20 }}>
        <PrimaryButton
          onPress={onPress}
          otherstyles={{
            paddingHorizontal: 60,
            paddingVertical: 10,
            borderRadius: 12,
          }}
          backgroundColor={"#0E1827"}
          title={"Sign In"}
        />
      </View>
    </SafeAreaView>
  );
};

NoUserComponent.propTypes = {
  onPress: PropTypes.func,
};
export default NoUserComponent;
