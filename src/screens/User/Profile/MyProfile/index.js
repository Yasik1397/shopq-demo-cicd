//<--------------------------Libraries--------------------------->
import { Formik } from "formik";
import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import ImagePicker from "react-native-image-crop-picker";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
//<--------------------------Components-------------------------->
import PrimaryButton from "../../../../components/Buttons/Primary";
import DropdownPicker from "../../../../components/Input/DropDownInput";
import MobileInput from "../../../../components/Input/MobileInput";
import PrimaryInput from "../../../../components/Input/PrimaryInput";
import SnackBar, { useSnackBar } from "../../../../components/SnackBar";

//<--------------------------Assets-------------------------->
import Edit from "../../../../assets/Icons/Edit.svg";
import Pen from "../../../../assets/Icons/pen.svg";
import Deleteicon from "../../../../assets/Icons/trash.svg";

import { DefaultImage } from "../../../../constants/IMAGES";

import ActionSheet from "react-native-actions-sheet";
import ChangeMail from "../../../../components/BottomSheets/Profile/ChangeMail";
import ChangeMobile from "../../../../components/BottomSheets/Profile/ChangeMobile";
import PrimaryHeader from "../../../../components/Header";
import { COLORS, FONTS } from "../../../../constants/Theme";

import Ionicons from "react-native-vector-icons/Ionicons";
import DeleteAccount from "../../../../components/BottomSheets/DeleteAccount";
import {
  requestCameraPermission,
  requestGalleryPermission,
} from "../../../../utils/permissions";
import { DeleteValue } from "../../../../utils/storageutils";

//<--------------------------Functions---------------------------->
import PhotoPopup from "../../../../components/BottomSheets/Profile/Photo";
import UpdateMail from "../../../../components/BottomSheets/Profile/UpdateMail";
import VerifyMail from "../../../../components/BottomSheets/Profile/VerifyMail";

import {
  useDeleteProfileMutation,
  useLoginMutation,
  useUpdateProfileMutation,
  useUploadImageMutation,
} from "../../../../redux/Api/Auth";
import { getUserData } from "../../../../redux/Api/user";
import { RFValue } from "../../../../utils/responsive";
import Secondary from "../../../../components/Buttons/Secondary";

const profileupateSchema = yup.object().shape({
  fullname: yup
    .string()
    .matches(/^[a-zA-Z\s]*$/, "Invalid name format. Please enter a valid name.")
    .required("Full Name is required"),
  gender: yup.string().required("Gender is required"),
});

