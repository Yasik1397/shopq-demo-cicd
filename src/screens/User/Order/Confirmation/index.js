//<--------------------------Libraries--------------------------->
import PropTypes from 'prop-types';
import React, {useRef, useState} from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {FlatList as FlatSheet} from 'react-native-actions-sheet';
import RazorpayCheckout from 'react-native-razorpay';
import Config from 'react-native-config';
import ActionSheet from 'react-native-actions-sheet';
import {useDispatch, useSelector} from 'react-redux';
//<--------------------------Assets------------------------------>
import AntDesign from 'react-native-vector-icons/AntDesign';
import Addressicon from '../../../../assets/Icons/location.svg';
import RadioIcon from 'react-native-vector-icons/MaterialIcons';
//<--------------------------Functions---------------------------->
import {
  capitalizeFirstLetter,
  truncateText,
} from '../../../../utils/TextFormat';
//<--------------------------Constants------------------------->
import {COLORS, FONTS} from '../../../../constants/Theme';
import {RFValue} from '../../../../utils/responsive';
//<--------------------------Components-------------------------->
import CouponSheet from '../../../../components/BottomSheets/CouponSheet';
import PrimaryButton from '../../../../components/Buttons/Primary';
import AddressCard from '../../../../components/Cards/AddressCard';
import OrderCard from '../../../../components/Cards/OrderCard';
import PriceSummary from '../../../../components/Cards/PriceCard';
import PrimaryHeader from '../../../../components/Header';
import PrimaryInput from '../../../../components/Input/PrimaryInput';
import SnackBar, {useSnackBar} from '../../../../components/SnackBar';
//<--------------------------Api-------------------------->
import {validateCoupon} from '../../../../redux/Api/Products/Coupon';
import {
  usePostPaymentMutation,
  useUpdatePaymentMutation,
} from '../../../../redux/Api/Products/Payment';
import {useGetSummaryQuery} from '../../../../Api/EndPoints/orders';
import {fetchCart} from '../../../../redux/actions/cartSlice';

