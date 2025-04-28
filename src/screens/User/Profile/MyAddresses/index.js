//<--------------------------Libraries--------------------------->
import PropTypes from 'prop-types';
import React, {useRef} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import Animated, {FadeIn} from 'react-native-reanimated';
import MenuIcon from 'react-native-vector-icons/Entypo';
import {useDispatch, useSelector} from 'react-redux';

import Octicons from 'react-native-vector-icons/Octicons';
import PrimaryHeader from '../../../../components/Header';
import SnackBar, {useSnackBar} from '../../../../components/SnackBar';

import {RFValue} from '../../../../utils/responsive';
import {COLORS, FONTS} from '../../../../constants/Theme';
import {hexToRgba} from '../../../../utils/deliveryStatus';
import {getUserData} from '../../../../redux/Api/user';
import {useUpdateProfileMutation} from '../../../../redux/Api/Auth';
const MyAddresses = ({navigation}) => {
  const dispatch = useDispatch();
  const UserData = useSelector(state => state?.Userdata?.user?.records);

  const [refreshing, setRefreshing] = React.useState(false);
  const {snackVisible, showSnack} = useSnackBar();
  const [updateUser] = useUpdateProfileMutation();
  const scrollViewRef = useRef(null);

  const handleDelete = async item => {
    const updatedAddresses = UserData?.address?.filter(
      address => address !== item,
    );

    const res = await updateUser({
      id: item?.id,
      updatedata: {
        ...UserData,
        address: updatedAddresses,
      },
    });
    if (res?.data?.success) {
      showSnack('Address deleted successfully', 'success', 1500, () => {
        dispatch(getUserData({id: UserData?.id}));
      });
    }
  };

  const handlePrimary = async selectedAddress => {
    try {
      // Ensure we have user data
      if (!UserData || !UserData.address) return;

      // Update all other addresses to `primary: false`
      const updatedAddresses = UserData.address.map(addr => ({
        ...addr,
        primary: addr === selectedAddress, // Set only the selected address as primary
      }));

      // Prepare updated user data
      const updatedUserData = {
        ...UserData,
        address: updatedAddresses,
      };

      // Call updateUser API
      const res = await updateUser({
        id: UserData?.id,
        updatedata: updatedUserData,
      });
      if (res?.data?.success) {
        showSnack('Address updated successfully', 'success', 1500, () => {
          dispatch(getUserData({id: UserData?.id}));
        });
      } else {
        showSnack(res?.error?.data?.detail, 'error');
      }
    } catch (error) {
      console.error('Error updating primary address:', error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.WHITE}}>
      <PrimaryHeader
        onPress={() => navigation.goBack()}
        headerName={'My Addresses'}
      />
      <ScrollView
        ref={scrollViewRef}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}>
        <FlatList
          contentContainerStyle={{
            padding: 12,
            backgroundColor: COLORS.WHITE,
          }}
          ItemSeparatorComponent={() => {
            return (
              <View
                style={{
                  backgroundColor: '#E8E8E8',
                  height: 1,
                  marginVertical: 16,
                }}
              />
            );
          }}
          ListFooterComponentStyle={{marginVertical: 16}}
          ListFooterComponent={() => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                justifyContent: 'center',
              }}>
              <Octicons name="plus-circle" size={18} color={COLORS.PRIMARY} />
              <Text
                onPress={() => navigation.navigate('AddAddress')}
                style={{
                  color: '#0E1827',
                  fontSize: RFValue(14),
                  fontFamily: FONTS.BOLD,
                  textAlign: 'center',
                  includeFontPadding: false,
                }}>
                Add New Address
              </Text>
            </View>
          )}
          data={UserData?.address || []}
          renderItem={({item, index}) => {
            return (
              <Animated.View
                key={index + 1}
                entering={FadeIn.delay(index * 100)}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      paddingVertical: 5,
                    }}>
                    <Text
                      style={{
                        fontSize: RFValue(16),
                        fontFamily: FONTS.BOLD,
                        color: '#061018',
                        textTransform: 'capitalize',
                      }}>
                      {item.addressTitle ? item.addressTitle : 'Home'}
                    </Text>
                    {item.primary ? (
                      <View
                        style={{
                          borderRadius: 12,
                          backgroundColor: hexToRgba('#2A72AC', 0.1),
                          paddingHorizontal: 8,
                          paddingVertical: 5,
                        }}>
                        <Text
                          style={{
                            fontSize: RFValue(12),
                            fontFamily: FONTS.BOLD,
                            color: '#0E1827',
                            includeFontPadding: false,
                          }}>
                          Primary
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <Menu>
                    <MenuTrigger style={{}}>
                      <MenuIcon
                        color={COLORS.BLACK}
                        size={20}
                        name="dots-three-vertical"
                      />
                    </MenuTrigger>
                    <MenuOptions
                      optionsContainerStyle={{
                        borderTopLeftRadius: 12,
                        borderBottomLeftRadius: 12,
                        width: 141,
                        padding: 10,
                      }}>
                      <MenuOption
                        onSelect={() => {
                          navigation.navigate('EditAddress', {
                            Addressdata: item,
                          });
                        }}>
                        <Text
                          style={{
                            fontSize: RFValue(14),
                            fontFamily: FONTS.SEMI_BOLD,
                            color: '#2C4152',
                          }}>
                          Edit
                        </Text>
                      </MenuOption>
                      <MenuOption onSelect={() => handleDelete(item)}>
                        <Text
                          style={{
                            fontSize: RFValue(14),
                            fontFamily: FONTS.SEMI_BOLD,
                            color: '#2C4152',
                          }}>
                          Remove
                        </Text>
                      </MenuOption>
                      <MenuOption
                        onSelect={() => {
                          handlePrimary(item);
                        }}>
                        <Text
                          style={{
                            fontSize: RFValue(14),
                            fontFamily: FONTS.SEMI_BOLD,
                            color: '#2C4152',
                          }}>
                          Set as primary
                        </Text>
                      </MenuOption>
                    </MenuOptions>
                  </Menu>
                </View>

                {item?.userName ? (
                  <Text
                    style={{
                      fontFamily: FONTS.REGULAR,
                      color: '#8B8F93',
                      fontSize: RFValue(14),
                    }}>
                    {item?.userName},
                  </Text>
                ) : null}
                <Text
                  style={{
                    fontFamily: FONTS.REGULAR,
                    color: '#8B8F93',
                    fontSize: RFValue(14),
                  }}
                  ellipsizeMode={'tail'}
                  numberOfLines={2}>
                  {`${item?.streetAddress1}${
                    item?.streetAddress2 ? ', ' + item?.streetAddress2 : ''
                  }${item?.landmark ? ', ' + item?.landmark + ',' : ''}`}
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.REGULAR,
                    color: '#8B8F93',
                    fontSize: RFValue(14),
                  }}
                  ellipsizeMode={'tail'}
                  numberOfLines={2}>
                  {item?.city},{item?.land}-{item?.zipcode}
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.REGULAR,
                    color: '#8B8F93',
                    fontSize: RFValue(14),
                    marginTop: 5,
                  }}>
                  Ph : {item?.mobileNumber?.slice(-10)}
                </Text>
              </Animated.View>
            );
          }}
          keyExtractor={() => (item, index) => index.toString()}
        />
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
          error={snackVisible.error}
        />
      </View>
    </SafeAreaView>
  );
};
MyAddresses.propTypes = {
  navigation: PropTypes.object.isRequired,
};
export default React.memo(MyAddresses);
