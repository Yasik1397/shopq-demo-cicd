
//<--------------------------Libraries--------------------------->
// import MultiSlider from "@ptomasroos/react-native-multi-slider";
import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-actions-sheet";
import Tick from "../../../assets/Icons/checkbox_select.svg";
import UnTick from "../../../assets/Icons/checkbox_unselect.svg";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

//<--------------------------Components-------------------------->

//<--------------------------Assets------------------------------>
import SelectIcon from "../../../assets/Icons/select_icon.svg";
import RatingIcon from "../../../assets/Icons/star.svg";
import Fontisto from "react-native-vector-icons/Fontisto";

//<--------------------------Functions---------------------------->

import { useFilterProductsQuery } from "../../../Api/EndPoints/products";
import { COLORS, FONTS } from "../../../constants/Theme";
import { RFValue } from "../../../utils/responsive";
import { capitalizeFirstLetter } from "../../../utils/TextFormat";
import PrimaryButton from "../../Buttons/Primary";
import MultiSlider from "../../MultiSlider";

const ratings = [5, 4, 3, 2, 1];
const discounts = [10, 20, 30, 40];
const { width } = Dimensions.get("window");

const FilterComponent = ({
  Ref,
  category,
  ApplyFilter,
  loading,
  setCounts,
  brands,
  AttributeData,
}) =>
  // ref
  {
    //Hooks declarions
    const [values, setValues] = useState([0, 10000]);
    const [selectedratings, setselectedratings] = useState([]);
    const [selecteddiscount, setselecteddiscount] = useState([]);
    const [selectedbrands, setselectedbrands] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState([]);
    const areAllEmpty =
      selectedratings.length === 0 &&
      selecteddiscount.length === 0 &&
      selectedbrands.length === 0 &&
      selectedAttributes.length === 0 &&
      values[0] === 0 &&
      values[1] === 10000;

    const parentVariantIds = new Set();
    const childVariantIds = new Set();
    selectedAttributes.forEach((item) => {
      parentVariantIds.add(item.id);
      childVariantIds.add(item.value_id);
    });
    const parentVariantIdsString = Array.from(parentVariantIds).join(",");
    const childVariantIdsString = Array.from(childVariantIds).join(",");
    const { data, refetch } = useFilterProductsQuery({
      min_off_percentage: selecteddiscount.length
        ? Math.min(...selecteddiscount)
        : 0,
      max_off_percentage: selecteddiscount.length
        ? Math.max(...selecteddiscount)
        : 100,
      category_id: category,
      max_price: values[1],
      min_price: values[0],
      rating: selectedratings?.length
        ? selectedratings.map((i) => i).join(",")
        : "",
      brand_ids: selectedbrands?.length
        ? selectedbrands.map((i) => i).join(",")
        : "",
      parent_variant_ids: parentVariantIdsString,
      child_variant_ids: childVariantIdsString,
    });

    const onSelectAttribute = (item, itemValue) => {
      const sItem = {
        id: item,
        value_id: itemValue,
      };
      const selectedIndex = selectedAttributes?.findIndex(
        (SelectedIndex) =>
          SelectedIndex.id === item && SelectedIndex.value_id === itemValue
      );
      if (selectedIndex === -1) {
        setSelectedAttributes([...selectedAttributes, sItem]);
        refetch();
      } else {
        setSelectedAttributes((prevItems) => {
          const newSelectedItems = prevItems.filter(
            (selectedItem) =>
              selectedItem?.id !== item || selectedItem?.value_id !== itemValue
          );
          return newSelectedItems;
        });
        refetch();
      }
    };

    const onSelectRating = (data) => {
      // setselectedratings([data]);
      if (selectedratings?.find((size) => size == data)) {
        const filtered = selectedratings.filter((size) => size != data);
        setselectedratings(filtered);
      } else {
        setselectedratings([...selectedratings, data]);
      }
      refetch();
    };
    const onSelectDiscount = (data) => {
      // setselecteddiscount([data]);
      if (selecteddiscount?.find((size) => size == data)) {
        const filtered = selecteddiscount.filter((size) => size != data);
        setselecteddiscount(filtered);
      } else {
        setselecteddiscount([...selecteddiscount, data]);
      }
      refetch();
    };
    const onValuesChange = (newValues) => {
      setValues(newValues);
      refetch();
    };
    const ResetFilters = () => {
      setselectedratings([]);
      setselecteddiscount([]);
      setValues([0, 10000]);
      // setselectedcolor([]);
      setSelectedAttributes([]);
      setselectedbrands([]);
    };

    const handlePress = (item) => {
      setselectedbrands((prev) => {
        if (prev?.includes(item.id)) {
          // If the item is already selected, remove it from the selectedbrands array
          return prev?.filter((brandId) => brandId !== item?.id);
        } else {
          // If the item is not selected, add it to the selectedbrands array
          return [...prev, item?.id];
        }
      });

      refetch();
    };
    // const isChecked = selectedbrands.includes(item?.id);
    return (
      <>
        <View style={{ padding: 24, paddingBottom: 0 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.SEMI_BOLD,
                color: COLORS.BLACK,
                fontSize: RFValue(14),
              }}
            >
              Filters
            </Text>
            <TouchableOpacity
              onPress={() => {
                ResetFilters(), ApplyFilter(0, 100, 10000, 0, "", "", "");
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.SEMI_BOLD,
                  color: COLORS.RED,
                  fontSize: RFValue(14),
                }}
              >
                Clear
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity activeOpacity={1}>
              {AttributeData?.records?.map((item) => {
                return (
                  <View key={item.id}>
                    <Text
                      style={{
                        fontFamily: FONTS.SEMI_BOLD,
                        color: COLORS.BLACK,
                        fontSize: RFValue(14),
                        marginVertical: 10,
                      }}
                    >
                      {capitalizeFirstLetter(item?.title)}
                    </Text>
                    <View
                      style={{
                        flexWrap: "wrap",
                        flexDirection: "row",
                        gap: 10,
                      }}
                    >
                      {item?.attribute_values?.map((value) => {
                        return (
                          <Pressable
                            onPress={() => {
                              onSelectAttribute(item.attribute_id, value.id);
                            }}
                            key={value?.id}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              height: 31,
                              borderRadius: 30,
                              borderColor: selectedAttributes.find(
                                (i) =>
                                  i?.value_id === value?.id &&
                                  i?.id === item?.attribute_id
                              )
                                ? "#0E1827"
                                : "#E8E8E8",
                              backgroundColor: selectedAttributes.find(
                                (i) =>
                                  i?.value_id === value?.id &&
                                  i?.id === item?.attribute_id
                              )
                                ? "#0E1827"
                                : "#FFFFFF",
                              borderWidth: 1,
                              paddingHorizontal: 16,
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              style={{
                                color: selectedAttributes.find(
                                  (i) =>
                                    i?.value_id === value?.id &&
                                    i?.id === item?.attribute_id
                                )
                                  ? COLORS.WHITE
                                  : COLORS.BLACK,
                                fontFamily: FONTS.SEMI_BOLD,
                                fontSize: RFValue(14),
                                textTransform: "capitalize",
                              }}
                            >
                              {value?.title}
                            </Text>
                            {selectedAttributes.find(
                              (i) =>
                                i?.value_id === value?.id &&
                                i?.id === item?.attribute_id
                            ) ? (
                              <SelectIcon style={{ marginLeft: 8 }} />
                            ) : null}
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
              <Text
                style={{
                  marginTop: 20,
                  marginBottom: 10,
                  fontSize: RFValue(14),
                  fontFamily: FONTS.SEMI_BOLD,
                  color: COLORS.BLACK,
                }}
              >
                Brands
              </Text>
              <View
                style={{
                  flexWrap: "wrap",
                  flexDirection: "row",
                  gap: 10,
                }}
              >
                {brands?.records?.map((item) => (
                  <Pressable
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      height: 31,
                      borderRadius: 30,
                      borderColor: "#E8E8E8",
                      backgroundColor: "#FFFFFF",
                      borderWidth: 1,
                      paddingHorizontal: 16,
                      justifyContent: "center",
                    }}
                    key={item.id}
                    onPress={() => {
                      handlePress(item);
                    }}
                  >
                    <Text
                      key={item.id}
                      style={{
                        fontFamily: FONTS.SEMI_BOLD,
                        color: COLORS.BLACK,
                        fontSize: RFValue(14),
                        textTransform: "capitalize",
                        includeFontPadding: false,
                      }}
                    >
                      {item.title}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text
                style={{
                  marginVertical: 10,
                  fontSize: RFValue(14),
                  fontFamily: FONTS.SEMI_BOLD,
                  color: COLORS.BLACK,
                }}
              >
                Price (&#x20B9;)
              </Text>
              <MultiSlider
                initialValues={[0, 10000]}
                onChange={(values) => {
                  onValuesChange(values);
                }}
                max={10000}
                min={0}
              />

              <FlatList
                scrollEnabled={false}
                ItemSeparatorComponent={() => (
                  <View style={{ height: 16 }}></View>
                )}
                ListHeaderComponent={() => (
                  <Text
                    style={{
                      marginVertical: 10,
                      fontFamily: FONTS.SEMI_BOLD,
                      color: COLORS.BLACK,
                    }}
                  >
                    Ratings
                  </Text>
                )}
                data={ratings}
                renderItem={({ item }) => {
                  return (
                    <Pressable
                      onPress={() => {
                        onSelectRating(item);
                      }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 10,
                        marginVertical: 5,
                      }}
                    >
                      {selectedratings.includes(item) ? (
                        <Tick height={20} width={20} />
                      ) : (
                        <UnTick height={20} width={20} />
                      )}
                      {item === 0 ? (
                        <Text
                          style={{
                            marginLeft: 12,
                            fontSize: RFValue(14),
                            fontFamily: FONTS.SEMI_BOLD,
                            color: COLORS.BLACK,
                          }}
                        >
                          None
                        </Text>
                      ) : (
                        <FlatList
                          scrollEnabled={false}
                          style={{ marginLeft: 12 }}
                          ItemSeparatorComponent={() => (
                            <View style={{ width: 7 }}></View>
                          )}
                          horizontal={true}
                          keyExtractor={(item) => item}
                          renderItem={() => (
                            <Fontisto
                              name="star"
                              color="#EBA83A"
                              size={RFValue(20)}
                            />
                          )}
                          data={Array.from(Array(item).keys())}
                        />
                      )}
                    </Pressable>
                  );
                }}
                keyExtractor={(item) => item}
              />
              <Text
                style={{
                  marginVertical: 10,
                  fontFamily: FONTS.SEMI_BOLD,
                  color: COLORS.BLACK,
                }}
              >
                Discount
              </Text>

              <FlatList
                scrollEnabled={false}
                ItemSeparatorComponent={() => (
                  <View style={{ height: 16 }}></View>
                )}
                data={discounts}
                renderItem={({ item }) => {
                  return (
                    <Pressable
                      onPress={() => {
                        onSelectDiscount(item);
                      }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 10,
                        marginVertical: 5,
                      }}
                    >
                      {selecteddiscount.includes(item) ? (
                        <Tick height={20} width={20} />
                      ) : (
                        <UnTick height={20} width={20} />
                      )}
                      <Text
                        style={{
                          marginLeft: 12,
                          fontFamily: FONTS.SEMI_BOLD,
                          color: COLORS.BLACK,
                        }}
                      >
                        {item == 0 ? "None" : `${item}% offer`}
                      </Text>
                    </Pressable>
                  );
                }}
                keyExtractor={(item) => item}
              />
            </TouchableOpacity>
          </ScrollView>
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            backgroundColor: "white",
            width: "100%",
            paddingVertical: 14,
            paddingHorizontal: 16,
          }}
        >
          <PrimaryButton
            isLoading={loading}
            otherstyles={{ flex: 1 }}
            title={
              areAllEmpty
                ? "Show all results"
                : data?.total_records > 0
                ? `Show ${data?.total_records} results`
                : "No products found"
            }
            onPress={() => {
              ApplyFilter(
                selecteddiscount?.length ? Math.min(...selecteddiscount) : 0,
                selecteddiscount?.length ? Math.max(...selecteddiscount) : 100,
                values[1],
                values[0],
                selectedratings?.length
                  ? selectedratings.map((i) => i).join(",")
                  : "",
                selectedbrands?.length
                  ? selectedbrands.map((i) => i).join(",")
                  : "",
                parentVariantIdsString,
                childVariantIdsString
              );
              Ref?.current?.hide();
              setCounts(selectedAttributes?.length);
            }}
          />
        </View>
      </>
    );
  };

FilterComponent.propTypes = {
  Ref: PropTypes.func,
  options: PropTypes.object,
  title: PropTypes.string,
  category: PropTypes.string,
  category_id: PropTypes.string,
  sort: PropTypes.string,
  ApplyFilter: PropTypes.func,
  loading: PropTypes.bool,
  setCounts: PropTypes.func,
  AttributeData: PropTypes.any,
  brands: PropTypes.any,
};
export default React.memo(FilterComponent);
