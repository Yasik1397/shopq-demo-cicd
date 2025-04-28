import PropTypes from "prop-types";
import { Formik } from "formik";
import React, { useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import * as yup from "yup";

import { COLORS, FONTS } from "../../../constants/Theme";

import MobileInput from "../../../components/Input/MobileInput";
import EmailInput from "../../../components/Input/PrimaryInput";
import PrimaryButton from "../../../components/Buttons/Primary";
import SnackBar, { useSnackBar } from "../../../components/SnackBar";

import { useChangeMobileMutation } from "../../../Api/EndPoints/user_profile";
import { SafeAreaView } from "react-native";
import PrimaryHeader from "../../../components/Header";
import { RFValue } from "../../../utils/responsive";

const ChangeMobile = ({ navigation }) => {
  const formref = useRef();
  const [loader, setloader] = useState(false);
  const [changeMobile] = useChangeMobileMutation();
  const { showSnack, snackVisible } = useSnackBar();
  const changemobilenumbervalidation = yup.object().shape({
    mobilenumber: yup
      .string()
      .required("Phone Number is required")
      .matches(/^\d{10}$/, "Please enter a valid Indian phone number"),

    email: yup
      .string()
      .required("Email is required")
      .email("Please enter a valid email address"),
  });

  const HandleSubmit = async (values) => {
    setloader(true);
    const res = await changeMobile({
      mobile_number: values?.mobilenumber,
      email: values?.email,
      country_code: values?.country_code,
    });
    console.log("res: ", res);
    if (res?.data?.success) {
      setloader(false);
      showSnack('OTP has been sent successfully', "success", 1500, () => {
        navigation.navigate("OTPScreen", {
          email: values.email,
          mobilenumber: values.mobilenumber,
          country_code: values.country_code,
          type: "change-mobile",
        });
      });
    } else {
      showSnack(res?.data?.message, "error");
      setloader(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
      <PrimaryHeader onPress={() => navigation.goBack()} />
      <Formik
        innerRef={formref}
        validationSchema={changemobilenumbervalidation}
        initialValues={{
          mobilenumber: "",
          email: "",
          country_code: "+91",
        }}
        onSubmit={HandleSubmit}
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
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.WHITE,
              paddingHorizontal: 16,
              paddingBottom: 24,
            }}
          >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={{ gap: 8, marginBottom: 24 }}>
                <Text
                  style={{
                    color: COLORS.BLACK,
                    fontFamily: FONTS.BOLD,
                    fontSize: RFValue(22),
                  }}
                >
                  Lost Mobile number
                </Text>
                <Text
                  style={{
                    color: "#68717D",
                    fontFamily: FONTS.REGULAR,
                    fontSize: RFValue(14),
                  }}
                >
                  Kindly enter the mobile number and email address registered to
                  your account.
                </Text>
              </View>

              <View style={{ gap: 16 }}>
                <MobileInput
                  onChangecode={handleChange("country_code")}
                  onChangeText={handleChange("mobilenumber")}
                  handleBlur={handleBlur("mobilenumber")}
                  value={values.mobilenumber}
                  countryCode={values.country_code}
                  error={touched.mobilenumber ? errors.mobilenumber : ""}
                  label="Mobile number"
                  keyboard={"number-pad"}
                  capitalize={false}
                  mask={false}
                  autoComplete={"username"}
                  autoFocus={false}
                  placeholder={"Enter mobile number"}
                />
                <EmailInput
                  onchangetext={handleChange("email")}
                  onblur={handleBlur("email")}
                  value={values.email}
                  error={touched.email ? errors.email : ""}
                  label="Email address"
                  keyboard={"email-address"}
                  capitalize={false}
                  mask={true}
                  autoComplete={"username"}
                  autoFocus={false}
                  placeholder={"robert@gmail.com"}
                  Type={"email"}
                  secured={false}
                />
              </View>
            </ScrollView>

            <View>
              <PrimaryButton
                disabled={!isValid}
                isLoading={loader}
                title={"Continue"}
                onPress={handleSubmit}
              />
              <View
                style={{
                  width: "100%",
                  padding: 10,
                  position: "absolute",
                  bottom: 55,
                  alignSelf: "center",
                }}
              >
                <SnackBar
                  show={snackVisible.show}
                  content={snackVisible.content}
                  type={snackVisible.type}
                />
              </View>
            </View>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

ChangeMobile.propTypes = {
  navigation: PropTypes.any,
};

export default ChangeMobile;
