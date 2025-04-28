import React from "react";
import { View, Text } from "react-native";
import { COLORS, FONTS } from "../../../constants/Theme";
import LogoffIcon from "../../../assets/Icons/logoff.svg";

import PrimaryButton from "../../Buttons/Primary";
import PropTypes from "prop-types";
import { RFValue } from "../../../utils/responsive";

const LogoutPopup = ({ onCancel, onSubmit }) => {
  return (
    <View style={{ padding: 16, gap: 16 }}>
      <LogoffIcon alignSelf="center" />
      <Text
        style={{
          textAlign: "center",
          fontFamily: FONTS.SEMI_BOLD,
          fontSize: RFValue(16),
          color: "#061018",
        }}
      >
        Logout Confirmation ?
      </Text>
      <Text
        style={{
          textAlign: "center",
          fontFamily: FONTS.REGULAR,
          fontSize: RFValue(14),
          color: "#757A7E",
        }}
      >
        Are you sure you want to log out? You can return {"\n"}anytime, and your
        saved items will still be here.
      </Text>
      <View style={{ flexDirection: "row", gap: 13, marginTop: 20 }}>
        <PrimaryButton
          textColor={COLORS.PRIMARY}
          backgroundColor={COLORS.WHITE}
          otherstyles={{
            flex: 1,
            paddingVertical: RFValue(12),
            borderWidth: 1,
            borderColor: COLORS.PRIMARY,
          }}
          onPress={onCancel}
          title="Cancel"
        />
        <PrimaryButton
          textColor={COLORS.WHITE}
          backgroundColor={COLORS.PRIMARY}
          otherstyles={{ flex: 1, paddingVertical: RFValue(12) }}
          onPress={onSubmit}
          title={"Yes, Logout"}
        />
      </View>
    </View>
  );
};

LogoutPopup.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default React.memo(LogoutPopup);
