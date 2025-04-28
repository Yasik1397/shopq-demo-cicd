import { Formik } from "formik";
import React, { useRef, useState } from "react";
import { ScrollView, View, Text, SafeAreaView } from "react-native";
import * as yup from "yup";

import { COLORS, FONTS } from "../../../../constants/Theme";
import { useChangeMobileMutation } from "../../../../Api/EndPoints/user_profile";
import PrimaryButton from "../../../../components/Buttons/Primary";
import MobileInput from "../../../../components/Input/MobileInput";
import SnackBar, { useSnackBar } from "../../../../components/SnackBar";

import PropTypes from "prop-types";
import PrimaryHeader from "../../../../components/Header";
import { RFValue } from "../../../../utils/responsive";

const NewMobileScreen = ({ navigation, route }) => {
  const formref = useRef();
  const [loader, setloader] = useState(false);
  const { showSnack, snackVisible } = useSnackBar();

  const [changemobilenumberApi] = useChangeMobileMutation();
  const loginValidationSchema = yup.object().shape({
    mobilenumber: yup
      .string()
      .required("Phone Number is required")
      .matches(/^\d{10}$/, "Please enter a valid Mobile Number"),
  });

  const handleSubmit = async (values) => {
    setloader(true);
    const res = await changemobilenumberApi({
      mobile_number: route?.params?.mobilenumber,
      email: route?.params?.email,
      country_code: values.country_code,
      newmobile: values?.mobilenumber,
    });
    if (res?.data?.success) {
      console.log('res: ', res);
      showSnack('OTP has been sent successfully', "success", 1500, () => {
        navigation.navigate("OTPScreen", {
          mobilenumber: values.mobilenumber,
          country_code: values.country_code,
          type: "verify-new",
        });
      });
    } else {
      showSnack(res?.data?.message, "error");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
      <PrimaryHeader headerName={null} />
      <Formik
        innerRef={formref}
        validationSchema={loginValidationSchema}
        initialValues={{
          mobilenumber: "",
          country_code: "+91",
        }}
        onSubmit={handleSubmit}
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
            <ScrollView style={{ flex: 1 }}>
              <View style={{ gap: 8 }}>
                <Text
                  style={{
                    color: "#061018",
                    fontFamily: FONTS.BOLD,
                    fontSize: RFValue(22),
                  }}
                >
                  New Mobile number
                </Text>
                <Text
                  style={{
                    color: "#68717D",
                    fontFamily: FONTS.MEDIUM,
                    fontSize: RFValue(14),
                  }}
                >
                  Kindly enter your new mobile number to register your account.
                </Text>
              </View>
              <View style={{ marginTop: 12 }}>
                <MobileInput
                  required
                  onChangecode={handleChange("country_code")}
                  onChangeText={handleChange("mobilenumber")}
                  onblur={handleBlur("mobilenumber")}
                  value={values.mobilenumber}
                  error={touched.mobilenumber ? errors.mobilenumber : ""}
                  label="New mobile number"
                  keyboard={"number-pad"}
                  variant={"primaryInput"}
                  capitalize={false}
                  mask={false}
                  autoComplete={"username"}
                  autoFocus={false}
                  placeholder={"(987) 6543210"}
                />
              </View>
            </ScrollView>
            <View>
              <PrimaryButton
                isloading={loader}
                title={"Continue"}
                disabled={!isValid}
                onPress={handleSubmit}
              />
            </View>
            <View
              style={{
                padding: 10,
                width: "100%",
                position: "absolute",
                bottom: 60,
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
        )}
      </Formik>
    </SafeAreaView>
  );
};

NewMobileScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};
export default NewMobileScreen;
