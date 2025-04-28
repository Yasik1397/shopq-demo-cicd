import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import {
  FlatList,
  ImageBackground,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View
} from 'react-native';

import PreviewCard from '../../../components/Cards/PreviewCard';

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Octicons from 'react-native-vector-icons/Octicons';

import { useDispatch, useSelector } from 'react-redux';

import SearchBar from '../../../components/SearchBar';


import BadgedIcon from '../../../components/BadgedIcon';
import GridTemplate from '../../../components/Others/Templates/GridTemplate';
import { COLORS, FONTS } from '../../../constants/Theme';
import { fetchCart } from '../../../redux/actions/cartSlice';
import { fetchWishlistById } from '../../../redux/actions/wishSlice';
import { useGetCartQuery } from '../../../redux/Api/Products/Cart';
import { SettingsData } from '../../../redux/Api/User/Settings';
import { RFValue } from '../../../utils/responsive';

const DashBoard = ({navigation}) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state?.Userdata?.user?.records);

  const settingsData = useSelector(state => state?.settings?.data);
  const backgroundColor =
    settingsData?.records?.site_settings?.header?.background_color || '#fff';
  const IconColor =
    settingsData?.records?.site_settings?.header?.font_icon_color || '#fff';
  const [refreshing, setRefreshing] = React.useState(false);
  const {data: cartdata} = useGetCartQuery(user?.id);
  useEffect(() => {
    dispatch(fetchCart(user?.id));
    dispatch(SettingsData());
    dispatch(fetchWishlistById(user?.id));
  }, []);
  const sortedData = settingsData?.records?.site_settings?.midSection?.sort(
    (a, b) => a?.position - b?.position,
  );

  const onRefresh = React.useCallback(() => {
    dispatch(SettingsData()).then(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: backgroundColor}}>
      <StatusBar
        backgroundColor={backgroundColor || '#fff'}
        barStyle={'dark-content'}
      />
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <SearchBar
          onPress={() => navigation.navigate('SearchScreen')}
          type={'home'}
          isPressable
          icon={<Feather color={IconColor} name="search" size={RFValue(20)} />}
          placeholder={'Search ShopQ'}
          icon1={
            !user ? null : user?.is_notification_active ? (
              <BadgedIcon
                count={0}
                children={
                  <Octicons color={IconColor} name="bell" size={RFValue(20)} />
                }
              />
            ) : (
              <Octicons color={IconColor} name="bell" size={RFValue(20)} />
            )
          }
          onIcon1Press={() => navigation.navigate('Notification')}
          icon2={
            !user ? null : (
              <BadgedIcon
                count={cartdata?.records?.length}
                children={
                  <FontAwesome6
                    name="bag-shopping"
                    color={IconColor}
                    size={RFValue(20)}
                    onPress={() => navigation.navigate('Cart')}
                  />
                }
              />
            )
          }
          onIcon2Press={() => navigation.navigate('Cart')}
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flex: 1, backgroundColor: '#fff'}}
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }>
        {sortedData?.map((item, index) => (
          <SafeAreaView key={index}>
            {item?.type === 'Banner' ? (
              <Pressable
                onPress={() => {
                  navigation.navigate('ProductList', {
                    data: {
                      title: item?.child_category_details?.category_name,
                      id: item?.child_category_details?.id,
                    },
                  });
                }}>

                  <ImageBackground
                    resizeMode="cover"
                    source={{uri: item?.image}}
                    style={{
                      flex: 1,
                      aspectRatio: 16 / 7,
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: item.font_color,
                        fontSize: RFValue(25),
                        fontFamily: FONTS.SEMI_BOLD,
                        textAlign: item?.content_alignment,
                      }}>
                      {item?.content
                        ? item?.content.replace(/<[^>]+>/g, '')
                        : ''}
                    </Text>
                  </ImageBackground>
              </Pressable>
            ) : item?.type === 'product-slider' ? (
              <View
                style={{
                  paddingVertical: 16,
                  backgroundColor: item?.background_color,
                }}>
                <Text
                  style={{
                    color: COLORS.BLACK,
                    fontFamily: FONTS.BOLD,
                    textAlign: 'center',
                    fontSize: RFValue(14),
                    includeFontPadding: true,
                  }}>
                  {item?.section_name}
                </Text>
                <FlatList
                  ItemSeparatorComponent={() => <View style={{width: 10}} />}
                  data={item?.products}
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  contentContainerStyle={{
                    paddingHorizontal: 10,
                    paddingTop: 16,
                  }}
                  renderItem={({item, index}) => (
                    <PreviewCard
                      index={index}
                      data={item}
                      onPress={() => {
                        navigation.navigate('ProductDetails', {
                          url_slug: item?.url_slug,
                          product_sku: item?.product_sku,
                          id: item?.id,
                        });
                      }}
                    />
                  )}
                  keyExtractor={item => item?.id}
                />
              </View>
            ) : item?.type === 'product-grid' ? (
              <View
                style={{
                  paddingVertical: 16,
                  backgroundColor: item?.background_color,
                }}>
                <Text
                  style={{
                    color: COLORS.BLACK,
                    fontFamily: FONTS.SEMI_BOLD,
                    fontSize: RFValue(14),
                    textAlign: 'center',
                    includeFontPadding: true,
                  }}>
                  {item?.section_name}
                </Text>
                <FlatList
                  ItemSeparatorComponent={() => <View style={{width: 10}} />}
                  data={item?.product_grid?.flat() || []}
                  contentContainerStyle={{
                    paddingHorizontal: 10,
                    paddingTop: 16,
                  }}
                  horizontal
                  scrollEnabled
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item, index}) => (
                    <PreviewCard
                      index={index}
                      data={item}
                      onPress={() => {
                        navigation.navigate('ProductDetails', {
                          url_slug: item?.url_slug,
                          product_sku: item?.product_sku,
                          id: item?.id,
                        });
                      }}
                    />
                  )}
                  keyExtractor={item => item?.id}
                />
              </View>
            ) : item?.type === 'category-grid' ? (
              <View
                style={{
                  backgroundColor: COLORS.WHITE,
                  padding: 16,
                  alignItems: 'center',
                }}>
                <GridTemplate data={item} key={index} navigation={navigation} />
              </View>
            ) : item?.type === 'category-slider' ? (
              <View
                style={{
                  paddingVertical: 16,
                  backgroundColor: item?.background_color,
                }}>
                <Text
                  style={{
                    fontSize: RFValue(14),
                    fontFamily: FONTS.SEMI_BOLD,
                    alignItems: 'center',
                    alignSelf: 'center',
                    color: COLORS.BLACK,
                  }}>
                  {item?.section_name}
                </Text>
                <FlatList
                  data={item?.products}
                  ItemSeparatorComponent={() => <View style={{width: 10}} />}
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  contentContainerStyle={{
                    paddingHorizontal: 10,
                    paddingTop: 16,
                  }}
                  renderItem={({item, index}) => (
                    <PreviewCard
                      data={item}
                      index={index}
                      onPress={() => {
                        navigation.navigate('ProductList', {
                          data: {
                            title: item?.child_category_details?.category_name,
                            id: item?.child_category_details?.id,
                          },
                        });
                      }}
                    />
                  )}
                  keyExtractor={item => item?.id}
                />
              </View>
            ) : null}
          </SafeAreaView>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

DashBoard.propTypes = {
  navigation: PropTypes.object,
};

export default React.memo(DashBoard);
