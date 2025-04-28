//<--------------------------Libraries--------------------------->
import Clipboard from "@react-native-clipboard/clipboard";
import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import {
  FlatList,
  Image,
  Linking,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Config from "react-native-config";
import { useDispatch, useSelector } from "react-redux";

import { useGetSummaryQuery } from "../../../../../Api/EndPoints/orders";
import {
  useAddproductreviewApiMutation,
  useGetReviewbyProductIDQuery,
} from "../../../../../Api/EndPoints/products";

import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
// import Tick from "../../../../../assets/Icons/tick_circle.svg";
// import Unchecked from "../../../../../assets/Icons/unchecked_circle.svg";
import CreditIcon from "../../../../../assets/Icons/credit.svg";
import PrimaryButton from "../../../../../components/Buttons/Primary";
import PriceSummary from "../../../../../components/Cards/PriceCard";

import OrderCard from "../../../../../components/Cards/OrderCard";
import SnackBar, { useSnackBar } from "../../../../../components/SnackBar";

import PropTypes from "prop-types";
import ActionSheet from "react-native-actions-sheet";
import Chip from "../../../../../components/Chip";
import PrimaryHeader from "../../../../../components/Header";
import TrackOrder from "../../../../../components/TrackOrder";
import { COLORS, FONTS } from "../../../../../constants/Theme";
import { capitalizeFirstLetter } from "../../../../../utils/TextFormat";
import Secondary from "../../../../../components/Buttons/Secondary";
import PrimaryInput from "../../../../../components/Input/PrimaryInput";
import { RFValue } from "../../../../../utils/responsive";
import RNFS from "react-native-fs";
import { fetchOrderDetails } from "../../../../../redux/actions/orderSlice";
import { addToCart, fetchCart } from "../../../../../redux/actions/cartSlice";
const BUCKET_URL = Config?.BUCKET_URL;

const MyOrderDetails = ({ navigation, route }) => {
  const user = useSelector((state) => state?.Userdata?.user?.records);
  const dispatch = useDispatch();
  const data = route.params;
  const orderDetails = useSelector((state) => state?.OrderData?.orderDetails);
  console.log("orderDetails: ", orderDetails);
  const { data: reviewData } = useGetReviewbyProductIDQuery({
    product_id: orderDetails?.items[0]?.product_id,
    user_id: user?.id,
  });
  console.log("reviewData: ", reviewData);
  const [productdata, setProductdata] = useState("");
  const validationSchema = Yup.object().shape({
    review: Yup.string()
      .required("Review is required")
      .test("wordCount", "Maximum 240 words allowed", (value) => {
        const words = value?.split(" ");
        return words?.length <= 240;
      }),
  });
  const { showSnack, snackVisible } = useSnackBar();

  const [refreshing, setRefreshing] = React.useState(false);
  const [reviewloader, setReviewloader] = useState(false);

  const [addproductreview] = useAddproductreviewApiMutation();

  let Shipping_location = orderDetails?.status_history;

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(fetchOrderDetails(data?.order_id)).then((res) => {
      setProductdata(res?.payload?.records);
      setRefreshing(false);
    });
  };

  useEffect(() => {
    dispatch(fetchOrderDetails(data?.order_id)).then((res) => {
      setProductdata(res?.payload?.records);
    });
  }, []);

  const TrackSheetRef = useRef(null);
  const ReviewSheetRef = useRef(null);

  const formref = useRef();
  const scrollViewRef = useRef(null);

  const copyToClipboard = () => {
    const refId = orderDetails?.payment_order_id;
    Clipboard.setString(refId);
  };

  const Submitreview = async (values, { resetForm }) => {
    try {
      setReviewloader(true);

      const res = await addproductreview({
        product_id: productdata?.items[0]?.product_id,
        product_name: productdata?.items[0]?.title,
        user_id: user?.id,
        review: values?.review,
        rating: values?.rating,
        image: productdata?.items[0]?.cover_image,
        user_profile: `${user?.profile_image}`,
      });
      console.log("review  ", res);
      if (res?.data?.success) {
        resetForm();
        setReviewloader(false);
        ReviewSheetRef?.current?.hide();
        showSnack("Review Submitted Sccessfully", "success", 1500);
      }
    } catch (error) {
      setReviewloader(false);
      showSnack("Something went wrong", "error");
    }
  };
  const CartCost = orderDetails?.sub_total;
  const { data: summarydata } = useGetSummaryQuery({ amount: CartCost });

  const formatMonthDate = (value) => {
    const date = new Date(value);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = months[date?.getMonth()];
    const day = date?.getDate();
    const year = date?.getFullYear();

    return `${month} ${day}, ${year}`;
  };

  const handleDownload = () => {
    RNFS.downloadFile({
      fromUrl: `${BUCKET_URL}${orderDetails?.invoice}`,
      toFile: `${RNFS.DocumentDirectoryPath}/${orderDetails?.invoice}`,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
      <PrimaryHeader
        onPress={() => navigation.goBack()}
        headerName={route?.params?.order_id}
        children1={<Chip label={orderDetails?.status} />}
      />
      <ScrollView
        ref={scrollViewRef}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={[
          {
            paddingHorizontal: 16,
            backgroundColor: COLORS.WHITE,
            flexGrow: 1,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <FlatList
          keyExtractor={(index) => index.toString()}
          ListHeaderComponent={() => (
            <Text
              style={{
                fontSize: RFValue(14),
                color: "#061018",
                fontFamily: FONTS.BOLD,
              }}
            >
              Products
            </Text>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          ListHeaderComponentStyle={{
            paddingBottom: 8,
          }}
          data={orderDetails?.items}
          renderItem={({ item }) => {
            return (
              <OrderCard
                onWriteReview={() => ReviewSheetRef?.current.show()}
                onPress={() => {
                  navigation.navigate("ProductDetails", {
                    url_slug: item?.url_slug,
                    product_sku: item?.product_sku,
                    id: item?.id,
                  });
                }}
                data={item}
                type={"review"}
              />
            );
          }}
        />
        <View
          style={{ marginVertical: 20, height: 1, backgroundColor: "#D9D9D9" }}
        />
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.SEMI_BOLD,
                fontSize: RFValue(14),
                color: COLORS.BLACK,
                marginBottom: 8,
              }}
            >
              Track Order
            </Text>

            {orderDetails?.status == "Ordered" ? null : (
              <Pressable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#F5F5F6",
                  borderRadius: 5,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                }}
                onPress={() => TrackSheetRef?.current.show()}
              >
                <Text
                  style={{
                    fontFamily: FONTS.MEDIUM,
                    color: "#061018",
                    fontSize: 10,
                    includeFontPadding: false,
                  }}
                >
                  Track
                </Text>
                <Feather name="chevron-right" color={"#061018"} size={10} />
              </Pressable>
            )}
          </View>

          <TrackOrder
            onTrack={() => TrackSheetRef?.current?.show()}
            currentStatus={orderDetails?.status}
            data={orderDetails?.status_history}
          />
        </View>
        <View
          style={{ marginVertical: 20, height: 1, backgroundColor: "#D9D9D9" }}
        />
        {/* Address Section */}
        <View>
          <Text
            style={{
              fontFamily: FONTS.MEDIUM,
              color: COLORS.LIGHT_GREY,
              fontSize: RFValue(12),
            }}
          >
            Delivering to
          </Text>
          <Text
            style={{
              fontFamily: FONTS.SEMI_BOLD,
              fontSize: RFValue(14),
              color: COLORS.BLACK,
            }}
          >
            {orderDetails?.address?.addressTitle
              ? orderDetails?.address?.addressTitle
              : "Home"}
          </Text>
          <Text>{orderDetails?.address?.userName}</Text>
          <Text
            style={{
              color: "#8B8F93",
              fontSize: RFValue(14),
              fontFamily: FONTS.MEDIUM,
            }}
          >
            {`${orderDetails?.address?.streetAddress1}${
              orderDetails?.address?.streetAddress2
                ? ", " + orderDetails?.address?.streetAddress2
                : ""
            }${
              orderDetails?.address?.city
                ? ", " + orderDetails?.address?.city
                : ""
            }${
              orderDetails?.address?.landmark
                ? ", " + orderDetails?.address?.landmark
                : ""
            } ${
              orderDetails?.address?.land
                ? ", " + orderDetails?.address?.land
                : ""
            }${
              orderDetails?.address?.zipcode
                ? " - " + orderDetails?.address?.zipcode
                : ""
            }`}
          </Text>
          <Text
            ellipsizeMode={"tail"}
            numberOfLines={2}
            style={{
              fontSize: RFValue(14),
              fontFamily: FONTS.MEDIUM,
              color: "#8B8F93",
            }}
          >
            Ph :{" "}
            {orderDetails?.address?.mobileNumber
              ? orderDetails?.address?.mobileNumber?.slice(-10)
              : "9xxxxxxxx2"}
          </Text>
        </View>

        <View style={{}}>
          <Text
            style={{
              color: "#061018",
              fontSize: RFValue(14),
              fontFamily: FONTS.BOLD,
            }}
          >
            Mode of payment
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 8,
                backgroundColor: "#F5F5F6",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CreditIcon />
            </View>
            <View style={{ flex: 1, justifyContent: "space-between" }}>
              <Text
                style={{
                  fontSize: RFValue(14),
                  color: "#061018",
                  fontFamily: FONTS.SEMI_BOLD,
                }}
              >
                Online Payment
              </Text>
              <Text
                style={{
                  fontSize: RFValue(12),
                  fontFamily: FONTS.MEDIUM,
                  color: COLORS.LIGHT_GREY,
                }}
              >
                Ref : {orderDetails?.payment_order_id}
              </Text>
            </View>
            <Pressable onPress={copyToClipboard}>
              <Feather name="copy" color={"#8B8F93"} size={20} />
            </Pressable>
          </View>
        </View>
        <View style={{}}>
          <PriceSummary data={summarydata?.records} />
        </View>
        <View style={{ marginVertical: 10 }}>
          <PrimaryButton
            onPress={() => {
              const params = {
                product_id: orderDetails?.items[0]?.product_id,
                varient_id: orderDetails?.items[0]?.variant_id,
                status: "pending",
                user_id: user?.id,
                is_selected: true,
                quantity: 1,
              };
              dispatch(addToCart(params)).then(() => {
                showSnack("Item added to cart", "success", 1500, () => {
                  dispatch(fetchCart(user?.id));
                  navigation.navigate("Cart");
                });
              });
            }}
            disabled={
              orderDetails?.items?.length === 1 &&
              orderDetails?.items[0]?.cart_details?.product_details?.is_deleted
            }
            otherstyles={{ flex: 1, paddingVertical: 12, borderRadius: 8 }}
            title="Reorder Item"
          />
        </View>
        <View style={{ alignSelf: "center" }}>
          <TouchableOpacity
            onPress={() => {
              handleDownload;
            }}
          >
            <Text
              style={{
                color: "#0E1827",
                fontSize: RFValue(14),
                fontFamily: FONTS.SEMI_BOLD,
              }}
            >
              Download Invoice
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontFamily: FONTS.MEDIUM }}>
            For any queries regarding this orders, please reach us at
          </Text>

          <TouchableOpacity
            onPress={() => Linking.openURL("mailto:info@shopq.site")}
          >
            <Text
              style={{
                fontFamily: FONTS.SEMI_BOLD,
                lineHeight: 22,
                fontSize: RFValue(14),
                color: "#09141ECC",
                textDecorationLine: "underline",
              }}
            >
              info@shopq.site
            </Text>
          </TouchableOpacity>
        </View>

        <ActionSheet
          ref={TrackSheetRef}
          indicatorStyle={{ backgroundColor: "#D0D1D1", marginTop: 12 }}
          containerStyle={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
          closable
          gestureEnabled
          openAnimationConfig={{
            timing: { duration: 500 },
            bounciness: 0,
          }}
        >
          <View style={{ padding: 16 }}>
            <Text style={{ color: "#061018", fontFamily: "Manrope-SemiBold" }}>
              Track order
            </Text>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={{ paddingLeft: 16 }}>
                  {Shipping_location?.filter((i) => i?.location)?.map(
                    (item, index) => {
                      return (
                        <View key={index} style={{ paddingVertical: 32 }}>
                          <Text
                            style={{
                              color: "#313132",
                              fontSize: RFValue(14),
                              fontWeight: "700",
                              fontFamily: "Manrope-Bold",
                            }}
                          >
                            {capitalizeFirstLetter(item?.location)}
                          </Text>
                          <Text
                            style={{
                              color: "#313132",
                              fontSize: RFValue(14),
                              fontWeight: "500",
                              opacity: 0.6,
                              fontFamily: "Manrope-Medium",
                            }}
                          >
                            {formatMonthDate(item?.date)}
                          </Text>
                        </View>
                      );
                    }
                  )}
                </View>
              </View>
            </ScrollView>
            <PrimaryButton
              onPress={() => TrackSheetRef?.current?.hide()}
              title="Close"
              textColor={COLORS.BLACK}
              backgroundColor={COLORS.WHITE}
              otherstyles={{
                borderWidth: 1,
                borderColor: COLORS.BLACK,
                paddingVertical: 12,
              }}
            />
          </View>
        </ActionSheet>
        <ActionSheet
          ref={ReviewSheetRef}
          indicatorStyle={{ backgroundColor: "#D0D1D1", marginTop: 12 }}
          containerStyle={{
            padding: 12,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
          closable
          gestureEnabled
          openAnimationConfig={{
            timing: { duration: 500 },
            bounciness: 0,
          }}
        >
          <Formik
            validationSchema={validationSchema}
            innerRef={formref}
            enableReinitialize={true}
            initialValues={{
              rating: reviewData?.records[0]?.rating || 0,
              review: reviewData?.records[0]?.review || "",
            }}
            onSubmit={Submitreview}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isValid,
              setFieldValue,
            }) => (
              <View>
                <Text
                  style={{
                    color: "#061018",
                    fontFamily: FONTS.BOLD,
                    fontSize: RFValue(14),
                  }}
                >
                  Write a review
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{
                      uri: `${productdata?.items[0]?.cover_image}`,
                    }}
                    style={{
                      width: 76,
                      height: 58,
                      resizeMode: "cover",
                      borderRadius: 4,
                    }}
                  />

                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{
                      fontSize: RFValue(14),
                      color: "#061018",
                      fontFamily: FONTS.SEMI_BOLD,
                      flexShrink: 1,
                    }}
                  >
                    {productdata?.items[0]?.title}
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: 16,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Pressable
                      key={item}
                      onPress={() => setFieldValue("rating", item)}
                    >
                      <FontAwesome
                        name={
                          item <= Math.floor(values?.rating) ? "star" : "star-o"
                        }
                        size={40}
                        color="#EBA83A"
                      />
                    </Pressable>
                  ))}
                </View>

                <View
                  style={{
                    borderRadius: 12,
                    marginTop: 10,
                  }}
                >
                  <PrimaryInput
                    error={touched?.review && errors?.review}
                    label={"Comments"}
                    placeholder="Write a review"
                    multiline={true}
                    value={values?.review}
                    onchangetext={handleChange("review")}
                    onblur={handleBlur("review")}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 16,
                  }}
                >
                  <Secondary
                    title1="Cancel"
                    title2="Submit"
                    backgroundColor1={COLORS.WHITE}
                    textColor1={COLORS.BLACK}
                    otherstyles1={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 12,
                    }}
                    otherstyles2={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 12,
                    }}
                    isButton2Disabled={!isValid}
                    isloading1={reviewloader}
                    onPress1={() => {
                      ReviewSheetRef.current.hide();
                      formref.current.resetForm();
                    }}
                    onPress2={handleSubmit}
                  />
                </View>
              </View>
            )}
          </Formik>
        </ActionSheet>
        <View
          style={{
            padding: 10,
            width: "100%",
            position: "absolute",
            bottom: 10,
            alignSelf: "center",
          }}
        >
          <SnackBar
            show={snackVisible.show}
            content={snackVisible.content}
            type={snackVisible.type}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
MyOrderDetails.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};
export default React.memo(MyOrderDetails);
