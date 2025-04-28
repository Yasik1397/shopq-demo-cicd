import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import PrimaryHeader from '../../../../../components/Header';
import PropTypes from 'prop-types';
import {COLORS, FONTS} from '../../../../../constants/Theme';
import {ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getStoreData} from '../../../../../redux/Api/User/StoreSettings';
import PrimaryInput from '../../../../../components/Input/PrimaryInput';
import PrimaryButton from '../../../../../components/Buttons/Primary';
import MobileInput from '../../../../../components/Input/MobileInput';
import {usePostContactUsMutation} from '../../../../../redux/Api/Helpcenter/contactUsApi';
import SnackBar, {useSnackBar} from '../../../../../components/SnackBar';
import {isTablet, RFValue} from '../../../../../utils/responsive';
import {Formik} from 'formik';
import * as Yup from 'yup';
const Contactus = ({navigation}) => {
  const dispatch = useDispatch();
  const [postContactUs] = usePostContactUsMutation();
  const {snackVisible, showSnack} = useSnackBar();
  const [isLoading, setIsLoading] = useState(false);
  const data = useSelector(state => state?.StoreData?.data);
  useEffect(() => {
    dispatch(getStoreData());
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    mobile_number: Yup.string()
      .matches(/^\d+$/, 'Mobile number must be numeric')
      .min(10, 'Mobile number must be at least 10 digits')
      .required('Mobile number is required'),
    message: Yup.string()
      .required('Message is required')
      .test('wordCount', 'Message must be at most 240 words', value => {
        return value ? value.trim().split(/\s+/).length <= 240 : true;
      }),
  });

  const handleSubmit = async (values, {resetForm}) => {
    try {
      setIsLoading(true);
      const result = await postContactUs(values);
      if (result?.data?.success) {
        showSnack(
          "Thanks for contacting us! We'll respond as soon as possible.",
          'success',
        );
        resetForm();
      }
    } catch (e) {
      setIsLoading;
      showSnack('Something went wrong', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.WHITE}}>
      <PrimaryHeader
        headerName="Contact us"
        onPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: COLORS.WHITE,
          padding: 16,
        }}>
        <Formik
          initialValues={{
            name: '',
            email: '',
            mobile_number: '',
            message: '',
            country_code: '+91',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontFamily: FONTS.BOLD,
                  fontSize: RFValue(20),
                  color: '#2B38AC',
                }}>
                Want to get in touch? {isTablet ? '' : '\n'}We'd love to hear
                from you.
              </Text>
              <View style={{gap: 16, marginTop: 24}}>
                {data?.records ? (
                  <View
                    style={{
                      backgroundColor: '#F9F9F9',
                      paddingHorizontal: 12,
                      paddingVertical: 16,
                      borderRadius: 8,
                    }}>
                    <View style={{gap: 6}}>
                      <Text
                        style={{
                          color: '#061018',
                          fontFamily: FONTS.MEDIUM,
                          fontSize: RFValue(14),
                        }}>
                        {data?.records[0]?.street_address}
                      </Text>
                      <Text
                        style={{
                          color: '#061018',
                          fontFamily: FONTS.MEDIUM,
                          fontSize: RFValue(14),
                        }}>
                        {data?.records[0]?.city?.label} -{' '}
                        {data?.records[0]?.city?.code},
                      </Text>
                      <Text
                        style={{
                          color: '#061018',
                          fontFamily: FONTS.MEDIUM,
                          fontSize: RFValue(14),
                        }}>
                        {data?.records[0]?.state?.label},{' '}
                        {data?.records[0]?.country?.label}.
                      </Text>
                    </View>
                    <View
                      style={{
                        height: 1,
                        marginVertical: 16,
                        backgroundColor: '#E8E8E8',
                      }}
                    />
                    <View style={{gap: 6}}>
                      <Text
                        style={{
                          color: '#8B8F93',
                          fontFamily: FONTS.MEDIUM,
                          fontSize: RFValue(14),
                        }}>
                        Contact:{' '}
                        <Text style={{color: '#061018'}}>
                          {data?.records[0]?.whatsapp_number}
                        </Text>
                      </Text>
                      <Text
                        style={{
                          color: '#8B8F93',
                          fontFamily: FONTS.MEDIUM,
                          fontSize: RFValue(14),
                        }}>
                        Email: {''}
                        <Text style={{color: '#061018'}}>info@shopq.site</Text>
                      </Text>
                    </View>
                  </View>
                ) : null}
                <View
                  style={{
                    backgroundColor: '#F9F9F9',
                    paddingHorizontal: 12,
                    paddingVertical: 16,
                    borderRadius: 8,
                    gap: 16,
                  }}>
                  <PrimaryInput
                    placeholder="Enter your name"
                    required
                    label="Name"
                    onchangetext={handleChange('name')}
                    onblur={handleBlur('name')}
                    value={values.name}
                    error={touched.name && errors.name}
                  />
                  <PrimaryInput
                    placeholder="Enter your email address"
                    required
                    label="Email address"
                    onchangetext={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    error={touched.email && errors.email}
                  />
                  <MobileInput
                    onChangecode={handleChange('country_code')}
                    onChangeText={handleChange('mobile_number')}
                    handleBlur={handleBlur('mobile_number')}
                    placeholder="mobile number"
                    required
                    label="Mobile number"
                    value={values.mobile_number}
                    error={touched.mobile_number && errors.mobile_number}
                  />
                  <PrimaryInput
                    placeholder="Type here"
                    multiline
                    required
                    label="Message"
                    onchangetext={handleChange('message')}
                    onblur={handleBlur('message')}
                    value={values.message}
                    error={touched.message && errors.message}
                    helper={
                      <Text
                        style={{
                          color: '#8B8F93',
                          fontFamily: FONTS.REGULAR,
                          fontSize: RFValue(14),
                        }}>
                        {values.message.trim().split(/\s+/).length
                          ? values.message.trim().split(/\s+/).length
                          : 0}
                        /240 words
                      </Text>
                    }
                  />
                  <PrimaryButton
                    isLoading={isLoading}
                    onPress={handleSubmit}
                    title="Submit"
                    otherstyles={{borderRadius: 32, paddingVertical: 12}}
                  />
                </View>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
      <View
        style={{position: 'absolute', bottom: 70, width: '100%', padding: 10}}>
        <SnackBar
          show={snackVisible.show}
          content={snackVisible.content}
          type={snackVisible.type}
        />
      </View>
    </SafeAreaView>
  );
};

Contactus.propTypes = {
  navigation: PropTypes.object,
};
export default Contactus;
