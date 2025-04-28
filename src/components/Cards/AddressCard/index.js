import React from "react";
import { Pressable, Text, View } from "react-native";
import { FONTS } from "../../../constants/Theme";
import PropTypes from "prop-types";
import RadioIcon from "react-native-vector-icons/MaterialIcons";
import { RFValue } from "../../../utils/responsive";

const AddressCard = ({ item, isSelected, onPress }) => {
  return (
    <Pressable
      style={{
        gap: 10,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "flex-start",
      }}
      onPress={() => (isSelected ? null : onPress(item))}
    >
      <RadioIcon
        name={isSelected ? "radio-button-on" : "radio-button-off"}
        color="#09141EE5"
        size={20}
      />
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#0E1827",
              fontSize: RFValue(16),
              fontFamily: FONTS.MEDIUM,
              includeFontPadding: false,
            }}
          >
            {item?.addressTitle || "Address"}
          </Text>
        </View>
        <Text
          style={{
            color: "#8B8F93",
            fontFamily: FONTS.MEDIUM,
            fontSize: RFValue(14),
          }}
        >
          {item?.userName || ""}
        </Text>
        <Text
          style={{
            color: "#8B8F93",
            fontFamily: FONTS.MEDIUM,
            fontSize: RFValue(14),
          }}
        >
          {`${item?.streetAddress1}${
            item?.streetAddress2 ? ", " + item?.streetAddress2 : ""
          }${item?.city ? ", " + item?.city : ""}${
            item?.land ? ", " + item?.land : ""
          }${item?.zipcode ? " - " + item?.zipcode : ""}`}
        </Text>
        <Text
          style={{
            color: "#8B8F93",
            fontFamily: FONTS.MEDIUM,
            fontSize: RFValue(14),
            fontWeight: "500",
          }}
        >
          Ph : {item?.mobileNumber?.slice(-10)}
        </Text>
      </View>
    </Pressable>
  );
};

AddressCard.propTypes = {
  item: PropTypes.any,
  isSelected: PropTypes.bool,
  onPress: PropTypes.func,
};
export default AddressCard;
