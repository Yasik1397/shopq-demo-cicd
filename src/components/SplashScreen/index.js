import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native"; // Use Text from react-native
import { SvgUri } from "react-native-svg";
import { useGetlogocolorApiQuery } from "../../Api/EndPoints/settings";
import { COLORS, FONTS } from "../../constants/Theme";
import { useDispatch, useSelector } from "react-redux";
import { SettingsData } from "../../redux/Api/User/Settings";
import Animated, { FadeIn } from "react-native-reanimated";
import { RFValue } from "../../utils/responsive";

const SplashScreen = ({ setinitial }) => {
  const dispatch = useDispatch();
  const { data, isFetching: loading } = useGetlogocolorApiQuery();
  const settingsData = useSelector((state) => state?.settings?.data);
  const Logo = data?.records[0]?.logo;
  const title = settingsData?.records?.seo_title;

  useEffect(() => {
    dispatch(SettingsData());
    setTimeout(() => {
      setinitial(false);
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.BLACK} />
      ) : (
        <Animated.View
          entering={FadeIn}
          style={{ alignItems: "center", gap: 16 }}
        >
          <SvgUri uri={Logo} width={50} height={50} />
          <Text style={styles.title}>{title}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: RFValue(16),
    color: COLORS.BLACK,
    fontFamily: FONTS.SEMI_BOLD,
    textAlign: "center",
  },
});

SplashScreen.propTypes = {
  setinitial: PropTypes.func,
};
export default React.memo(SplashScreen);
