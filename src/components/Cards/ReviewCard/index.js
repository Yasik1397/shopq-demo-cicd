//<--------------------------Libraries--------------------------->
import React from "react";
import { Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { DefaultImage } from "../../../constants/IMAGES";
import { COLORS, FONTS } from "../../../constants/Theme";
import PropTypes from "prop-types";
import { RFValue } from "../../../utils/responsive";
import { CustomRatingStars } from "../../../screens/User/Products/Reviews";

const ReviewCard = ({ imageUri, label, date, reviewText, rating }) => {
  const calculateDaysAgo = (created_at) => {
    const currentDate = new Date();
    const createdAtDate = new Date(created_at);
    const timeDifference = currentDate - createdAtDate;
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    if (daysAgo === 0) {
      // write a min with in one hour
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      if (daysDifference === 0) {
        // display minutes
        return `${Math.floor(timeDifference / (1000 * 60 * 24))} minutes ago`;
      } else {
        return `${daysDifference} hour ago`;
      }
    } else if (daysAgo <= 5) {
      return `${daysAgo} days ago`;
    } else {
      // return date 01/01/2022
      return `${createdAtDate.getDate()}/${
        createdAtDate.getMonth() + 1
      }/${createdAtDate.getFullYear()}`;
    }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.WHITE,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <FastImage
            source={{
              uri: imageUri ? imageUri : DefaultImage.products,
              priority: FastImage.priority.high,
              cache: "immutable",
            }}
            style={{
              width: 28,
              height: 28,
              borderRadius: 28,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          <Text style={{ fontSize: RFValue(14), fontFamily: FONTS.MEDIUM, color: "#060108" }}>
            {label}
          </Text>
        </View>
        <Text
          style={{
            fontSize: RFValue(14),
            fontFamily: FONTS.MEDIUM,
            color: "#8B8F93",
          }}
        >
          {calculateDaysAgo(date)}
        </Text>
      </View>
      <View style={{ paddingVertical: 8 }}>
      <CustomRatingStars rating={rating} />
      </View>
      <Text
        style={{
          color: "#333B41",
          fontFamily: FONTS.REGULAR,
          fontSize: RFValue(14),
        }}
        ellipsizeMode="tail"
        numberOfLines={2}
      >
        {reviewText}
      </Text>
    </View>
  );
};

ReviewCard.propTypes = {
  imageUri: PropTypes.string,
  label: PropTypes.string,
  date: PropTypes.string,
  reviewText: PropTypes.string,
  rating: PropTypes.number,
};
export default React.memo(ReviewCard);
