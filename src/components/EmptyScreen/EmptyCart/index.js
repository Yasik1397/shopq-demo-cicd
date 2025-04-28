import React from "react";
import { Text, View } from "react-native";
import NoCart from "../../../assets/Generals/cart_empty.svg";
import { COLORS, FONTS } from "../../../constants/Theme";
import PrimaryButton from "../../Buttons/Primary";
import PropTypes from "prop-types";
import { RFValue } from "../../../utils/responsive";

const EmptyCart = ({ onPress }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <NoCart />
      <Text
        style={{
          fontSize: RFValue(14),
          fontFamily: FONTS.BOLD,
          marginTop: 12,
          color: "#061018",
        }}
      >
        Your cart is empty
      </Text>
      <PrimaryButton
        otherstyles={{
          paddingVertical: 12,
          width: "100%",
          marginTop: 40,
          borderWidth: 1,
          borderRadius: 12,
        }}
        fontFamily={FONTS.BOLD}
        backgroundColor={COLORS.WHITE}
        textColor={COLORS.BLACK}
        title={"Search products"}
        onPress={onPress}
      />
    </View>
  );
};

EmptyCart.propTypes = {
  onPress: PropTypes.func,
};
export default EmptyCart;
