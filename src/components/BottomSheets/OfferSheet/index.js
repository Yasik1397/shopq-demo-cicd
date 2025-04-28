import React from "react";
import { Dimensions, Image, Text, View } from "react-native";
import { DefaultImage } from "../../../constants/IMAGES";
import PrimaryButton from "../../Buttons/Primary";
import PropTypes from "prop-types";
import { FONTS } from "../../../constants/Theme";
import LinearGradient from "react-native-linear-gradient";
import { RFValue } from "../../../utils/responsive";
import RenderHTML from "react-native-render-html";
import { ScrollView } from "react-native-actions-sheet";
const { width } = Dimensions.get("window");

const OfferDetails = ({ data, onClose }) => {
  return (
    <View style={{ padding: 16, gap: 16 }}>
      <Text
        style={{
          color: "#061018",
          fontFamily: FONTS.SEMI_BOLD,
          textAlign: "center",
          fontSize: RFValue(18),
        }}
      >
        Offer Details
      </Text>
      <View
        style={{
          borderWidth: 1,
          borderColor: "#EEEDEE",
          borderRadius: 12,
          padding: 2,
          alignItems: "center",
          flexDirection: "row",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <Image
          style={{
            height: 120,
            width: 120,
            borderRadius: 12,
          }}
          source={{ uri: data?.product_images?.[0] || DefaultImage }}
        />
        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{
              color: "#061018",
              fontFamily: FONTS.SEMI_BOLD,
              fontSize: RFValue(16),
            }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {data?.title || "Default Title"}
          </Text>
          <Text
            style={{
              fontSize: RFValue(14),
              color: "#A3A6A8",
              fontFamily: FONTS.MEDIUM,
            }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {data?.brand_name || "Default Title"}
          </Text>
          <LinearGradient
            colors={["#CA093D", "#CB007E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              alignSelf: "flex-start",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
              marginVertical: 4,
            }}
          >
            <Text
              style={{
                includeFontPadding: false,
                fontFamily: FONTS.MEDIUM,
                fontSize: RFValue(14),
                color: "#fff",
                textTransform: "uppercase",
              }}
            >
              FREE ITEM
            </Text>
          </LinearGradient>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          gap: 16,
        }}
      >
        <RenderHTML
          systemFonts={[FONTS.REGULAR, FONTS.BOLD, FONTS.SEMI_BOLD]}
          baseStyle={{
            color: "#000",
            fontSize: RFValue(14),
            fontFamily: FONTS.REGULAR,
          }}
          source={{ html: data?.productDetails }}
          contentWidth={width}
        />
      </ScrollView>
      <PrimaryButton
        otherstyles={{ paddingVertical: 12, borderRadius: 8 }}
        onPress={onClose}
        title={"Close"}
      />
    </View>
  );
};

OfferDetails.propTypes = {
  onClose: PropTypes.func,
  data: PropTypes.object,
};

export default OfferDetails;
