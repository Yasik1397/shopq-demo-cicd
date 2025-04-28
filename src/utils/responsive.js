import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

// screen size
const screenHeight = hp("100%");
const screenWidth = wp("100%");



// responsive screen size
export const DEVICE_TYPE = {
  isSmallMobile: screenHeight < 640,
  isMobile: screenWidth < 600,
  isTablet: screenWidth >= 600 && screenWidth < 900,
  isLargeTablet: screenWidth >= 900,
};

export const RFValue = (size) => {
    if (DEVICE_TYPE?.isSmallMobile) {
    return size - 2;
  } else if (DEVICE_TYPE?.isTablet) {
    return size + 4;
  } else if (DEVICE_TYPE?.isLargeTablet) {
      return size + 6;
  }``
  return size;
};

export const isTablet = DEVICE_TYPE.isTablet || DEVICE_TYPE.isLargeTablet;