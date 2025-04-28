import PropTypes from "prop-types";
import React from "react";
import { View, Text } from "react-native";
import { COLORS, FONTS } from "../../../constants/Theme";
import PrimaryButton from "../../Buttons/Primary";
import { RFValue } from "../../../utils/responsive";

export const DeleteCart = ({ onPress, onDelete }) => {
  return (
    <View style={{ padding: 16 }}>
      <Text
        style={{
          fontFamily: FONTS.SEMI_BOLD,
          fontSize: RFValue(16),
          color: "#061018",
          textAlign: "center",
        }}
      >
        Are you sure you want to {"\n"} delete this Item?
      </Text>
      <Text
        style={{
          fontFamily: FONTS.SEMI_BOLD,
          fontSize: RFValue(16),
          color: "#A3A6A8",
          textAlign: "center",
          marginTop: 16,
        }}
      >
        This Item will be deleted in your cart.
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 10,
          marginTop: 42,
        }}
      >
        <PrimaryButton
          backgroundColor={COLORS.WHITE}
          otherstyles={{ borderWidth: 1, flex: 1, paddingVertical: 12 }}
          textColor={"#061018"}
          title={"Cancel"}
          onPress={onPress}
        />
        <PrimaryButton
          backgroundColor={"#D05051"}
          otherstyles={{ flex: 1, paddingVertical: 12 }}
          textColor={COLORS.WHITE}
          title={"Delete"}
          onPress={onDelete}
        />
      </View>
    </View>
  );
};

DeleteCart.propTypes = {
  onPress: PropTypes.func,
  onDelete: PropTypes.func,
};
