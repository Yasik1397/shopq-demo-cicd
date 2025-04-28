import PropTypes from "prop-types";
import { Formik } from "formik";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BackgroundTimer from "react-native-background-timer";
import {
  CodeField,
  Cursor,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import * as Yup from "yup";

import Secondary from "../../../Buttons/Secondary";
import { COLORS, FONTS } from "../../../../constants/Theme";
import { RFValue } from "../../../../utils/responsive";
import { maskNumber } from "../../../../utils/TextFormat";

// Validation schema
const validationSchema = Yup.object().shape({
  code: Yup.string()
    .length(6, "OTP must be 6 digits long")
    .required("OTP is required"),
});

const OTPTemplate = ({
  title1,
  title2,
  onPress1,
  onResendOTP,
  isLoading,
  title,
  subtitle,
  content,
  OnSubmit,
}) => {
  const CELL_COUNT = 6;
  const formikRef = useRef(null);

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: formikRef.current?.values?.code,
    setValue: formikRef.current?.handleChange("code"),
  });
  const [timer, setTimer] = useState(60);

  const handleOnSubmit = useCallback(
    (values) => {
      OnSubmit(values.code);
    },
    [OnSubmit]
  );

  useEffect(() => {
    const intervalId = BackgroundTimer.setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);
    return () => {
      BackgroundTimer.clearInterval(intervalId);
    };
  }, [timer]);
  const containerStyle = useMemo(
    () => ({
      gap: 8,
      paddingBottom: subtitle ? 36 : 60,
      paddingTop: 24,
      paddingHorizontal: 16,
    }),
    [subtitle]
  );

  return (
    <View>
      <View style={containerStyle}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && (
          <Text style={styles.subtitle}>
            {subtitle} {maskNumber(content)}
          </Text>
        )}
      </View>

      <Formik
        initialValues={{ code: "" }}
        validationSchema={validationSchema}
        onSubmit={handleOnSubmit}
        innerRef={formikRef}
      >
        {({
          handleChange,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
          setFieldTouched,
        }) => (
          <View>
            <View style={styles.codeFieldContainer}>
              <CodeField
                value={values.code}
                {...props}
                onChangeText={handleChange("code")}
                onBlur={() => setFieldTouched("code")}
                cellCount={CELL_COUNT}
                caretHidden={false}
                keyboardType="number-pad"
                rootStyle={{ color: "black", justifyContent: "space-around" }}
                renderCell={({ index, symbol, isFocused }) => (
                  <View
                    key={index}
                    style={[
                      styles.cell,
                      isFocused && styles.focusCell,
                      touched.code && errors.code
                        ? { borderColor: COLORS.error }
                        : null,
                    ]}
                    onLayout={getCellOnLayoutHandler(index)}
                  >
                    <Text style={styles.cellText}>
                      {symbol || (isFocused ? <Cursor /> : null)}
                    </Text>
                  </View>
                )}
                onFulfill={(code) => {
                  handleChange("code")(code);
                  handleSubmit();
                }}
              />
              {touched.code && errors.code && (
                <Text style={styles.errorText}>{errors.code}</Text>
              )}
              {timer > 0 ? (
                <Text style={styles.messageTxt}>
                  You can resend OTP in 0:{timer.toString().padStart(2, "0")}{" "}
                  seconds
                </Text>
              ) : (
                <View style={styles.rowView}>
                  <Text style={styles.messageTxt}>Didn’t receive the OTP?</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setTimer(60);
                      onResendOTP();
                    }}
                  >
                    <Text style={[styles.messageTxt, styles.resendTxt]}>
                      {" "}
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
              <Secondary
                backgroundColor1={COLORS.WHITE}
                borderColor1={COLORS.BLACK}
                textColor1={COLORS.BLACK}
                textColor2={COLORS.WHITE}
                title1={title1}
                title2={title2}
                otherstyles1={{
                  flex: 0.7,
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingVertical: 12,
                }}
                otherstyles2={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: COLORS.PRIMARY,
                  borderRadius: 12,
                  paddingVertical: 12,
                }}
                onPress1={onPress1}
                onPress2={handleSubmit}
                isLoading2={isLoading}
                isButton2Disabled={!isValid}
              />
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

OTPTemplate.propTypes = {
  title1: PropTypes.string,
  title2: PropTypes.string,
  onPress1: PropTypes.func,
  onResendOTP: PropTypes.func,
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  content: PropTypes.string,
  OnSubmit: PropTypes.func,
};

const styles = StyleSheet.create({
  boldText: { color: COLORS.black, fontWeight: "bold" },
  cell: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#EEEDEE",
    borderRadius: 8,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    width: 47,
  },
  cellText: {
    color: "#031227",
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(14),
    fontWeight: "400",
  },
  codeFieldContainer: {
    paddingBottom: 60,
    paddingHorizontal: 16,
  },
  errorText: {
    color: COLORS.titleRed,
    fontFamily: FONTS.MEDIUM,
    fontSize: RFValue(12),
  },
  focusCell: { borderColor: COLORS.darkGray, borderWidth: 2 },
  messageTxt: {
    color: "#68717D",
    fontFamily: FONTS.MEDIUM,
    fontSize: RFValue(12),
    paddingTop: 12,
    textAlign: "center",
  },
  resendTxt: {
    color: COLORS.PRIMARY,
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: RFValue(14),
    textDecorationLine: "underline",
  },
  rowView: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  subtitle: {
    color: COLORS.LIGHT_BLACK,
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(14),
    lineHeight: 20,
    textAlign: "center",
  },
  title: {
    color: COLORS.BLACK,
    fontFamily: FONTS.BOLD,
    fontSize: RFValue(16),
    textAlign: "center",
  },
});

export default React.memo(OTPTemplate);
