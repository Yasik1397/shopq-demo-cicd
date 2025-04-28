//<--------------------------Libraries--------------------------->
import PropTypes from "prop-types";
import React from "react";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
//<--------------------------Components------------------------->
import ProductBanner from "../../Banners/productbanner";
import PageIndicators from "../Indicators";

const ProductCarousal = ({ data, onclick }) => {
  const animatedValue = useSharedValue(0);

  return (
    <View style={{ alignItems: "center" }}>
      {data?.length > 0 ? (
        <Carousel
          pagingEnabled
          width={data?.length === 1 ? wp("95%") : wp("100%") - 20}
          height={data?.length === 1 ? hp("48%") : hp("48%")}
          data={data || []}
          autoPlay={false}
          snapEnabled
          loop={data?.length > 1 ? true : false}
          onProgressChange={(_, pro) => {
            animatedValue.value = Math.round(pro);
          }}
          renderItem={({ item, index }) => {
            return <ProductBanner data={item} onPress={() => onclick(index)} />;
          }}
          autoplay={false}
        />
      ) : null}
      {data?.length > 1 ? (
        <View style={{ position: "absolute", alignSelf: "center", bottom: 15 }}>
          <PageIndicators animatedValue={animatedValue} carouselData={data} />
        </View>
      ) : null}
    </View>
  );
};
ProductCarousal.propTypes = {
  data: PropTypes.array.isRequired,
  onclick: PropTypes.any,
};
export default React.memo(ProductCarousal);
