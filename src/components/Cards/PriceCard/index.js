//<--------------------------Libraries--------------------------->
import PropTypes from "prop-types";
import React from "react";
import { Text, View } from "react-native";
import { COLORS, FONTS } from "../../../constants/Theme";
import { RFValue } from "../../../utils/responsive";
//<--------------------------Components-------------------------->
//Import custom components here
//<--------------------------Assets------------------------------>
//Import assets for this file
//<--------------------------Functions---------------------------->
//Import reusable functions here

const PriceCard = ({
  data,
  // cartItems,
  // type,
  // setPrice
}) => {
  console.log("data: ", data);
  //Hooks declarions
  //Declare functions here
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.WHITE,
      }}
    >
      <Text
        style={{
          color: "#061018",
          fontFamily: FONTS.SEMI_BOLD,
          fontSize: RFValue(14),
        }}
      >
        Price Summary
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 12,
        }}
      >
        <Text
          style={{
            color: COLORS.GREY,
            fontFamily: FONTS.MEDIUM,
            fontSize: RFValue(14),
          }}
        >
          Subtotal{" "}
          <Text style={{ fontFamily: FONTS.MEDIUM, fontSize: RFValue(10) }}>
            (Inclusive of all taxes)
          </Text>
        </Text>
        <Text
          style={{
            color: COLORS.BLACK,
            fontFamily: FONTS.MEDIUM,
            fontSize: RFValue(14),
          }}
        >
          &#8377;{" "}
          {typeof data?.order_price == "number"
            ? data?.order_price?.toLocaleString()
            : 0}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            color: COLORS.GREY,
            fontFamily: FONTS.MEDIUM,
            fontSize: RFValue(14),
          }}
        >
          Discount
        </Text>

        <Text
          style={{
            fontSize: RFValue(14),
            fontFamily: FONTS.MEDIUM,
            color: "#03a685",
          }}
        >
          {data?.order_price == 0
            ? "₹ 0.00"
            : `- ₹ ${data?.order_price - data?.total_price}`}
        </Text>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text
          style={{
            color: COLORS.GREY,
            fontFamily: FONTS.MEDIUM,
            fontSize: RFValue(14),
          }}
        >
          Shipping
        </Text>
        <Text
          style={{
            color: COLORS.BLACK,
            fontFamily: FONTS.MEDIUM,
            fontSize: RFValue(14),
          }}
        >
          {" "}
          {data?.order_price == 0
            ? "₹ 0.00"
            : data?.shipping_charge > 0
            ? typeof data?.shipping_charge == "number"
              ? `₹ ${data?.shipping_charge?.toLocaleString()}`
              : "00"
            : "Free"}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 12,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#061018",
            fontFamily: FONTS.MEDIUM,
            fontSize: RFValue(16),
          }}
        >
          Total
        </Text>
        <Text
          style={{
            color: "#061018",
            fontFamily: FONTS.BOLD,
            fontSize: RFValue(16),
          }}
        >
          {data?.total_price > 0
            ? `₹ ${data?.total_price?.toLocaleString()}`
            : "₹ 0.00"}
        </Text>
      </View>
    </View>
  );
};

PriceCard.propTypes = {
  data: PropTypes.object,
  // type: PropTypes.string,
  // cartItems: PropTypes.array,
};
export default React.memo(PriceCard);
