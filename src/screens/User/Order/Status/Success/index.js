//<--------------------------Libraries--------------------------->
import Clipboard from '@react-native-clipboard/clipboard';
import PropTypes from 'prop-types';
import React, {useEffect, useRef} from 'react';
import {
  BackHandler,
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import RNFS from 'react-native-fs';
//<--------------------------Components-------------------------->
import PrimaryButton from '../../../../../components/Buttons/Primary';
import PrimaryHeader from '../../../../../components/Header';
import SnackBar, {useSnackBar} from '../../../../../components/SnackBar';
//<--------------------------Assets------------------------------>
import Copyicon from 'react-native-vector-icons/Feather';
import Addressicon from '../../../../../assets/Icons/location.svg';
import Paymenticon from '../../../../../assets/Icons/payment.svg';
//<--------------------------Redux------------------------------>
import {useGetOrderDetailsQuery} from '../../../../../Api/EndPoints/orders';
//<--------------------------Functions------------------------------>
import {capitalizeFirstLetter} from '../../../../../utils/TextFormat';

import {COLORS, FONTS} from '../../../../../constants/Theme';
import {RFValue} from '../../../../../utils/responsive';

//Import assets for this file
const PaymentSuccess = ({navigation, route}) => {
  const data = route?.params;
  const {showSnack, snackVisible} = useSnackBar();
  const scrollViewRef = useRef(null);
  const user = useSelector(state => state?.Userdata?.user?.records);
  const {data: orderdetails} = useGetOrderDetailsQuery(data?.infos?.order_id);

  const copyToClipboard = text => {
    Clipboard.setString(text);
    showSnack('Copied to clipboard', 'success', 2000);
  };
  const handleDownload = async () => {
    try {
      const url = `invoices/Invoice-${data?.infos?.order_id}.pdf`;

      RNFS.writeFile(url, data?.infos?.invoice, 'base64').then(() => {});
      showSnack('Invoice downloaded successfully', 'success', 2000);
    } catch (error) {
      showSnack('Something went wrong', 'error');
      console.log(error);
    }
  };

  useEffect(() => {
    const handleBackPress = () => {
      navigation.navigate('Home');
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [navigation]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.WHITE}}>
      <PrimaryHeader
        headerName="Order Summary"
        onPress={() => navigation.navigate('Cart')}
      />
      <ScrollView
        ref={scrollViewRef}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={require('../../../../../assets/Icons/greentickamination.gif')}
            style={{height: 100, width: 100}}
          />
          <Text
            style={{
              fontSize: RFValue(20),
              color: '#061018',
              fontFamily: FONTS.BOLD,
            }}>
            Your Order Has Been Placed {'\n'}
            Sucessfully !
          </Text>
          <Text
            style={{
              fontSize: RFValue(14),
              color: '#09141E99',
              fontFamily: FONTS.REGULAR,
            }}>
            Thank you for placing an order with us.
          </Text>
        </View>
        <View
          style={{
            backgroundColor: '#F5F5F6',
            padding: 12,
            margin: 10,
            borderRadius: 12,
          }}>
          <Text
            style={{
              fontSize: RFValue(14),
              color: '#757A7E',
              fontFamily: FONTS.REGULAR,
            }}>
            We have received your order{' '}
            <Text
              style={{
                fontSize: RFValue(14),
                color: '#0E1827',
                fontFamily: FONTS.SEMI_BOLD,
              }}>
              {data?.infos?.order_id}
            </Text>{' '}
            and will begin processing it soon. A mail has been sent to
            <Text
              style={{
                color: '#0E1827',
                fontFamily: FONTS.SEMI_BOLD,
              }}>
              {' '}
              {user?.email}
            </Text>{' '}
          </Text>
        </View>
        <View style={{margin: 10}}>
          <Text
            style={{
              fontSize: RFValue(14),
              color: '#061018',
              fontFamily: FONTS.SEMI_BOLD,
            }}>
            Delivering to
          </Text>
          <View style={{marginTop: 10}}>
            <View style={{flexDirection: 'row', gap: 8}}>
              <Addressicon height={40} width={40} />

              <View style={{width: '80%'}}>
                <Text
                  style={{
                    fontSize: RFValue(14),
                    color: '#061018',
                    fontFamily: 'Manrope',
                  }}>
                  {capitalizeFirstLetter(
                    orderdetails?.records?.address?.addressTitle,
                  )}
                </Text>
                <Text
                  style={{
                    fontSize: RFValue(14),
                    fontWeight: 500,
                    color: '#8B8F93',
                    fontFamily: 'Manrope-Medium',
                  }}>
                  {`${orderdetails?.records?.address?.userName?.trim()}${orderdetails?.records?.address?.streetAddress1?.trim()}${
                    orderdetails?.records?.address?.streetAddress2
                  }${orderdetails?.records?.address?.city},${
                    orderdetails?.records?.address?.land
                  }-${orderdetails?.records?.address?.zipcode}`}
                </Text>
                <Text
                  style={{
                    fontSize: RFValue(14),
                    color: '#8B8F93',
                    fontFamily: 'Manrope-Medium',
                  }}>
                  Ph :{orderdetails?.records?.address?.mobileNumber?.slice(-10)}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{margin: 10, marginTop: 0, gap: 10}}>
          <Text
            style={{
              fontSize: RFValue(14),
              color: '#061018',
              fontFamily: 'Manrope-Bold',
            }}>
            Mode of payment
          </Text>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', gap: 8}}>
              <Paymenticon height={40} width={40} />
              <View style={{gap: 2, flexDirection: 'column'}}>
                <Text
                  style={{
                    fontSize: RFValue(14),
                    color: '#061018',
                    fontFamily: 'Manrope-SemiBold',
                  }}>
                  Online Payment
                </Text>
                <Text
                  style={{
                    fontSize: RFValue(12),
                    color: '#A3A6A8',
                    fontFamily: 'Manrope-Medium',
                  }}>
                  Ref : {data?.infos?.razorpay_payment_id}
                </Text>
              </View>
            </View>
            <View>
              <Copyicon
                name="copy"
                size={RFValue(20)}
                color={'#061018'}
                onPress={() => {
                  copyToClipboard(data?.infos?.razorpay_payment_id);
                }}
              />
            </View>
          </View>
        </View>
        <View style={{margin: 10, marginTop: 0, gap: 10}}>
          <Text
            style={{
              fontSize: RFValue(14),
              color: '#061018',
              fontFamily: 'Manrope-SemiBold',
            }}>
            Order Total
          </Text>
          <Text
            style={{
              color: '#061018',
              fontSize: RFValue(16),
              fontFamily: FONTS.BOLD,
            }}>
            ₹ {data?.infos?.total_price}
          </Text>
        </View>
        <View style={{margin: 10, marginTop: 30}}>
          <PrimaryButton
            title={'View order details'}
            onPress={() =>
              navigation.navigate('OrderinfoScreen', {
                order_id: data?.infos?.order_id,
              })
            }
            otherstyles={{paddingVertical: 14, borderRadius: 12}}
          />
          <Pressable
            onPress={handleDownload}
            style={{margin: 10, alignItems: 'center'}}>
            <Text
              style={{
                fontSize: RFValue(14),
                color: '#0E1827',
                fontFamily: 'Manrope-SemiBold',
              }}>
              Download Invoice
            </Text>
          </Pressable>
          <View style={{marginTop: 19, alignItems: 'center', marginBottom: 25}}>
            <Text
              style={{
                fontSize: RFValue(12),
                color: '#09141E',
                fontFamily: 'Manrope-Regular',
              }}>
              For any queries regarding this orders, please reach us at
            </Text>
            <Text
              style={{
                fontSize: RFValue(12),
                color: '#09141E',
                fontFamily: 'Manrope-Medium',
              }}
              onPress={() => Linking.openURL('mailto:info@shopq.site')}>
              info@shopq.site
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          width: '100%',
          padding: 10,
          position: 'absolute',
          bottom: 10,
          alignSelf: 'center',
        }}>
        <SnackBar
          show={snackVisible.show}
          content={snackVisible.content}
          type={snackVisible.type}
        />
      </View>
    </SafeAreaView>
  );
};
PaymentSuccess.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};
export default React.memo(PaymentSuccess);
