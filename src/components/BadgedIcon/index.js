import PropTypes from "prop-types";
import React from "react";
import { Text, View } from "react-native";
import { COLORS, FONTS } from "../../constants/Theme";
import { useSelector } from "react-redux";
import { RFValue } from "../../utils/responsive";

const BadgedIcon = ({ children, count }) => {
  const settingsData = useSelector((state) => state?.settings?.data);
  const color =
    settingsData?.records?.site_settings?.header?.notification_dot_color || "red";
  return (
    <View>
      {count >= 0 ? (
        <View
          style={{
            position: "absolute",
            zIndex: 10,
            top: -4,
            right: -2,
            width: count === 0 ? 7 : 14,
            height: count === 0 ? 7 : 14,
            borderRadius: 10,
            backgroundColor: color,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.SEMI_BOLD,
              fontSize: RFValue(8),
              color: COLORS.WHITE,
            }}
          >
            {count === 0 ? "" : count}
          </Text>
        </View>
      ) : null}
      {children}
    </View>
  );
};

BadgedIcon.propTypes = {
  count: PropTypes.number,
  children: PropTypes.element,
};
export default React.memo(BadgedIcon);
