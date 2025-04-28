//<--------------------------Libraries-------------------------->
import {Formik} from 'formik';
import PropTypes from 'prop-types';
import React, {useRef, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as yup from 'yup';

//<--------------------------Assets-------------------------->
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import CheckboxSelect from '../../../assets/Icons/checkbox_select.svg';
// import CheckboxUnselect from '../../../assets/Icons/checkbox_unselect.svg';
//<--------------------------Components------------------------>
import PrimaryHeader from '../../../components/Header';

import PrimaryButton from '../../../components/Buttons/Primary';
import MobileInput from '../../../components/Input/MobileInput';

import SnackBar, {useSnackBar} from '../../../components/SnackBar';

//<--------------------------Styles-------------------------->
import {COLORS, FONTS} from '../../../constants/Theme';

//<--------------------------Utils-------------------------->
import {GetValue, StoreValue} from '../../../utils/storageutils';

//<--------------------------Api-------------------------->
import {useLoginMutation} from '../../../redux/Api/Auth';
import {styles} from './styles';
import {RFValue} from '../../../utils/responsive';

const LoginScreen = ({navigation, onAuthStateChanged}) => {
  const formref = useRef();
  const [postLogin] = useLoginMutation();
  const {snackVisible, showSnack} = useSnackBar();

  const [isLoading, setIsLoading] = useState(false);

  const loginValidationSchema = yup.object().shape({
    mobilenumber: yup
      .string()
      .required('Mobile number is required')
      .matches(/^\d{10}$/, 'Please enter a valid phone number'),
  });

  const handleSubmit = async values => {
    console.log('values: ', values);
    setIsLoading(true);

    try {
      const fcmToken = await GetValue('fcmtoken');
      const res = await postLogin({
        country_code: values.country_code,
        mobile_number: values.mobilenumber,
        fcm_token: fcmToken?.data,
      });

      console.log('login: ', res);

      if (res?.data?.success) {
        showSnack('OTP has been sent successfully', 'success', 1500, () => {
          navigation.navigate('OTPScreen', {
            mobilenumber: values.mobilenumber,
            country_code: values.country_code,
            type: 'login',
          });
        });
      } else {
        showSnack(res?.data?.message || 'Login failed', 'error');
      }
    } catch (error) {
      // Use showSnack function for error handling
      showSnack('Something went wrong. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <PrimaryHeader
        children={
          <TouchableOpacity
            onPress={async () => {
              await StoreValue('user', {user: 'guest'});
              onAuthStateChanged();
            }}>
            <Text style={styles.headertext}>Skip</Text>
          </TouchableOpacity>
        }
      />
      <Formik
        innerRef={formref}
        validationSchema={loginValidationSchema}
        initialValues={{
          country_code: '+91',
          mobilenumber: '',
          check: false,
        }}
        onSubmit={handleSubmit}>
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
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.WHITE,
              paddingHorizontal: 16,
              paddingBottom: 24,
            }}>
            <ScrollView
              contentContainerStyle={{flexGrow: 1}}
              showsVerticalScrollIndicator={false}>
              <View style={{gap: 8}}>
                <View
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between">
                  <Text style={styles.titletxt}>Login/Create Account</Text>
                </View>
                <Text style={styles.contenttxt}>
                  Please enter your Mobile number to Continue
                </Text>
              </View>
              <View style={{gap: 8, marginTop: 10}}>
                <View>
                  <MobileInput
                    onChangeText={text => handleChange('mobilenumber')(text)}
                    onChangecode={values =>
                      setFieldValue('country_code', values)
                    }
                    value={values.mobilenumber}
                    error={touched.mobilenumber ? errors.mobilenumber : ''}
                    label="Mobile number"
                    placeholder="Ex: +91 8056841024"
                    keyboard="number-pad"
                    countryCode={values?.country_code}
                    handleBlur={handleBlur('mobilenumber')}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                  <Pressable
                    style={styles.checkboxContainer}
                    onPress={() => setFieldValue('check', !values.check)}>
                    {values?.check ? (
                      <Ionicons
                        name={'checkbox'}
                        color={COLORS.BLACK}
                        size={18}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name={'checkbox-blank-outline'}
                        color={COLORS.GREY}
                        size={18}
                      />
                    )}
                  </Pressable>
                  <Text
                    style={{
                      fontFamily: FONTS.REGULAR,
                      color: COLORS.GREY,
                      fontSize: RFValue(12),
                    }}>
                    I agree to your{' '}
                    <Text
                      style={{
                        color: COLORS.BLACK,
                      }}
                      onPress={() => navigation.navigate('Terms')}>
                      Terms and conditions.
                    </Text>
                  </Text>
                </View>
              </View>
            </ScrollView>

            <PrimaryButton
              title={'Continue'}
              onPress={() => (isValid && values?.check ? handleSubmit() : null)}
              otherstyles={{
                borderRadius: 12,
                paddingVertical: 14,
              }}
              isLoading={isLoading}
              disabled={!isValid || !values?.check || isLoading}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 12,
              }}>
              <Text
                style={{
                  fontSize: RFValue(14),
                  fontFamily: FONTS.REGULAR,
                  color: COLORS.GREY,
                }}>
                Lost Mobile number?{' '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ChangeMobile');
                }}>
                <Text
                  style={{
                    fontSize: RFValue(14),
                    fontFamily: FONTS.SEMI_BOLD,
                    color: COLORS.BLACK,
                  }}>
                  Change Number
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
      <View style={styles.snackcontainer}>
        <SnackBar
          show={snackVisible.show}
          type={snackVisible.type}
          content={snackVisible.content}
        />
      </View>
    </SafeAreaView>
  );
};

LoginScreen.propTypes = {
  navigation: PropTypes.object,
  onAuthStateChanged: PropTypes.func,
};

export default LoginScreen;
