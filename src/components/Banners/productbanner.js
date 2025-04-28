//<--------------------------Libraries--------------------------->
import PropTypes from "prop-types";
import React from "react";
import { Pressable } from "react-native";
import FastImage from "react-native-fast-image";
//<--------------------------Assets------------------------------>
import { DefaultImage } from "../../constants/IMAGES";

const ProductBanner = ({ data, onPress }) => {
  //Hooks declarions
  //Declare state variables
  //Declare functions here

  return (
    <Pressable
      style={{
        alignSelf: "center",
        height: "100%",
        width: "98%",
        borderRadius: 12,
      }}
      onPress={onPress}
    >
      <FastImage
        defaultSource={DefaultImage.products}
        style={{ height: "100%", width: "100%", borderRadius: 12 }}
        source={{
          uri: data,
          priority: FastImage.priority.high,
          cache: "immutable",
        }}
        resizeMode={FastImage.resizeMode?.cover}
      />
    </Pressable>
  );
};
ProductBanner.propTypes = {
  data: PropTypes.object.isRequired,
  onPress: PropTypes.func,
};
export default React.memo(ProductBanner);
