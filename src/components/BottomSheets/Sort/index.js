//<--------------------------Libraries--------------------------->
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import RadioButton from "../../RadioButton";
//<--------------------------Components-------------------------->

//<--------------------------Assets------------------------------>
//Import assets for this file
import Checkbox from "../../../assets/Icons/checkbox_select.svg";
import Uncheckbox from "../../../assets/Icons/checkbox_unselect.svg";
import Checked from "../../../assets/Icons/checked_circle.svg";
import Unchecked from "../../../assets/Icons/unchecked_circle.svg";
import { COLORS, FONTS } from "../../../constants/Theme";

//<--------------------------Functions---------------------------->
import PrimaryButton from "../../Buttons/Primary";
import Secondary from "../../Buttons/Secondary";
import { RFValue } from "../../../utils/responsive";
//Import reusable functions here

const SortPopup = ({
  selected,
  setselected,
  options,
  title,
  sub_title,
  onPress_reset,
  type,
  onCancel,
}) => {
  const [filter, setFilter] = useState(selected);

  const toggleFilter = (item) => {
    if (filter?.includes(item)) {
      setFilter(
        filter?.includes(item)
          ? filter?.filter((i) => i !== item)
          : [...filter, item]
      );
    } else {
      setFilter([...filter, item]);
    }
  };
  return (
    <View>
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              fontSize: RFValue(16),
              fontFamily: FONTS.BOLD,
              color: COLORS.BLACK,
            }}
          >
            {title}
          </Text>
          <TouchableOpacity onPress={onPress_reset}>
            <Text
              style={{
                color: COLORS.RED,
                fontSize: RFValue(16),
                fontFamily: FONTS.BOLD,
              }}
            >
              {sub_title}
            </Text>
          </TouchableOpacity>
        </View>
        {options?.map((item) => (
          <View key={item} style={{ marginTop: 16 }}>
            {type === "orders" ? (
              <RadioButton
                source={filter?.includes(item) ? <Checkbox /> : <Uncheckbox />}
                onPress={() => toggleFilter(item)}
                label={item}
              />
            ) : (
              <RadioButton
                source={selected == item ? <Checked /> : <Unchecked />}
                onPress={() => setselected(item)}
                label={item}
              />
            )}
          </View>
        ))}
      </View>
      {type === "orders" ? (
        <View style={{ padding: 16, flexDirection: "row", gap: 10 }}>
          <PrimaryButton
            title="Cancel"
            backgroundColor={COLORS.WHITE}
            textColor={COLORS.BLACK}
            otherstyles={{ flex: 1, borderWidth: 1, paddingVertical: 12 }}
            onPress={onCancel}
          />
          <PrimaryButton
            onPress={() => {
              setselected(filter);
              onCancel();
            }}
            title="Apply"
            otherstyles={{ flex: 1, paddingVertical: 12  }}
          />
        </View>
      ) : null}
    </View>
  );
};
SortPopup.propTypes = {
  selected: PropTypes.any,
  setselected: PropTypes.any,
  options: PropTypes.any,
  title: PropTypes.any,
  sub_title: PropTypes.any,
  onPress_reset: PropTypes.any,
  type: PropTypes.any,
  onCancel: PropTypes.func,
};
export default React.memo(SortPopup);
