/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-console */
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import PrimaryButton from "../../../components/Buttons/Primary";
import SnackBar, { useSnackBar } from "../../../components/SnackBar";

import { Formik } from "formik";
import PropTypes from "prop-types";
import _BackgroundTimer from "react-native-background-timer";
import { CodeField, Cursor } from "react-native-confirmation-code-field";
import PrimaryHeader from "../../../components/Header";
import Welcome from "../../../components/Modal/Welcome";
import { COLORS, FONTS } from "../../../constants/Theme";
import {
  useLoginMutation,
  useUpdateProfileMutation,
  useVerifyEmailMutation,
  useVerifyMobileMutation,
} from "../../../redux/Api/Auth";
import { StoreValue } from "../../../utils/storageutils";
import { maskNumber } from "../../../utils/TextFormat";
import { RFValue } from "../../../utils/responsive";
import { useFocusEffect } from "@react-navigation/native";
const OTPScreen = ({ navigation, route, onAuthStateChanged }) => {
  const type = route?.params?.type;
  const user = route?.params?.data;
  // console.log("type: ", type);


  useFocusEffect(
    useCallback(() => {
      formref?.current?.resetForm();
      setTimer(60);
    }, [])
  );

  const [verifyLoginOTP] = useVerifyMobileMutation();
  const [resendLoginOTP] = useLoginMutation();

  const [emailVerify] = useVerifyEmailMutation();
  const [resendEmail] = useUpdateProfileMutation();

  const formref = useRef();

  const [welcomemodal, setwelcomemodal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const { showSnack, snackVisible } = useSnackBar();

  useEffect(() => {
    const intervalId = _BackgroundTimer.setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);
    return () => {
      _BackgroundTimer.clearInterval(intervalId);
    };
  }, [timer]);

  const LoginResend = async () => {
    try {
      const res = await resendLoginOTP({
        mobile_number: route?.params?.mobilenumber,
        country_code: route?.params?.country_code,
        resend: true,
      });
      console.log("login resend: ", res);
      if (res?.data?.success) {
        showSnack(res?.data?.message, "success");
      } else {
        showSnack(res?.data?.message, "error");
      }
    } catch (e) {
      showSnack("Something went wrong", "error");
    }
  };

  const EmailResend = async () => {
    try {
      const res = await resendEmail({
        id: user?.id,
        updatedata: {
          email: user?.email,
        },
      });
      console.log("email resend: ", res);
      if (res?.data?.success) {
        showSnack(res?.data?.message, "success");
      } else {
        showSnack(res?.data?.message, "error");
      }
    } catch (e) {
      showSnack("Something went wrong", "error");
    }
  };
  const resendOtp = () => {
    switch (type) {
      case "login":
        LoginResend();
        break;
      case "email-verify":
        EmailResend();
        break;
      case "change-mobile":
        LoginResend();
        break;
    }
  };

  const VerifyEmail = async (values) => {
    try {
      const res = await emailVerify({
        email: user?.email,
        otp: values?.code,
      });
      console.log("email verify: ", res);
      if (res?.data?.success) {
        showSnack(res?.data?.message, "success", 1500, () => {
          onAuthStateChanged();
        });
      } else {
        showSnack(res?.data?.message, "error");
      }
    } catch (e) {
      showSnack("Something went wrong", "error");
    }
  };

  const handleVerifyOTP = async (values) => {
    try {
      setLoading(true);
      const result = await verifyLoginOTP({
        mobile_number: route?.params?.mobilenumber,
        mobile_number_otp: values?.code,
        country_code: route?.params?.country_code,
      });

      console.log("result: ", result);
      if (result?.data?.success) {
        if (result?.data?.records) {
          const user = result?.data?.records;
          if (user?.full_name && user?.gender && user?.email) {
            // dispatch(getUserData({ id: result?.data?.records?.id }));
            showSnack("login successfully", "success", 2000, async () => {
              setLoading(false);
              await Promise.all([
                StoreValue("user", result?.data?.records),
                StoreValue("token", result?.data?.records?.access_token),
              ]);
              onAuthStateChanged();
            });
          } else {
            showSnack(
              "OTP verified successfully",
              "success",
              2000,
              async () => {
                setLoading(false);
                if (result?.data?.records?.is_recovered) {
                  setwelcomemodal(true);
                }
                navigation.navigate("Signup", {
                  data: result?.data?.records,
                });
              }
            );
          }
        }
      } else {
        // Show error snack message from server response
        showSnack(result?.data?.message || "Verification failed", "error");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);

      // Show a generic error message
      showSnack("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeOTP = async (values) => {
    try {
      setLoading(true);
      const result = await emailVerify({
        email: route?.params?.email,
        otp: values?.code,
      });
      console.log("result: ", result);
      if (result?.data?.success) {
        showSnack("OTP verified successfully", "success", 2000, async () => {
          setLoading(false);
          navigation.navigate("NewNumber", {
            email: route?.params?.email,
            mobilenumber: route?.params?.mobilenumber,
            country_code: route?.params?.country_code,
          });
        });
      } else {
        showSnack(result?.data?.message || "Verification failed", "error");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  // Show a generic error message

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
      <PrimaryHeader onPress={() => navigation.goBack()} />
      <View style={{ flex: 1, backgroundColor: COLORS.WHITE, padding: 16 }}>
        <Formik
          initialValues={{ code: "" }}
          validationSchema={Yup.object().shape({
            code: Yup.string()
              .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
              .required("OTP is required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            if (type === "email-verify") {
              VerifyEmail(values);
            } else if (type === "login") {
              handleVerifyOTP(values);
            } else if (type === "change-mobile") {
              handleChangeOTP(values);
            } else if (type === "verify-new") {
              VerifyEmail(values);
            }
            setSubmitting(false);
          }}
          innerRef={formref}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isValid,
            isSubmitting,
          }) => (
            <View style={{ flex: 1 }}>
              <ScrollView>
                <View style={{ gap: 8, paddingBottom: 24 }}>
                  <Text
                    style={{
                      fontFamily: FONTS.BOLD,
                      fontSize: RFValue(22),
                      color: COLORS.BLACK,
                    }}
                  >
                    Enter OTP
                  </Text>
                  <Text
                    style={{ fontFamily: FONTS.REGULAR, fontSize: RFValue(14) }}
                  >
                    {" "}
                    A OTP has been sent to this{" "}
                    {user?.email
                      ? user?.email
                      : maskNumber(route?.params?.mobilenumber)}
                    {}
                  </Text>
                </View>
                <View style={{ gap: 8 }}>
                  <Text
                    style={{
                      fontFamily: FONTS.MEDIUM,
                      fontSize: RFValue(14),
                      color: COLORS.BLACK,
                    }}
                  >
                    Enter OTP<Text style={{ color: COLORS.RED }}>*</Text>
                  </Text>
                  <CodeField
                    value={values.code}
                    onChangeText={handleChange("code")}
                    onBlur={() => handleBlur("code")}
                    cellCount={6}
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
                      >
                        <Text style={styles.cellText}>
                          {symbol ||
                            (isFocused ? <Cursor cursorSymbol="|" /> : null)}
                        </Text>
                      </View>
                    )}
                    onFulfill={(code) => {
                      handleChange("code")(code);
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
                          resendOtp();
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
              </ScrollView>
              <PrimaryButton
                isLoading={isSubmitting || loading}
                backgroundColor={COLORS.BLACK}
                title="Continue"
                onPress={handleSubmit}
                otherstyles={{
                  borderRadius: 12,
                  paddingVertical: 14,
                }}
                disabled={!isValid || isSubmitting || loading}
              />
            </View>
          )}
        </Formik>
      </View>
      <View
        style={{
          padding: 10,
          position: "absolute",
          bottom: 70,
          alignSelf: "center",
          width: "100%",
        }}
      >
        <SnackBar
          show={snackVisible.show}
          content={snackVisible.content}
          type={snackVisible.type}
        />
      </View>
      <Welcome
        welcomemodal={welcomemodal}
        onPress={async () => {
          setwelcomemodal(false);
          await onAuthStateChanged();
        }}
      />
    </SafeAreaView>
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
    paddingTop: 16,
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
OTPScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
  type: PropTypes.string,
  onAuthStateChanged: PropTypes.func,
};
export default OTPScreen;
