import PropTypes from "prop-types";
import React, { useState } from "react";
import {
    LayoutAnimation,
    SafeAreaView,
    SectionList,
    Text,
    View,
} from "react-native";
import { useSelector } from "react-redux";
import Accordion from "../../../../../components/Accordion";
import PrimaryHeader from "../../../../../components/Header";
import { COLORS, FONTS } from "../../../../../constants/Theme";
import { RFValue } from "../../../../../utils/responsive";

const FAQs = ({ navigation }) => {
  const data = useSelector((state) => state?.FAQdata?.data);
  const [openCardId, setOpenCardId] = useState(null);

  const transformData = (records) => {
    return records?.map((record) => ({
      title: record?.title || "Untitled",
      data: record?.faq_questions?.map((question) => ({
        id: question.id,
        question: question.question,
        content: question.content,
      })),
    }));
  };

  const sections = transformData(data?.records);

  const toggleAccordion = (id) => {
    LayoutAnimation.linear();
    setOpenCardId(openCardId === id ? null : id);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
      <PrimaryHeader headerName="FAQs" onPress={() => navigation.goBack()} />
      <SectionList
        sections={sections || []}
        renderSectionHeader={({ section }) => (
          <Text
            style={{
              fontSize: RFValue(14),
              color: "#8B8F93",
              fontFamily: FONTS.SEMI_BOLD,
            }}
          >
            {section.title}
          </Text>
        )}
        SectionSeparatorComponent={() => <View style={{ height: 12 }} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <Accordion
            open={openCardId === item.id}
            onPress={() => toggleAccordion(item.id)}
            data={item}
          />
        )}
      />
    </SafeAreaView>
  );
};

FAQs.propTypes = {
  navigation: PropTypes.object,
};
export default FAQs;