//Import assets for this file
const OrderConfirmation = ({navigation}) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state?.Userdata?.user?.records);
  const {showSnack, snackVisible} = useSnackBar();
  const [loading, setLoading] = useState(false);
  const CartItems = useSelector(state => state?.Cartdata?.cart);

  const {
    data: couponData,
    validationResult,
    validationError,
  } = useSelector(state => state.CouponData);

  const [address, setAddress] = useState(
    user?.address ? user?.address[0] : null,
  );
  const settingsData = useSelector(state => state?.settings?.data);

  const [coupon, setCoupon] = useState('');

  const [refreshing, setRefreshing] = useState(false);

  const AddressSheetRef = useRef();
  const CouponSheetRef = useRef();

  const [createPayment] = usePostPaymentMutation();
  const [updatePayment] = useUpdatePaymentMutation();

  const calculateCartTotal = data => {
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
          `Invalid price or quantity for product ID ${current.product_id}`,
        );
        return total;
      }
    }, 0);

    return totalCost;
  };
  const CartCost = calculateCartTotal(CartItems);
  const {data: summarydata} = useGetSummaryQuery({
    amount: CartCost,
  });

  const HandlevalidateCoupon = async () => {
    dispatch(
      validateCoupon({
        id: coupon?.coupon_code,
        user_id: user?.id,
      }),
    ).then(res => {
      console.log('res: ', res);
      showSnack(res?.payload?.message, 'success', 1500);
    });
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      const selectedItems = CartItems?.filter(
        item =>
          item?.current_stock > 0 &&
          !item?.out_of_stock_status &&
          item?.is_selected,
      );

      if (!selectedItems?.length) {
        showSnack('No valid items selected for checkout', 'error');
        setLoading(false);
        return;
      }

      const order = {
        storeId: '1001',
        user_id: user?.id,
        user_details: {
          user_id: user?.id || '',
          email: user?.email || '',
          full_name: user?.full_name || '',
          mobile_number: user?.mobile_number || '',
          country_code: user?.country_code || '',
        },
        status_history: [{status: 'ordered', date: Date.now()}],
        over_all_status: 'OrderPlaced',
        payment_status: 'pending',
        status: 'Ordered',
        is_selected: true,
        items: selectedItems.map(item => ({
          ...item,
          product_id: item?.product_id,
          product_details: {
            ...item?.product_details,
            product_quantity: item?.quantity,
          },
        })),
        shipping_charge: 0,
        track_status: 'OrderPlaced',
        sub_total: summarydata?.records?.total_price || 0,
        total_price: summarydata?.records?.total_price || 0,
        address: {
          userName: address?.userName || '',
          streetAddress1: address?.streetAddress1 || '',
          city: address?.city || '',
          zipcode: address?.zipcode || '',
          landmark: address?.landmark || '',
          mobileNumber: address?.mobileNumber || '',
          streetAddress2: address?.streetAddress2 || '',
          land: address?.land || '',
          addressTitle: address?.addressTitle || '',
          primary: address?.primary || false,
        },
      };

      const res = await createPayment(order);
      console.log('res: ', res);

      if (!res?.data?.success) {
        showSnack(res?.data?.message, 'error');
        setLoading(false);
        return;
      }

      const paymentDetails = res?.data?.records;
      const options = {
        description: 'ShopQ Order payment',
        image: settingsData?.records?.header?.image,
        currency: 'INR',
        key: Config.RAZORPAY_KEY,
        amount: (paymentDetails?.order_details?.total_price || 0) * 100,
        name: 'ShopQ',
        prefill: {
          email: user?.email,
          contact: user?.mobile_number,
          name: user?.full_name,
        },
        theme: {color: '#0E1827'},
      };

      RazorpayCheckout.open(options)
        .then(async val => {
          try {
            const requestData = {
              razorpay_payment_id: 'demo_payment_L6m3cToeH9FHW',
              razorpay_order_id: paymentDetails?.razorpay_order_id,
              razorpay_signature: 'demo_sign_L6m3cToeH9FHW7',
            };

            const updateRes = await updatePayment(requestData);
            console.log('updateRes: ', updateRes?.error?.data?.detail);

            if (updateRes?.data?.success) {
              dispatch(fetchCart(user?.id));
              showSnack('Order placed successfully', 'success', 1500, () => {
                navigation.navigate('PaymentSuccess', {
                  infos: {
                    razorpay_payment_id: val.razorpay_payment_id,
                    order_id: paymentDetails?.order_id,
                    total_price: paymentDetails?.order_details?.total_price,
                    refId: paymentDetails?.razorpay_order_id,
                  },
                });
              });
            } else {
              showSnack(
                updateRes?.error?.data?.detail?.error,
                'error',
                1500,
                () => {
                  dispatch(fetchCart(user?.id));
                  navigation.navigate('PaymentFailure', {
                    infos: {
                      razorpay_payment_id: val.razorpay_payment_id,
                      order_id: paymentDetails?.order_id,
                      total_price: paymentDetails?.order_details?.total_price,
                      refId: paymentDetails?.razorpay_order_id,
                    },
                  });
                },
              );
            }
          } catch (error) {
            console.error('Error in updating payment:', error);
            showSnack(
              'Payment update failed, please try again',
              'error',
              1500,
              () => {
                dispatch(fetchCart(user?.id));
                navigation.navigate('PaymentFailure', {
                  infos: {
                    razorpay_payment_id: val.razorpay_payment_id,
                    order_id: paymentDetails?.order_id,
                    total_price: paymentDetails?.order_details?.total_price,
                    refId: paymentDetails?.razorpay_order_id,
                  },
                });
              },
            );
          }
        })
        .catch(() => {
          showSnack('Payment failed, please try again', 'error', 1500, () => {
            dispatch(fetchCart(user?.id));
            navigation.navigate('PaymentFailure', {
              infos: {
                razorpay_payment_id: paymentDetails?.razorpay_payment_id,
                order_id: paymentDetails?.order_id,
                total_price: paymentDetails?.order_details?.total_price,
                refId: paymentDetails?.razorpay_order_id,
              },
            });
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error('Error placing order:', error);
      showSnack('Order placement failed, please try again', 'error');
      setLoading(false);
    }
  };

  const handlePress = item => {
    setAddress(address === item ? null : item);
    AddressSheetRef?.current?.hide();
  };
  const AddAddressfun = () => {
    navigation.navigate('AddAddress');
    AddressSheetRef?.current?.hide();
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.WHITE}}>
      <PrimaryHeader
        onPress={() => navigation.goBack()}
        headerName={'Order Confirmation'}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{flexGrow: 1, backgroundColor: COLORS.WHITE}}
        showsVerticalScrollIndicator={false}>
        <View style={{paddingHorizontal: 16}}>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={
              CartItems
                ? CartItems?.filter(item => item?.is_selected === true)
                : [] || []
            }
            ItemSeparatorComponent={() => (
              <View
                style={{
                  marginVertical: 16,
                  height: 1,
                  backgroundColor: '#E8E8E8',
                }}
              />
            )}
            renderItem={({item}) => {
              return <OrderCard type={'orders'} data={item} />;
            }}
          />
        </View>
        <View style={{margin: 10, gap: 5}}>
          <View>
            <Text
              style={{
                fontSize: RFValue(14),
                color: '#061018',
                fontFamily: FONTS.SEMI_BOLD,
              }}>
              Delivering to
            </Text>
          </View>
          {user?.address?.length > 0 ? (
            <View
              style={{
                flex: 1,
                flexGrow: 1,
                flexDirection: 'row',
                gap: 10,
                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'row', gap: 8}}>
                <Addressicon />
                <View style={{}}>
                  <Text
                    style={{
                      fontSize: RFValue(12),
                      color: '#061018',
                      fontFamily: FONTS.BOLD,
                    }}>
                    {address?.addressTitle
                      ? capitalizeFirstLetter(address?.addressTitle)
                      : 'Address'}
                  </Text>
                  <Text
                    style={{
                      fontSize: RFValue(12),
                      color: '#757A7E',
                      fontFamily: FONTS.MEDIUM,
                    }}>
                    {truncateText(
                      `${address?.streetAddress1},${address?.streetAddress2}${
                        address?.city ? ', ' + address?.city : ''
                      }${address?.land ? ', ' + address?.land : ''}${
                        address?.zipcode ? ' - ' + address?.zipcode : ''
                      }`,
                      30,
                    )}
                  </Text>
                  <Text
                    style={{
                      fontSize: RFValue(12),
                      color: '#757A7E',
                      fontFamily: FONTS.MEDIUM,
                    }}>
                    Ph : {address?.mobileNumber?.slice(-10)}
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => {
                  AddressSheetRef?.current?.show();
                }}>
                <Text
                  style={{
                    fontSize: RFValue(12),
                    color: COLORS.PRIMARY,
                    fontFamily: FONTS.BOLD,
                  }}>
                  Change
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
                marginTop: 10,
              }}
              onPress={() => navigation.navigate('AddAddress')}>
              <Text
                style={{
                  color: COLORS.PRIMARY,
                  fontSize: RFValue(14),
                  fontFamily: FONTS.BOLD,
                }}>
                &#43; Add New Address
              </Text>
            </Pressable>
          )}
        </View>
        {couponData?.records?.length > 0 ? (
          <View
            style={{
              gap: 12,
              borderRadius: 4,
              margin: 16,
              paddingHorizontal: 4,
              paddingVertical: 8,
              backgroundColor: '#FAFAFA',
            }}>
            <Text
              style={{
                fontSize: RFValue(14),
                color: COLORS.BLACK,
                fontFamily: FONTS.MEDIUM,
              }}>
              Have a coupon code?
            </Text>
            <PrimaryInput
              placeholder={'Ex: FREE50'}
              label={'Enter code'}
              value={coupon?.coupon_code || ''}
              rightchild={
                <TouchableOpacity onPress={HandlevalidateCoupon}>
                  <Text style={{color: COLORS.PRIMARY, fontSize: RFValue(14)}}>
                    APPLY
                  </Text>
                </TouchableOpacity>
              }
            />
            <Text></Text>
            <Text
              onPress={() => CouponSheetRef?.current?.show()}
              style={{
                textDecorationLine: 'underline',
                fontSize: RFValue(14),
                color: COLORS.BLACK,
                fontFamily: FONTS.MEDIUM,
                textAlign: 'center',
                textDecorationColor: COLORS.BLACK,
              }}>
              Select from available coupons
            </Text>
          </View>
        ) : null}
        <View style={{margin: 10, gap: 10}}>
          <Text
            style={{
              fontSize: RFValue(14),
              color: '#061018',
              fontFamily: FONTS.SEMI_BOLD,
            }}>
            Payment method
          </Text>
          <Pressable
            style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
            <RadioIcon
              // name={isRadioSelected ? "radio-button-on" : "radio-button-off"}
              name={'radio-button-on'}
              color="#09141EE5"
              size={20}
            />
            <Text
              style={{
                fontSize: RFValue(14),
                color: '#09141EE5',
                fontFamily: FONTS.MEDIUM,
              }}>
              Online Payment
            </Text>
          </Pressable>
        </View>

        <View style={{paddingHorizontal: 16}}>
          <PriceSummary data={summarydata?.records} cartItems={CartItems} />
        </View>
      </ScrollView>
      {/* Bottom button */}
      <View
        style={{
          backgroundColor: COLORS.WHITE,
          shadowColor: 'black',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.6,
          shadowRadius: 4,
          elevation: 5,
          bottom: 0,
          width: '100%',
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 30,
          }}>
          <View style={{paddingRight: 10}}>
            <Text
              style={{
                color: COLORS.BLACK,
                fontFamily: FONTS.SEMI_BOLD,
                fontSize: RFValue(12),
              }}>
              Total
            </Text>
            <Text
              style={{
                color: COLORS.BLACK,
                fontFamily: FONTS.SEMI_BOLD,
                fontSize: RFValue(16),
              }}>
              &#8377;{' '}
              {summarydata?.records?.total_price
                ? summarydata?.records?.total_price?.toLocaleString()
                : 0}
            </Text>
          </View>
          <PrimaryButton
            isLoading={loading}
            disabled={!address}
            onPress={() => handlePlaceOrder()}
            otherstyles={{flex: 1, paddingVertical: 14, borderRadius: 12}}
            title={'Place Order'}
          />
        </View>
      </View>

      <View
        style={{
          padding: 10,
          position: 'absolute',
          bottom: 65,
          width: '100%',
          alignSelf: 'center',
        }}>
        <SnackBar
          show={snackVisible.show}
          content={snackVisible.content}
          type={snackVisible.type}
        />
      </View>
      <ActionSheet
        indicatorStyle={{backgroundColor: '#D0D1D1', marginTop: 12}}
        containerStyle={{
          height: '75%',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
        closable
        gestureEnabled
        openAnimationConfig={{
          timing: {duration: 500},
          bounciness: 0,
        }}
        ref={AddressSheetRef}>
        <FlatSheet
          ListHeaderComponentStyle={{paddingBottom: 24}}
          ListHeaderComponent={() => (
            <View>
              <Text
                style={{
                  color: '#0E1827',
                  fontSize: RFValue(16),
                  fontFamily: FONTS.SEMI_BOLD,
                }}>
                Change Delivery Address
              </Text>
            </View>
          )}
          contentContainerStyle={{padding: 16}}
          showsVerticalScrollIndicator={false}
          scrollToOverflowEnabled={false}
          ItemSeparatorComponent={() => <View style={{height: 24}} />}
          data={user?.address || []}
          renderItem={({item, index}) =>
            Object.keys(user?.address[index])?.length === 0 ? null : (
              <AddressCard
                item={item}
                isSelected={address === item}
                onPress={handlePress}
              />
            )
          }
          ListFooterComponentStyle={{
            paddingVertical: 16,
          }}
          keyExtractor={item => item.id}
        />
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            padding: 16,
          }}
          onPress={() => AddAddressfun()}>
          <AntDesign name="pluscircleo" size={18} color={COLORS.PRIMARY} />
          <Text
            style={{
              color: '#09141EE5',
              fontFamily: FONTS.MEDIUM,
              fontSize: RFValue(16),
              textAlign: 'center',
            }}>
            Add new address
          </Text>
        </TouchableOpacity>
      </ActionSheet>
      <ActionSheet
        indicatorStyle={{backgroundColor: '#D0D1D1', marginTop: 12}}
        containerStyle={{
          height: '75%',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
        closable
        gestureEnabled
        openAnimationConfig={{
          timing: {duration: 500},
          bounciness: 0,
        }}
        ref={CouponSheetRef}>
        <CouponSheet
          data={couponData?.records}
          onApply={item => {
            setCoupon(item);
            CouponSheetRef?.current?.hide();
          }}
        />
      </ActionSheet>
    </SafeAreaView>
  );
};
OrderConfirmation.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};
export default React.memo(OrderConfirmation);
