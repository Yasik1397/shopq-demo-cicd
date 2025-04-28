import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Image,
  Pressable,
  Text,
  View,
  Dimensions,
  StyleSheet,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import Octicons from "react-native-vector-icons/Octicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import { COLORS, FONTS } from "../../../constants/Theme";
import { capitalizeFirstLetter, truncateText } from "../../../utils/TextFormat";
import { DefaultImage } from "../../../constants/IMAGES";
import { RFValue } from "../../../utils/responsive";
import LinearGradient from "react-native-linear-gradient";
import { checkImageAccessibility } from "../../../utils/error";
import SkeletonLoader from "../../SkeletonLoader";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 8;
const NUM_COLUMNS = 2;
const CARD_WIDTH = (width - (NUM_COLUMNS + 1) * CARD_MARGIN) / NUM_COLUMNS;

const LoadingCard = () => {
  return (
    <View style={[styles.card, { gap: 8 }]}>
      <SkeletonLoader
        width={CARD_WIDTH}
        height={CARD_WIDTH}
        borderRadius={12}
      />
      <SkeletonLoader width={CARD_WIDTH} height={20} borderRadius={12} />
      <SkeletonLoader width={CARD_WIDTH} height={20} borderRadius={12} />
    </View>
  );
};

const PreviewCard = ({
  index,
  data,
  onPress,
  type,
  onLike,
  onShare,
  loading,
}) => {
  const [imageUri, setImageUri] = useState(DefaultImage.products); // Set default image initially

  useEffect(() => {
    const fetchImage = async () => {
      const uri = await checkImageAccessibility(
        data?.cover_image ||
          data?.image ||
          data?.category_details?.category_image
      );
      setImageUri(uri);
    };

    fetchImage();
  }, [data]);
  return loading ? (
    <LoadingCard />
  ) : (
    <Animated.View
      entering={FadeIn.delay(index * 50)}
      key={index + 1}
      style={[styles.card, { width: CARD_WIDTH }]}
    >
      <Pressable style={styles.imageContainer} onPress={onPress}>
        <Image
          resizeMode="cover"
          source={{
            uri: imageUri,
          }}
          style={styles.image}
        />
        {data?.product_offer ? (
          <>
            {/* Buy 1 Get 1 Free */}
            {data?.product_offer?.[0]?.offer_type === "Buy One Get One Free" ? (
              <LinearGradient
                colors={["#EF1F21", "#F17C08"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  alignSelf: "flex-end",
                  padding: 4,
                  borderBottomLeftRadius: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "left",
                      fontFamily: FONTS.BOLD,
                      fontSize: RFValue(9),
                      color: COLORS.WHITE,
                    }}
                  >
                    Buy{"\n"}Get{" "}
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONTS.BOLD,
                      color: COLORS.WHITE,
                      fontSize: RFValue(20),
                    }}
                  >
                    1
                  </Text>
                </View>
              </LinearGradient>
            ) : data?.product_offer?.[0]?.offer_type === "Free Item" ? (
              <LinearGradient
                colors={["#CA093D", "#CB007E"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  alignSelf: "flex-end",
                  padding: 4,
                  borderTopLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "left",
                      fontFamily: FONTS.BOLD,
                      fontSize: RFValue(9),
                      color: COLORS.WHITE,
                    }}
                  >
                    GET FREE ITEM
                  </Text>
                </View>
              </LinearGradient>
            ) : null}
          </>
        ) : null}
      </Pressable>
      {type === "wishlist" ? (
        <View style={styles.actionButtons}>
          <Pressable onPress={onLike} style={styles.actionButton}>
            {data?.wishlist_id ? (
              <Octicons name="heart-fill" size={16} color={"#EF1F21"} />
            ) : (
              <Octicons name="heart" size={16} color={"#9B9FA3"} />
            )}
          </Pressable>
          <Pressable onPress={onShare} style={styles.actionButton}>
            <Octicons name="share-android" size={16} color={"#000000"} />
          </Pressable>
        </View>
      ) : null}

      {data?.offer_percentage ? (
        <View style={styles.offerBadge}>
          <View style={styles.offerBadgeBackground} />
          <Text style={styles.offerText}>{`${data?.offer_percentage}%`}</Text>
        </View>
      ) : null}
      <View>
        {data?.title ? (
          <Text style={styles.title} numberOfLines={1}>
            {truncateText(capitalizeFirstLetter(data?.title), 18)}
          </Text>
        ) : null}
        {data?.brand_name ? (
          <Text style={styles.brandName} numberOfLines={1}>
            {data?.brand_name}
          </Text>
        ) : null}
        <View style={styles.priceSection}>
          <View style={styles.priceContainer}>
            {data?.selling_price ? (
              <Text style={styles.sellingPrice}>
                ₹ {data?.selling_price?.toLocaleString()}
              </Text>
            ) : null}
            {data?.records?.product_discount_price !==
            data?.records?.product_price ? (
              <Text style={styles.discountPrice} numberOfLines={1}>
                {data?.records?.product_discount_price?.toLocaleString() ||
                  data?.price?.toLocaleString()}
              </Text>
            ) : null}
          </View>
          {data?.review_rating > 0 ? (
            <View style={styles.ratingContainer}>
              <Fontisto name="star" color="#EBA83A" size={RFValue(16)} />
              <Text style={styles.ratingText}>
                {Math.floor(data?.review_rating.toFixed(1))}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Animated.View>
  );
};

PreviewCard.propTypes = {
  data: PropTypes.object,
  onPress: PropTypes.func,
  index: PropTypes.number,
  type: PropTypes.string,
  onLike: PropTypes.func,
  onShare: PropTypes.func,
  loading: PropTypes.bool,
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    margin: CARD_MARGIN / 2,
    overflow: "hidden",
  },
  imageContainer: {
    height: CARD_WIDTH,
    marginBottom: 4,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  actionButtons: {
    position: "absolute",
    zIndex: 1,
    right: 4,
    top: 4,
    alignItems: "center",
  },
  actionButton: {
    height: 34,
    width: 34,
    borderRadius: 17,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  offerBadge: {
    position: "absolute",
    zIndex: 1,
    left: 4,
    top: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  offerBadgeBackground: {
    height: 34,
    width: 34,
    borderRadius: 17,
    backgroundColor: "#BF4343",
  },
  offerText: {
    color: COLORS.WHITE,
    position: "absolute",
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(10),
    textAlign: "center",
  },
  title: {
    fontFamily: FONTS.MEDIUM,
    fontSize: RFValue(14),
    color: COLORS.LIGHT_BLACK,
    marginTop: 8,
  },
  brandName: {
    fontSize: RFValue(12),
    color: COLORS.GREY,
    fontFamily: FONTS.SEMI_BOLD,
  },
  priceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sellingPrice: {
    color: COLORS.BLACK,
    fontSize: RFValue(16),
    fontFamily: FONTS.SEMI_BOLD,
  },
  discountPrice: {
    fontSize: RFValue(12),
    color: COLORS.GREY,
    textDecorationLine: "line-through",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: RFValue(14),
    fontFamily: FONTS.SEMI_BOLD,
    color: COLORS.GREY,
  },
});

export default PreviewCard;
