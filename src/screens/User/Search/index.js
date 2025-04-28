//<--------------------------Libraries--------------------------->
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { COLORS, FONTS } from "../../../constants/Theme";
//<--------------------------Components-------------------------->
import PreviewCard from "../../../components/Cards/PreviewCard";
import SearchBar from "../../../components/SearchBar";
//<--------------------------Assets------------------------------>
import Noresult from "../../../assets/Generals/noresult.svg";
import Recent from "../../../assets/Icons/recent.svg";
import Searchicon from "../../../assets/Icons/search.svg";
//<--------------------------Api-------------------------->
import Feather from "react-native-vector-icons/Feather";
import {
  useDeleteRecentMutation,
  useGetGlobalsearchQuery,
  useGetRecentSearchQuery,
} from "../../../redux/Api/Products/Search";
//<--------------------------Functions---------------------------->
import { truncateText } from "../../../utils/TextFormat";
import { RFValue } from "../../../utils/responsive";

const SearchScreen = ({ navigation }) => {
  const [text_search, setSearch_Text] = useState("");
  const [text, setText] = useState("");
  const [initial, setInitial] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const user = useSelector((state) => state?.Userdata?.user?.records);
  const settingsData = useSelector((state) => state?.settings?.data);
  const backgroundColor =
    settingsData?.records?.site_settings?.header?.background_color || "#fff";
  const { data: recentdatas, isLoading } = useGetGlobalsearchQuery({
    search_value: text_search.trim(),
    user_id: user?.id,
  });

  const { data: recent_searches, refetch: refetch_recent } =
    useGetRecentSearchQuery(user?.id);

  useEffect(() => {
    if (text_search?.trim() === "") {
      refetch_recent();
    }
  }, [text_search, refetch_recent]);

  const [delete_recent] = useDeleteRecentMutation({
    user_id: user?.id,
    delete_value: "",
  });

  const handleDeleteSearch = async (item) => {
    delete_recent({
      user_id: user?.id,
      delete_value: item,
    }).then((res) => {
      if (res?.data?.success) {
        refetch_recent();
      }
    });
  };

  const onRefresh = React.useCallback(() => {
    refetch_recent().then(() => setRefreshing(false));
  }, []);

  const handleSearchSubmit = (text, type, id) => {
    if (type == "recommended") {
      navigation.navigate("ProdutDetails", {
        id: id,
      });
    } else {
      setSearch_Text(text);
      setText(text);
      setInitial(false);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: backgroundColor }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 8,
          paddingHorizontal: 16,
          backgroundColor: backgroundColor,
        }}
      >
        <SearchBar
          autoFocus
          icon={<Feather name="search" size={20} color={COLORS.WHITE} />}
          onBack={() => navigation.goBack()}
          value={text}
          onSubmitEditing={() => {
            setSearch_Text(text), setInitial(false);
          }}
          onChangeText={(val) => {
            setText(val);
            setSearch_Text(val);
            setInitial(false);
            refetch_recent();
          }}
          placeholder={"Search"}
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, backgroundColor: COLORS.WHITE }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          {initial ? (
            <View style={{ flex: 1, paddingHorizontal: 16 }}>
              {recentdatas?.records?.length !== 0 &&
              text_search?.length !== 0 ? null : recent_searches?.records[0]
                  ?.search_key?.length >= 0 ? (
                <Text
                  style={{
                    fontSize: RFValue(16),
                    color: "#061018",
                    fontFamily: FONTS.SEMI_BOLD,
                    marginVertical: 16,
                  }}
                >
                  Your recent searches
                </Text>
              ) : isLoading ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ActivityIndicator size={"large"} color={"#061018"} />
                </View>
              ) : (
                <Text
                  style={{
                    color: "#061018",
                    fontFamily: FONTS.SEMI_BOLD,
                    fontSize: RFValue(16),
                    marginVertical: 16,
                  }}
                >
                  No recent searches
                </Text>
              )}
              <FlatList
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ marginTop: 8, flexGrow: 1 }}
                scrollEnabled={false}
                data={
                  recentdatas?.records?.length !== 0 &&
                  text_search?.length !== 0
                    ? recentdatas?.records?.slice(0, 10)
                    : recent_searches?.records[0]?.search_key?.slice(0, 10)
                }
                keyExtractor={(index) => index.toString()}
                ItemSeparatorComponent={() => {
                  return (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "#E8E8E6",
                        marginVertical: 12,
                      }}
                    />
                  );
                }}
                renderItem={({ item }) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          recentdatas?.records?.length !== 0 &&
                          text_search?.length !== 0
                            ? handleSearchSubmit(
                                item?.product_title?.trim(),
                                "recommended",
                                item?.id
                              )
                            : handleSearchSubmit(item)
                        }
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          gap: 5,
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 5,
                            alignItems: "center",
                          }}
                        >
                          {recentdatas?.records?.length !== 0 &&
                          text_search?.length !== 0 ? (
                            <Searchicon width={20} height={20} />
                          ) : recent_searches?.records[0]?.search_key?.length >
                            0 ? (
                            <Recent width={20} height={20} />
                          ) : null}
                          <Text
                            style={{
                              fontSize: RFValue(14),
                              fontFamily: FONTS.MEDIUM,
                              color: "#495056",
                              includeFontPadding: false,
                            }}
                          >
                            {recentdatas?.records?.length !== 0 &&
                            text_search?.length !== 0
                              ? truncateText(item?.title, 42)
                              : truncateText(item, 42)}
                          </Text>
                        </View>
                        <Feather
                          onPress={() => handleDeleteSearch(item)}
                          name="x"
                          color={"#495056"}
                          size={16}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </View>
          ) : (
            <FlatList
              scrollEnabled={false}
              contentContainerStyle={{ marginVertical: 16, flexGrow: 1 }}
              ListEmptyComponent={() => {
                return (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Noresult height={168} width={220} />
                    <Text
                      style={{
                        fontFamily: FONTS.SEMI_BOLD,
                        fontSize: RFValue(14),
                        color: "#061018",
                      }}
                    >
                      No result found
                    </Text>
                  </View>
                );
              }}
              ItemSeparatorComponent={() => {
                return (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "#E8E8E6",
                      marginVertical: 12,
                    }}
                  />
                );
              }}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              data={
                recentdatas?.records?.length !== 0 && text_search?.length !== 0
                  ? recentdatas?.records
                  : []
              }
              keyExtractor={(item) => item?.product_id}
              renderItem={({ item }) => {
                return (
                  <PreviewCard
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
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

SearchScreen.propTypes = {
  navigation: PropTypes.object,
};
export default React.memo(SearchScreen);
