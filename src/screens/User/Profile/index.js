//<--------------------------Libraries--------------------------->
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { Pressable, SafeAreaView, SectionList, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { useDispatch, useSelector } from "react-redux";

//<--------------------------Components-------------------------->
import PrimaryButton from "../../../components/Buttons/Primary";
import NoUserComponent from "../../../components/EmptyScreen/NoUser";
import PrimaryHeader from "../../../components/Header";
import SnackBar, { useSnackBar } from "../../../components/SnackBar";

//<--------------------------Assets------------------------------>

//<--------------------------Redux---------------------------->

//<--------------------------Functions---------------------------->

import ActionSheet from "react-native-actions-sheet";
import Animated, { FadeInUp } from "react-native-reanimated";
import Logout from "../../../components/BottomSheets/Logout";
import ListCard from "../../../components/Cards/ListCard";
import { Profile_Data } from "../../../constants/Data";
import { DefaultImage } from "../../../constants/IMAGES";
import { COLORS, FONTS } from "../../../constants/Theme";
import { getAboutUs } from "../../../redux/Api/Helpcenter/AboutUs";
import { getFAQdata } from "../../../redux/Api/Helpcenter/FAQs";
import { getStoreData } from "../../../redux/Api/User/StoreSettings";
import { capitalizeFirstLetter } from "../../../utils/TextFormat";
import { RFValue } from "../../../utils/responsive";
import { DeleteValue } from "../../../utils/storageutils";
import { getUserData } from "../../../redux/Api/user";
import { useLogoutProfileMutation } from "../../../redux/Api/Auth";

const Profile = ({ navigation, onAuthStateChanged }) => {
  const dispatch = useDispatch();
  // const deleteAccountstate = useSelector((state) => state?._deleteReducer?.ACCOUNT);
  const user = useSelector((state) => state?.Userdata?.user?.records);
  const logoutSheetRef = useRef(null);
  const { snackVisible, showSnack } = useSnackBar();
  const [postLogout] = useLogoutProfileMutation();
  useEffect(() => {
    dispatch(getFAQdata());
    dispatch(getAboutUs());
    dispatch(getStoreData());
  }, []);

  const handleLogout = async () => {
    try {
      const res = await postLogout(user?.id);
      console.log('res: ', res);
      if (res?.data?.success) {
        logoutSheetRef?.current?.hide();
        showSnack(res?.data?.message, "success", 1500, async () => {
          dispatch(getUserData({ id: null }));
          await Promise.all([DeleteValue("token"), DeleteValue("user")]);
          onAuthStateChanged();
        });
      } else {
        showSnack(res?.data?.message, "error");
      }
    } catch (error) {
      showSnack("Something went wrong", "error");
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.WHITE,
      }}
    >
      <PrimaryHeader headerName="Profile" />
      {user ? (
        <SectionList
          key={user?.id}
          data={Profile_Data}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingBottom: 50,
          }}
          sections={Profile_Data}
          renderSectionHeader={({ section: { title } }) => (
            <Animated.Text
              entering={FadeInUp.delay(2 * 50)}
              key={2 + 1}
              style={{
                fontFamily: FONTS.MEDIUM,
                fontSize: RFValue(14),
                color: "#8B8F93",
              }}
            >
              {title}
            </Animated.Text>
          )}
          ListHeaderComponent={() => (
            <View style={{ paddingTop: 24, paddingBottom: 16 }}>
              <FastImage
                style={{
                  alignSelf: "center",
                  width: 80,
                  height: 80,
                  borderRadius: 80,
                }}
                source={{
                  uri: user?.profile_image
                    ? user?.profile_image
                    : DefaultImage.profile,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <Text
                style={{
                  fontFamily: FONTS.SEMI_BOLD,
                  fontSize: RFValue(20),
                  textAlign: "center",
                  marginTop: RFValue(12),
                  color: COLORS.PRIMARY,
                }}
              >
                Hello, {capitalizeFirstLetter(user?.full_name)}
              </Text>
              {user?.email ? (
                <Text
                  style={{
                    fontFamily: FONTS.REGULAR,
                    fontSize: RFValue(14),
                    textAlign: "center",
                    marginTop: 5,
                    color: "#757A7E",
                  }}
                >
                  {user?.email}
                </Text>
              ) : null}
            </View>
          )}
          SectionSeparatorComponent={() => <View style={{ height: 16 }} />}
          ItemSeparatorComponent={() => (
            <View
              style={{
                marginVertical: 16,
                height: 1,
                backgroundColor: "#E8E8E8",
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <ListCard
              index={index}
              Optionname={item.name}
              children={item.icon}
              onPress={() => {
                navigation.navigate(item.screen);
              }}
              no_icon={!item.arrow}
            />
          )}
          ListFooterComponentStyle={{ marginTop: 20 }}
          ListFooterComponent={() => (
            <PrimaryButton
              title={"Log Out"}
              textColor={"#D92121"}
              fontFamily={FONTS.BOLD}
              backgroundColor={COLORS.WHITE}
              otherstyles={{
                borderWidth: 1.5,
                borderColor: "#D92121",
                paddingVertical: 12,
                borderRadius: 12,
              }}
              onPress={() => {
                logoutSheetRef.current?.show();
              }}
            />
          )}
        />
      ) : (
        <View style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
          <NoUserComponent
            onPress={async () => {
              await Promise.all([DeleteValue("token"), DeleteValue("user")]);
              onAuthStateChanged();
            }}
          />
          <Pressable
            onPress={() => {
              navigation.navigate("Terms");
            }}
          >
            <Text
              style={{
                paddingBottom: 32,
                fontFamily: FONTS.MEDIUM,
                fontSize: RFValue(14),
                color: COLORS.PRIMARY,
                textAlign: "center",
              }}
            >
              Terms & Service
            </Text>
          </Pressable>
        </View>
      )}

      <ActionSheet
        indicatorStyle={{ backgroundColor: "#D0D1D1", marginTop: 12 }}
        containerStyle={{
          width: "100%",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
        ref={logoutSheetRef}
        closable
        gestureEnabled
        openAnimationConfig={{
          timing: { duration: 500 },
          bounciness: 0,
        }}
      >
        <Logout
          onCancel={() => logoutSheetRef?.current?.hide()}
          onSubmit={handleLogout}
        />
      </ActionSheet>
      <View
        style={{
          padding: 10,
          position: "absolute",
          width: "100%",
          bottom: 16,
          alignSelf: "center",
        }}
      >
        <SnackBar
          show={snackVisible.show}
          content={snackVisible.content}
          type={snackVisible.type}
        />
      </View>
    </SafeAreaView>
  );
};
Profile.propTypes = {
  navigation: PropTypes.object,
  onAuthStateChanged: PropTypes.func,
};
export default React.memo(Profile);
