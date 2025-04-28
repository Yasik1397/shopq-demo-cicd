import PropTypes from "prop-types";
import React, { useRef } from "react";
import { FlatList, SafeAreaView, ScrollView, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { useGetReviewbyProductIDQuery } from "../../../../Api/EndPoints/products";
import ReviewCard from "../../../../components/Cards/ReviewCard";
import PrimaryHeader from "../../../../components/Header";
import { COLORS, FONTS } from "../../../../constants/Theme";
import { RFValue } from "../../../../utils/responsive";
import FontAwesome from "react-native-vector-icons/FontAwesome";
//<--------------------------Components-------------------------->
//<--------------------------Assets------------------------------>
//<--------------------------Functions---------------------------->

export const CustomRatingStars = ({ rating }) => (
  <View style={{ flexDirection: "row", gap: 4 }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <FontAwesome
        key={star}
        name={star <= Math.floor(rating) ? "star" : "star-o"}
        size={18}
        color="#EBA83A"
      />
    ))}
  </View>
);

CustomRatingStars.propTypes = {
  rating: PropTypes.number,
};
const ReviewsScreen = ({ navigation, component, product_id, route }) => {
  const scrollViewRef = useRef(null);

  // Fetch review data
  const { data: reviewData } = useGetReviewbyProductIDQuery({
    product_id: route?.params?.product_id || product_id,
  });

  // Helper function for calculating rating percentages
  const calculateRatingPercentage = (rating) =>
    (reviewData?.records?.filter((item) => item?.rating === rating).length /
      (reviewData?.records?.length || 1)) *
    100;

  const ratings = [5, 4, 3, 2, 1].map((rating) => ({
    label: rating,
    fill: calculateRatingPercentage(rating),
  }));

  const totalRating = reviewData?.records?.reduce(
    (total, current) => total + current?.rating,
    0
  );
  const averageRating = reviewData?.records?.length
    ? (totalRating / reviewData?.records?.length).toFixed(1)
    : 0;

  const SliderWithNumber = ({ label, fill }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginVertical: 2,
      }}
    >
      <Text style={{ fontFamily: FONTS.MEDIUM, color: "#323232" }}>
        {label}
      </Text>
      <View
        style={{
          flex: 1,
          marginHorizontal: 10,
          backgroundColor: "#D9D9D9",
          borderRadius: 50,
          overflow: "hidden",
          height: 4,
        }}
      >
        <View
          style={{
            width: `${fill}%`,
            backgroundColor: "#EBA83A",
            height: "100%",
          }}
        />
      </View>
    </View>
  );

  SliderWithNumber.propTypes = {
    label: PropTypes.number.isRequired,
    fill: PropTypes.number.isRequired,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
      {component ? (
        <Text
          style={{
            fontSize: RFValue(16),
            color: "#060108",
            fontFamily: FONTS.SEMI_BOLD,
          }}
        >
          Reviews
        </Text>
      ) : (
        <PrimaryHeader
          onPress={() => navigation.goBack()}
          headerName="Reviews"
        />
      )}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            gap: 40,
            justifyContent: "space-between",
          }}
        >
          {/* Average Rating */}
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: RFValue(40),
                fontFamily: FONTS.SEMI_BOLD,
                color: "#060108",
              }}
            >
              {averageRating}
            </Text>
            <CustomRatingStars rating={parseFloat(averageRating)} />

            <Text style={{ fontSize: RFValue(12), fontFamily: FONTS.REGULAR }}>
              {reviewData?.records?.length} Reviews
            </Text>
          </View>

          {/* Rating Sliders */}
          <View style={{ flex: 1, justifyContent: "center" }}>
            {ratings.map((item) => (
              <SliderWithNumber
                key={item.label}
                label={item.label}
                fill={item.fill}
              />
            ))}
          </View>
        </View>

        {/* Divider */}
        <View
          style={{ height: 1, backgroundColor: "#D9D9D9", marginVertical: 10 }}
        />

        {/* Reviews List */}
        <FlatList
          data={reviewData?.records}
          keyExtractor={(index) => index.toString()}
          renderItem={({ item }) => (
            <ReviewCard
              date={item.created_at}
              reviewText={item.review}
              imageUri={item?.user_profile}
              label={item?.user_name}
              rating={item.rating}
            />
          )}
          ListFooterComponent={() => (
            <View
              style={{
                height: 1,
                backgroundColor: "#D9D9D9",
                marginVertical: 10,
              }}
            />
          )}
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 10 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

ReviewsScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
  component: PropTypes.bool,
  product_id: PropTypes.number,
};
export default React.memo(ReviewsScreen);
