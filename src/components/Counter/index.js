import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { FONTS } from "../../constants/Theme";
import PropTypes from "prop-types";
import { RFValue } from "../../utils/responsive";

const Counter = ({ data, disabled, onAdd, onSubtract, onPress }) => {
  return (
    <View
      style={{
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 10,
        borderColor: "#EAEAEA",
        flexDirection: "row",
        gap: 8,
        opacity: disabled ? 0.5 : 1,
        alignItems: "center",
      }}
    >
      <Pressable disabled={disabled} onPress={onSubtract}>
        <Text
          style={{
            fontFamily: FONTS.SEMI_BOLD,
            fontSize: RFValue(20),
            color: "#A3A6A8",
            includeFontPadding: false,
          }}
        >
          &#8722;
        </Text>
      </Pressable>
      <TouchableOpacity disabled={disabled} onPress={onPress}>
        <Text
          style={{
            fontSize: RFValue(14),
            color: "#061018",
            fontFamily: FONTS.SEMI_BOLD,
            includeFontPadding: false,
          }}
        >
          {data || 0}
        </Text>
      </TouchableOpacity>
      <Pressable disabled={disabled} onPress={onAdd}>
        <Text
          style={{
            fontFamily: FONTS.SEMI_BOLD,
            includeFontPadding: false,
            fontSize: RFValue(20),
            color: "#061018",
          }}
        >
          &#43;
        </Text>
      </Pressable>
    </View>
  );
};
Counter.propTypes = {
  data: PropTypes.number,
  onPress: PropTypes.func,
  onAdd: PropTypes.func,
  disabled: PropTypes.bool,
  onSubtract: PropTypes.func,
};
export default React.memo(Counter);
