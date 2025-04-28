import PropTypes from "prop-types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { ErrorIcon, SuccesIcon, WarningIcon } from "../../constants/assets";
import { FONTS } from "../../constants/Theme";
import { RFValue } from "../../utils/responsive";
import { capitalizeFirstLetter } from "../../utils/TextFormat";

const SnackBar = ({
  LeftIcon,
  RightIcon,
  content,
  onPress,
  type = "warning",
  show,
}) => {
  const icons = {
    success: <SuccesIcon />,
    error: <ErrorIcon />,
    warning: <WarningIcon />,
  };

  const resolvedLeftIcon = icons[type];

  if (!show) return null;

  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutDown}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        {resolvedLeftIcon || LeftIcon}
        {content && (
          <Text style={styles.content}>{capitalizeFirstLetter(content)}</Text>
        )}
      </View>
      {RightIcon && (
        <TouchableOpacity onPress={onPress} style={styles.iconButton}>
          {RightIcon}
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#333B41",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    elevation: 5,
    flex: 1,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  content: {
    color: "white",
    fontFamily: FONTS.MEDIUM,
    fontSize: RFValue(14),
    lineHeight: 20,
    marginHorizontal: 10,
  },
  iconButton: {
    gap: 4,
  },
});

SnackBar.propTypes = {
  LeftIcon: PropTypes.node,
  RightIcon: PropTypes.node,
  content: PropTypes.string,
  onPress: PropTypes.func,
  type: PropTypes.string,
  show: PropTypes.bool,
};

SnackBar.defaultProps = {
  LeftIcon: null,
  RightIcon: null,
  content: "",
  onPress: () => {},
  type: "warning",
  show: false,
};

export default React.memo(SnackBar);

export const useSnackBar = () => {
  const [snackVisible, setSnackVisible] = React.useState({
    show: false,
    content: "",
    type: "",
  });

  const showSnack = (content, type = "warning", duration = 2000, callback) => {
    setSnackVisible({ show: true, content, type });
    setTimeout(() => {
      setSnackVisible({ show: false, content: "", type: "" });
      if (callback) callback();
    }, duration);
  };

  return { snackVisible, showSnack };
};
