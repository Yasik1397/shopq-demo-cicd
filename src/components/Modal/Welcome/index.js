import PropTypes from "prop-types";
import React from "react";
import { Modal, ScrollView, Text, View } from "react-native";
import WelcomeIcon from "../../../assets/Icons/welcome.svg";
import { FONTS } from "../../../constants/Theme";
import PrimaryButton from "../../Buttons/Primary";
import { RFValue } from "../../../utils/responsive";
const WelcomeModal = ({ welcomemodal, onPress }) => {
  return (
    <Modal animationType="fade" style={{ flex: 1 }} visible={welcomemodal}>
      <View style={{ flex: 1, padding: 16, paddingBottom: 32 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
              gap: 32,
            }}
          >
            <Text
              style={{
                fontSize: RFValue(22),
                color: "#000",
                fontFamily: FONTS.BOLD,
                textAlign: "center",
              }}
            >
              Welcome Back!
            </Text>
            <WelcomeIcon />
            <Text
              style={{
                fontSize: RFValue(14),
                fontFamily: FONTS.REGULAR,
                color: "#A49EA5",
                textAlign: "center",
              }}
            >
              We’re thrilled to have you back! Your account is fully restored,
              and you can now access all your data and features as before.{" "}
              {"\n"}
              {"\n"} Let’s pick up right where you left off! 😊{" "}
            </Text>
          </View>
        </ScrollView>
        <PrimaryButton title="Go Shopping" onPress={onPress} />
      </View>
    </Modal>
  );
};

WelcomeModal.propTypes = {
  welcomemodal: PropTypes.bool,
  onPress: PropTypes.func,
};

export default React.memo(WelcomeModal);
