import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, { Line } from "react-native-svg";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withTiming,
} from "react-native-reanimated";
import PropTypes from "prop-types";
import { COLORS } from "../../constants/Theme";

const { width } = Dimensions.get("window");
const SLIDER_WIDTH = width - 80;

const MultiSlider = ({ max = 100, initialValues = [20, 80], onChange }) => {
  const [minValue, maxValue] = initialValues;

  const minPos = useSharedValue((minValue / max) * SLIDER_WIDTH);
  const maxPos = useSharedValue((maxValue / max) * SLIDER_WIDTH);


  const onChangeHandler = (values) => {
    if (onChange) {
      runOnJS(onChange)(values);
    }
  };

  const minGesture = Gesture.Pan().onUpdate((e) => {
    minPos.value = Math.max(
      0,
      Math.min(maxPos.value - 20, e.translationX + minPos.value)
    );
    runOnJS(onChangeHandler)([
      Math.round((minPos.value / SLIDER_WIDTH) * max),
      Math.round((maxPos.value / SLIDER_WIDTH) * max),
    ]);
  });

  const maxGesture = Gesture.Pan().onUpdate((e) => {
    maxPos.value = Math.max(
      minPos.value + 20,
      Math.min(SLIDER_WIDTH, e.translationX + maxPos.value)
    );
    runOnJS(onChangeHandler)([
      Math.round((minPos.value / SLIDER_WIDTH) * max),
      Math.round((maxPos.value / SLIDER_WIDTH) * max),
    ]);
  });

  const animatedMinThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(minPos.value, { duration: 200 }) }],
  }));

  const animatedMaxThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(maxPos.value, { duration: 200 }) }],
  }));

  return (
    <View style={styles.container}>
      <Svg width={SLIDER_WIDTH}  height="40">
        {/* Background Line */}
        <Line
          x1="0"
          y1="20"
          x2={SLIDER_WIDTH}
          y2="20"
          stroke="#D9D9D9"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Active Range Line */}
        <Line
          x1={minPos.value}
          y1="20"
          x2={maxPos.value}
          y2="20"
          stroke={COLORS.BLACK}
          strokeWidth="8"
          strokeLinecap="round"
        />
      </Svg>

      {/* Min Thumb */}
      <GestureDetector gesture={minGesture}>
        <Animated.View style={[styles.thumb, animatedMinThumbStyle]}>
          <View style={styles.innerThumb} />
        </Animated.View>
      </GestureDetector>

      {/* Max Thumb */}
      <GestureDetector gesture={maxGesture}>
        <Animated.View style={[styles.thumb, animatedMaxThumbStyle]}>
          <View style={styles.innerThumb} />
        </Animated.View>
      </GestureDetector>

      {/* Value Labels */}
      <Text style={[styles.label, { left: minPos.value - 10 }]}>
        {Math.round((minPos.value / SLIDER_WIDTH) * max)}
      </Text>
      <Text style={[styles.label, { left: maxPos.value - 10 }]}>
        {Math.round((maxPos.value / SLIDER_WIDTH) * max)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.BLACK,
    position: "absolute",
    top: 8,
  },
  innerThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignSelf: "center",
    marginTop: 2,
  },
  label: {
    zIndex: 500,
    position: "absolute",
    top: -10,
    fontSize: 12,
    color: "#333",
  },
});

MultiSlider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  initialValues: PropTypes.array,
  onChange: PropTypes.func,
};

export default React.memo(MultiSlider);
