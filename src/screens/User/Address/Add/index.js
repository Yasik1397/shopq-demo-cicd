//<--------------------------Libraries--------------------------->
import {Formik} from 'formik';
import React, {useRef, useState} from 'react';
import {Pressable, ScrollView, Text, View, SafeAreaView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import * as yup from 'yup';
//<--------------------------Components-------------------------->
//Import custom components here
import PrimaryButton from '../../../../components/Buttons/Primary';
import PrimaryHeader from '../../../../components/Header';

import MobileInput from '../../../../components/Input/MobileInput';
import PrimaryInput from '../../../../components/Input/PrimaryInput';

import CheckBox from '../../../../components/RadioButton/checkbox';
import SnackBar, {useSnackBar} from '../../../../components/SnackBar';
//<--------------------------Redux------------------------------>
import {useUpdateProfileMutation} from '../../../../redux/Api/Auth';

//<--------------------------Functions---------------------------->
import {getUserData} from '../../../../redux/Api/user';
import {styles} from './styles';

const AddAddress = ({navigation}) => {
  const user = useSelector(state => state?.Userdata?.user?.records);
  const dispatch = useDispatch();
  const {showSnack, snackVisible} = useSnackBar();
  const [loader, setLoader] = useState(false);

  const [updateUser] = useUpdateProfileMutation();
  const formref = useRef();

  const AddressValidation = yup.object().shape({
    name: yup
      .string()
      .matches(/^[A-Za-z ]+$/, 'Name must contain only alphabetic characters')
      .required('Full Name is required'),
    mobilenumber: yup
      .string()
      .matches(
        /^[6-9]\d{9}$/,
        'Please enter a valid 10-digit Indian phone number',
      )
      .required('Phone Number is required'),
    streetaddress1: yup.string().required('Address Line 1 is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zipcode: yup
      .string()
      .matches(/^\d{6}$/, 'Please enter a valid 6-digit zipcode')
      .required('Zip Code is required')
      .matches(/^\S*$/, 'Zipcode cannot contain empty spaces'),
    addresstitle: yup.string().required('Address Title is required'),
    landmark: yup.string().nullable(),
  });

  const handleAddaddress = async values => {
    setLoader(true);
    const Address = {
      userName: values?.name,
      mobileNumber: values?.countrycode + values?.mobilenumber,
      streetAddress1: values?.streetaddress1,
      streetAddress2: values?.streetaddress2,
      city: values?.city,
      land: values?.state,
      zipcode: values?.zipcode,
      addressTitle: values?.addresstitle,
      landmark: values?.landmark,
      primary: values?.primary,
    };

    try {
      let updatedAddresses;
      if (values?.primary) {
        // Mark current address as primary
        updatedAddresses = [
          Address,
          ...(user?.address?.map(data => ({
            ...data,
            primary: false,
          })) || []),
        ];
      } else {
        // Append to existing addresses
        updatedAddresses = user?.address
          ? [...user?.address, Address]
          : [Address];
      }

      const res = await updateUser({
        id: user?.id,
        updatedata: {
          ...user,
          address: updatedAddresses,
        },
      });

      if (res?.data?.success) {
        dispatch(getUserData({id: user?.id})).then(() => {
          showSnack('Address added successfully!', 'success', 1500, () => {
            navigation.goBack();
          });
        });
      } else {
        showSnack(
          res?.data?.message || 'Something went wrong. Please try again.',
          'error',
        );
      }
    } catch (error) {
      showSnack('Something went wrong. Please try again.', 'error');
    } finally {
      setLoader(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <PrimaryHeader
        headerName={'Add Address'}
        onPress={() => navigation.goBack()}
      />
      <Formik
        innerRef={formref}
        validationSchema={AddressValidation}
        // enableReinitialize={true}
        initialValues={{
          name: '',
          countrycode: '',
          mobilenumber: '',
          streetaddress1: '',
          streetaddress2: '',
          city: '',
          state: '',
          zipcode: '',
          addresstitle: '',
          landmark: '',
          primary: false,
        }}
        onSubmit={values => handleAddaddress(values)}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
          isValid,
          dirty,
        }) => {
          return (
            <View style={styles.container}>
              <ScrollView
                contentContainerStyle={styles.scrollcontainer}
                showsVerticalScrollIndicator={false}>
                <View>
                  <Text style={styles.title}>Contact Info</Text>
                  <View style={styles.subcontainer}>
                    <PrimaryInput
                      required
                      onchangetext={text => {
                        const trimmedText = text?.trimStart();
                        handleChange('name')(trimmedText);
                      }}
                      onblur={handleBlur('name')}
                      value={values.name}
                      error={touched.name ? errors.name : ''}
                      label="Name "
                      keyboard={'ascii-capable'}
                      capitalize={true}
                      mask={false}
                      placeholder={'Ex:Karthick'}
                      secured={false}
                    />
                    <MobileInput
                      required
                      onChangecode={e => {
                        handleChange('countrycode')(e);
                      }}
                      onChangeText={text => {
                        const trimmedText = text?.trimStart();
                        handleChange('mobilenumber')(trimmedText);
                      }}
                      onblur={handleBlur('mobilenumber')}
                      value={values.mobilenumber}
                      error={touched.mobilenumber ? errors.mobilenumber : ''}
                      label="Mobile Number"
                      keyboard={'number-pad'}
                      capitalize={false}
                      autoFocus={false}
                      placeholder={'8056742052'}
                    />
                  </View>
                  <View>
                    <Text style={styles.title}>Address Info</Text>
                  </View>
                  <View style={styles.subcontainer}>
                    <PrimaryInput
                      required
                      onchangetext={text => {
                        const trimmedText = text?.trimStart();
                        handleChange('streetaddress1')(trimmedText);
                      }}
                      onblur={handleBlur('streetaddress1')}
                      value={values.streetaddress1}
                      error={
                        touched.streetaddress1 ? errors.streetaddress1 : ''
                      }
                      label="Address Line 1"
                      keyboard={'street-address'}
                      capitalize={false}
                      mask={false}
                      autoFocus={false}
                      placeholder={'Address Line 1'}
                      secured={false}
                    />

                    <PrimaryInput
                      required
                      onchangetext={text => {
                        const trimmedText = text?.trimStart();
                        handleChange('streetaddress2')(trimmedText);
                      }}
                      onblur={handleBlur('streetaddress2 (optional)')}
                      value={values.streetaddress2}
                      error={
                        touched.streetaddress2 ? errors.streetaddress2 : ''
                      }
                      label="Address Line 2 (optional)"
                      keyboard={'streetaddress2'}
                      capitalize={false}
                      mask={false}
                      autoFocus={false}
                      placeholder={'Address Line 2'}
                      secured={false}
                    />
                    <PrimaryInput
                      required
                      onchangetext={text => {
                        const trimmedText = text?.trimStart();
                        handleChange('city')(trimmedText);
                      }}
                      onblur={handleBlur('city')}
                      value={values.city}
                      error={touched.city ? errors.city : ''}
                      label="City"
                      keyboard={'email-address'}
                      capitalize={false}
                      mask={false}
                      placeholder={'Tirupur'}
                      secured={false}
                    />
                    <PrimaryInput
                      required
                      onchangetext={text => {
                        const trimmedText = text?.trimStart();
                        handleChange('state')(trimmedText);
                      }}
                      onblur={handleBlur('state')}
                      value={values.state}
                      error={touched.state ? errors.state : ''}
                      label="State"
                      keyboard={'email-address'}
                      capitalize={false}
                      mask={false}
                      autoFocus={false}
                      placeholder={'Tamil Nadu'}
                      secured={false}
                    />
                    <PrimaryInput
                      required
                      onchangetext={text => {
                        const trimmedText = text?.trimStart();
                        handleChange('zipcode')(trimmedText);
                      }}
                      onblur={handleBlur('zipcode')}
                      value={values.zipcode}
                      error={touched.zipcode ? errors.zipcode : ''}
                      label="Zip Code"
                      keyboard={'number-pad'}
                      capitalize={false}
                      mask={false}
                      autoFocus={false}
                      placeholder={'641325'}
                      secured={false}
                    />
                    <PrimaryInput
                      required
                      onchangetext={text => {
                        const trimmedText = text?.trimStart();
                        handleChange('addresstitle')(trimmedText);
                      }}
                      onblur={handleBlur('addresstitle')}
                      value={values.addresstitle}
                      error={touched.addresstitle ? errors.addresstitle : ''}
                      label="Address Title"
                      keyboard={'email-address'}
                      capitalize={false}
                      mask={false}
                      autoFocus={false}
                      placeholder={'Home,Office,etc...'}
                      secured={false}
                    />
                    <View>
                      <PrimaryInput
                        onchangetext={text => {
                          const trimmedText = text?.trimStart();
                          handleChange('landmark')(trimmedText);
                        }}
                        onblur={handleBlur('landmark')}
                        value={values.landmark}
                        error={touched.landmark ? errors.landmark : ''}
                        label="Landmark (Optional)"
                        keyboard={'email-address'}
                        capitalize={false}
                        mask={false}
                        autoFocus={false}
                        placeholder={'Near VR mall'}
                        secured={false}
                      />
                      <View style={{paddingVertical: 10}}>
                        <Pressable
                          style={{
                            flexDirection: 'row',
                            gap: 10,
                            alignItems: 'center',
                          }}>
                          <CheckBox
                            data={values?.primary}
                            onpress={() =>
                              values?.primary === true
                                ? setFieldValue('primary', false)
                                : setFieldValue('primary', true)
                            }
                          />
                          <Text style={styles.text}>
                            Use as primary address
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
              <PrimaryButton
                disabled={!isValid || !dirty || loader}
                isLoading={loader}
                title={'Add Address'}
                onPress={handleSubmit}
                otherstyles={{
                  paddingVertical: 12,
                  borderRadius: 8,
                  margin: 16,
                }}
              />
            </View>
          );
        }}
      </Formik>
      <View style={styles.snackcontainer}>
        <SnackBar
          show={snackVisible.show}
          content={snackVisible.content}
          type={snackVisible?.type}
        />
      </View>
    </SafeAreaView>
  );
};
AddAddress.propTypes = {
  navigation: PropTypes.object,
};
export default React.memo(AddAddress);
