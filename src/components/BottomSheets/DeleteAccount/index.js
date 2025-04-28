import React from "react";
import { View, Text } from "react-native";
import { COLORS, FONTS } from "../../../constants/Theme";
import TrashIcon from "../../../assets/Icons/trash_red.svg";

import PropTypes from "prop-types";
import { RFValue } from "../../../utils/responsive";
import Secondary from "../../Buttons/Secondary";

const DeleteAccountPopup = ({ onCancel, onSubmit }) => {
  return (
    <View style={{ padding: 16, gap: 16 }}>
      <TrashIcon alignSelf="center" />
      <Text
        style={{
          textAlign: "center",
          fontFamily: FONTS.SEMI_BOLD,
          fontSize: RFValue(16),
          color: "#061018",
        }}
      >
        Delete your account?
      </Text>
      <Text
        style={{
          textAlign: "center",
          fontFamily: FONTS.REGULAR,
          fontSize: RFValue(14),
          color: "#757A7E",
        }}
      >
        This action cannot be undone. If you proceed, all your account data will
        be permanently removed within 24 hours.
      </Text>
      <Text
        style={{
          fontFamily: FONTS.REGULAR,
          fontSize: RFValue(14),
          color: "#757A7E",
        }}
      >
        <Text style={{ fontFamily: FONTS.BOLD, color: COLORS.PRIMARY }}>
          Note:
        </Text>{" "}
        If you want to retrieve your account, you can login to your account
        within 24 hours to cancel your Deletion.
      </Text>

      <Secondary
        onPress={onCancel}
        title1={"Delete account"}
        textColor1={COLORS.RED}
        backgroundColor1={COLORS.WHITE}
        title2={"No, Keep account"}
        otherstyles1={{
          flex: 1,
          paddingVertical: 12,
          paddingHorizontal: 8,
          borderWidth: 1,
          borderColor: COLORS.RED,
          borderRadius: 12,
        }}
        otherstyles2={{
          flex: 1,
          paddingVertical: 12,
          borderRadius: 12,
          paddingHorizontal: 8,
        }}
        onPress1={onSubmit}
        onPress2={onCancel}
      />
    </View>
  );
};

DeleteAccountPopup.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default React.memo(DeleteAccountPopup);
