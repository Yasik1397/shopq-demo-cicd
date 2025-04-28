//<--------------------------Libraries--------------------------->
import PropTypes from "prop-types";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
//<--------------------------Assets------------------------------>
import { COLORS, FONTS } from "../../../constants/Theme";
//<--------------------------Functions---------------------------->
import { RFValue } from "../../../utils/responsive";

const PrimaryInput = ({
  label,
  placeholder,
  value,
  keyboard,
  required,
  capitalize,
  secureTextEntry,
  autoComplete,
  autoFocus,
  onchangetext,
  onblur,
  error,
  onfocus,
  editable,
  disabled,
  rightchild,
  _On_press,
  multiline,
  helper,
}) => {
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
          {required && <Text style={{ color: COLORS.RED }}>*</Text>}
        </Text>
      ) : null}
      <View
        style={{
          backgroundColor: disabled ? "#F9FAFB" : COLORS.WHITE,
          borderWidth: 1,
          borderRadius: 12,
          borderColor: error ? COLORS.RED : "#E6E7E8",
          justifyContent: "center",
          paddingHorizontal: 15,
          overflow: "hidden",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            onPressIn={() => {
              onfocus ? onfocus() : null;
            }}
            onChangeText={onchangetext}
            value={value}
            onBlur={onblur}
            keyboardType={keyboard}
            autoCapitalize={capitalize ? "sentences" : "none"}
            secureTextEntry={secureTextEntry}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            multiline={multiline}
            placeholderTextColor={COLORS.GREY}
            style={{
              width: "80%",
              backgroundColor: disabled ? "#F9FAFB" : COLORS.WHITE,
              color: disabled ? "#AAADB2" : COLORS.BLACK,
              fontSize: RFValue(14),
              fontFamily: FONTS.REGULAR,
              height: multiline ? 120 : null,
            }}
            textAlignVertical={multiline ? "top" : null}
            placeholder={placeholder}
            editable={editable}
          />
          {rightchild ? (
            <Pressable
              onPress={_On_press}
              style={{
                width: "20%",
                alignItems: "flex-end",
              }}
            >
              {rightchild}
            </Pressable>
          ) : null}
        </View>
      </View>
      {error ? (
        <Text
          style={{
            fontFamily: FONTS.REGULAR,
            fontSize: RFValue(12),
            color: COLORS.RED,
          }}
        >
          {error}
        </Text>
      ) : null}
      {multiline && helper ? <View>{helper}</View> : null}
    </View>
  );
};
PrimaryInput.propTypes = {
  keyboard: PropTypes.string,
  variant: PropTypes.string,
  required: PropTypes.bool,
  capitalize: PropTypes.bool,
  mask: PropTypes.bool,
  editable: PropTypes.bool,
  autoComplete: PropTypes.string,
  autoFocus: PropTypes.bool,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  secured: PropTypes.bool,
  onchangetext: PropTypes.func,
  onblur: PropTypes.func,
  value: PropTypes.string,
  error: PropTypes.string,
  onmask: PropTypes.func,
  onfocus: PropTypes.func,
  rightchild: PropTypes.element,
  disabled: PropTypes.bool,
  _On_press: PropTypes.func,
  secureTextEntry: PropTypes.bool,
  multiline: PropTypes.bool,
  helper: PropTypes.element,
};
export default React.memo(PrimaryInput);
