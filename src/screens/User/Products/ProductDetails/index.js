//<--------------------------Libraries--------------------------->
import {useFocusEffect} from '@react-navigation/native';
import {Formik} from 'formik';
import PropTypes from 'prop-types';
import React, {useEffect, useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import ActionSheet from 'react-native-actions-sheet';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import ImageViewer from 'react-native-image-zoom-viewer';
import RenderHTML from 'react-native-render-html';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import * as Yup from 'yup';

//<--------------------------Assets------------------------------>
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Octicons from 'react-native-vector-icons/Octicons';

import NoReviewScreen from '../../../../assets/Icons/noreview.svg';
import Feather from 'react-native-vector-icons/Feather';
import ShareIcon from '../../../../assets/Icons/share.svg';
import TickIcon1 from '../../../../assets/Icons/theme tick.svg';
import TickIcon from '../../../../assets/Icons/tick_icon.svg';

//<--------------------------Components-------------------------->
import PrimaryButton from '../../../../components/Buttons/Primary';
import PreviewCard from '../../../../components/Cards/PreviewCard';
import PrimaryHeader from '../../../../components/Header';
import SkeletonLoader from '../../../../components/SkeletonLoader';
import SnackBar, {useSnackBar} from '../../../../components/SnackBar';
import Reviewscreen from '../Reviews';
import BadgedIcon from '../../../../components/BadgedIcon';
import ProductCarousal from '../../../../components/Carousal/ProductCarousal';
import Secondary from '../../../../components/Buttons/Secondary';

import {COLORS, FONTS} from '../../../../constants/Theme';

import {capitalizeFirstLetter} from '../../../../utils/TextFormat';
import {fetchPincode} from '../../../../utils/apiUtils';
import {DeleteValue} from '../../../../utils/storageutils';
import {RFValue} from '../../../../utils/responsive';

import {addToCart, fetchCart} from '../../../../redux/actions/cartSlice';
import {
  addToWishlist,
  removeFromWishlist,
} from '../../../../redux/actions/wishSlice';
import {
  useGetReviewbyProductIDQuery,
  useGetSimilarProductsQuery,
  useProductsavailableApiQuery,
} from '../../../../Api/EndPoints/products';

import OfferDetails from '../../../../components/BottomSheets/OfferSheet';
import FreeCard from '../../../../components/Cards/FreeCard';
import {fetchproductDetails} from '../../../../redux/actions/productSlice';
const {width, height} = Dimensions.get('window');

const LoadingComponent = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', gap: 12}}>
      <SkeletonLoader
        height={heightPercentageToDP('50%')}
        width={width * 0.9}
        borderRadius={12}
      />
      <View style={{flex: 1, gap: 8}}>
        <SkeletonLoader width={width * 0.2} height={20} borderRadius={5} />
        <SkeletonLoader width={width * 0.8} height={35} borderRadius={5} />
        <SkeletonLoader width={width * 0.9} height={40} borderRadius={5} />
        <View style={{flexDirection: 'row', gap: 8}}>
          {Array.from({length: 7}).map((_, index) => (
            <SkeletonLoader
              key={index}
              width={width * 0.1}
              height={30}
              borderRadius={5}
            />
          ))}
        </View>
        <View style={{flexDirection: 'row', gap: 8}}>
          {Array.from({length: 4}).map((_, index) => (
            <SkeletonLoader
              key={index}
              width={width * 0.2}
              height={30}
              borderRadius={5}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const ProdutDetails = ({navigation, route, onAuthStateChanged}) => {
  const {details: ProductDetails, loading: ProductLoading} = useSelector(
    state => state?.Product,
  );
  console.log('ProductLoading: ', ProductLoading);
  const dispatch = useDispatch();
  const user = useSelector(state => state?.Userdata?.user?.records);
  const {data: reviewData} = useGetReviewbyProductIDQuery({
    product_id: route?.params?.product_id,
  });
  const {data: similardata} = useGetSimilarProductsQuery({
    id: route?.params?.product_id,
  });
  const CartItems = useSelector(state => state?.Cartdata?.cart);
  const {showSnack, snackVisible} = useSnackBar();
  const [Loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedAttribute, setSelectedAttribute] = useState({});
  const [selectedItemId, setSelectedItemId] = useState('');
  const [showexpand, setshowexpand] = useState(true);
  const [slider, setSlider] = useState(false);
  const [index, setIndex] = useState(false);

  const formikRef = useRef(null);
  const OfferSheetRef = useRef(null);

  const ProductRecords = ProductDetails?.records;
  const {data: product_data, refetch: ProductRefetch} =
    useProductsavailableApiQuery({
      product_id: ProductRecords?.product_id,
      variant: selectedItemId,
      user_id: user?.id,
    });

  const handleAddtoCart = async () => {
    if (!user) {
      await Promise.all([DeleteValue('token'), DeleteValue('user')]);
      onAuthStateChanged();
    } else {
      if (ProductRecords?.in_cart) {
        dispatch(fetchCart(user?.id)).then(() => {
          navigation.navigate('Cart');
        });
      } else if (ProductRecords?.out_of_stock_status) {
        showSnack('Out of stock', 'warning');
      } else if (!ProductRecords?.is_active) {
        showSnack('Currently unavailable', 'warning');
      } else {
        OnCart();
      }
    }
  };

  useEffect(() => {
    dispatch(
      fetchproductDetails({
        product_slug: route?.params?.url_slug || route?.params?.product_slug,
        product_sku: route?.params?.product_sku || route?.params?.sku,
        userid: user?.id,
      }),
    );
  }, []);

  useEffect(() => {
    ProductRefetch();
  }, [selectedItemId]);

  const validationSchema = Yup.object().shape({
    zipcode: Yup.string().matches(/^\d{6}$/, 'Invalid zipcode format'),
  });

  const scrollViewRef = useRef(null);

  const openShare = () => {
    Share.share({
      message:
        `Check out this awesome product I found on ShopQ fashion platform ` +
        `http://develop.shopq.site/product-detail${route?.params?.url_slug}/?sku=${route?.params?.product_sku}`,
    });
  };

  const onFavorite = async () => {
    if (!user) {
      await Promise.all([DeleteValue('token'), DeleteValue('user')]);
      onAuthStateChanged();
    }
    if (user?.id) {
      if (ProductRecords?.is_favourite) {
        dispatch(removeFromWishlist(ProductRecords?.wishlist_id)).then(() => {
          dispatch(fetchCart(user?.id));
          showSnack('Product removed from Wishlist', 'success', 1500, () => {
            dispatch(
              fetchproductDetails({
                product_slug:
                  route?.params?.url_slug || route?.params?.product_slug,
                product_sku: route?.params?.product_sku || route?.params?.sku,
                userid: user?.id,
              }),
            );
          });
        });
      } else {
        dispatch(
          addToWishlist({
            product_id: ProductRecords?.product_id,
            user_id: user?.id,
            variant_id: ProductRecords?.variant_id,
          }),
        ).then(() => {
          dispatch(fetchCart(user?.id));
          showSnack('Product added to Wishlist', 'success', 1500, () => {
            dispatch(
              fetchproductDetails({
                product_slug:
                  route?.params?.url_slug || route?.params?.product_slug,
                product_sku: route?.params?.product_sku || route?.params?.sku,
                userid: user?.id,
              }),
            );
          });
        });
      }
    }
  };
  const OnCart = async () => {
    if (!user) {
      await Promise.all([DeleteValue('token'), DeleteValue('user')]);
      onAuthStateChanged();
    } else {
      dispatch(
        addToCart({
          variant_id: ProductRecords?.variant_id,
          product_id: ProductRecords?.product_id,
          status: 'pending',
          user_id: user?.id,
          is_selected: true,
        }),
      ).then(() => {
        showSnack('Item added to cart', 'success');
      });
    }
  };
  const Buy_now = async () => {
    if (!user) {
      await Promise.all([DeleteValue('token'), DeleteValue('user')]);
      onAuthStateChanged();
    }
    if (user?.id) {
      if (ProductRecords?.in_cart) {
        navigation.navigate('Cart');
      }
      dispatch(
        addToCart({
          variant_id: ProductRecords?.variant_id,
          product_id: ProductRecords?.product_id,
          status: 'pending',
          user_id: user?.id,
          is_selected: true,
        }),
      ).then(() => {
        showSnack('Item added to cart', 'success', 1500, () => {
          navigation.navigate('Cart');
        });
      });
    }
  };

  const handleAttributes = (key, value) => {
    if (Array.isArray(value) && value.length > 0) {
      value = value[0];
    }

    setSelectedAttribute(prev => ({
      ...prev,
      [key]: value,
    }));
    setSelectedItemId(value?.id);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.WHITE}}>
      <PrimaryHeader
        onPress={() => navigation.goBack()}
        headerName={'Product Details'}
        children1={
          !user ? null : (
            <BadgedIcon
              count={CartItems?.length}
              children={
                <FontAwesome6
                  name="bag-shopping"
                  color={COLORS.BLACK}
                  size={20}
                  onPress={() => navigation.navigate('Cart')}
                />
              }
            />
          )
        }
      />
      {ProductLoading.details ? (
        <LoadingComponent />
      ) : (
        <ScrollView
          scrollEnabled={Loading ? false : true}
          ref={scrollViewRef}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1, backgroundColor: '#FFFFFF'}}>
          <View style={{marginTop: 12}}>
            <View
              style={{position: 'absolute', zIndex: 10, right: 30, top: 10}}>
              <View
                style={{
                  height: 38,
                  width: 38,
                  borderRadius: 19,
                  backgroundColor: '#FFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: '#9B9FA3',
                }}>
                <Octicons
                  name={ProductRecords?.is_favourite ? 'heart-fill' : 'heart'}
                  size={20}
                  onPress={() => onFavorite()}
                  color={ProductRecords?.is_favourite ? '#EF1F21' : '#9B9FA3'}
                />
              </View>
              <ShareIcon onPress={() => openShare()} style={{marginTop: 10}} />
            </View>
            <ProductCarousal
              data={ProductRecords?.product_images}
              onclick={e => {
                setIndex(e);
                setSlider(true);
              }}
            />
          </View>
          <View style={{marginHorizontal: 16}}>
            <Text
              style={{
                fontSize: RFValue(14),
                color: '#A3A6A8',
                fontFamily: FONTS.MEDIUM,
              }}>
              {ProductRecords?.brand_name}
            </Text>
          </View>
          <View style={{marginHorizontal: 16}}>
            <>
              <Text
                style={{
                  fontFamily: FONTS.SEMI_BOLD,
                  fontSize: RFValue(16),
                  color: '#061018',
                }}>
                {capitalizeFirstLetter(ProductRecords?.title?.trimStart())}
              </Text>
              <View
                flexWrap="wrap"
                flexDirection="row"
                justifyContent="space-between"
                paddingHorizontal={'xm'}
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <Text
                  numberOfLines={showexpand ? 2 : null}
                  style={{
                    fontSize: RFValue(14),
                    color: '#8B8F93',
                    fontFamily: FONTS.MEDIUM,
                  }}>
                  {ProductRecords?.seo_description?.length >= 150
                    ? showexpand
                      ? `${ProductRecords?.seo_description?.slice(0, 150)}`
                      : ProductRecords?.seo_description
                    : ProductRecords?.seo_description}
                </Text>
                {ProductRecords?.product_description?.length >= 125 ? (
                  <Pressable
                    onPress={() => setshowexpand(!showexpand)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: RFValue(14),
                        fontWeight: '600',
                        color: '#0E1827',
                        overflow: 'scroll',
                        fontFamily: FONTS.MEDIUM,
                      }}>
                      {showexpand ? 'Read More' : 'Read Less'}
                    </Text>
                  </Pressable>
                ) : null}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'baseline',
                  gap: 4,
                }}>
                <Text
                  style={{
                    fontSize: RFValue(26),
                    fontFamily: FONTS.BOLD,
                    color: '#061018',
                  }}>
                  &#x20B9;{ProductRecords?.product_price?.toLocaleString()}{' '}
                </Text>
                {ProductRecords?.tax_included_price ? (
                  <Text
                    style={{
                      textDecorationLine: 'line-through',
                      color: '#60666A',
                      fontFamily: FONTS.MEDIUM,
                      fontSize: RFValue(14),
                      verticalAlign: 'center',
                    }}>
                    {ProductRecords?.tax_included_price}
                  </Text>
                ) : null}
                {ProductRecords?.offer_percentage ? (
                  <Text
                    style={{
                      color: '#3E8A23',
                      fontFamily: FONTS.MEDIUM,
                      fontSize: RFValue(14),
                    }}>
                    {ProductRecords?.offer_percentage}% off
                  </Text>
                ) : null}

                {(ProductRecords?.out_of_stock_status ||
                  (ProductRecords?.current_stock > 0 &&
                    ProductRecords?.current_stock < 5) ||
                  !ProductRecords?.is_active) && (
                  <Text
                    style={{
                      color: COLORS.RED,
                      fontSize: RFValue(14),
                      fontFamily: FONTS.MEDIUM,
                    }}>
                    {ProductRecords?.out_of_stock_status
                      ? 'Out of stock'
                      : ProductRecords?.current_stock > 0 &&
                        ProductRecords?.current_stock < 5
                      ? `Hurry, only ${ProductRecords?.current_stock} left!`
                      : 'Currently unavailable'}
                  </Text>
                )}
              </View>
              {ProductRecords?.review_rating > 0 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 10,
                    gap: 5,
                  }}>
                  <Fontisto name="star" color="#EBA83A" size={RFValue(16)} />
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('ReviewsScreen', {
                        product_id: ProductRecords?.product_id,
                      });
                    }}>
                    <View style={{flexDirection: 'row', gap: 5}}>
                      <Text
                        style={{
                          fontFamily: FONTS.MEDIUM,
                          fontSize: RFValue(16),
                          color: '#757A7E',
                        }}>
                        {Math.floor(ProductRecords?.review_rating)}
                      </Text>
                      <Text
                        style={{
                          fontFamily: FONTS.REGULAR,
                          fontSize: RFValue(16),
                          color: '#757A7E',
                        }}>
                        (
                        {ProductRecords?.review_count
                          ? ProductRecords?.review_count
                          : null}{' '}
                        Reviews)
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}
              {ProductRecords?.product_offer?.[0]?.offer_type ===
              'Free Item' ? (
                <FreeCard
                  data={ProductRecords}
                  onPress={() => {
                    OfferSheetRef?.current.show();
                  }}
                />
              ) : ProductRecords?.product_offer?.[0]?.offer_type ===
                'Buy One Get One Free' ? (
                <LinearGradient
                  colors={['#EF1F21', '#F17C08']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={{
                    alignSelf: 'flex-start',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderBottomRightRadius: 12,
                    borderTopRightRadius: 12,
                  }}>
                  <Text
                    style={{
                      includeFontPadding: false,
                      fontFamily: FONTS.MEDIUM,
                      fontSize: RFValue(14),
                      color: '#fff',
                    }}>
                    BUY ONE, GET ONE FREE
                  </Text>
                </LinearGradient>
              ) : null}
            </>
          </View>

          <View style={{paddingHorizontal: 10}}>
            {Object.entries(ProductRecords?.variants || {}).map(
              ([key, value]) => {
                if (key.toLowerCase() !== 'color') return null;

                const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);

                return (
                  <View style={{marginBottom: 15, gap: 12}} key={key}>
                    <Text
                      style={{
                        fontSize: RFValue(16),
                        color: '#060108',
                        fontFamily: FONTS.SEMI_BOLD,
                      }}>
                      {formattedKey}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      {value?.map(color => {
                        const isSelected = selectedColor?.id === color?.id;
                        return (
                          <View
                            key={color?.id}
                            style={{
                              padding: 4,
                              borderRadius: 100,
                              borderColor: isSelected
                                ? '#061018'
                                : 'transparent',
                              borderWidth: isSelected ? 1 : 0,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: 8,
                            }}>
                            <TouchableOpacity
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                                backgroundColor: color?.title.toLowerCase(),
                                borderColor: '#000',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: isSelected ? 0 : 1,
                              }}
                              onPress={() => {
                                setSelectedColor(color);
                                handleAttributes(key, color);
                                setSelectedItemId(color.id);
                              }}>
                              {isSelected &&
                                (color?.title.toLowerCase() === 'white' ? (
                                  <TickIcon1 />
                                ) : (
                                  <TickIcon />
                                ))}
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              },
            )}
          </View>

          <View style={{paddingHorizontal: 10}}>
            {Object.entries(ProductRecords?.variants || {}).map(
              ([key, value]) => {
                if (key.toLowerCase() === 'color') return null;

                const isSizeVariant = key.toLowerCase() === 'size';
                const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);

                return (
                  <View style={{marginBottom: 15, gap: 12}} key={key}>
                    <Text
                      style={{
                        color: '#060108',
                        fontSize: RFValue(16),
                        fontFamily: 'Manrope-Bold',
                      }}>
                      {formattedKey}
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 10,
                        }}>
                        {value?.map(item => {
                          const isSelected =
                            selectedAttribute?.[key]?.id === item.id;
                          return (
                            <TouchableOpacity
                              key={item.id}
                              style={{
                                borderWidth: isSelected ? 1 : 0,
                                borderColor: isSelected
                                  ? '#0E1827'
                                  : 'transparent',
                                height: isSizeVariant ? height * 0.054 : 'auto',
                                borderRadius: 50,
                                margin: 5,
                                marginBottom: 10,
                                backgroundColor: isSelected
                                  ? '#FFF'
                                  : '#0610180A',
                                minWidth: isSizeVariant
                                  ? width * 0.114
                                  : 'auto',
                                padding: item?.title?.length === 1 ? 10 : 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                              onPress={() => handleAttributes(key, item)}>
                              <Text
                                style={{
                                  fontSize: RFValue(12),
                                  fontWeight: 'bold',
                                  opacity: isSelected ? 1 : 0.5,
                                  color: isSelected ? '#0E1827' : '#000000',
                                }}>
                                {item?.title.toUpperCase()}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </ScrollView>
                  </View>
                );
              },
            )}
          </View>

          <View style={{marginHorizontal: 16}}>
            <Formik
              initialValues={{zipcode: '', result: false}}
              innerRef={formikRef}
              validationSchema={validationSchema}
              onSubmit={values => {
                setLoading(true);
                fetchPincode(values?.zipcode).then(res => {
                  if (typeof res == 'object') {
                    const isDeliverable = res[0]?.PostOffice?.find(
                      item => item?.Country == 'India',
                    );
                    if (isDeliverable) {
                      formikRef?.current?.setFieldValue('result', true);
                      formikRef?.current?.setFieldError('zipcode', '');
                      setLoading(false);
                    } else {
                      formikRef?.current?.setFieldValue('result', false);
                      formikRef?.current?.setFieldError(
                        'zipcode',
                        'Not available to your location',
                      );
                      setLoading(false);
                    }
                  }
                });
              }}>
              {({handleChange, handleSubmit, values, errors, isValid}) => (
                <View style={{marginVertical: 15, gap: 8}}>
                  <Text
                    style={{
                      color: '#060108',
                      fontSize: RFValue(14),
                      fontFamily: FONTS.SEMI_BOLD,
                    }}>
                    Deliver To
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                    }}>
                    <TextInput
                      maxLength={6}
                      placeholder="Zipcode"
                      style={{
                        flexGrow: 1,
                        fontSize: RFValue(14),
                        fontFamily: FONTS.REGULAR,
                        borderBottomWidth: 1,
                        borderBottomColor: errors.zipcode
                          ? COLORS.RED
                          : '#B8BABC',
                        color: '#0E1827',
                      }}
                      keyboardType="numeric"
                      onChangeText={text => {
                        handleChange('zipcode')(text);
                      }}
                      value={values.zipcode}
                    />
                    <PrimaryButton
                      title={'Check'}
                      backgroundColor={COLORS.WHITE}
                      textColor={COLORS.BLACK}
                      fontFamily={FONTS.SEMI_BOLD}
                      otherstyles={{
                        borderColor: '#0E1827',
                        borderWidth: 1,
                        paddingVertical: 10,
                        borderRadius: 8,
                      }}
                      disabled={!isValid || values?.zipcode?.length == 0}
                      onPress={Loading ? null : handleSubmit}
                      ProductLoading={Loading}
                    />
                  </View>
                  {errors.zipcode && values?.zipcode ? (
                    <Text
                      style={{
                        fontSize: RFValue(14),
                        fontFamily: FONTS.REGULAR,
                        color: COLORS.RED,
                      }}>
                      {errors.zipcode}
                    </Text>
                  ) : values?.result ? (
                    <Text
                      style={{
                        fontSize: RFValue(14),
                        fontFamily: FONTS.REGULAR,
                        color: COLORS.GREEN,
                      }}>
                      Delivery Within 6-8 business days to {values?.zipcode}
                    </Text>
                  ) : null}
                </View>
              )}
            </Formik>
          </View>

          {/* Description Section */}
          <View style={{marginHorizontal: 16}}>
            {ProductRecords?.productDetails ? (
              <Text
                style={{
                  color: '#060108',
                  fontFamily: FONTS.SEMI_BOLD,
                  fontSize: RFValue(16),
                }}>
                Product Details
              </Text>
            ) : null}
            <View>
              <RenderHTML
                systemFonts={[FONTS.REGULAR, FONTS.BOLD, FONTS.SEMI_BOLD]}
                baseStyle={{
                  color: '#000',
                  fontSize: RFValue(14),
                  fontFamily: FONTS.REGULAR,
                }}
                source={{html: ProductRecords?.productDetails}}
                contentWidth={width}
              />
            </View>
          </View>

          {/* Banner Images */}
          <FlatList
            scrollEnabled={false}
            data={ProductRecords?.additional_images}
            ItemSeparatorComponent={() => <View style={{height: 10}} />}
            contentContainerStyle={{
              paddingVertical: 24,
            }}
            renderItem={({item}) => (
              <Image
                source={{uri: item}}
                style={{
                  alignSelf: 'center',
                  width: '100%',
                  height: height * 0.2,
                  borderRadius: 12,
                }}
              />
            )}
          />
          <View style={{marginHorizontal: 16}}>
            {reviewData?.records?.length > 0 ? (
              <>
                <Reviewscreen
                  component={true}
                  navigation={navigation}
                  product_id={route?.params?.product_id}
                />
                {reviewData?.records?.length > 5 ? (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                      }}>
                      <Pressable
                        onPress={() =>
                          navigation.navigate('Reviews', {
                            product_id: route?.params?.product_id,
                          })
                        }>
                        <Text
                          style={{
                            fontSize: RFValue(14),
                            color: '#0E1827',
                            fontFamily: FONTS.SEMI_BOLD,
                            marginLeft: 5,
                          }}>
                          View All
                        </Text>
                      </Pressable>
                      <FontAwesome6
                        name="arrow-right-long"
                        size={14}
                        color={'#0E1827'}
                      />
                    </View>
                  </>
                ) : null}
              </>
            ) : (
              <View style={{marginTop: 24}}>
                <NoReviewScreen alignSelf={'center'} />
                <Text
                  style={{
                    marginTop: 16,
                    right: 10,
                    fontSize: RFValue(14),
                    color: COLORS.GREY,
                    fontFamily: FONTS.MEDIUM,
                    textAlign: 'center',
                    includeFontPadding: false,
                  }}>
                  No reviews yet..!
                </Text>
              </View>
            )}
          </View>
          {similardata?.records?.length > 0 ? (
            <View
              style={{
                backgroundColor: '#F6FBFF',
                gap: 16,
                marginTop: 20,
                paddingVertical: 16,
              }}>
              <Text
                style={{
                  fontSize: RFValue(16),
                  fontFamily: FONTS.SEMI_BOLD,
                  color: '#060108',
                  paddingHorizontal: 16,
                }}>
                Similar Products
              </Text>
              <FlatList
                horizontal
                list
                showsHorizontalScrollIndicator={false}
                data={similardata?.records || []}
                ItemSeparatorComponent={() => <View style={{width: 10}} />}
                ListHeaderComponent={() => <View style={{width: 16}} />}
                renderItem={({item}) => (
                  <PreviewCard
                    data={item}
                    onPress={() => {
                      navigation.push('ProductDetails', {
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
        </ScrollView>
      )}
      <View style={{paddingHorizontal: 16, paddingVertical: 12}}>
        <Secondary
          fontFamily1={FONTS.SEMI_BOLD}
          fontFamily2={FONTS.SEMI_BOLD}
          title1={ProductRecords?.in_cart ? 'Go to Cart' : 'Add to Cart'}
          title2={'Buy Now'}
          isButton2Disabled={
            ProductRecords?.in_cart || ProductRecords?.out_of_stock_status
          }
          onPress1={handleAddtoCart}
          onPress2={Buy_now}
          backgroundColor1={COLORS.WHITE}
          backgroundColor2={COLORS.PRIMARY}
          textColor1={COLORS.PRIMARY}
          textColor2={COLORS.WHITE}
          otherstyles1={{flex: 1, paddingVertical: 12, borderRadius: 12}}
          otherstyles2={{flex: 1, paddingVertical: 12, borderRadius: 12}}
        />
      </View>

      {/* Offer Details */}
      <ActionSheet
        closable
        gestureEnabled
        ref={OfferSheetRef}
        containerStyle={{
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}>
        <OfferDetails
          data={ProductRecords}
          onClose={() => OfferSheetRef.current?.hide()}
        />
      </ActionSheet>

      {/* Image Slider Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={slider}
        onRequestClose={() => {
          setSlider(false);
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              position: 'absolute',
              top: 30,
              left: 10,
              zIndex: 1,
            }}>
            <TouchableOpacity
              onPress={() => setSlider(false)}
              style={{
                backgroundColor: '#fff',
                borderRadius: 50,
                padding: 10,
                elevation: 5,
              }}>
              <Feather name="x" size={24} color={COLORS.PRIMARY} />
            </TouchableOpacity>
          </View>
          <ImageViewer
            backgroundColor="transparent"
            imageUrls={ProductRecords?.product_images?.map(image => ({
              url: image,
            }))}
            index={index}
            enableSwipeDown
            style={{width: '100%', height: '100%', backgroundColor: '#fff'}}
            onSwipeDown={() => setSlider(false)}
            saveToLocalByLongPress={false}
          />
        </View>
      </Modal>

      <View
        style={{
          padding: 10,
          position: 'absolute',
          bottom: 70,
          width: '100%',
        }}>
        <SnackBar
          show={snackVisible?.show}
          content={snackVisible?.content}
          type={snackVisible?.type}
        />
      </View>
    </SafeAreaView>
  );
};
ProdutDetails.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
  item: PropTypes.any,
  onAuthStateChanged: PropTypes.func,
};

export default React.memo(ProdutDetails);
