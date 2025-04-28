//<--------------------------Libraries--------------------------->
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Share,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
//<--------------------------Components-------------------------->
import NoUserComponent from "../../../components/EmptyScreen/NoUser";
import SnackBar, { useSnackBar } from "../../../components/SnackBar";
//<--------------------------Assets------------------------------>
// import CartIcon from "../../../assets/Icons/cart_icon.svg";
// import SearchIcon from "../../../assets/Icons/search_icon.svg";
//<--------------------------Redux---------------------------->
import { useGetCartQuery } from "../../../redux/Api/Products/Cart";
//<--------------------------Functions---------------------------->
//Import reusable functions here
import Feather from "react-native-vector-icons/Feather";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import BadgedIcon from "../../../components/BadgedIcon";
import PreviewCard from "../../../components/Cards/PreviewCard";
import NoProducts from "../../../components/EmptyScreen/NoProducts";
import PrimaryHeader from "../../../components/Header";
import { COLORS } from "../../../constants/Theme";
import { isTablet, RFValue } from "../../../utils/responsive";
import { DeleteValue } from "../../../utils/storageutils";
import {
  addToWishlist,
  fetchWishlistById,
  removeFromWishlist,
} from "../../../redux/actions/wishSlice";
import { useStatusBar } from "../../../hooks/useStatusbar";
const { width } = Dimensions.get("window");
const numColumns = 2; // Number of columns
const itemWidth = width / numColumns - 20;
const WishList = ({ navigation, onAuthStateChanged }) => {
  useStatusBar("light-content", true);
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.Userdata?.user?.records);
  const { data: wishList, loading } = useSelector((state) => state?.Wishdata);
  const [refreshing, setRefreshing] = useState(false);

  const { showSnack, snackVisible } = useSnackBar();

  const { data: cartdata } = useGetCartQuery(user?.id);

  useEffect(() => {
    dispatch(fetchWishlistById(user?.id));
  }, []);

  if (!user) {
    return (
      <NoUserComponent
        onPress={async () => {
          await Promise.all([DeleteValue("token"), DeleteValue("user")]);
          onAuthStateChanged();
        }}
      />
    );
  }
  const onRefresh = React.useCallback(() => {
    dispatch(fetchWishlistById(user?.id)).then(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.WHITE,
      }}
    >
      <PrimaryHeader
        headerName={"Wishlist"}
        children={
          <Feather onPress={() => navigation.navigate("SearchScreen")} color={COLORS.BLACK} name="search" size={RFValue(20)} />
        }
        children1={
          <BadgedIcon
            count={cartdata?.records?.length}
            children={
              <FontAwesome6
                name="bag-shopping"
                color={COLORS.BLACK}
                size={RFValue(20)}
                onPress={() => navigation.navigate("Cart")}
              />
            }
          />
        }
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <FlatList
          contentContainerStyle={{
            flexGrow: 1,
          }}columnWrapperStyle={{ justifyContent: "space-between" }}
          ListEmptyComponent={() => (
            <NoProducts onPress={() => navigation.navigate("SearchScreen")} />
          )}
          ItemSeparatorComponent={() => {
            return <View style={{ height: 16 }} />;
          }}
          showsVerticalScrollIndicator={false}
          numColumns={numColumns}
          data={wishList || []}
          keyExtractor={(item) => item?.product_id}
          renderItem={({ item, index }) => {
            return (
              <PreviewCard
                onShare={() => {
                  Share.share({
                    message:
                      `Check out this awesome product I found on ShopQ fashion platform ` +
                      `http://develop.shopq.site/product-detail${item?.url_slug}/?sku=${item?.product_sku}`,
                  });
                }}
                loading={loading}
                width={itemWidth}
                onLike={() => {
                  if (item?.wishlist_id) {
                    dispatch(removeFromWishlist(item?.wishlist_id)).then(() => {
                      dispatch(fetchWishlistById(user?.id));
                      showSnack("Product removed from Wishlist", "success");
                    });
                  } else {
                    dispatch(
                      addToWishlist({
                        product_id: item?.product_id,
                        user_id: user?.id,
                        variant_id: item?.variant_id,
                      })
                    ).then(() => {
                      dispatch(fetchWishlistById(user?.id));
                      showSnack("Product added to Wishlist", "success");
                    });
                  }
                }}
                type="wishlist"
                index={index}
                data={item}
                onPress={() => {
                  navigation.navigate("ProductDetails", {
                    url_slug: item?.url_slug,
                    product_sku: item?.product_sku,
                    product_id: item?.product_id,
                  });
                }}
              />
            );
          }}
        />
        <View
          style={{
            width: "100%",
            padding: 10,
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
WishList.propTypes = {
  navigation: PropTypes.object,
  onAuthStateChanged: PropTypes.func,
};
export default React.memo(WishList);
