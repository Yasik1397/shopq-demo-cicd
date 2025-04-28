//<--------------------------Libraries--------------------------->
import PropTypes from "prop-types";
import React from "react";
import { Pressable, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import Animated, { FadeInUp } from "react-native-reanimated";

import { DefaultImage } from "../../../constants/IMAGES";
import { COLORS, FONTS } from "../../../constants/Theme";
import Entypo from "react-native-vector-icons/Entypo";
import { capitalizeFirstLetter, truncateText } from "../../../utils/TextFormat";
import { RFValue } from "../../../utils/responsive";
//<--------------------------Components-------------------------->
//Import custom components here
//<--------------------------Assets------------------------------>
//Import assets for this file
//<--------------------------Functions---------------------------->
//Import reusable functions here
//Essential props needed for this component/screen (with types) to work properly

// const imageHeight = imag;
const CheckoutCard = ({
  onPress,
  data,
  textColor,
  deliveryDate,
  isloading,
  index,
}) => {
  const OrderLength = data?.items?.length - 1;
  const CoverImage = data?.items[0]?.cover_image;
  return (
    <Animated.View key={index + 1} entering={FadeInUp.delay((index + 1) * 100)}>
      <Pressable
        onPress={onPress}
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <FastImage
            source={{ uri: CoverImage || DefaultImage.products }}
            style={{ width: 80, height: 80, borderRadius: 12 }}
            resizeMode={FastImage.resizeMode.cover}
          />
          {data?.cart_details?.product_details?.is_deleted ? (
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 12,
                backgroundColor: "#00000066",
                position: "absolute",
                bottom: 0,
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.RED,
                  borderRadius: 5,
                  padding: 2,
                  position: "absolute",
                  width: "100%",
                  left: 0,
                  bottom: "40%",
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.SEMI_BOLD,
                    color: COLORS.WHITE,
                    fontSize: RFValue(12),
                    textAlign: "center",
                  }}
                >
                  Unavailable
                </Text>
              </View>
            </View>
          ) : null}
          <View style={{ gap: 8 }}>
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
            >
              <Text
                numberOfLines={1}
                style={{
                  fontSize: RFValue(14),
                  fontFamily: FONTS.SEMI_BOLD,
                  color: "#060108",
                }}
              >
                {truncateText(data?.items[0]?.title, 24)}
              </Text>
              {OrderLength == 0 ? null : (
                <Text
                  style={{
                    color: COLORS.RED,
                    fontFamily: FONTS.MEDIUM,
                    fontSize: RFValue(12),
                  }}
                >
                  .(
                  <Text
                    style={{
                      fontFamily: FONTS.MEDIUM,
                      textDecorationLine: "underline",
                    }}
                  >
                    +{OrderLength} more Items
                  </Text>
                  ).
                </Text>
              )}
            </View>

            <Text
              style={{
                fontFamily: FONTS.REGULAR,
                fontSize: RFValue(12),
                color: COLORS.LIGHT_GREY,
              }}
            >
              {data?.order_id}
            </Text>
            <View
              style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
            >
              <Text
                style={{
                  fontSize: RFValue(12),
                  fontFamily: FONTS.BOLD,
                  color: textColor,
                }}
              >
                {data?.status == "outForDelivery"
                  ? "Out for delivery"
                  : capitalizeFirstLetter(data?.status)}
              </Text>
              {data?.status === "Delivered" ||
              data?.status === "outForDelivery" ? null : (
                <Text
                  style={{
                    fontSize: RFValue(12),
                    fontFamily: FONTS.MEDIUM,
                    color: "#757A7E",
                  }}
                >
                  Expected Date :
                </Text>
              )}
              {deliveryDate && data?.status != "outForDelivery" ? (
                <Text
                  style={{
                    fontSize: RFValue(12),
                    fontFamily: FONTS.MEDIUM,
                    color: "#757A7E",
                  }}
                >
                  {deliveryDate}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
        <Entypo name="chevron-right" size={24} color={"#8B8F93"} />
      </Pressable>
    </Animated.View>
  );
};

CheckoutCard.propTypes = {
  title: PropTypes.string,
  imageUri: PropTypes.string,
  deliveryStatus: PropTypes.string,
  deliveryDate: PropTypes.string,
  remainingitem: PropTypes.number,
  orderId: PropTypes.string,
  isloading: PropTypes.bool,
  onPress: PropTypes.func,
  textColor: PropTypes.string,
  data: PropTypes.object,
  index: PropTypes.number,
};

export default React.memo(CheckoutCard);
