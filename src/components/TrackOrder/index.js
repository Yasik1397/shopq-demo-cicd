import PropTypes from "prop-types";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FONTS } from "../../constants/Theme";
import { RFValue } from "../../utils/responsive";
import { formatTimestamp } from "../../utils/dateFormat";

const defaultSteps = [
  { label: "Order", key: "ordered", completed: false },
  { label: "Shipped", key: "shipped", completed: false },
  { label: "Out for Delivery", key: "outForDelivery", completed: false },
  { label: "Delivered", key: "delivered", completed: false },
];

const AnimatedTick = ({ isActive }) => {
  const progress = useSharedValue(isActive ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(isActive ? 1 : 0, {
      duration: 800,
      easing: Easing.ease,
    });
  }, [isActive]);

  return (
    <View style={styles.tickContainer}>
      <Svg width={24} style={{ alignSelf: "center" }} height={24}>
        <Circle
          cx="12"
          cy="12"
          r="10"
          stroke={isActive ? "#2DA502" : "#D9D9D9"}
          strokeWidth={2}
          fill="white"
        />
        {isActive ? (
          <MaterialCommunityIcons
            top={4}
            alignSelf="center"
            justifyContent="center"
            name="check"
            size={16}
            color="#2DA502"
          />
        ) : null}
      </Svg>
    </View>
  );
};

AnimatedTick.propTypes = {
  isActive: PropTypes.bool,
};

const TrackOrder = ({ data, currentStatus, onTrack }) => {
  const updatedSteps = React.useMemo(() => {
    return defaultSteps?.map((step) => ({
      ...step,
      completed: data?.some(
        (item) => item?.status?.toLowerCase() === step?.key
      ),
    }));
  }, [data]);

  return (
    <View style={styles.container}>
      {updatedSteps.map((step, index) => {
        const stepData = data?.find(
          (item) => item?.status?.toLowerCase() === step.key
        );

        return (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <AnimatedTick
                isActive={
                  currentStatus?.toLowerCase() === step.key || step.completed
                }
              />
              {index !== updatedSteps.length - 1 && (
                <View
                  style={[
                    styles.verticalLine,
                    { backgroundColor: step.completed ? "#2DA502" : "#D9D9D9" },
                  ]}
                />
              )}
            </View>
            <View>
              <Text style={styles.stepLabel}>{step.label}</Text>
              {stepData ? (
                <>
                  <Text style={styles.stepDetails}>
                    {formatTimestamp(stepData.date)}
                  </Text>
                  {step.key === "shipped" && (
                    <TouchableOpacity onPress={onTrack}>
                      <Text style={styles.viewDetails}>View Details</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
};

TrackOrder.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.number,
      status: PropTypes.string,
      location: PropTypes.string,
    })
  ),
  onTrack: PropTypes.func,
  currentStatus: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  iconContainer: {
    alignItems: "center",
    marginRight: 10,
  },
  tickContainer: {
    width: 24,
    height: 24,
  },
  verticalLine: {
    width: 2,
    height: 40,
    backgroundColor: "#2DA502",
    marginTop: 5,
  },
  stepLabel: {
    fontSize: RFValue(14),
    fontFamily: FONTS.MEDIUM,
    color: "#061018",
  },
  stepDetails: {
    fontSize: RFValue(12),
    fontFamily: FONTS.MEDIUM,
    color: "#A3A6A8",
  },
  viewDetails: {
    fontSize: RFValue(12),
    fontFamily: FONTS.MEDIUM,
    color: "#60666A",
    textDecorationLine: "underline",
    marginTop: 5,
  },
});

export default TrackOrder;
