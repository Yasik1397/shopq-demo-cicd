import React from "react";
import { Text, View } from "react-native";
import NoCart from "../../../assets/Generals/list_empty.svg";
import { COLORS, FONTS } from "../../../constants/Theme";
import PrimaryButton from "../../Buttons/Primary";
import PropTypes from "prop-types";
import { RFValue } from "../../../utils/responsive";

const NoProducts = ({ onPress, type }) => {
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
        {`No ${type === "Myorders" ? "Orders Yet" : "Products Added"}`}
      </Text>
      {type === "Myorders" ? null : (
        <PrimaryButton
          otherstyles={{
            paddingHorizontal: 60,
            paddingVertical: 12,
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
      )}
    </View>
  );
};

NoProducts.propTypes = {
  onPress: PropTypes.func,
  type: PropTypes.string,
};
export default NoProducts;
