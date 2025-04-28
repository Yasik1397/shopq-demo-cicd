import PropTypes from "prop-types";
import React from "react";
import { Pressable, StyleSheet, View, ActivityIndicator } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { COLORS, FONTS } from "../../../constants/Theme";
// import { useSelector } from "react-redux";
import { RFValue } from "../../../utils/responsive";

const PrimaryButton = ({
  disabled,
  onPress,
  title,
  isLoading,
  loaderSize,
  icon,
  icon1,
  otherstyles,
  textColor,
  backgroundColor,
  fontFamily,
}) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  // const settingsData = useSelector((state) => state?.settings?.data);
  // const ButtonColor =
  //   settingsData?.records?.site_settings?.button?.background_color || "#fff";

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  React.useEffect(() => {
    if (isLoading) {
      translateY.value = withTiming(-10, { duration: 300 });
      opacity.value = withTiming(0.5, { duration: 300 });
    } else {
      translateY.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
    }
  }, [isLoading]);

  React.useEffect(() => {
    opacity.value = 0;
    opacity.value = withTiming(1, { duration: 200 });
  }, [title]);

  return (
    <Pressable
      disabled={isLoading ? isLoading : disabled}
      onPress={onPress}
      style={[
        styles.button,
        otherstyles,
        {
          opacity: disabled ? 0.5 : 1,
          backgroundColor: backgroundColor
            ? backgroundColor
            :  "#0E1827",
        },
      ]}
    >
      {isLoading ? (
        <ActivityIndicator
          color={textColor ? textColor : "white"}
          size={loaderSize ? loaderSize : 18}
        />
      ) : (
        <Animated.View style={[styles.content, animatedTextStyle]}>
          {icon1 && <View style={styles.icon1Container}>{icon1}</View>}
          <Animated.Text
            style={[
              styles.buttonTxt,
              {
                color: textColor ? textColor : COLORS.WHITE,
                fontFamily: fontFamily ? fontFamily : FONTS.MEDIUM,
              },
              animatedTextStyle,
            ]}
          >
            {title}
          </Animated.Text>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
        </Animated.View>
      )}
    </Pressable>
  );
};

PrimaryButton.propTypes = {
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  title: PropTypes.string,
  isLoading: PropTypes.bool,
  loaderSize: PropTypes.number,
  icon: PropTypes.node,
  icon1: PropTypes.node,
  otherstyles: PropTypes.object,
  textColor: PropTypes.string,
  fontFamily: PropTypes.string,
  backgroundColor: PropTypes.string,
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: COLORS.BLACK,
    borderRadius: 15,
    justifyContent: "center",
    padding: 16,
  },
  buttonTxt: {
    color: COLORS.WHITE,
    fontFamily: FONTS?.MEDIUM,
    fontSize: RFValue(16),
    includeFontPadding: false,
  },
  content: {
    alignItems: "center",
    flexDirection: "row",
  },
  icon1Container: {
    paddingEnd: 8,
  },
  iconContainer: {
    paddingStart: 8,
  },
});

export default PrimaryButton;
