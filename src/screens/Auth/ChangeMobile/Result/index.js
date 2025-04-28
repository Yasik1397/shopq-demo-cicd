import PropTypes from "prop-types";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import ChangeTick from "../../../../assets/Icons/tickinmobile.svg";
import PrimaryButton from "../../components/Buttons/Primary";
import { FONTS } from "../../constants/Theme";
import { RFValue } from "../../../../utils/responsive";

const ChangeMobileResult = ({ navigation }) => {
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      <ScrollView style={{ flexGrow: 1 }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text
              style={{
                fontSize: RFValue(22),
                fontFamily: FONTS.SEMI_BOLD,
                color: "#0E1827",
              }}
            >
              Mobile number changed
            </Text>
            <ChangeTick />
            <Text
              style={{
                fontSize: RFValue(14),
                fontWeight: "400",
                fontFamily: FONTS.SEMI_BOLD,
                color: "#757A7E",
              }}
            >
              Your mobile number has been successfully
            </Text>
            <Text
              style={{
                fontSize: RFValue(14),
                fontFamily: FONTS.SEMI_BOLD,
                color: "#757A7E",
              }}
            >
              Changed.
            </Text>
          </View>
        </View>
      </ScrollView>
      <PrimaryButton
        isLoading={loader}
        title={"Go Shopping"}
        onPress={() => navigation.navigate("Home")}
      />
    </View>
  );
};

ChangeMobileResult.propTypes = {
  navigation: PropTypes.any,
};
export default ChangeMobileResult;
