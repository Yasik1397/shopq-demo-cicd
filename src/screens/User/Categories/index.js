//<--------------------------Libraries--------------------------->
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  PanResponder,
  Pressable,
  Text,
  View
} from "react-native";
//<--------------------------Components-------------------------->
//Import custom components here
import SkeletonLoader from "../../../components/SkeletonLoader";

//<--------------------------Assets------------------------------>
//Import assets for this file
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useDispatch, useSelector } from "react-redux";

import { capitalizeFirstLetter } from "../../../utils/TextFormat";

import { SafeAreaView } from "react-native";
import BadgedIcon from "../../../components/BadgedIcon";
import PrimaryHeader from "../../../components/Header";
import { COLORS, FONTS } from "../../../constants/Theme";
import { useGetCartQuery } from "../../../redux/Api/Products/Cart";
import { getCategories } from "../../../redux/Api/Products/Category";
import { RFValue } from "../../../utils/responsive";
//<--------------------------Functions---------------------------->
//Import reusable functions here

const Categories = ({ navigation }) => {
  const dispatch = useDispatch();
  const settingsData = useSelector((state) => state?.settings?.data);

  const backgroundColor =
    settingsData?.records?.site_settings?.header?.background_color || "#fff";

  const data = useSelector((state) => state?.CategoryData?.data);
  const user = useSelector((state) => state?.Userdata?.user?.records);
  const CartItems = useSelector((state) => state?.Cartdata?.cart);

  const { data: cartdata } = useGetCartQuery(user?.id);

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  const { height } = Dimensions.get("window");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showIndicator, setShowIndicator] = useState(false);
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 0;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 0) {
          handleScrollUp();
        }
      },
    })
  ).current;

  const handleScrollUp = () => {
    setShowIndicator(true);
    Animated.timing(animatedOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowIndicator(false);
          dispatch(getCategories());
        });
      }, 2000);
    });
  };

  useEffect(() => {
    if (data?.records) {
      navigatetoSubcategory(data?.records[0]?.children, 0);
    }
  }, [data?.records]);
  const navigatetoSubcategory = (params, index) => {
    const subcatagories = params
      ?.map((item) => {
        return item;
      })
      .flat();
    setSubcategories(subcatagories);
    setSelectedItem(index);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center" }}
      {...panResponder.panHandlers}
    >
      <PrimaryHeader
        children1={
          <BadgedIcon
            count={cartdata?.records?.length}
            children={
              <FontAwesome6
                name="bag-shopping"
                color={COLORS.BLACK}
                size={RFValue(20)}
                onPress={() => navigation.navigate("Cart")}
              />
            }
          />
        }
        headerName={"Categories"}
      />
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View>
          <FlatList
            data={data?.records || []}
            contentContainerStyle={{ flexGrow: 1, backgroundColor: "#F5F7F8" }}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <View>
                  {item?.children[0]?.children?.length ? (
                    <Pressable
                      onPress={() => {
                        navigatetoSubcategory(item?.children, index);
                        setLoading(true);
                        setTimeout(() => {
                          setLoading(false);
                        }, 1000);
                      }}
                      style={{
                        backgroundColor:
                          selectedItem === index
                            ? "#fff"
                            : selectedItem - 1 == index
                            ? "#F5F7F8"
                            : selectedItem + 1 == index
                            ? "#F5F7F8"
                            : "#F5F7F8",
                        alignItems: "center",
                        padding: 12,
                        borderBottomWidth: selectedItem === index ? 2 : 0,
                        borderBottomColor:
                          selectedItem === index
                            ? backgroundColor
                            : "transparent",
                      }}
                    >
                      <Image
                        source={{
                          uri: item.category_image ? item.category_image : "",
                        }}
                        style={{ width: 50, height: 50, borderRadius: 10 }}
                        resizeMode="cover"
                      />
                      <Text
                        numberOfLines={1}
                        style={{
                          color:
                            selectedItem === index ? "#2C4152" : "#00000099",
                          fontSize: RFValue(14),
                          fontFamily: FONTS.MEDIUM,
                        }}
                      >
                        {capitalizeFirstLetter(item.category_name)}
                      </Text>
                    </Pressable>
                  ) : null}
                </View>
              );
            }}
          />
        </View>
        <View style={{ backgroundColor: "#fff", flexGrow: 1 }}>
          <FlatList
            data={subcategories}
            contentContainerStyle={{
              backgroundColor: "#fff",
              flexGrow: 1,
              marginLeft: 10,
            }}
            renderItem={({ item }) => {
              const data = item;
              return (
                <View style={{}}>
                  {loading ? (
                    <View style={{ marginBottom: 20 }}>
                      <SkeletonLoader
                        borderRadius={50}
                        height={20}
                        width={100}
                      />
                    </View>
                  ) : data?.children && data?.children?.length > 0 ? (
                    <Text
                      style={{
                        fontFamily: FONTS.SEMI_BOLD,
                        fontSize: RFValue(16),
                        color: "#061018",
                      }}
                    >
                      {capitalizeFirstLetter(data?.category_name)}
                    </Text>
                  ) : null}
                  {data?.children?.length > 0 ? (
                    <FlatList
                      numColumns={3}
                      ItemSeparatorComponent={() => (
                        <View style={{ height: 12 }} />
                      )}
                      showsHorizontalScrollIndicator={false}
                      data={data?.children}
                      renderItem={({ item }) => {
                        return (
                          <>
                            {loading ? (
                              <View
                                style={{
                                  alignItems: "center",
                                  gap: 10,
                                  marginBottom: 20,
                                  marginEnd: 20,
                                }}
                              >
                                <SkeletonLoader
                                  width={67}
                                  height={67}
                                  borderRadius={12}
                                />
                                <SkeletonLoader
                                  width={50}
                                  height={10}
                                  borderRadius={12}
                                />
                              </View>
                            ) : (
                              <Pressable
                                onPress={() => {
                                  console.log("item: ", item);
                                  navigation.navigate("ProductList", {
                                    data: item,
                                  });
                                }}
                                style={{ marginVertical: 8 }}
                              >
                                <View
                                  style={{
                                    alignItems: "center",
                                    marginHorizontal: 12,
                                    borderRadius: 12,
                                  }}
                                >
                                  <Image
                                    resizeMode="contain"
                                    style={{
                                      width: 67,
                                      height: 67,
                                      borderRadius: 12,
                                    }}
                                    source={{
                                      uri: item?.category_image
                                        ? item?.category_image
                                        : "https://www.rajguruelectronics.com/assets/images/products/p2.jpg",
                                    }}
                                  />
                                  <View
                                    style={{
                                      marginTop: 5,
                                      width: 50,
                                      alignItems: "center",
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontFamily: FONTS.REGULAR,
                                        fontSize: RFValue(12),
                                        color: "#2C4152",
                                      }}
                                      numberOfLines={1}
                                      key={item?.id}
                                    >
                                      {capitalizeFirstLetter(
                                        item?.category_name
                                      )}
                                    </Text>
                                  </View>
                                </View>
                              </Pressable>
                            )}
                          </>
                        );
                      }}
                    />
                  ) : null}
                </View>
              );
            }}
          />
        </View>
      </View>
      <Animated.View
        style={{
          position: "absolute",
          top: height * 0.38,
          left: 0,
          right: 0,
          justifyContent: "center",
          alignItems: "center",
          opacity: animatedOpacity,
        }}
      >
        {showIndicator && <ActivityIndicator size="large" color="#0E1827" />}
      </Animated.View>
    </SafeAreaView>
  );
};
Categories.propTypes = {
  navigation: PropTypes.object.isRequired,
};
export default React.memo(Categories);
