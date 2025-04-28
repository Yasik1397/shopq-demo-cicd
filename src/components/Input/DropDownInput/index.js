import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { COLORS, FONTS } from "../../../constants/Theme";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "../../../utils/responsive";

const DropdownPicker = ({
  options = [],
  placeholder = "Select an option",
  onSelect = () => {},
  dropdownStyle = {},
  optionStyle = {},
  placeholderStyle = {},
  label = "",
  required = false,
  disabled = false,
  value = null,
  setValue = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownHeight = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(dropdownHeight.value, {
        duration: 150,
        easing: Easing.inOut(Easing.ease),
      }),
      opacity: withTiming(dropdownHeight.value > 0 ? 1 : 0, {
        duration: 150,
      }),
    };
  });

  const toggleDropdown = () => {
    if (isOpen) {
      dropdownHeight.value = 0;
    } else {
      dropdownHeight.value = options.length * RFValue(40);
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    setValue(option);
    onSelect(option);
    toggleDropdown();
  };

  return (
    <View>
      {label ? (
        <Text
          style={{
            fontSize: RFValue(14),
            fontFamily: FONTS.MEDIUM,
            color: COLORS.LIGHT_BLACK,
            marginBottom: 6,
          }}
        >
          {label}
          {required ? <Text style={{ color: COLORS.RED }}>*</Text> : null}
        </Text>
      ) : null}
      <View style={[styles.container, dropdownStyle]}>
        <TouchableOpacity
          style={[
            styles.placeholderContainer,
            { backgroundColor: disabled ? "#F9FAFB" : COLORS.WHITE },
          ]}
          disabled={disabled}
          onPress={toggleDropdown}
        >
          {value ? (
            <Text style={[styles.placeholderText, placeholderStyle,{ color: disabled ? "#AAADB2" : "#061018"}]}>
              {value}
            </Text>
          ) : (
            <Text
              style={[
                styles.placeholderText,
                placeholderStyle,
                { color: "#AAADB2" },
              ]}
            >
              {placeholder}
            </Text>
          )}
          <Entypo
            size={RFValue(20)}
            name={isOpen ? "chevron-small-up" : "chevron-small-down"}
          />
        </TouchableOpacity>
        <Animated.View style={[styles.dropdownContainer, animatedStyle]}>
        <View style={{ height: 1, backgroundColor: "#fff" }} />
          <FlatList
            data={options}
            keyExtractor={(index) => index.toString()}
            contentContainerStyle={{ flexGrow: 1, borderRadius: 8 }}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: "#fff" }} />
            )}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  optionStyle,
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    backgroundColor: COLORS.WHITE,
                    zIndex: 10,
                    borderRadius: 8,
                  },
                ]}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.optionText}>{item}</Text>
                {value === item ? (
                  <Ionicons
                    size={RFValue(16)}
                    color={"#061018"}
                    name="checkmark-sharp"
                  />
                ) : null}
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E6E7E8",
    zIndex: 1,
  },
  placeholderContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.WHITE,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: RFValue(14),
    fontFamily: FONTS.MEDIUM,
  },
  dropdownContainer: {
    position: "absolute",
    top: 45,
    left: 0,
    right: 0,
    backgroundColor: COLORS.WHITE,
    zIndex: 9999,
    borderRadius: 8,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E6E7E8",
  },
  optionText: {
    fontSize: RFValue(14),
    color: COLORS.PRIMARY,
    fontFamily: FONTS.MEDIUM,
  },
});

DropdownPicker.propTypes = {
  options: PropTypes.any,
  placeholder: PropTypes.string,
  onSelect: PropTypes.func,
  dropdownStyle: PropTypes.any,
  optionStyle: PropTypes.any,
  placeholderStyle: PropTypes.any,
  label: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.any,
  setValue: PropTypes.func,
};
export default DropdownPicker;
