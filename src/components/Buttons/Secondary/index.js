import PropTypes from "prop-types";
import React from "react";
import { Platform, View } from "react-native";
import { COLORS, FONTS } from "../../../constants/Theme";
import PrimaryButton from "../Primary";

const TwoButton = ({
  onPress1,
  onPress2,
  title1,
  title2,
  textColor1,
  textColor2,
  isLoading1,
  isLoading2,
  isButton2Disabled,
  icon,
  icon1,
  otherstyles1,
  otherstyles2,
  backgroundColor1,
  backgroundColor2,
  fontFamily1,
  fontFamily2
}) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: COLORS.WHITE,
        gap: 12,
      }}
    >
      {title1 && (
        <PrimaryButton
        fontFamily={fontFamily1}
          title={title1}
          onPress={onPress1}
          icon1={icon1}
          backgroundColor={backgroundColor1}
          textColor={textColor1}
          isLoading={isLoading1}
          otherstyles={otherstyles1}
        />
      )}
      {title2 && (
        <PrimaryButton
        fontFamily={fontFamily2}
          title={title2}
          onPress={onPress2}
          icon={icon}
          textColor={textColor2}
          isLoading={isLoading2}
          disabled={isButton2Disabled}
          backgroundColor={
            backgroundColor2
          }
          otherstyles={otherstyles2}
        />
      )}
    </View>
  );
};

TwoButton.propTypes = {
  onPress1: PropTypes.func,
  onPress2: PropTypes.func,
  title1: PropTypes.string,
  title2: PropTypes.string,
  children1: PropTypes.node,
  children2: PropTypes.node,
  textColor1: PropTypes.string,
  textColor2: PropTypes.string,
  isLoading1: PropTypes.bool,
  isLoading2: PropTypes.bool,
  isButton2Disabled: PropTypes.bool,
  icon: PropTypes.node,
  icon1: PropTypes.node,
  shadowOpacity: PropTypes.number,
  elevation: PropTypes.number,
  logout: PropTypes.bool,
  animated: PropTypes.bool,
  backgroundColor1: PropTypes.string,
  backgroundColor2: PropTypes.string,
  otherstyles1: PropTypes.object,
  otherstyles2: PropTypes.object,
  fontFamily1: PropTypes.string,
  fontFamily2: PropTypes.string
};

export default React.memo(TwoButton);
