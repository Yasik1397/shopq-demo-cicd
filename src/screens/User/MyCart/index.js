//<--------------------------Libraries--------------------------->
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
//<--------------------------Components-------------------------->
import CartCard from "../../../components/Cards/CartCard";
import PriceCard from "../../../components/Cards/PriceCard";
import SnackBar, { useSnackBar } from "../../../components/SnackBar";

import ActionSheet from "react-native-actions-sheet";

import { useGetSummaryQuery } from "../../../Api/EndPoints/orders";
import { useGetSimilarProductsQuery } from "../../../Api/EndPoints/products";

import { DeleteCart } from "../../../components/BottomSheets/DeleteCart";
import PrimaryButton from "../../../components/Buttons/Primary";
import PreviewCard from "../../../components/Cards/PreviewCard";
import PrimaryHeader from "../../../components/Header";

import EmptyCart from "../../../components/EmptyScreen/EmptyCart";
import NoUserComponent from "../../../components/EmptyScreen/NoUser";

import { COLORS, FONTS } from "../../../constants/Theme";
import { getAllCoupens } from "../../../redux/Api/Products/Coupon";
import { DeleteValue } from "../../../utils/storageutils";
import { RFValue } from "../../../utils/responsive";
import { useGetCartQuery } from "../../../redux/Api/Products/Cart";

import {
  deleteCartById,
  fetchCart,
  updateCartById,
} from "../../../redux/actions/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishSlice";

