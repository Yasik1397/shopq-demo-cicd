//<--------------------------Libraries--------------------------->
import PropTypes from "prop-types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
//<--------------------------Constants------------------------------>
//Import constants for this file
import { COLORS, FONTS } from "../../../../constants/Theme";
import { RFValue } from "../../../../utils/responsive";

const PhotoPopup = ({ onCameraPress, onGalleryPress }) => {
  return (
    <View style={{ padding: 16 }}>
      <Text style={styles.header}>Add your profile photo</Text>
      <View style={styles.cntr}>
        <View style={{ alignItems: "center",  }}>
          <Entypo
            name="camera"
            size={50}
            color={COLORS.BLACK}
            onPress={onCameraPress}
          />
          <Text style={styles.text}>Camera</Text>
        </View>
        <View
          style={{ height: 40, width: 1, backgroundColor: COLORS.LIGHT_GREY }}
        />
        <View style={{ alignItems: "center" }}>
          <MaterialIcons
            name="photo"
            size={50}
            color={COLORS.BLACK}
            onPress={onGalleryPress}
          />
          <Text style={styles.text}>Gallery</Text>
        </View>
      </View>
    </View>
  );
};
PhotoPopup.propTypes = {
  onCameraPress: PropTypes.func,
  onGalleryPress: PropTypes.func,
};

const styles = StyleSheet.create({
  cntr: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 24,
  },
  header: {
    color: "#031227",
    fontFamily: FONTS.MEDIUM,
    fontSize: RFValue(16),
    textAlign: "center",
  },
  text: {
    color: COLORS.BLACK,
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: RFValue(14),
    lineHeight: 22,
  },
});
export default React.memo(PhotoPopup);
