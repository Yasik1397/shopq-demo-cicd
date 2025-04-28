//<--------------------------Libraries--------------------------->
import PropTypes from "prop-types";
import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
//<--------------------------Assets------------------------------>
import Fontisto from "react-native-vector-icons/Fontisto";
import { DefaultImage } from "../../../constants/IMAGES";
import { COLORS, FONTS } from "../../../constants/Theme";
//<--------------------------Functions---------------------------->
import { RFValue } from "../../../utils/responsive";
import { truncateText } from "../../../utils/TextFormat";

const OrderCard = ({ onPress, data, type, onWriteReview }) => {
  return (
    <Pressable
      onPress={onPress}
      style={{ flex: 1, flexDirection: "row", gap: 8 }}
    >
      <FastImage
        source={{
          uri: data?.cover_image || DefaultImage.products,
          priority: FastImage.priority.high,
          cache: "immutable",
        }}
        style={{ width: 90, height: 96, borderRadius: 10 }}
        resizeMode={FastImage.resizeMode.cover}
      />
      {data?.cart_details?.product_details?.is_deleted ||
      data?.cart_details?.is_active === false ? (
        <View
          style={{
            width: 90,
            height: 96,
            borderRadius: 10,
            justifyContent: "center",
            backgroundColor: "#00000066",
            position: "absolute",
          }}
        >
          <View
            style={{
              margin: 3,
              backgroundColor: "red",
              borderRadius: 5,
              padding: 2,
            }}
          >
            <Text
              style={{
                color: "#FFF",
                textAlign: "center",
              }}
            >
              Unavailable
            </Text>
          </View>
        </View>
      ) : null}

      <View style={{ flex: 1, gap: 8, justifyContent: "center" }}>
        <Text
          numberOfLines={1}
          style={{
            color: "#061018",
            fontFamily: FONTS?.SEMI_BOLD,
            fontSize: RFValue(14),
          }}
        >
          {truncateText(data?.title, 42)}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontFamily: FONTS?.MEDIUM, fontSize: RFValue(12) }}>
              Size :{" "}
            </Text>
            <Text style={{ fontFamily: FONTS?.MEDIUM, fontSize: RFValue(12) }}>
              {""}
              {data?.variant_name?.Size} {""}
            </Text>
            <Text style={{ fontFamily: FONTS?.MEDIUM, fontSize: RFValue(12) }}>
              ● {""}Qty :
            </Text>
            <Text style={{ fontFamily: FONTS?.MEDIUM, fontSize: RFValue(12) }}>
              {data?.quantity}
            </Text>
          </View>
          {type === "orders" ? null : data?.review_rating > 1 ? (
            <View style={{ flexDirection: "row", alignItem: "center", gap: 8 }}>
              <Fontisto name="star" color="#EBA83A" size={RFValue(16)} />
              <Text>{Math.floor(data?.review_rating)}</Text>
            </View>
          ) : null}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text
              style={{
                fontSize: RFValue(18),
                color: COLORS.BLACK,
                fontFamily: FONTS.MEDIUM,
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(18),
                  color: COLORS.BLACK,
                  fontFamily: FONTS.BOLD,
                }}
              >
                &#8377; {data?.selling_price * data?.quantity}{" "}
              </Text>
              <Text
                style={{
                  fontSize: RFValue(12),
                  fontFamily: FONTS.MEDIUM,
                  textDecorationLine: "line-through",
                  color: COLORS.GREY,
                }}
              >
                {data?.tax_included_price * data?.quantity}
              </Text>
            </Text>
          </View>
          {type === "review" ? (
            <TouchableOpacity onPress={onWriteReview}>
              <Text
                style={{
                  color: "#0E1827",
                  fontFamily: FONTS?.MEDIUM,
                  fontSize: RFValue(12),
                  textDecorationLine: "underline",
                }}
              >
                {data?.is_reviewed ? "Edit Review" : "Write a Review"}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};

OrderCard.propTypes = {
  onPress: PropTypes.func,
  type: PropTypes.string,
  data: PropTypes.object,
  onWriteReview: PropTypes.func,
};

export default React.memo(OrderCard);
