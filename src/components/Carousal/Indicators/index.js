import PropTypes from "prop-types";
import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { COLORS } from "../../../constants/Theme";
const PageIndicators = ({ carouselData, animatedValue }) => {
  return (
    <View
      style={[
        styles.paginationContainer,
        { marginTop: carouselData?.length === 1 ? 12 : null },
      ]}
    >
      {carouselData?.map((_, index) => {
        const animatedDotStyle = useAnimatedStyle(() => {
          const interpolatedValue = interpolate(
            animatedValue?.value % carouselData?.length,
            [index - 1, index, index + 1],
            [12, 32, 12],
            "clamp"
          );
          return {
            opacity: withTiming(interpolatedValue / 32, { duration: 100 }),
            width: withTiming(interpolatedValue, {
              duration: 100,
            }),
          };
        });

        return (
          <View key={index} style={styles.dotContainer}>
            <View style={styles.activeDotContainer}>
              <Animated.View style={[styles.activeDot, animatedDotStyle]} />
            </View>
          </View>
        );
      })}
    </View>
  );
};

PageIndicators.propTypes = {
  carouselData: PropTypes.array.isRequired,
  animatedValue: PropTypes.object.isRequired,
};

export default React.memo(PageIndicators);

const styles = StyleSheet.create({
  activeDot: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 50,
    height: 5,
  },
  activeDotContainer: { alignItems: "center", justifyContent: "center" },
  dotContainer: { alignItems: "center", justifyContent: "center" },
  paginationContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
  },
});