const MyProfile = ({ navigation, onAuthStateChanged }) => {
  const user = useSelector((state) => state?.Userdata?.user?.records);
  const dispatch = useDispatch();
  const { showSnack, snackVisible } = useSnackBar();

  const formref = useRef();
  const [imageUri, setImageUri] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [editmode, setEditmode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [postLogin] = useLoginMutation();
  const [updateUser] = useUpdateProfileMutation();

  const [updateprofile] = useUploadImageMutation();

  const [postDeleteAccount] = useDeleteProfileMutation();

  // Refs
  const ChangeMobileRef = useRef();

  const ChangeMailRef = useRef();
  const VerifyMailRef = useRef();
  const UpdateMailRef = useRef();

  const DeleteAccountRef = useRef();
  const PhotoSheetRef = useRef();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(getUserData({ id: user?.id }));
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleDeleteAccount = async () => {
    const res = await postDeleteAccount(user?.id);
    console.log("res: ", res);
    if (res?.data?.success) {
      DeleteAccountRef?.current?.hide();
      showSnack("Account deleted successfully", "success", 1500, async () => {
        await DeleteValue("token");
        await DeleteValue("user");
        onAuthStateChanged();
      });
    }
  };

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      const res = await updateUser({
        id: user?.id,
        updatedata: {
          full_name: values?.fullname,
          gender: values?.gender,
        },
      });
      console.log("res: ", res);
      if (res?.data?.success) {
        if (imageUri) {
          let formData = new FormData();
          formData.append("profile_image", {
            uri: imageUri?.path,
            type: imageUri?.mime,
            name: imageUri?.filename,
          });
          const res = await updateprofile({ id: user?.id, formData: formData });
          console.log("res:image ", res);
        }
        showSnack("Profile updated successfully", "success", 1500, () => {
          dispatch(getUserData({ id: user?.id }));
          setEditmode(false);
          setImageUri(null);
        });
      }
    } catch (e) {
      showSnack("Something went wrong", "error");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const HandleChangeMobile = async () => {
    const res = await postLogin({
      mobile_number: user?.mobile_number,
      country_code: user?.country_code,
    });
    if (res?.data?.success) {
      console.log("Change Mobile OTP", res);
      showSnack("OTP has been sent successfully", "success", 1500, () => {
        ChangeMobileRef?.current?.show();
      });
    } else {
      showSnack(res?.data?.message, "error");
    }
  };

  const handleMail = async (type) => {
    if (type === "change") {
      const res = await updateUser({
        id: user?.id,
        updatedata: { email: user?.email },
      });
      if (res?.data?.success) {
        console.log("res: ", res);
        showSnack("OTP has been sent to your email", "success", 1500, () => {
          ChangeMailRef?.current?.show();
        });
      }
    } else if (type === "verify") {
      const res = await updateUser({
        id: user?.id,
        updatedata: { email: user?.email },
      });
      console.log("res: ", res);
      if (res?.data?.success) {
        showSnack("OTP has been sent to your email", "success", 1500, () => {
          VerifyMailRef?.current?.show();
        });
      }
    } else if (type === "update") {
      UpdateMailRef?.current?.show();
    }
  };

  const openCamera = async () => {
    if (await requestCameraPermission()) {
      try {
        ImagePicker.openCamera({
          width: 300,
          height: 300,
          cropping: true,
          mediaType: "photo",
          cropperToolbarTitle: "Crop Profile Image",
          cropperStatusBarColor: COLORS.WHITE,
          cropperToolbarWidgetColor: COLORS.BLACK,
          cropperActiveWidgetColor: COLORS.PRIMARY,
          cropperCircleOverlay: true,
        })
          .then((image) => {
            setImageUri(image);
            PhotoSheetRef?.current?.hide();
          })
          .catch((err) => {
            if (err.code !== "E_PICKER_CANCELLED") {
              console.log(err);
            }
          });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const openGallery = async () => {
    if (await requestGalleryPermission()) {
      try {
        ImagePicker.openPicker({
          width: 300,
          height: 300,
          cropping: true,
          mediaType: "photo",
          cropperToolbarTitle: "Crop Profile Image",
          cropperStatusBarColor: COLORS.white,
          cropperToolbarWidgetColor: COLORS.black,
          cropperActiveWidgetColor: COLORS.primary,
          cropperCircleOverlay: true,
        })
          .then((image) => {
            setImageUri(image);
            formref.current?.setFieldValue("profile_image", image?.path);
            PhotoSheetRef?.current?.hide();
          })
          .catch((err) => {
            if (err.code !== "E_PICKER_CANCELLED") {
              console.log(err);
            }
          });
      } catch (err) {
        console.log("Error", err);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
      <PrimaryHeader
        onPress={() => navigation.goBack()}
        headerName={"My Profile"}
      />
      <Formik
        innerRef={formref}
        validationSchema={profileupateSchema}
        initialValues={{
          profileimage: user?.profile_image || null,
          fullname: user?.full_name,
          gender: user?.gender,
        }}
        enableReinitialize
        onSubmit={handleUpdate}
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
        }) => (
          <>
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              contentContainerStyle={{
                flexGrow: 1,
                backgroundColor: COLORS.WHITE,
                padding: 16,
              }}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ marginTop: 8, marginBottom: 16 }}>
                {/* Profile Image */}
                <View
                  style={{
                    position: "relative",
                    width: 80,
                    height: 80,
                    alignSelf: "center",
                  }}
                >
                  {user?.profile_image && !imageUri?.path ? (
                    <FastImage
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                      }}
                      source={{
                        uri: `${user?.profile_image}?t=${new Date().getTime()}`,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  ) : editmode && imageUri?.path ? (
                    <FastImage
                      source={{
                        uri: imageUri?.path,
                      }}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  ) : (
                    <FastImage
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                      }}
                      source={{
                        uri: DefaultImage.profile,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  )}
                  {editmode ? (
                    <Edit
                      onPress={() => PhotoSheetRef?.current?.show()}
                      style={{
                        position: "absolute",
                        bottom: -5,
                        right: -5,
                      }}
                    />
                  ) : null}
                </View>
              </View>
              {/* Account info Section */}
              <View style={{ gap: 16, marginBottom: 16 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.PRIMARY,
                      fontFamily: FONTS.SEMI_BOLD,
                      fontSize: RFValue(16),
                    }}
                  >
                    Account Info
                  </Text>
                  <Pen onPress={() => setEditmode(true)} />
                </View>
                <PrimaryInput
                  onchangetext={(text) => {
                    handleChange("fullname")(text);
                  }}
                  onblur={handleBlur("fullname")}
                  value={values?.fullname}
                  error={editmode && touched.fullname ? errors.fullname : ""}
                  label="Full Name"
                  keyboard={"ascii-capable"}
                  capitalize={true}
                  mask={false}
                  disabled={!editmode}
                  editable={editmode}
                  autoFocus={false}
                  placeholder={""}
                  secured={false}
                />
                <DropdownPicker
                  disabled={!editmode}
                  label="Gender"
                  placeholder="Select Gender"
                  options={["Male", "Female", "Prefer no to say"]}
                  value={values.gender}
                  setValue={handleChange("gender")}
                  onSelect={(option) => {
                    handleChange("gender")(option);
                  }}
                />
              </View>
              {/* Login Info Section */}
              {!editmode ? (
                <>
                  <View style={{ gap: 16 }}>
                    <Text
                      style={{
                        color: "#061018",
                        fontFamily: FONTS.SEMI_BOLD,
                        fontSize: RFValue(16),
                      }}
                    >
                      Login Info
                    </Text>
                    <MobileInput
                      valuecode={values.country_code}
                      onblur={handleBlur("mobile_number")}
                      value={user?.mobile_number}
                      error={touched.mobile_number ? errors.mobile_number : ""}
                      label="Mobile number"
                      disabled
                      keyboard={"number-pad"}
                      mask={false}
                      autoComplete={"username"}
                      autoFocus={false}
                      placeholder={"Enter your mobile number"}
                      secured={false}
                      extratext={"Change"}
                      editable={false}
                      children={
                        <TouchableOpacity onPress={HandleChangeMobile}>
                          <Text
                            style={{
                              color: COLORS.RED,
                              fontFamily: FONTS.MEDIUM,
                              fontSize: RFValue(14),
                            }}
                          >
                            Change
                          </Text>
                        </TouchableOpacity>
                      }
                    />

                    <PrimaryInput
                      onblur={handleBlur("email")}
                      value={user?.email ? user?.email : "- -"}
                      error={touched.email ? errors.email : ""}
                      label="Email Address"
                      keyboard={"email-address"}
                      variant={"primaryInput"}
                      capitalize={false}
                      mask={true}
                      disabled
                      autoComplete={"email"}
                      autoFocus={false}
                      placeholder={"test@example.com"}
                      editable={false}
                      rightchild={
                        <TouchableOpacity
                          onPress={() =>
                            handleMail(
                              !user?.email
                                ? "update"
                                : !user?.is_email_verified
                                ? "verify"
                                : "change"
                            )
                          }
                          style={{
                            flexDirection: "row",
                            gap: 8,
                            alignItems: "center",
                          }}
                        >
                          <View style={{ flexDirection: "row", gap: 4 }}>
                            {user?.email && user?.is_email_verified ? null : (
                              <Ionicons
                                color={
                                  !user?.is_email_verified
                                    ? "#EBA83A"
                                    : COLORS.RED
                                }
                                size={RFValue(20)}
                                name="alert-circle"
                              />
                            )}
                            <Text
                              style={{
                                color: !user?.is_email_verified
                                  ? "#EBA83A"
                                  : COLORS.RED,
                                fontFamily: FONTS.MEDIUM,
                                fontSize: RFValue(14),
                                includeFontPadding: false,
                              }}
                            >
                              {!user?.email
                                ? "Update"
                                : !user?.is_email_verified
                                ? "Verify"
                                : "Change"}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      }
                    />
                  </View>
                  <View style={{ marginTop: 6, gap: 16 }}>
                    <Text
                      style={{
                        color: "#8B8F93",
                        fontFamily: FONTS.REGULAR,
                        fontSize: RFValue(12),
                      }}
                    >
                      {!user?.email
                        ? "Update your email address to start getting emails about your account and to change your mobile number if lost"
                        : !user?.is_email_verified
                        ? `Verify your email address to start getting emails about your account and to change your mobile number if lost.`
                        : null}
                    </Text>
                    <PrimaryButton
                      icon1={<Deleteicon />}
                      backgroundColor={COLORS.WHITE}
                      fontFamily={FONTS.MEDIUM}
                      textColor={"#D05051"}
                      title={"Delete Account"}
                      onPress={() => {
                        DeleteAccountRef?.current?.show();
                      }}
                    />
                  </View>
                </>
              ) : null}
            </ScrollView>
            {editmode ? (
              <View
                style={{
                  padding: 12,
                  backgroundColor: COLORS.WHITE,
                  elevation: 5,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 1,
                  shadowRadius: 2.22,
                }}
              >
                <Secondary
                  title1={"Cancel"}
                  title2={"Update"}
                  onPress1={() => {
                    setEditmode(false);
                  }}
                  textColor1={COLORS.BLACK}
                  textColor2={COLORS.WHITE}
                  onPress2={handleSubmit}
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
                  isLoading2={loading}
                  isButton2Disabled={!isValid || loading || !dirty}
                />
              </View>
            ) : null}
          </>
        )}
      </Formik>

      <View
        style={{
          padding: 10,
          position: "absolute",
          bottom: editmode ? 80 : 20,
          width: "100%",
          alignSelf: "center",
        }}
      >
        <SnackBar
          show={snackVisible.show}
          content={snackVisible.content}
          type={snackVisible.type}
        />
      </View>

      {/* Delete Account Popup */}
      <ActionSheet
        indicatorStyle={{ backgroundColor: "#D0D1D1", marginTop: 12 }}
        containerStyle={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        closable
        gestureEnabled
        openAnimationConfig={{
          timing: { duration: 500 },
          bounciness: 0,
        }}
        ref={DeleteAccountRef}
      >
        <DeleteAccount
          onSubmit={handleDeleteAccount}
          onCancel={() => DeleteAccountRef?.current?.hide()}
        />
      </ActionSheet>
      {/* Update Mail Popup */}
      <ActionSheet
        indicatorStyle={{ backgroundColor: "#D0D1D1", marginTop: 12 }}
        containerStyle={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        closable
        gestureEnabled
        openAnimationConfig={{
          timing: { duration: 500 },
          bounciness: 0,
        }}
        ref={UpdateMailRef}
      >
        <UpdateMail />
      </ActionSheet>

      {/* Verify Mail Popup */}
      <ActionSheet
        indicatorStyle={{ backgroundColor: "#D0D1D1", marginTop: 12 }}
        containerStyle={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        closable
        gestureEnabled
        openAnimationConfig={{
          timing: { duration: 500 },
          bounciness: 0,
        }}
        ref={VerifyMailRef}
      >
        <VerifyMail
          email={user?.email}
          onClose={() => VerifyMailRef?.current?.hide()}
        />
      </ActionSheet>

      {/* Change Mail Popup */}
      <ActionSheet
        indicatorStyle={{ backgroundColor: "#D0D1D1", marginTop: 12 }}
        containerStyle={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        closable
        gestureEnabled
        openAnimationConfig={{
          timing: { duration: 500 },
          bounciness: 0,
        }}
        ref={ChangeMailRef}
      >
        <ChangeMail BottomsheetRef={ChangeMailRef} />
      </ActionSheet>

      {/* Change Mobile Popup */}
      <ActionSheet
        indicatorStyle={{ backgroundColor: "#D0D1D1", marginTop: 12 }}
        containerStyle={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        closable
        gestureEnabled
        openAnimationConfig={{
          timing: { duration: 500 },
          bounciness: 0,
        }}
        ref={ChangeMobileRef}
      >
        <ChangeMobile
          BottomsheetRef={ChangeMobileRef}
          mobile={user?.mobile_number}
        />
      </ActionSheet>
      <ActionSheet
        indicatorStyle={{ backgroundColor: "#D0D1D1", marginTop: 12 }}
        containerStyle={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        closable
        gestureEnabled
        openAnimationConfig={{
          timing: { duration: 500 },
          bounciness: 0,
        }}
        ref={PhotoSheetRef}
      >
        <PhotoPopup onCameraPress={openCamera} onGalleryPress={openGallery} />
      </ActionSheet>
    </SafeAreaView>
  );
};
MyProfile.propTypes = {
  navigation: PropTypes.object,
  onAuthStateChanged: PropTypes.func,
};
export default React.memo(MyProfile);
