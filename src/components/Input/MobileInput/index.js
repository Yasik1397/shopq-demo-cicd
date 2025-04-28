//<--------------------------Libraries--------------------------->
import PropTypes from "prop-types";
import { PhoneNumberUtil } from "google-libphonenumber";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CountryButton,
  CountryPicker,
  countryCodes,
} from "react-native-country-codes-picker";
import Animated, { FadeIn } from "react-native-reanimated";
//<--------------------------Components-------------------------->
import { COLORS, FONTS } from "../../../constants/Theme";
//<--------------------------Functions---------------------------->
import { RFValue } from "../../../utils/responsive";

const phoneUtil = PhoneNumberUtil.getInstance();
const MobileInput = ({
  onChangeText,
  onChangecode,
  value,
  error,
  label,
  placeholder,
  keyboard,
  required,
  capitalize,
  autoComplete,
  autoFocus,
  countryCode,
  handleBlur,
  handleFocus,
  editable,
  disabled,
  children,
}) => {
  //Hooks declarions
  const [show, setShow] = useState(false);
  const [formattedNumber, setFormattedNumber] = useState("");
  const [code, setCode] = useState({
    code: "IN",
    dial_code: "+91",
    flag: "🇮🇳",
  });
  const country = countryCodes.find((val) => val.code === code?.code);
  useEffect(() => {
    if (value?.length > 5) {
      try {
        const number = phoneUtil.parseAndKeepRawInput(value, country?.code);
        setFormattedNumber(
          phoneUtil.formatInOriginalFormat(number, country?.code)
        );
      } catch (e) {
        console.error("Error parsing phone number:", e);
      }
    } else {
      setFormattedNumber(value);
    }
  }, [value]);

  useEffect(() => {
    if (countryCode !== "+91") {
      const newCode = countryCodes.find((val) => val.dial_code === countryCode);
      if (newCode) {
        setCode(newCode);
      }
    }
  }, [countryCode]);

  function getMaxPhoneNumberLength(cCode) {
    const maxNumber = "9".repeat(15);
    const parsedNumber = parsePhoneNumberFromString(maxNumber, cCode);
    const nationalNumber = parsedNumber?.nationalNumber || "";
    return nationalNumber.length;
  }

  const cCode = code?.code; // Replace with the desired cCode code
  const maxLength = getMaxPhoneNumberLength(cCode);

  const maxChars = maxLength ? maxLength : 15;
  const handleChangeText = (text) => {
    const numericText = text.replace(/\D/g, "");
    if (numericText?.length <= maxChars) {
      onChangeText(numericText);
      if (numericText?.length > 6) {
        try {
          const number = phoneUtil.parseAndKeepRawInput(
            numericText,
            country?.code
          );
          setFormattedNumber(
            phoneUtil.formatInOriginalFormat(number, country?.code)
          );
        } catch (e) {
          console.error("Error formatting phone number:", e);
        }
      } else {
        setFormattedNumber(text);
      }
    }
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
      <View
        style={{
          backgroundColor: disabled ? "#F9FAFB" : COLORS.WHITE,
          borderWidth: 1,
          borderRadius: 8,
          // flex: 1,
          flexDirection: "row",
          alignItems: "center",
          borderColor: error ? COLORS.RED : "#E6E7E8",
          paddingHorizontal: 15,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View>
                <TouchableOpacity onPress={() => setShow(true)}>
                  <Text
                    style={{
                      color: disabled ? "#AAADB2" : COLORS.BLACK,
                      fontSize: RFValue(14),
                      fontFamily: FONTS.REGULAR,
                    }}
                  >
                    {code?.flag} {code?.dial_code}
                  </Text>
                </TouchableOpacity>
                <CountryPicker
                  ListHeaderComponent={({ countries, lang, onPress }) => (
                    <View style={{ marginTop: 16 }}>
                      {countries?.map((cntry, index) => (
                        <CountryButton
                          key={index}
                          item={cntry}
                          name={cntry?.name?.[lang || "en"]}
                          onPress={() => onPress(cntry)}
                          style={{
                            dialCode: styles.dialCode,
                            flag: { flex: 0.1 },
                            countryName: {
                              ...styles.text,
                              paddingStart: 12,
                              flex: 1,
                            },
                            countryButtonStyles: {
                              paddingVertical: 12,
                              height: null,
                              paddingHorizontal: 12,
                              backgroundColor: "#F7F8F9",
                            },
                          }}
                        />
                      ))}
                    </View>
                  )}
                  show={show}
                  pickerButtonOnPress={(item) => {
                    onChangecode(item?.dial_code ? item?.dial_code : "+91");
                    setCode({
                      code: item.code,
                      dial_code: item.dial_code,
                      flag: item.flag,
                    });
                    setShow(false);
                  }}
                  onRequestClose={() => setShow(false)}
                  onBackdropPress={() => setShow(false)}
                  inputPlaceholder="Search country"
                  style={{
                    modal: {
                      height: "50%",
                      backgroundColor: COLORS.WHITE,
                    },
                    textInput: {
                      borderRadius: 8,
                      padding: 8,
                      marginVertical: 8,
                    },
                  }}
                />
              </View>
              <View
                style={{
                  height: 15,
                  width: 1,
                  marginHorizontal: 5,
                  backgroundColor: COLORS.LIGHT_GREY,
                }}
              />
            </View>
          </>
          <TextInput
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleChangeText}
            value={formattedNumber}
            valuecode={code?.dial_code}
            keyboardType={keyboard}
            autoCapitalize={capitalize ? "sentences" : "none"}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            placeholderTextColor={COLORS.GREY}
            style={{
              flex: 1,
              backgroundColor: disabled ? "#F9FAFB" : COLORS.WHITE,
              color: disabled ? "#AAADB2" : COLORS.BLACK,
              fontSize: RFValue(14),
              fontFamily: FONTS.REGULAR,
            }}
            placeholder={placeholder}
            editable={editable}
          />
        </View>
        <View
          style={{
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          {children ? children : null}
        </View>
      </View>
      {error ? (
        <Animated.Text
          entering={FadeIn}
          style={{
            fontFamily: FONTS.REGULAR,
            fontSize: RFValue(12),
            color: COLORS.RED,
          }}
        >
          {error}
        </Animated.Text>
      ) : null}
    </View>
  );
};

MobileInput.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  editable: PropTypes.bool,
  autoFocus: PropTypes.bool,
  autoComplete: PropTypes.string,
  capitalize: PropTypes.bool,
  keyboard: PropTypes.any,
  value: PropTypes.string,
  handleBlur: PropTypes.func,
  onChangeText: PropTypes.func,
  onChangecode: PropTypes.func,
  handleFocus: PropTypes.func,
  countryCode: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.any,
};
const styles = StyleSheet.create({
  codeInput: {
    alignItems: "center",
    backgroundColor: COLORS.textInputBg,
    borderColor: COLORS.textInputBorder,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    padding: 12,
  },
  dialCode: {
    color: COLORS.BLACK,
    flex: 0.2,
    fontFamily: FONTS.MEDIUM,
    fontSize: RFValue(14),
  },
  errorText: {
    color: COLORS.RED,
    fontFamily: FONTS.MEDIUM,
    fontSize: RFValue(12),
    marginTop: 4,
  },
  text: {
    color: COLORS.BLACK,
    fontFamily: FONTS.MEDIUM,
    fontSize: RFValue(14),
  },
});
export default React.memo(MobileInput);
