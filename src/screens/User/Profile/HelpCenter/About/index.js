import PropTypes from "prop-types";
import React from "react";
import { Dimensions, SafeAreaView, ScrollView } from "react-native";
import RenderHTML from "react-native-render-html";
import PrimaryHeader from "../../../../../components/Header";
import { COLORS, FONTS } from "../../../../../constants/Theme";
import { useSelector } from "react-redux";
import { RFValue } from "../../../../../utils/responsive";

const AboutUs = ({ navigation }) => {
  const data = useSelector((state) => state?.AboutUsData?.data);

  const { width } = Dimensions.get("window");
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
      <PrimaryHeader headerName="About" onPress={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: COLORS.WHITE,
          padding: 16,
        }}
      >
        <RenderHTML
          systemFonts={[FONTS.REGULAR, FONTS.BOLD, FONTS.SEMI_BOLD]}
          baseStyle={{
            color: "#000",
            fontSize: RFValue(14),
            fontFamily: FONTS.REGULAR,
          }}
          contentWidth={width}
          source={{ html: data ? data?.records[0]?.content : "" || "" }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

AboutUs.propTypes = {
  navigation: PropTypes.object,
};
export default AboutUs;
