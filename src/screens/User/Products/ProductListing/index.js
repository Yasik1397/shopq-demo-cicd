//<--------------------------Libraries--------------------------->
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import ActionSheet from "react-native-actions-sheet";
//<--------------------------Components-------------------------->
import PreviewCard from "../../../../components/Cards/PreviewCard";
import PrimaryHeader from "../../../../components/Header";
import FilterComponent from "../../../../components/BottomSheets/Filters";
import SortPopup from "../../../../components/BottomSheets/Sort";
//<--------------------------Functions---------------------------->
import { useGetProductsQuery } from "../../../../redux/Api/Products/Products";
import { COLORS, FONTS } from "../../../../constants/Theme";
import NoProducts from "../../../../components/EmptyScreen/NoProducts";
import { isTablet, RFValue } from "../../../../utils/responsive";
import {
  useGetattributesQuery,
  useGetbrandsQuery,
} from "../../../../Api/EndPoints/filter";

const Produtlist = ({ navigation, route }) => {
  const { data: AttributeData } = useGetattributesQuery({
    category_id: route?.params?.data?.parent_id,
  });
  const { data: brands } = useGetbrandsQuery();

  const [selectedOption, setSelectedOption] = useState("Newest Arrivals");
  const [counts, setCounts] = useState(0);
  const [page, setpage] = useState(1);
  const [query, setQuery] = useState({
    sort_by_column: "created_at",
    sort_by: "desc",
  });
  const [filters, setfilters] = useState({
    min_off_percentage: 0,
    max_off_percentage: 100,
    child_category_id: route?.params?.data?.id,
    max_price: 10000,
    min_price: 0,
    rating: "",
    parent_variant_ids: "",
    child_variant_ids: "",
    brand_ids: "",
  });

  const params = useMemo(
    () => ({
      page: 1,
      limit: page * 20,
      ...query,
      ...filters,
    }),
    [page, query, filters]
  );
  const { data, isLoading, refetch } = useGetProductsQuery(params);

  const sortfilter = useRef();
  const filterref = useRef(null);

  //Declare state variables

  //Declare functions here
  const onSelect = (item) => {
    sortfilter?.current?.hide();
    if (item == "Newest Arrivals") {
      setQuery({ sort_by_column: "created_at", sort_by: "desc" });
      refetch();
    } else if (item == "Price : Low to high") {
      setQuery({ sort_by_column: "product_price", sort_by: "asc" });
      refetch();
    } else if (item == "Price : High to low") {
      setQuery({ sort_by_column: "product_price", sort_by: "desc" });
      refetch();
    } else {
      setQuery({ ...query, sort_by_column: "most_rating" });
      refetch();
    }
    setSelectedOption(item);
  };
  const ApplyFilter = (
    MINOFF,
    MAXOFF,
    MAXP,
    MINP,
    RATING,
    BRAND_IDS,
    ATTRIBUTES_ID,
    ATTRIBUTES_VALUE_ID
  ) => {
    setfilters({
      min_off_percentage: MINOFF,
      max_off_percentage: MAXOFF,
      child_category_id: route?.params?.data?.id,
      sort: "",
      max_price: MAXP,
      min_price: MINP,
      rating: RATING,
      brand_ids: BRAND_IDS,
      parent_variant_ids: ATTRIBUTES_ID,
      child_variant_ids: ATTRIBUTES_VALUE_ID,
    });
    setQuery({ sort_by: null, sort_by_column: null });
    refetch();
  };
  const filtercount = () => {
    let count = 0;
    if (filters.min_price != 0 || filters.max_price != 10000) {
      count++;
    }
    if (filters.rating != "") {
      count++;
    }
    if (filters.parent_variant_ids && filters.parent_variant_ids.length > 0) {
      count += counts;
    }
    if (filters.brand_ids) {
      count++;
    }
    if (
      filters.min_off_percentage !== 0 ||
      filters.max_off_percentage !== 100
    ) {
      count++;
    }
    return count;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
      <PrimaryHeader
        onPress={() => navigation.goBack()}
        headerName={
          route?.params?.data?.main_category ||
          route?.params?.data?.child_category ||
          route?.params?.data?.category_name ||
          route?.params?.data?.main_category_name ||
          route?.params?.data?.title
        }
      />
      <ScrollView
        scrollEnabled
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: COLORS.WHITE,
        }}
        showsVerticalScrollIndicator={false}
      >
        <FlatList
          data={data?.records || []}
          onEndReached={() => {
            setpage(page + 1);
            refetch();
          }}
          onEndReachedThreshold={0.5}
          ItemSeparatorComponent={() => {
            return <View style={{ height: 16 }} />;
          }}
          contentContainerStyle={{
            flexGrow: 1,
            marginBottom: 36,
          }}
          scrollEnabled={false}
          ListEmptyComponent={() => {
            return <NoProducts />;
          }}
          renderItem={({ item, index }) => {
            return (
              <PreviewCard
                loading={isLoading}
                index={index}
                data={item}
                onPress={() => {
                  navigation.navigate("ProductDetails", {
                    url_slug: item?.url_slug,
                    product_sku: item?.product_sku,
                    product_id: item?.product_id,
                  });
                }}
              />
            );
          }}
          ListFooterComponent={() => {
            return data?.length > 0 ? (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: COLORS.GREY,
                    fontFamily: FONTS.SEMI_BOLD,
                    fontSize: RFValue(16),
                    includeFontPadding: false,
                    lineHeight: 24,
                  }}
                >
                  You have reached the end
                </Text>
              </View>
            ) : (
              <></>
            );
          }}
          numColumns={isTablet ? 4 : 2}
          keyExtractor={(item) => item.id}
        />
      </ScrollView>
      {data?.records?.length > 1 || filtercount() > 0 ? (
        <View
          style={{
            alignItems: "center",
            position: "absolute",
            alignSelf: "center",
            bottom: 16,
            borderRadius: 8,
            backgroundColor: "white",
            elevation: 3,
            shadowColor: "black",
            shadowOffset: { width: 5, height: 5 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            borderWidth: 1,
            borderColor: "#D0D1D1",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            style={{ paddingHorizontal: 30, paddingVertical: 11 }}
            onPress={() => sortfilter?.current?.show()}
          >
            {selectedOption === "Newest Arrivals" ? null : (
              <View
                style={{
                  position: "absolute",
                  right: 18,
                  top: 6,
                  height: 8,
                  width: 8,
                  borderRadius: 5,
                  backgroundColor: COLORS.RED,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            )}
            <Text
              style={{
                fontSize: RFValue(14),
                fontFamily: FONTS.SEMI_BOLD,
                color: COLORS.BLACK,
              }}
            >
              Sort
            </Text>
          </Pressable>
          <View
            style={{
              width: 1,
              height: 20,
              backgroundColor: COLORS.LIGHT_GREY,
            }}
          />
          <Pressable
            style={{ paddingHorizontal: 30, paddingVertical: 11 }}
            onPress={() => filterref?.current?.show()}
          >
            <Text
              style={{
                fontSize: RFValue(14),
                fontFamily: FONTS.SEMI_BOLD,
                color: COLORS.BLACK,
              }}
            >
              Filters
            </Text>
            {filtercount() > 0 ? (
              <View
                style={{
                  position: "absolute",
                  right: 11,
                  top: 6,
                  height: 14,
                  width: 14,
                  borderRadius: 14,
                  backgroundColor: COLORS.RED,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.SEMI_BOLD,
                    fontSize: 10,
                    color: COLORS.WHITE,
                  }}
                >
                  {filtercount()}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      ) : null}

      {/* Sort */}
      <ActionSheet
        closable
        animated
        containerStyle={{
          backgroundColor: "white",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        indicatorStyle={{ backgroundColor: "#D0D1D1", marginTop: 12 }}
        ref={sortfilter}
        gestureEnabled
      >
        <SortPopup
          selected={selectedOption}
          title={"Sort by"}
          options={[
            "Newest Arrivals",
            "Price : Low to high",
            "Price : High to low",
            "Ratings",
          ]}
          setselected={onSelect}
        />
      </ActionSheet>

      {/* Filter */}
      <ActionSheet
        closable
        animated
        containerStyle={{
          backgroundColor: "white",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: "70%",
        }}
        indicatorStyle={{ backgroundColor: "#D0D1D1", marginTop: 12 }}
        ref={filterref}
        gestureEnabled
      >
        <FilterComponent
          brands={brands}
          loading={isLoading}
          ApplyFilter={ApplyFilter}
          category={route?.params?.data?.id}
          category_id={route?.params?.data?.parent_id}
          AttributeData={AttributeData}
          sort={query}
          Ref={filterref}
          setCounts={setCounts}
        />
      </ActionSheet>
    </SafeAreaView>
  );
};
Produtlist.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};
export default React.memo(Produtlist);
