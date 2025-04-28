//<--------------------------Libraries--------------------------->
import PropTypes from "prop-types";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  FadeInUp
} from "react-native-reanimated";
import Feather from "react-native-vector-icons/Feather";
//<--------------------------Style------------------------------>
import { COLORS, FONTS } from "../../../constants/Theme";
import { RFValue } from "../../../utils/responsive";

const ListCard = ({
  index,
  children,
  Optionname,
  onPress,
  no_icon,
  disabled,
  otherTxtStyles,
  otherCntrStyles,
}) => {

  return (
    <Animated.View entering={FadeInUp.delay(index * 50)} key={index + 1} >
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={[
          otherCntrStyles,
          {
            backgroundColor: COLORS.WHITE,
            opacity: disabled ? 0.3 : null,
            flexDirection: "row",
            gap: RFValue(12),
            alignItems: "center",
            justifyContent: "space-between",
          },
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {children ? children : null}
          <Text
            style={[
              otherTxtStyles,
              {
                color: '#061018',
                fontFamily: FONTS.SEMI_BOLD,
                fontSize: RFValue(16),
                includeFontPadding: false,
              },
            ]}
          >
            {Optionname}
          </Text>
        </View>
        {no_icon ? null : (
          <Feather name="chevron-right" size={14} color={"#9AA0A9"} />
        )}
      </Pressable>
    </Animated.View>
  );
};

export default React.memo(ListCard);

ListCard.propTypes = {
  index: PropTypes.number,
  children: PropTypes.node,
  Optionname: PropTypes.string,
  onPress: PropTypes.func,
  no_icon: PropTypes.bool,
  opacity: PropTypes.bool,
  disabled: PropTypes.bool,
  otherTxtStyles: PropTypes.object,
  otherCntrStyles: PropTypes.object,
};
