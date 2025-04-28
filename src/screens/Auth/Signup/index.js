/* eslint-disable no-console */
import { Formik } from "formik";
import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as yup from "yup";

import PrimaryHeader from "../../../components/Header";
import PrimaryButton from "../../../components/Buttons/Primary";

import PrimaryInput from "../../../components/Input/PrimaryInput";
import DropdownPicker from "../../../components/Input/DropDownInput";


import { StoreValue } from "../../../utils/storageutils";
import { COLORS, FONTS } from "../../../constants/Theme";
import { RFValue } from "../../../utils/responsive";
import SnackBar, { useSnackBar } from "../../../components/SnackBar";
import { useUpdateProfileMutation } from "../../../redux/Api/Auth";

const Signup = ({ navigation, route, onAuthStateChanged }) => {
  const UserData = route?.params?.data;
  console.log("UserData: ", UserData);

  const formref = useRef();
  const [updateUser] = useUpdateProfileMutation();
  const { snackVisible, showSnack } = useSnackBar();
  const [loading, setLoading] = useState(false);

  const profileupateSchema = yup.object().shape({
    fullname: yup.string().matches(/^[A-Za-z ]+$/, "Enter a valid name"),
    email: yup.string().email("Please enter a valid email"),
  });

  const Userregister = async (val) => {
    try {
      setLoading(true);
      const res = await updateUser({
        id: UserData?.id,
        updatedata: {
          full_name: val?.fullname.trim() || null,
          gender: val?.gender || null,
          email: val?.email || null,
        },
      });
      console.log(res?.data?.success, res?.error?.data?.detail);
      console.log('res: ', res);

      if (res?.data?.success) {
        setLoading(false);
        showSnack("Registered successfully", "success", 2000, async () => {
          await Promise.all([
            StoreValue("user", res?.data?.records),
            StoreValue("token", res?.data?.records?.access_token),
          ]);
          if (!UserData?.is_email_verified) {
            navigation.navigate("OTPScreen", {
              type: "verify",
              data: { id: res?.data?.records?.id, email: val?.email },
            });
          }
          onAuthStateChanged();
        });
      } else {
        setLoading(false);
        showSnack(res?.data?.message || "Something went wrong", "error");
      }
    } catch (e) {
      console.log(e, "Error in registering");
      setLoading(false);
      showSnack("Something went wrong", "error");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
      <PrimaryHeader onPress={() => navigation.goBack()} />
      <Formik
        innerRef={formref}
        validationSchema={profileupateSchema}
        initialValues={{
          fullname: UserData?.full_name || "",
          email: UserData?.email || "",
          gender: UserData?.gender || "",
        }}
        onSubmit={(values) => Userregister(values)}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
          dirty,
          setFieldValue,
        }) => (
          <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 24 }}>
            {console.log("values: ", values)}
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <Text
                style={{
                  fontFamily: FONTS.BOLD,
                  color: "#061018",
                  fontSize: RFValue(22),
                }}
              >
                Signup to your Account
              </Text>
              <Text
                style={{
                  color: COLORS.LIGHT_GREY,
                  fontFamily: FONTS.REGULAR,
                  fontSize: RFValue(14),
                }}
              >
                Kindly enter the details to create your account{" "}
              </Text>
              <View style={{ marginTop: 24, gap: 16 }}>
                <PrimaryInput
                  onchangetext={handleChange("fullname")}
                  onblur={handleBlur("fullname")}
                  value={values.fullname}
                  error={touched.fullname ? errors.fullname : ""}
                  label="Full name"
                  keyboard={"ascii-capable"}
                  capitalize={false}
                  mask={false}
                  autoFocus={false}
                  placeholder={"Ex: Robert"}
                  secured={false}
                />
                <PrimaryInput
                  onchangetext={handleChange("email")}
                  onblur={handleBlur("email")}
                  value={values.email}
                  error={touched.email ? errors.email : ""}
                  label="Email Address"
                  capitalize={false}
                  mask={false}
                  autoComplete={"email"}
                  autoFocus={false}
                  placeholder={"Ex: robert@gmail.com"}
                />
                <DropdownPicker
                  label="Gender"
                  placeholder="Select Gender"
                  options={["Male", "Female", "Prefer no to say"]}
                  onSelect={(G) => {
                    setFieldValue("gender", G);
                  }}
                  value={values.gender}
                />
              </View>
            </ScrollView>
            <View style={{ gap: 16 }}>
              <PrimaryButton
                backgroundColor={"#061018"}
                disabled={!isValid || !dirty}
                textColor={"#fff"}
                title={"Create"}
                isLoading={loading}
                onPress={isValid && dirty ? handleSubmit : null}
              />
              <TouchableOpacity
                onPress={async () => {
                  await Promise.all([
                    StoreValue("user", UserData),
                    StoreValue("token", UserData?.access_token),
                  ]);
                  onAuthStateChanged();
                }}
              >
                <Text
                  style={{
                    color: "#8B8F93",
                    fontSize: RFValue(16),
                    fontFamily: FONTS.SEMI_BOLD,
                    textAlign: "center",
                  }}
                >
                  Skip
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
      <View
        style={{
          padding: 10,
          position: "absolute",
          bottom: 75,
          width: "100%",
          alignSelf: "center",
        }}
      >
        <SnackBar
          show={snackVisible.show}
          type={snackVisible.type}
          content={snackVisible.content}
        />
      </View>
    </SafeAreaView>
  );
};

Signup.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
  onAuthStateChanged: PropTypes.func,
};
export default Signup;
