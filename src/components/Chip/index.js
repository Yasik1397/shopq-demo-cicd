import React from "react";
import { View, Text } from "react-native";
import { FONTS } from "../../constants/Theme";
import PropTypes from "prop-types";
import { hexToRgba, StatusTextColor } from "../../utils/deliveryStatus";
import { RFValue } from "../../utils/responsive";

const Chip = ({ label }) => {
  const color = StatusTextColor(label);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: hexToRgba(color, 0.1),
        borderRadius: 40,
        paddingHorizontal: 8,
        paddingVertical: 4,
      }}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: StatusTextColor(label),
        }}
      />
      <Text
        style={{
          color: StatusTextColor(label),
          fontFamily: FONTS.MEDIUM,
          fontSize: RFValue(12),
          includeFontPadding: false,
        }}
      >
        {label}
      </Text>
    </View>
  );
};

Chip.propTypes = {
  label: PropTypes.string,
};
export default React.memo(Chip);
