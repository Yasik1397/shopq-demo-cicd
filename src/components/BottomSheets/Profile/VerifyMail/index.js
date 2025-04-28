import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import Animated, { FadeIn } from "react-native-reanimated";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONTS } from "../../../../constants/Theme";
import {
  CodeField,
  Cursor,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

import * as Yup from "yup";
import PrimaryButton from "../../../Buttons/Primary";
import _BackgroundTimer from "react-native-background-timer";
import { useUpdateProfileMutation, useVerifyEmailMutation } from "../../../../redux/Api/Auth";
import GreenTick from "../../../../assets/Icons/greentick.svg";
import PropTypes from "prop-types";
import SnackBar, { useSnackBar } from "../../../SnackBar";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../../../../redux/Api/user";
import { RFValue } from "../../../../utils/responsive";

const validationSchema = Yup.object().shape({
  code: Yup.string()
    .length(6, "OTP must be 6 digits long")
    .required("OTP is required"),
});
const VerifyMail = ({ onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.Userdata?.user?.records);
  const [generateOtp] = useUpdateProfileMutation();

  const [codeValue, setCodeValue] = useState("");
  const { snackVisible, showSnack } = useSnackBar();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: codeValue,
    setValue: setCodeValue,
  });
  const [timer, setTimer] = useState(60);
  const CELL_COUNT = 6;
  const innerRef = useRef(null);
  const [VerifyEmail] = useVerifyEmailMutation();

  const handleOnSubmit = async (values) => {
    console.log("valuesadasds: ", values);
    try {
      setLoading(true);
      const res = await VerifyEmail({
        email: user?.email,
        otp: values.code,
      });
      console.log("res: ", res, res?.error?.data?.detail);
      if (res?.data?.success) {
        showSnack(res?.data?.message, "success", 1500, () => {
          dispatch(getUserData({ id: user?.id }));
          setStatus(true);
        });
      } else {
        showSnack(res?.error?.data?.detail, "error");
      }
      setLoading(false);
    } catch (error) {
      showSnack("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const intervalId = _BackgroundTimer.setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);
    return () => {
      _BackgroundTimer.clearInterval(intervalId);
    };
  }, [timer]);
  useEffect(() => {
    if (codeValue?.length === 6) {
      innerRef?.current?.setFieldValue("code", codeValue);
      handleOnSubmit({ code: codeValue });
    }
  }, [codeValue]);

  const onResendOTP = async () => {
    const res = await generateOtp({
      id: user?.id,
      updatedata: { email: user?.email },
    });
    if (res?.data?.success) {
      dispatch(getUserData({ id: user?.id }));
      showSnack("OTP resent Successfully", "success", 1500);
    } else {
      showSnack(res?.error?.data?.detail, "error");
    }
  };

  return (
    <Animated.View
      entering={FadeIn}
      style={{ paddingVertical: 24, paddingHorizontal: 16 }}
    >
      {!status ? (
        <>
          <View style={{ gap: 8, paddingBottom: 24 }}>
            <Text
              style={{
                fontSize: RFValue(16),
                fontFamily: FONTS.SEMI_BOLD,
                color: COLORS.BLACK,
              }}
            >
              Verify email address
            </Text>
            <Text
              style={{
                fontSize: RFValue(14),
                fontFamily: FONTS.REGULAR,
                color: "#757A7E",
              }}
            >
              An OTP has been sent to {user?.email}
            </Text>
          </View>
          <Formik
            initialValues={{ code: "" }}
            validationSchema={validationSchema}
            onSubmit={handleOnSubmit}
            innerRef={innerRef}
            validateOnMount
          >
            {({
              handleChange,
              handleSubmit,
              errors,
              touched,
              setFieldTouched,
              isValid,
            }) => {
              return (
                <View>
                  <View
                    style={[styles.codeFieldContainer, { paddingBottom: 100 }]}
                  >
                    <Text style={styles.title}>
                      Enter OTP<Text style={{ color: COLORS.RED }}>{"*"}</Text>
                    </Text>
                    <CodeField
                      value={codeValue}
                      {...props}
                      onChangeText={(text) => {
                        setCodeValue(text);
                        handleChange("code")(text);
                      }}
                      onBlur={() => setFieldTouched("code")}
                      cellCount={CELL_COUNT}
                      caretHidden={false}
                      keyboardType="number-pad"
                      rootStyle={{ color: "black" }}
                      renderCell={({ index, symbol, isFocused }) => (
                        <View
                          key={index}
                          style={[
                            styles.cell,
                            isFocused && styles.focusCell,
                            touched.code && errors.code
                              ? { borderColor: COLORS.RED }
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
                        setCodeValue(code);
                        handleChange("code")(code); // Sync with Formik
                        handleSubmit();
                      }}
                    />
                    {touched.code && errors.code && (
                      <Text style={styles.errorText}>{errors.code}</Text>
                    )}
                    {timer > 0 ? (
                      <Text style={styles.messageTxt}>
                        You can resend OTP in 0:
                        {timer.toString().padStart(2, "0")} seconds
                      </Text>
                    ) : (
                      <View style={styles.rowView}>
                        <Text style={styles.messageTxt}>
                          Didn't receive the OTP?
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            setTimer(60);
                            onResendOTP();
                          }}
                        >
                          <Text style={[styles.messageTxt, styles.resendTxt]}>
                            {" "}
                            Resend
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  <PrimaryButton
                    backgroundColor={COLORS.BLACK}
                    textColor={COLORS.WHITE}
                    otherstyles={{
                      paddingVertical: 12,
                      borderRadius: 12,
                    }}
                    isLoading={loading}
                    disabled={!isValid}
                    onPress={handleSubmit}
                    title="Verify"
                  />
                </View>
              );
            }}
          </Formik>
        </>
      ) : (
        <View style={{ gap: 8, paddingBottom: 14 }}>
          <Text
            style={{
              fontSize: RFValue(16),
              fontFamily: FONTS.SEMI_BOLD,
              color: COLORS.BLACK,
              textAlign: "center",
            }}
          >
            Email address verified
          </Text>
          <GreenTick marginTop={24} marginBottom={16} alignSelf="center" />
          <Text
            style={{
              fontSize: RFValue(14),
              fontFamily: FONTS.REGULAR,
              color: "#757A7E",
              textAlign: "center",
              paddingBottom: 40,
            }}
          >
            Your email address has been successfully {"\n"}verified.
          </Text>
          <PrimaryButton
            title="Go Shopping"
            otherstyles={{ paddingVertical: 12 }}
            onPress={onClose}
          />
        </View>
      )}
      {snackVisible?.show ? (
        <View
          style={{
            position: "absolute",
            bottom: 18,
            width: "100%",
            alignSelf: "center",
          }}
        >
          <SnackBar
            show={snackVisible?.show}
            type={snackVisible?.type}
            content={snackVisible?.content}
          />
        </View>
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  boldText: { color: COLORS.BLACK },
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
    gap: 8,
  },
  errorText: {
    color: COLORS.RED,
    fontFamily: FONTS.MEDIUM,
    fontSize: RFValue(12),
  },
  focusCell: { borderColor: COLORS.GREY, borderWidth: 2 },
  messageTxt: {
    color: "#68717D",
    fontFamily: FONTS.MEDIUM,
    fontSize: RFValue(12),
    paddingTop: 12,
    textAlign: "center",
  },
  resendTxt: {
    color: COLORS.BLACK,
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: RFValue(14),
  },
  rowView: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  subtitle: {
    color: COLORS.GREY,
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(14),
    lineHeight: 20,
  },
  title: {
    color: COLORS.BLACK,
    fontFamily: FONTS.MEDIUM,
    fontSize: RFValue(14),
  },
});

VerifyMail.propTypes = {
  onClose: PropTypes.func,
};
export default React.memo(VerifyMail);
