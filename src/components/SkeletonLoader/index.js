import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";

const SkeletonPlaceholder = ({ width, height, borderRadius = 8 }) => {
  const shimmerValue = useSharedValue(0);

  useEffect(() => {
    shimmerValue.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(shimmerValue.value, [0, 1], [-width, width]),
      },
    ],
  }));

  return (
    <View style={[styles.container, { width, height, borderRadius }]}>
      <View style={styles.background} />
      <Animated.View
        style={[
          styles.shimmerOverlay,
          { width: width * 2, borderRadius },
          animatedStyle,
        ]}
      >
        <LinearGradient
          colors={["#e0e0e0", "#f5f5f5", "#e0e0e0"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
};

SkeletonPlaceholder.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  borderRadius: PropTypes.number,
};

export default React.memo(SkeletonPlaceholder);

const styles = StyleSheet.create({
  background: { ...StyleSheet.absoluteFillObject, backgroundColor: "#e0e0e0" },
  container: {
    overflow: "hidden",
    backgroundColor: "#e0e0e0",
  },
  gradient: { ...StyleSheet.absoluteFillObject },
  shimmerOverlay: { height: "100%", position: "absolute" },
});
