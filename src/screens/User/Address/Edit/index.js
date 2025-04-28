//<--------------------------Libraries--------------------------->
import PropTypes from 'prop-types';
import {Formik} from 'formik';
import React, {useRef, useState} from 'react';
import {
  Pressable,
  Text,
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
} from 'react-native';
import * as yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
//<--------------------------Components-------------------------->
import PrimaryButton from '../../../../components/Buttons/Primary';
import InputComponent from '../../../../components/Input/PrimaryInput';
import MobileInput from '../../../../components/Input/MobileInput';
import CheckBox from '../../../../components/RadioButton/checkbox';
import {COLORS, FONTS} from '../../../../constants/Theme';
//<--------------------------Assets------------------------------>
import PrimaryHeader from '../../../../components/Header';
import SnackBar, {useSnackBar} from '../../../../components/SnackBar';
import {useUpdateProfileMutation} from '../../../../redux/Api/Auth';
import {getUserData} from '../../../../redux/Api/user';
import {RFValue} from '../../../../utils/responsive';

//<--------------------------Functions---------------------------->

const EditAddress = ({route, navigation}) => {
  const {Addressdata} = route?.params || {};
  const dispatch = useDispatch();
  const user = useSelector(state => state?.Userdata?.user?.records);
  const {snackVisible, showSnack} = useSnackBar();
  const [loader, setloader] = useState(false);
  const formref = useRef();
  const scrollViewRef = useRef(null);
  const [updateUser] = useUpdateProfileMutation();

  const loginValidationSchema = yup.object().shape({
    name: yup.string().required('Full Name is required'),
    mobilenumber: yup
      .string()
      .matches(
        /^[6-9]\d{9}$/,
        'Please enter a valid 10-digit Indian phone number',
      )
      .required('Phone Number is required'),
    streetaddress1: yup.string().required('Street Address1 is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zipcode: yup
      .string()
      .matches(/^\d{6}$/, 'Please enter a valid 6-digit zipcode')
      .required('Zip Code is required'),
    addresstitle: yup.string().nullable(),
    landmark: yup.string().nullable(),
  });

  const onSave = async values => {
    try {
      setloader(true);

      const newAddress = {
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

      // Get the current address list
      let updatedAddresses = [...(user?.address || [])];

      // Find the index of the existing address
      const existingIndex = updatedAddresses.findIndex(
        val => val === Addressdata,
      );

      if (existingIndex !== -1) {
        // Remove the existing address from the array
        updatedAddresses.splice(existingIndex, 1);
      }

      if (values?.primary) {
        // If the new address is marked primary, ensure no other address is primary
        updatedAddresses = updatedAddresses.map(addr => ({
          ...addr,
          primary: false,
        }));

        // Insert the new primary address at the beginning
        updatedAddresses.unshift(newAddress);
      } else {
        // Append the new address at the end
        updatedAddresses.push(newAddress);
      }

      // Prepare updated user data
      const updatedUserData = {
        id: user?.id,
        updatedata: {
          ...user,
          address: updatedAddresses,
        },
      };

      // Call updateUser API
      const res = await updateUser(updatedUserData);

      if (res?.data?.success) {
        dispatch(getUserData({id: user?.id}));
        showSnack('Address updated successfully!', 'success', 1500, () => {
          navigation.goBack();
        });
      } else {
        showSnack('Something went wrong', 'error');
      }
    } catch (error) {
      console.error('Error updating address:', error);
    } finally {
      setloader(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <PrimaryHeader
        onPress={() => navigation.goBack()}
        headerName="Edit Address"
      />
      <Formik
        innerRef={formref}
        validationSchema={loginValidationSchema}
        enableReinitialize={true}
        initialValues={{
          name: Addressdata?.userName || '',
          countrycode: Addressdata?.mobileNumber?.slice(0, 3) || '',
          mobilenumber: Addressdata?.mobileNumber?.slice(-10) || '',
          streetaddress1: Addressdata?.streetAddress1 || '',
          streetaddress2: Addressdata?.streetAddress2 || '',
          city: Addressdata?.city || '',
          state: Addressdata?.land || '',
          zipcode: Addressdata?.zipcode || '',
          addresstitle: Addressdata?.addressTitle || '',
          landmark: Addressdata?.landmark || '',
          primary: Addressdata?.primary || false,
        }}
        onSubmit={values => onSave(values)}>
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
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Contact Info</Text>
                <View style={styles.subcontainer}>
                  <InputComponent
                    required
                    onchangetext={text => {
                      handleChange('name')(text);
                    }}
                    onblur={handleBlur('name')}
                    value={values?.name}
                    error={touched.name ? errors.name : ''}
                    label="Name"
                    keyboard={'ascii-capable'}
                    capitalize={true}
                    mask={false}
                    autoComplete={'name'}
                    placeholder={'Ramesh'}
                    secured={false}
                  />

                  <MobileInput
                    required
                    onChangeText={text => {
                      handleChange('mobilenumber')(text);
                    }}
                    onChangecode={text => {
                      handleChange('countrycode')(text);
                    }}
                    onblur={handleBlur('mobilenumber')}
                    value={values?.mobilenumber?.slice(-10)}
                    error={touched.mobilenumber ? errors.mobilenumber : ''}
                    label="Mobile Number "
                    keyboard={'number-pad'}
                    capitalize={false}
                    mask={false}
                    autoComplete={'mobilenumber'}
                    autoFocus={false}
                    placeholder={'987654123'}
                    secured={false}
                    Type={'mobilenumber'}
                  />
                </View>

                <Text style={styles.title}>Address Info</Text>
                <View style={styles.subcontainer}>
                  <InputComponent
                    required
                    onchangetext={text => {
                      handleChange('streetaddress1')(text);
                    }}
                    onblur={handleBlur('streetaddress1')}
                    value={values?.streetaddress1}
                    error={touched.streetaddress1 ? errors.streetaddress1 : ''}
                    label="Address Line 1 "
                    keyboard={'street-address'}
                    capitalize={false}
                    mask={false}
                    autoComplete={'streetaddress'}
                    autoFocus={false}
                    placeholder={'Address Line 1'}
                    secured={false}
                  />
                  <InputComponent
                    required
                    onchangetext={text => {
                      handleChange('streetaddress2')(text);
                    }}
                    onblur={handleBlur('streetaddress2')}
                    value={values?.streetaddress2}
                    error={touched.streetaddress2 ? errors.streetaddress2 : ''}
                    label="Address Line 2 (optional)"
                    keyboard={'streetaddress2'}
                    capitalize={false}
                    mask={false}
                    autoComplete={'streetaddress2'}
                    autoFocus={false}
                    placeholder={'Address Line 2'}
                    secured={false}
                  />
                  <InputComponent
                    required
                    onchangetext={text => {
                      handleChange('city')(text);
                    }}
                    onblur={handleBlur('city')}
                    value={values?.city}
                    error={touched.city ? errors.city : ''}
                    label="City"
                    keyboard={'email-address'}
                    capitalize={false}
                    mask={false}
                    autoComplete={'city'}
                    autoFocus={false}
                    placeholder={'Tirupur'}
                    secured={false}
                  />

                  <InputComponent
                    required
                    onchangetext={text => {
                      handleChange('state')(text);
                    }}
                    onblur={handleBlur('state')}
                    value={values?.state}
                    error={touched.state ? errors.state : ''}
                    label="State"
                    keyboard={'email-address'}
                    capitalize={false}
                    mask={false}
                    autoComplete={'state'}
                    autoFocus={false}
                    placeholder={'Tamil Nadu'}
                    secured={false}
                  />
                  <InputComponent
                    required
                    onchangetext={text => {
                      handleChange('zipcode')(text);
                    }}
                    onblur={handleBlur('zipcode')}
                    value={values?.zipcode}
                    error={touched.zipcode ? errors.zipcode : ''}
                    label="Zip Code"
                    keyboard={'number-pad'}
                    capitalize={false}
                    mask={false}
                    autoComplete={'zipcode'}
                    autoFocus={false}
                    placeholder={'641325'}
                    secured={false}
                  />
                  <InputComponent
                    onchangetext={text => {
                      handleChange('addresstitle')(text);
                    }}
                    onblur={handleBlur('addresstitle')}
                    value={values?.addresstitle}
                    error={touched.addresstitle ? errors.addresstitle : ''}
                    label="Address Title"
                    keyboard={'email-address'}
                    capitalize={false}
                    mask={false}
                    autoComplete={'addresstitle'}
                    autoFocus={false}
                    placeholder={'Home,Office,etc...'}
                    secured={false}
                  />
                  <InputComponent
                    onchangetext={text => {
                      handleChange('landmark')(text);
                    }}
                    onblur={handleBlur('landmark')}
                    value={values?.landmark}
                    error={touched.landmark ? errors.landmark : ''}
                    label="Land mark (optional)"
                    keyboard={'email-address'}
                    capitalize={false}
                    mask={false}
                    autoComplete={'landmark'}
                    autoFocus={false}
                    placeholder={'Near VR mall'}
                    secured={false}
                  />
                  <View style={{marginVertical: 10}}>
                    <Pressable style={{flexDirection: 'row', gap: 10}}>
                      <CheckBox
                        data={values?.primary}
                        onpress={() =>
                          values?.primary
                            ? setFieldValue('primary', false)
                            : setFieldValue('primary', true)
                        }></CheckBox>
                      <Text style={{color: COLORS.BLACK}}>
                        Use as primary address
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </ScrollView>
              <PrimaryButton
                disabled={!isValid || !dirty || loader}
                isLoading={loader}
                title={'Update'}
                otherstyles={{
                  paddingVertical: 12,
                  borderRadius: 8,
                  margin: 16,
                }}
                onPress={handleSubmit}
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
EditAddress.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  scrollcontainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    color: COLORS.BLACK,
    fontFamily: FONTS.BOLD,
    fontSize: RFValue(16),
  },
  subcontainer: {
    gap: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  text: {
    color: COLORS.BLACK,
    fontFamily: FONTS.MEDIUM,
    fontSize: RFValue(14),
  },
  btncontainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  snackcontainer: {
    padding: 10,
    position: 'absolute',
    bottom: 70,
    width: '100%',
    alignSelf: 'center',
  },
});
export default React.memo(EditAddress);
