import React from "react";
import PropTypes from "prop-types";
import { Text, View, SafeAreaView } from "react-native";

import Copyicon from "react-native-vector-icons/Feather";

import Failureicon from "../../../../../assets/Icons/failureinfo.svg";

import Clipboard from "@react-native-clipboard/clipboard";

import { FONTS } from "../../../../../constants/Theme";

import PrimaryHeader from "../../../../../components/Header";
import PrimaryButton from "../../../../../components/Buttons/Primary";
import { RFValue } from "../../../../../utils/responsive";

const PaymentFailure = ({ navigation }) => {
  const copyToClipboard = (value) => {
    Clipboard.setString(value);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <PrimaryHeader
        onPress={() => navigation.navigate('Cart')}
        headerName={"Order Summary"}
      />
      <View style={{ flex: 1, padding: 16 }}>
        <View
          style={{ justifyContent: "center", alignItems: "center", gap: 8 }}
        >
          <Failureicon />
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text
              style={{
                fontFamily: FONTS.SEMI_BOLD,
                color: "#061018",
                fontSize: RFValue(20),
                textAlign: "center",
              }}
            >
              Your Payment was {"\n"} Unsuccessful !
            </Text>
          </View>
          <Text
            style={{
              fontFamily: FONTS.REGULAR,
              color: "#09141E99",
              fontSize: RFValue(14),
            }}
          >
            Oops! Something went wrong
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#F5F5F6",
            padding: 12,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              fontSize: RFValue(14),
              color: "#757A7E",
              fontFamily: FONTS.REGULAR,
            }}
          >
            We regret to inform you that your payment could
            <Text
              style={{
                color: "#061018",
                fontFamily: FONTS.SEMI_BOLD,
              }}
            >
              {" "}
              not be processed.
            </Text>{" "}
            Please review the information below for more details and try again.
          </Text>
        </View>
        <View style={{ margin: 10, marginTop: 0, gap: 10 }}>
          <Text
            style={{
              fontSize: RFValue(14),
              color: "#061018",
              fontFamily: FONTS.SEMI_BOLD,
            }}
          >
            Payment details
          </Text>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", gap: 8 }}>
              <View style={{ gap: 2, flexDirection: "column" }}>
                <Text
                  style={{
                    fontSize: RFValue(14),
                    fontWeight: 600,
                    color: "#061018",
                    fontFamily: FONTS.SEMI_BOLD,
                  }}
                >
                  Online Payment
                </Text>
                <Text
                  style={{
                    fontSize: RFValue(12),
                    fontWeight: 500,
                    color: "#A3A6A8",
                    fontFamily: "Manrope-Medium",
                  }}
                >
                  Ref : 1455454654561
                </Text>
              </View>
            </View>
            <View>
              <Copyicon
                onPress={() => {
                  copyToClipboard();
                }}
              />
            </View>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", gap: 8 }}>
              <View style={{ gap: 2, flexDirection: "column" }}>
                <Text
                  style={{
                    fontSize: RFValue(14),
                    color: "#061018",
                    fontFamily: FONTS.SEMI_BOLD,
                  }}
                >
                  Order ID
                </Text>
                <Text
                  style={{
                    fontSize: RFValue(12),
                    fontWeight: 500,
                    color: "#A3A6A8",
                    fontFamily: FONTS.MEDIUM,
                  }}
                >
                  #2545154245
                </Text>
              </View>
            </View>
            <View>
              <Copyicon
                name="copy"
                size={RFValue(20)}
                color={"#061018"}
                onPress={() => {
                  copyToClipboard();
                }}
              />
            </View>
          </View>
        </View>
      </View>

      <View style={{ paddingLeft: 8, paddingRight: 8 }}>
        <PrimaryButton title={"Try again"} variant={"primaryButton"} />
        <View style={{ marginTop: 19, alignItems: "center", marginBottom: 25 }}>
          <Text
            style={{
              fontSize: RFValue(12),
              color: "#09141E",
              fontFamily: FONTS.REGULAR,
            }}
          >
            For any queries regarding this orders, please reach us at
          </Text>
          <Text
            style={{
              fontSize: RFValue(12),
              color: "#09141E",
              fontFamily: FONTS.MEDIUM,
            }}
            onPress={() => copyToClipboard("info@shopq.site", "text")}
          >
            info@shopq.site
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
PaymentFailure.propTypes = {
  navigation: PropTypes.any,
};

export default React.memo(PaymentFailure);
