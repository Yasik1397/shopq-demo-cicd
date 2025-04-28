import PropTypes from "prop-types";
import React from "react";
import { Dimensions, SafeAreaView, ScrollView } from "react-native";
import { COLORS, FONTS } from "../../../../../constants/Theme";
import PrimaryHeader from "../../../../../components/Header";
import { useSelector } from "react-redux";
import { RFValue } from "../../../../../utils/responsive";
import RenderHTML from "react-native-render-html";

const width = Dimensions.get("window").width;
const TermsDetails = ({ navigation, route }) => {
  const data = useSelector((state) => state?.TermsData?.data?.records);
  const cleanHTML = (html) => {
    return html
      .replace(/<p><br><\/p>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
      <PrimaryHeader
        onPress={() => navigation.goBack()}
        headerName={route?.params?.title}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
        <RenderHTML
          systemFonts={[FONTS.REGULAR, FONTS.BOLD, FONTS.SEMI_BOLD]}
          baseStyle={{
            color: "#000",
            fontSize: RFValue(14),
            fontFamily: FONTS.REGULAR,
          }}
          source={{ html: data && cleanHTML(data[0]?.content) || "" }}
          contentWidth={width}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

TermsDetails.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};
export default React.memo(TermsDetails);
