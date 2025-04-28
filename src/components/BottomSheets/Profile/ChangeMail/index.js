/* eslint-disable no-console */
import { Formik } from "formik";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Animated, Image, Keyboard, Text, View } from "react-native";
import * as Yup from "yup";

import { COLORS, FONTS } from "../../../../constants/Theme";

import PrimaryButton from "../../../Buttons/Primary";
import PrimaryInput from "../../../Input/PrimaryInput";
import OTPTemplate from "../../../Others/Templates/OTPTemplate";
import SnackBar, { useSnackBar } from "../../../SnackBar";
import { RFValue } from "../../../../utils/responsive";
import { useUpdateProfileMutation, useVerifyEmailMutation } from "../../../../redux/Api/Auth";
import { useDispatch, useSelector } from "react-redux";
import Secondary from "../../../Buttons/Secondary";
import { FadeIn } from "react-native-reanimated";
import { getUserData } from "../../../../redux/Api/user";

const ChangeEmailPopup = ({ BottomsheetRef, email }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.Userdata?.user?.records);

  const [screen, setScreen] = useState("otp");
  const [newemail, setNewemail] = useState("");
  const [loading, setLoading] = useState(false);
  const [postChange] = useUpdateProfileMutation();
  const [Verifyotp] = useVerifyEmailMutation();
  const { snackVisible, showSnack } = useSnackBar();

  const validationSchema = Yup.object().shape({
    newmail: Yup.string()
      .email("Invalid email address")
      .required("Email is required")
      .test("email", "Invalid email address", (value) => {
        const emailRegex = /^[a-zA-Z][a-z0-9._%+-]*@[a-z]+\.[A-Za-z]{2,4}$/;
        return emailRegex.test(value);
      })
      .max(50, " Email should not exceed 50 characters"),
  });
  const navigateToScreen = (screenName) => {
    setScreen(screenName);
  };

  const HandleCancel = () => {
    BottomsheetRef.current?.hide();
  };

  const VerifyOtp = async (val) => {
    try {
      setLoading(true);
      Keyboard.dismiss();
      const payload = {
        email: user?.email,
        otp: val,
      };
      const result = await Verifyotp(payload);
      if (result?.data?.success) {
        showSnack(result?.data?.message, "success", 1500, () => {
          navigateToScreen("new");
        });
      } else {
        showSnack(result?.data?.message, "error");
      }
    } catch (err) {
      console.error(err, "error");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    const res = await postChange({
      id: user?.id,
      updatedata: { email: user?.email },
    });
    if (res?.data?.success) {
      console.log("Resend Mobile OTP", res);
      showSnack("OTP Resend Successfully", "success", 1500);
    } else {
      showSnack(res?.error?.data?.detail, "error");
    }
  };
  const HandleChangeEmail = async (val) => {
    try {
      setLoading(true);
      Keyboard.dismiss();
      const payload = {
        id: user?.id,
        updatedata: { email: val },
      };
      const result = await postChange(payload);
      // eslint-disable-next-line no-console
      console.log(result);
      if (result?.data?.success) {
        showSnack("OTP has been sent successfully", "success", 1500, () => {
          navigateToScreen("newotp");
        });
      } else {
        showSnack(result?.error?.data?.detail, "error");
      }
    } catch (err) {
      console.error(err, "error");
    } finally {
      setLoading(false);
    }
  };

  const VerifyNewEmail = async (val) => {
    try {
      setLoading(true);
      const payload = {
        email: newemail,
        otp: val,
      };
      const result = await Verifyotp(payload);
      if (result?.data?.success) {
        showSnack(result?.data?.message, "success", 1500, () => {
          dispatch(getUserData({ id: user?.id }));
          navigateToScreen("success");
        });
      } else {
        showSnack(result?.data?.message, "error");
      }
    } catch (err) {
      console.error(err, "error");
    } finally {
      setLoading(false);
    }
  };

  // Common UI components
  const renderHeader = (title, subtitle, content) => (
    <View
      style={{
        gap: 8,
        paddingBottom:
          subtitle || title === "Enter your new email address" ? 36 : 60,
        paddingTop: 24,
      }}
    >
      <Text
        style={{
          textAlign: "center",
          color: COLORS.BLACK,
          fontFamily: FONTS.BOLD,
          fontSize: 16,
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={{
            color: COLORS.LIGHT_GREY,
            fontFamily: FONTS.REGULAR,
            fontSize: RFValue(14),
            textAlign: "center",
            lineHeight: 20,
          }}
        >
          {subtitle}
          <Text style={{ color: COLORS.BLACK, fontWeight: "bold" }}>
            {content}
          </Text>
        </Text>
      )}
    </View>
  );

  const renderTwoButtons = (
    title1,
    title2,
    onPress1,
    onPress2,
    isButton2Disabled,
    isLoading2
  ) => (
    <Secondary
      borderColor1={COLORS.BLACK}
      textColor1={COLORS.BLACK}
      textColor2={COLORS.WHITE}
      title1={title1}
      title2={title2}
      onPress1={onPress1}
      backgroundColor1={COLORS.WHITE}
      otherstyles1={{
        flex: 1,
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
      onPress2={onPress2}
      isButton2Disabled={isButton2Disabled}
      isLoading2={isLoading2}
    />
  );


  const renderContent = () => {
    if (screen === "otp") {
      return (
        <OTPTemplate
          title1={"Cancel"}
          title2={"Continue"}
          onPress1={HandleCancel}
          onResendOTP={resendOTP}
          isLoading={loading}
          OnSubmit={VerifyOtp}
          title={"Change email address"}
          subtitle={"Please enter the OTP received to"}
          content={email}
        />
      );
    }

    if (screen === "new") {
      return (
        <View style={{}}>
          <Formik
            initialValues={{ newmail: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              HandleChangeEmail(values.newmail);
              setNewemail(values.newmail);
            }}
          >
            {({
              handleChange,
              handleSubmit,
              values,
              errors,
              touched,
              isValid,
            }) => (
              <>
                <View style={{ paddingHorizontal: 15, paddingBottom: 120 }}>
                  {renderHeader("Enter your new email address")}
                  <PrimaryInput
                    value={values.newmail}
                    onchangetext={(text) => {
                      const lowerCaseText = text.toLowerCase();
                      handleChange("newmail")(lowerCaseText);
                    }}
                    label="Email address"
                    placeholder="Email address"
                    error={touched.newmail && errors.newmail}
                  />
                </View>
                {renderTwoButtons(
                  "Cancel",
                  "Verify",
                  HandleCancel,
                  handleSubmit,
                  !isValid,
                  loading
                )}
              </>
            )}
          </Formik>
        </View>
      );
    }

    if (screen === "newotp") {
      return (
        <View>
          <OTPTemplate
            title1={"Cancel"}
            title2={"Continue"}
            onPress1={HandleCancel}
            onResendOTP={HandleChangeEmail}
            isLoading={loading}
            OnSubmit={(val) => VerifyNewEmail(val)}
            title={"Change email address"}
            subtitle={"Please enter the OTP received to"}
            content={newemail}
          />
        </View>
      );
    }

    if (screen === "success") {
      return (
        <View style={{ padding: 16, paddingTop: 0 }}>
          {renderHeader("Email address changed")}
          <View style={{ alignItems: "center", gap: 16 }}>
            <Image
              source={require("../../../../assets/Icons/greentickamination.gif")}
              style={{ height: 100, width: 100 }}
            />
            <Text
              style={{
                fontFamily: FONTS.REGULAR,
                fontSize: RFValue(14),
                color: COLORS.LIGHT_GREY,
                textAlign: "center",
                lineHeight: 22,
                paddingHorizontal: 23,
                paddingBottom: 41,
              }}
            >
              Your email address has been successfully {"\n"} changed.
            </Text>
          </View>
          <PrimaryButton
            onPress={HandleCancel}
            title={"Go Shopping"}
            otherstyles={{ paddingVertical: 12, borderRadius: 12 }}
          />
        </View>
      );
    }

    return null;
  };

  return (
    <Animated.View entering={FadeIn}>
      {renderContent()}
      <View
        style={{
          padding: 10,
          position: "absolute",
          bottom: 75,
          alignSelf: "center",
          width: "100%",
        }}
      >
        <SnackBar
          show={snackVisible?.show}
          content={snackVisible?.content}
          type={snackVisible?.type}
        />
      </View>
    </Animated.View>
  );
};

ChangeEmailPopup.propTypes = {
  BottomsheetRef: PropTypes.any,
  email: PropTypes.string,
  snackVisible: PropTypes.object,
  setSnackVisible: PropTypes.func,
  setPopupSnack: PropTypes.func,
  resendOTP: PropTypes.func,
  refetch: PropTypes.func,
};

export default React.memo(ChangeEmailPopup);
