import React from "react";
import LinearGradient from "react-native-linear-gradient";
import { RFValue } from "../../../utils/responsive";
import { Image, Pressable, Text, View } from "react-native";
import { FONTS } from "../../../constants/Theme";
import { DefaultImage } from "../../../constants/IMAGES";
import PropTypes from "prop-types";

const FreeCard = ({ onPress, data }) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexWrap: "wrap",
        borderRadius: 8,
        padding: 8,
        backgroundColor: "#FDFDFD",
        borderColor: "#D9D9D9",
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
      }}
    >
      <Image
        source={{
          uri:
            data?.product_offer?.[0]?.free_item_image || DefaultImage.products,
        }}
        style={{
          width: 50,
          height: 50,
          resizeMode: "contain",
          borderRadius: 8,
        }}
      />
      <View style={{ gap: 6 }}>
        <Text
          style={{
            color: "#061018",
            fontFamily: FONTS.MEDIUM,
            fontSize: RFValue(14),
          }}
        >
          {data?.product_offer?.[0]?.free_item_detail?.title || "Free Item"}
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
          }}
        >
          <Text
            style={{
              includeFontPadding: false,
              fontFamily: FONTS.MEDIUM,
              fontSize: RFValue(14),
              color: "#fff",
            }}
          >
            FREE ITEM
          </Text>
        </LinearGradient>
      </View>
    </Pressable>
  );
};
FreeCard.propTypes = {
  onPress: PropTypes.func,
  data: PropTypes.object,
};
export default React.memo(FreeCard);
