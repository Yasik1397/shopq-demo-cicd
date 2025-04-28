import PropTypes from "prop-types";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-actions-sheet";
import { COLORS, FONTS } from "../../../constants/Theme";
import { RFValue } from "../../../utils/responsive";

const CouponSheet = ({ data, onApply }) => {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={data || []}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
      }}
      ListHeaderComponentStyle={{ marginBottom: 16 }}
      ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
      renderItem={({ item }) => (
        <View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontSize: RFValue(16),
                fontFamily: FONTS.MEDIUM,
                color: COLORS.BLACK,
              }}
            >
              {item?.coupon_code}
            </Text>
            <TouchableOpacity onPress={() => onApply(item)}>
              <Text
                style={{
                  fontSize: RFValue(16),
                  fontFamily: FONTS.MEDIUM,
                  color: COLORS.RED,
                }}
              >
                Apply
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: RFValue(14),
              fontFamily: FONTS.REGULAR,
              color: COLORS.BLACK,
            }}
          >
            {item?.coupon_description}
          </Text>
        </View>
      )}
      ListHeaderComponent={() => (
        <Text
          style={{
            fontSize: RFValue(18),
            fontFamily: FONTS.MEDIUM,
            color: COLORS.BLACK,
          }}
        >
          Coupons
        </Text>
      )}
    />
  );
};

CouponSheet.propTypes = {
  data: PropTypes.array,
  onApply: PropTypes.func,
};
export default CouponSheet;
