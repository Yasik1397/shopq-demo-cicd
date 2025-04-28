import PropTypes from "prop-types";
import React from "react";
import { FlatList, SafeAreaView, View } from "react-native";
import ListCard from "../../../../../components/Cards/ListCard";
import PrimaryHeader from "../../../../../components/Header";
import { COLORS } from "../../../../../constants/Theme";
import { useDispatch } from "react-redux";
import { getTerms } from "../../../../../redux/actions/termSlice";

const TermsData = [
  {
    id: 1,
    name: "Privacy Policy",
  },
  {
    id: 2,
    name: "Shipping Policy",
  },
  {
    id: 3,
    name: "Cancellation Policy",
  },
  {
    id: 4,
    name: "Terms and conditions",
  },
];

const getParams = (name) => {
  switch (name) {
    case "Shipping Policy":
      return "contacts";
    case "Terms and conditions":
      return "terms_and_conditions";
    case "Cancellation Policy":
      return "cancellation_policy";
    case "Privacy Policy":
      return "privacy_policy";
  }
};

const Terms = ({ navigation }) => {
  const dispatch = useDispatch();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
      <PrimaryHeader
        onPress={() => navigation.goBack()}
        headerName="Terms & Policies"
      />
      <FlatList
        ItemSeparatorComponent={() => (
          <View
            style={{
              marginVertical: 16,
              height: 1,
              backgroundColor: "#E8E8E8",
            }}
          />
        )}
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        data={TermsData}
        renderItem={({ item, index }) => (
          <ListCard
            onPress={() => {
              dispatch(getTerms(getParams(item.name))).then(() => {
                navigation.navigate("TermsDetails", {
                  title: item.name,
                });
              });
            }}
            index={index}
            Optionname={item.name}
          />
        )}
      />
    </SafeAreaView>
  );
};

Terms.propTypes = {
  navigation: PropTypes.object,
};
export default React.memo(Terms);