const MyCart = ({ navigation, onAuthStateChanged }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.Userdata?.user?.records);
  const CartItems = useSelector((state) => state?.Cartdata?.cart);
  const { data: cartdata, refetch: refetchCart } = useGetCartQuery(user?.id);
  const { snackVisible, showSnack } = useSnackBar();

  useEffect(() => {
    dispatch(fetchCart(user?.id));
  }, [user?.id]);

  const DeleteCartRef = useRef(null);

  const [refreshing, setRefreshing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { data: similardata } = useGetSimilarProductsQuery({
    id: cartdata?.records[0]?.product_id,
  });
  console.log("similardata: ", similardata);

  const calculateCartTotal = (data) => {
    console.log("data: ", data);
    if (!Array.isArray(data)) {
      return;
    }
    const totalCost = data.reduce((total, current) => {
      const productPrice = parseFloat(current?.selling_price);
      const quantity = parseFloat(current?.quantity);
      const isSelected = current?.is_selected;

      if (!isSelected) {
        return total;
      }

      if (!isNaN(productPrice) && !isNaN(quantity)) {
        const subtotal = productPrice * quantity;
        return total + subtotal;
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          `Invalid price or quantity for product ID ${current.product_id}`
        );
        return total;
      }
    }, 0);

    return totalCost;
  };
  const CartCost = calculateCartTotal(
    CartItems
      ? CartItems?.filter(
          (item) =>
            item?.current_stock > 0 &&
            item?.out_of_stock_status === false &&
            item?.is_selected
        )
      : []
  );
  const { data: summarydata } = useGetSummaryQuery({ amount: CartCost });

  useEffect(() => {
    dispatch(getAllCoupens());
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(fetchCart(user?.id)).then(() => {
      setRefreshing(false);
    });
  }, []);

  const handleDeleteCart = async () => {
    try {
      dispatch(deleteCartById(selectedId)).then(() => {
        DeleteCartRef?.current?.hide();
        dispatch(fetchCart(user?.id));
      });
      showSnack("Item deleted from cart", "success", 1500);
      // if (res?.data?.success) {
      //   showSnack(res?.data?.message, "success");
      //   DeleteCartRef?.current?.hide();
      //   refetchCart();
      // } else {
      //   showSnack(res?.data?.message, "error");
      // }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("error: ", error);
    }
  };

  if (!user?.id) {
    return (
      <NoUserComponent
        onPress={async () => {
          await Promise.all([DeleteValue("token"), DeleteValue("user")]);
          onAuthStateChanged();
        }}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
      <PrimaryHeader
        headerName={"My Cart"}
        onPress={() => navigation.goBack()}
      />
      {CartItems ? (
        <View style={{ flex: 1 }}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{
              flexGrow: 1,
              backgroundColor: COLORS.WHITE,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Cart List Section */}
            <FlatList
              contentContainerStyle={{ flexGrow: 1, padding: 12 }}
              ListEmptyComponent={() => <EmptyCart />}
              ItemSeparatorComponent={() => {
                return <View style={{ height: 12 }} />;
              }}
              keyExtractor={(item) => item?.cart_id}
              data={CartItems || []}
              renderItem={({ item, index }) => {
                return (
                  <CartCard
                    _onPress={() =>
                      navigation.navigate("ProductDetails", {
                        url_slug: item?.url_slug,
                        product_sku: item?.product_sku,
                        product_id: item?.product_id,
                      })
                    }
                    onAdd={async () => {
                      dispatch(
                        updateCartById({
                          id: item?.cart_id,
                          is_selected: item?.is_selected,
                          product_id: item?.product_id,
                          status: "pending",
                          user_id: user?.id,
                          variant_id: item?.variant_id,
                          quantity: item?.quantity + 1,
                        })
                      ).then(() => {
                        dispatch(fetchCart(user?.id));
                        showSnack("Item added to cart", "success");
                      });
                    }}
                    onSubtract={async () => {
                      dispatch(
                        updateCartById({
                          id: item?.cart_id,
                          is_selected: item?.is_selected,
                          product_id: item?.product_id,
                          status: "pending",
                          user_id: user?.id,
                          variant_id: item?.variant_id,
                          quantity: item?.quantity - 1,
                        })
                      ).then(() => {
                        dispatch(fetchCart(user?.id));
                        showSnack("Item removed from cart", "success");
                      });
                    }}
                    onCheck={async () => {
                      dispatch(
                        updateCartById({
                          id: item?.cart_id,
                          is_selected: !item?.is_selected,
                          product_id: item?.product_id,
                          status: "pending",
                          user_id: user?.id,
                          variant_id: item?.variant_id,
                        })
                      ).then(() => {
                        dispatch(fetchCart(user?.id));
                        showSnack(
                          item?.is_selected
                            ? "Item removed from cart"
                            : "Item added to cart",
                          "success"
                        );
                      });
                    }}
                    onDelete={() => {
                      DeleteCartRef?.current?.show();
                      setSelectedId(item?.cart_id);
                    }}
                    onFavourite={async () => {
                      try {
                        if (item?.is_favourite) {
                          dispatch(removeFromWishlist(item?.wishlist_id)).then(
                            () => {
                              dispatch(fetchCart(user?.id));
                              showSnack(
                                "Product removed from Wishlist",
                                "success"
                              );
                            }
                          );
                        } else {
                          dispatch(
                            addToWishlist({
                              product_id: item?.product_id,
                              user_id: user?.id,
                              variant_id: item?.variant_id,
                            })
                          ).then(() => {
                            dispatch(fetchCart(user?.id));
                            showSnack("Product added to Wishlist", "success");
                          });
                        }
                      } catch (error) {
                        // eslint-disable-next-line no-console
                        console.log("error: ", error);
                      }
                    }}
                    data={item}
                    index={index}
                  />
                );
              }}
            />
            {/* Similar Products Section */}
            {similardata ? (
              <View
                style={{
                  backgroundColor: "#F6FBFF",
                  gap: 16,
                  marginTop: 20,
                  paddingVertical: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: RFValue(16),
                    fontFamily: FONTS.SEMI_BOLD,
                    color: "#060108",
                    paddingHorizontal: 16,
                  }}
                >
                  Similar Products
                </Text>
                <FlatList
                  horizontal
                  onEndReachedThreshold={0.5}
                  showsHorizontalScrollIndicator={false}
                  data={similardata?.records || []}
                  ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                  ListHeaderComponent={() => <View style={{ width: 16 }} />}
                  renderItem={({ item }) => (
                    <PreviewCard
                      data={item}
                      onPress={() => {
                        navigation.push("ProductDetails", {
                          url_slug: item?.url_slug,
                          product_sku: item?.product_sku,
                          id: item?.id,
                        });
                      }}
                    />
                  )}
                />
              </View>
            ) : null}
            {/* Price Card Section */}
            <View style={{ paddingHorizontal: 16 }}>
              <PriceCard data={summarydata?.records} />
            </View>
          </ScrollView>
          {/* Bottom button  */}
          <View
            style={{
              backgroundColor: COLORS.WHITE,
              shadowColor: "black",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.6,
              shadowRadius: 4,
              elevation: 5,
              bottom: 0,
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 30,
              }}
            >
              <View>
                <Text
                  style={{
                    color: COLORS.BLACK,
                    fontFamily: FONTS.SEMI_BOLD,
                    fontSize: RFValue(12),
                  }}
                >
                  Total
                </Text>
                <Text
                  style={{
                    color: COLORS.BLACK,
                    fontFamily: FONTS.SEMI_BOLD,
                    fontSize: RFValue(16),
                  }}
                >
                  &#8377; {summarydata?.records?.total_price?.toLocaleString()}
                </Text>
              </View>
              <PrimaryButton
                onPress={() => {
                  navigation.navigate("OrderConfirmation");
                }}
                disabled={cartdata?.records?.length === 0}
                otherstyles={{ flex: 1, paddingVertical: 12, borderRadius: 12 }}
                title={"Checkout"}
              />
            </View>
          </View>
        </View>
      ) : (
        <View style={{ padding: 16, flex: 1, justifyContent: "center" }}>
          <EmptyCart />
        </View>
      )}
      <ActionSheet
        indicatorStyle={{ backgroundColor: "#D0D1D1", marginTop: 12 }}
        animated
        closable
        gestureEnabled
        ref={DeleteCartRef}
        containerStyle={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        closeOnPress={false}
      >
        <DeleteCart onDelete={() => handleDeleteCart()} />
      </ActionSheet>
      <View
        style={{
          width: "100%",
          padding: 10,
          position: "absolute",
          bottom: 60,
          alignSelf: "center",
        }}
      >
        <SnackBar
          show={snackVisible.show}
          content={snackVisible.content}
          type={snackVisible.type}
        />
      </View>
    </SafeAreaView>
  );
};

MyCart.propTypes = {
  navigation: PropTypes.object,
  onAuthStateChanged: PropTypes.func,
};

export default React.memo(MyCart);
