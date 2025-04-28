/* eslint-disable no-console */
import { Formik } from "formik";
import { PhoneNumberUtil } from "google-libphonenumber";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Image, Keyboard, Text, View } from "react-native";
import { countryCodes } from "react-native-country-codes-picker";

import { COLORS, FONTS } from "../../../../constants/Theme";

import PrimaryButton from "../../../Buttons/Primary";
import CountryCodePicker from "../../../Input/MobileInput";

import Animated, { FadeIn } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import {  useChangeMobileMutation, useUpdateMobileMutation } from "../../../../Api/EndPoints/user_profile";
import {
  useLoginMutation,
  useVerifyMobileMutation,
} from "../../../../redux/Api/Auth";
import { RFValue } from "../../../../utils/responsive";
import { PhoneSchema } from "../../../../utils/validator";
import Secondary from "../../../Buttons/Secondary";
import OTPTemplate from "../../../Others/Templates/OTPTemplate";
import SnackBar, { useSnackBar } from "../../../SnackBar";
import { getUserData } from "../../../../redux/Api/user";

const phoneUtil = PhoneNumberUtil.getInstance();

const ChangeMobilePopup = ({ BottomsheetRef, mobile }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.Userdata?.user?.records);

  const { snackVisible, showSnack } = useSnackBar();
  const [screen, setScreen] = useState("otp");
  const [newmobile, setNewmobile] = useState("");
  const [newData, setNewData] = useState({
    mobileNumber: "",
    countryCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [postLogin] = useLoginMutation();
  const [Verifyotp] = useVerifyMobileMutation();
  const [ChangeMobile] = useUpdateMobileMutation();

  const navigateToScreen = (screenName) => {
    setScreen(screenName);
  };

  const HandleCancel = () => {
    BottomsheetRef.current?.hide();
  };

  const resendOTP = async () => {
    const res = await postLogin({
      mobile_number: user?.mobile_number,
      country_code: user?.country_code,
      resend: true,
    });
    if (res?.data?.success) {
      console.log("Resend Mobile OTP", res);
      showSnack("OTP Resend Successfully", "success", 1500);
    } else {
      showSnack(res?.data?.message, "error");
    }
  };

  const VerifyOtp = async (val) => {
    try {
      setLoading(true);
      Keyboard.dismiss();
      const payload = {
        country_code: user?.country_code,
        mobile_number: user?.mobile_number,
        mobile_number_otp: val,
      };
      const result = await Verifyotp(payload);
      if (result?.data?.success) {
        showSnack(result?.data?.message, "success", 1500, () => {
          navigateToScreen("new");
        });
      } else {
        showSnack(result?.error?.data?.detail?.message, "error");
      }
    } catch (err) {
      console.error(err, "error");
    } finally {
      setLoading(false);
    }
  };

  const HandleChangeMobile = async (val) => {
    console.log("val: ", val);
    try {
      setLoading(true);
      Keyboard.dismiss();
      const payload = {
        id: user?.id,
        country_code: user?.country_code,
        mobile_number: val,
      };
      const result = await ChangeMobile(payload);

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

  const VerifyNewMobile = async (val) => {
    try {
      setLoading(true);
      const payload = {
        id: user?.id,
        country_code: user?.country_code,
        mobile_number: newmobile,
        otp: val,
      };
      const result = await ChangeMobile(payload);
      if (result?.data?.success) {
        showSnack(result?.data?.message, "success", 1500, () => {
          dispatch(getUserData({ id: user?.id }));
          navigateToScreen("success");
        });
      } else {
        showSnack(result?.error?.data?.detail?.message, "error");
      }
    } catch (err) {
      console.error(err, "error");
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = (title, subtitle, content) => (
    <View
      style={{
        gap: 8,
        paddingBottom: screen === "new" ? 24 : 36,
        paddingTop: 24,
      }}
    >
      <Text
        style={{
          textAlign: "center",
          color: COLORS.BLACK,
          fontFamily: FONTS.SEMI_BOLD,
          fontSize: RFValue(16),
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
        <View>
          <OTPTemplate
            title1={"Cancel"}
            title2={"Continue"}
            onPress1={HandleCancel}
            onResendOTP={resendOTP}
            isLoading={loading}
            OnSubmit={VerifyOtp}
            title={"Change mobile number"}
            subtitle={"Please enter the OTP received to"}
            content={mobile}
          />
        </View>
      );
    }
    if (screen === "new") {
      return (
        <View style={{}}>
          <Formik
            initialValues={{ mobileNumber: "", countryCode: "+91" }}
            onSubmit={(e) => {
              HandleChangeMobile(e.mobileNumber);
              setNewmobile(e.mobileNumber);
              setNewData(e);
            }}
            validationSchema={PhoneSchema}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isValid,
            }) => (
              <>
                <View style={{ paddingHorizontal: 16, paddingBottom: 120 }}>
                  {renderHeader("Enter your new mobile number")}
                  <CountryCodePicker
                    placeholder={"Mobile number"}
                    label={"Mobile Number"}
                    value={values.mobileNumber}
                    countryCode={values.countryCode}
                    autoFocus={false}
                    onChangecode={handleChange("countryCode")}
                    handleBlur={handleBlur("mobileNumber")}
                    onChangeText={handleChange("mobileNumber")}
                    error={touched.mobileNumber && errors.mobileNumber}
                  />
                </View>
                <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
                  {renderTwoButtons(
                    "Cancel",
                    "Verify",
                    HandleCancel,
                    handleSubmit,
                    !isValid,
                    loading
                  )}
                </View>
              </>
            )}
          </Formik>
        </View>
      );
    }
    if (screen === "newotp") {
      const CountryCode = countryCodes.find(
        (val) => val?.dial_code === newData?.countryCode
      )?.code;
      const number = phoneUtil.parseAndKeepRawInput(
        newData?.mobileNumber?.replace(/\D/g, ""),
        CountryCode
      );
      const phone = `${newData?.countryCode} ${phoneUtil.formatInOriginalFormat(
        number,
        CountryCode
      )}`;
      return (
        <View style={{ opacity: 1 }}>
          <OTPTemplate
            title1={"Cancel"}
            title2={"Continue"}
            onPress1={HandleCancel}
            onResendOTP={HandleChangeMobile}
            isLoading={loading}
            OnSubmit={(otp) => VerifyNewMobile(otp)}
            title={"Change mobile number"}
            subtitle={"Please enter the OTP received to"}
            content={phone}
          />
        </View>
      );
    }
    if (screen === "success") {
      return (
        <View
          style={{
            paddingHorizontal: 16,
            paddingBottom: 24,
          }}
        >
          {renderHeader("Mobile number changed")}
          <View style={{ alignItems: "center", gap: 16, paddingTop: 14 }}>
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
                lineHeight: 16,
                paddingBottom: 41,
              }}
            >
              Your mobile number has been successfully {"\n"} changed.
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

ChangeMobilePopup.propTypes = {
  BottomsheetRef: PropTypes.any,
  mobile: PropTypes.string,
  snackVisible: PropTypes.object,
  resendOTP: PropTypes.func,
};

export default React.memo(ChangeMobilePopup);
