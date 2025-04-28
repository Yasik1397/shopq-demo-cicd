import PropTypes from "prop-types";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import Feather from "react-native-vector-icons/Feather";
import { COLORS, FONTS } from "../../constants/Theme";
import { RFValue } from "../../utils/responsive";

const Accordion = ({ data, onPress, open }) => {
  return (
    <Animated.View
      style={[
        styles.item,
        { backgroundColor:  COLORS.WHITE },
      ]}
    >
      <Pressable onPress={onPress}>
        <View style={styles.row}>
          <View style={{ flex: 1, gap: 8 }}>
            <Text style={styles.questionText}>{data?.question}</Text>
            {open && (
              <Text style={styles.answerText}>
                {data?.content?.replace(/<\/?[^>]+>/g, "")}
              </Text>
            )}
          </View>
          <Feather
            name={open ? "chevron-up" : "chevron-down"}
            size={RFValue(18)}
            color={open ? "#1C2A3D" : "#9AA0A9"}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
};

Accordion.propTypes = {
  data: PropTypes.object,
  onPress: PropTypes.func,
  open: PropTypes.bool,
};

const styles = StyleSheet.create({
  answerText: {
    color: "#757A7E",
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(12),
    textAlign: "justify",
    includeFontPadding: false,
  },
  item: {
    borderColor: "#EEEFF2",
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
    padding: 12,
    width: "100%",
  },
  questionText: {
    color: COLORS.BLACK,
    fontFamily: FONTS.MEDIUM,
    fontSize: RFValue(14),
    textAlign: "justify",
    includeFontPadding: false,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
});

export default Accordion;
