//<--------------------------Libraries--------------------------->
import PropTypes from "prop-types";
import React from "react";
import { FlatList, SafeAreaView } from "react-native";
import PrimaryHeader from "../../../../components/Header";
import { COLORS } from "../../../../constants/Theme";

const TermsandPolicies = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
      <PrimaryHeader
        onPress={() => navigation.goBack()}
        headerName="Terms & Policies"
      />
      <FlatList />
    </SafeAreaView>
  );
};
TermsandPolicies.propTypes = {
  navigation: PropTypes.object,
};
export default React.memo(TermsandPolicies);
