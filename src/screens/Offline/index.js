import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import NetworkFailure from "../../assets/Generals/no_internet.svg";

import { COLORS, FONTS } from "../../constants/Theme";
import PrimaryButton from "../../components/Buttons/Primary";
import { RFValue } from "../../utils/responsive";
const OfflineScreen = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.WHITE, padding: 16 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View>
            <NetworkFailure />
          </View>
          <View>
            <Text style={[styles.headerText, { alignSelf: "center" }]}>
              Something’s not right
            </Text>
            <Text style={[styles.text, { marginTop: 20, alignSelf: "center" }]}>
              Please check your internet connection
            </Text>
          </View>
        </View>
      </ScrollView>
      <PrimaryButton
        textColor={COLORS.PRIMARY}
        backgroundColor={COLORS.WHITE}
        otherstyles={{
          borderWidth: 1,
          borderColor: "#0E1827",
          paddingVertical: 12,
          borderRadius: 12,
        }}
        title={"Retry"}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
  },
  headerText: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: RFValue(24),
    textAlign: "center",
    color: "#061018",
  },
  text: {
    fontSize: RFValue(16),
    color: "#A3A6A8",
    textAlign: "center",
    fontFamily: FONTS.MEDIUM,
  },
});
export default React.memo(OfflineScreen);
