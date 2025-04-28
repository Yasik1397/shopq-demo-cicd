import PropTypes from "prop-types";
import React from "react";
import { Pressable, Text } from "react-native";
import { COLORS, FONTS } from "../../constants/Theme";
import { RFValue } from "../../utils/responsive";
const RadioButton = ({
  source,
  onPress,
  label,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={{ alignItems: "center", flexDirection: "row", gap: 10 }}
    >
      {source}
      <Text
        style={{
          fontSize: RFValue(16),
          fontFamily: FONTS.MEDIUM,
          color: COLORS.BLACK,
          includeFontPadding: false,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
};
RadioButton.propTypes = {
  source: PropTypes.node,
  onPress: PropTypes.func,
  label: PropTypes.string,
};
export default React.memo(RadioButton);
