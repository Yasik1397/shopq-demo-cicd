import PropTypes from "prop-types";
import React from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { COLORS, FONTS } from "../../../../constants/Theme";
import { RFValue } from "../../../../utils/responsive";

const { width, height } = Dimensions.get("window");

const ShopNow = ({ onPress }) => {
  return (
    <Pressable
      style={{
        backgroundColor: COLORS.WHITE,
        borderRadius: 12,
        paddingHorizontal: 16,
        alignSelf: "flex-start",
        paddingVertical: 8,
      }}
      onPress={onPress}
    >
      <Text
        style={{
          fontFamily: FONTS.BOLD,
          color: COLORS.BLACK,
          fontSize: RFValue(14),
          includeFontPadding: false,
        }}
      >
        Shop Now
      </Text>
    </Pressable>
  );
};

ShopNow.propTypes = {
  onPress: PropTypes.func,
};

const GridTemplate = ({ navigation, data }) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.WHITE,
      }}
    >
      {/* Top Row: Rectangle */}
      <FastImage
        resizeMode="cover"
        source={{
          uri: data?.section_1?.image,
        }}
        style={{
          alignSelf: "center",
          width: width * 0.9,
          height: height * 0.5,
          borderRadius: 16,
          marginBottom: 16,
        }}
      />
      <View style={{ position: "absolute", top: 10, left: 20 }}>
        <Text
          style={{
            fontFamily: FONTS.REGULAR,
            color: COLORS.BLACK,
            fontSize: RFValue(14),
          }}
        >
          {data?.section_1?.child_category_details?.category_name}
        </Text>
        <Text
          style={{
            fontFamily: FONTS.BOLD,
            color: COLORS.BLACK,
            fontSize: RFValue(30),
          }}
        >
          {data?.section_1?.title}
        </Text>
        <ShopNow
          onPress={() =>
            navigation.navigate("ProductList", {
              category: data?.section_1?.child_category_details?.category_name,
              id: data?.section_1?.child_category_details?.id,
            })
          }
        />
      </View>

      {/* Second Row: Two Squares */}
      <View
        style={{
          alignSelf: "center",
          marginBottom: 16,
        }}
      >
        {/* First Square */}

        <FastImage
          resizeMode="cover"
          source={{
            uri: data?.section_3?.image,
          }}
          style={{
            width: width * 0.9,
            height: width * 0.96,
            borderRadius: 16,
          }}
        />
        <View style={{ position: "absolute", top: 10, left: 20 }}>
          <Text
            style={{
              fontFamily: FONTS.REGULAR,
              color: COLORS.BLACK,
              fontSize: RFValue(14),
            }}
          >
            {data?.section_3?.child_category_details?.category_name}
          </Text>
          <Text
            style={{
              fontFamily: FONTS.BOLD,
              color: COLORS.BLACK,
              fontSize: RFValue(30),
            }}
          >
            {data?.section_3?.title}
          </Text>
          <ShopNow
            onPress={() => {
              navigation.navigate("ProductList", {
                category:
                  data?.section_3?.child_category_details?.category_name,
                id: data?.section_3?.child_category_details?.id,
              });
            }}
          />
        </View>
      </View>
      {/* Second Square */}
      <View
        style={{
          alignSelf: "center",
          marginBottom: 16,
        }}
      >
        <FastImage
          resizeMode="cover"
          source={{
            uri: data?.section_2?.image,
          }}
          style={{
            alignSelf: "center",
            width: width * 0.9,
            height: width * 0.9,
            borderRadius: 16,
          }}
        />
        <View style={{ position: "absolute", top: 10, left: 20 }}>
          <Text
            style={{
              fontFamily: FONTS.REGULAR,
              color: COLORS.BLACK,
              fontSize: RFValue(14),
            }}
          >
            {data?.section_2?.child_category_details?.category_name}
          </Text>
          <Text
            style={{
              fontFamily: FONTS.BOLD,
              color: COLORS.BLACK,
              fontSize: RFValue(30),
            }}
          >
            {data?.section_2?.title}
          </Text>
          <ShopNow
            onPress={() => {
              navigation.navigate("ProductList", {
                category:
                  data?.section_2?.child_category_details?.category_name,
                id: data?.section_2?.child_category_details?.id,
              });
            }}
          />
        </View>
      </View>
      {/* Third Row: Rectangle */}
      <View
        style={{
          alignSelf: "center",
          marginBottom: 16,
        }}
      >
        <FastImage
          resizeMode="cover"
          source={{
            uri: data?.section_4?.image,
          }}
          style={{
            width: width * 0.9,
            height: height * 0.17,
            borderRadius: 16,
          }}
        />
        <View style={{ position: "absolute", zIndex: 10, top: 10, left: 20 }}>
          <Text
            style={{
              fontFamily: FONTS.REGULAR,
              color: COLORS.BLACK,
              fontSize: RFValue(14),
            }}
          >
            {data?.section_4?.child_category_details?.category_name}
          </Text>
          <Text
            style={{
              fontFamily: FONTS.BOLD,
              color: COLORS.BLACK,
              fontSize: RFValue(30),
            }}
          >
            {data?.section_4?.title}
          </Text>
          <ShopNow
            onPress={() => {
              navigation.navigate("ProductList", {
                category:
                  data?.section_4?.child_category_details?.category_name,
                id: data?.section_4?.child_category_details?.id,
              });
            }}
          />
        </View>
      </View>
    </View>
  );
};

GridTemplate.propTypes = {
  data: PropTypes.object,
  navigation: PropTypes.object,
};
export default GridTemplate;
