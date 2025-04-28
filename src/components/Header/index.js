//<--------------------------Libraries--------------------------->
import PropTypes from "prop-types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
//<--------------------------Components-------------------------->
//Import custom components here
//<--------------------------Assets------------------------------>
import { COLORS, FONTS } from "../../constants/Theme";
//<--------------------------Functions---------------------------->
import { capitalizeFirstLetter } from "../../utils/TextFormat";
import { RFValue } from "../../utils/responsive";

const PrimaryHeader = ({
  headerName,
  children1,
  children,
  onPress,
  otherStyles,
  color,
}) => {
  return (
    <View style={[styles.header, otherStyles]}>
      <View style={styles.rowView}>
        {onPress ? (
          <TouchableOpacity onPress={onPress}>
            <Entypo name="chevron-left" size={RFValue(24)} color={COLORS.BLACK} />
          </TouchableOpacity>
        ) : null}
        <View style={{ flex: 1 }}>
          {headerName && (
            <Text
              numberOfLines={1}
              style={[
                styles.headerTxt,
                {
                  fontSize: RFValue(16),
                  color: color ? color : COLORS.BLACK,
                },
              ]}
            >
              {capitalizeFirstLetter(headerName)}
            </Text>
          )}
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 12 }}>
        {children1}
        {children}
      </View>
    </View>
  );
};
PrimaryHeader.propTypes = {
  headerName: PropTypes.string,
  children: PropTypes.node,
  children1: PropTypes.node,
  onPress: PropTypes.func,
  otherStyles: PropTypes.object,
  color: PropTypes.string,
};
const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: "100%",
  },
  headerTxt: {
    color: COLORS.BLACK,
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: RFValue(16),
    includeFontPadding: false,
    lineHeight: 24,
  },
  rowView: { alignItems: "center", flex: 1, flexDirection: "row", gap: 12 },
});
export default PrimaryHeader;
