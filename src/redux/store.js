//<--------------------------Libraries--------------------------->
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";

//<--------------------------Api--------------------------->
import { AuthApi, ProfileApi, uploadImage } from "./Api/Auth";
import { attributeApi } from "../Api/EndPoints/filter";
import { notificationApi } from "../Api/EndPoints/notification";

import {
  getOrderDetailsAPI,
  myordersApi,
  summaryApi,
} from "../Api/EndPoints/orders";

import {
  addproductreviewApi,
  filterproductsApi,
  productsavailableApi,
  reviewApibyProductID,
  similarproductsApi,
} from "../Api/EndPoints/products";

import { getlogocolorApi } from "../Api/EndPoints/settings";

import {
  UpdateMobile,
  ChangeMobile,
  Notification_Api,
} from "../Api/EndPoints/user_profile";

import { SearchApi } from "./Api/Products/Search";

import { productsApi } from "./Api/Products/Products";
import { cartApi } from "./Api/Products/Cart";

//<--------------------------Slices--------------------------->
import StoreData from "./Api/User/StoreSettings";
import Userdata from "./Api/user";
import CategoryData from "./Api/Products/Category";
import Cartdata from "./actions/cartSlice";
import Wishdata from "./actions/wishSlice";
import Product from "./actions/productSlice";

import Orderdata from "./actions/orderSlice";
import FAQdata from "./Api/Helpcenter/FAQs";

import TermsData from "./actions/termSlice";

import CouponData from "./Api/Products/Coupon";
import AboutUsData from "./Api/Helpcenter/AboutUs";

import settingsReducer from "./Api/User/Settings";


import { getNotificationbyId } from "./Api/User/notification";
import { postContactUs } from "./Api/Helpcenter/contactUsApi";
import { PaymentApi } from "./Api/Products/Payment";

const store = configureStore({
  reducer: {
    [myordersApi.reducerPath]: myordersApi.reducer,
    [similarproductsApi.reducerPath]: similarproductsApi.reducer,
    [attributeApi.reducerPath]: attributeApi.reducer,
    [filterproductsApi.reducerPath]: filterproductsApi.reducer,

    Userdata: Userdata,
    StoreData: StoreData,
    CategoryData: CategoryData,
    Product: Product,

    Cartdata: Cartdata,
    Wishdata: Wishdata,
    OrderData: Orderdata,
    TermsData: TermsData,
    FAQdata: FAQdata,
    AboutUsData: AboutUsData,

    CouponData: CouponData,
    [postContactUs.reducerPath]: postContactUs.reducer,


    [cartApi.reducerPath]: cartApi.reducer,

    [summaryApi.reducerPath]: summaryApi.reducer,

    // Cart Api
    [reviewApibyProductID.reducerPath]: reviewApibyProductID.reducer,

    [productsavailableApi.reducerPath]: productsavailableApi.reducer,
    [addproductreviewApi.reducerPath]: addproductreviewApi.reducer,


    [getOrderDetailsAPI.reducerPath]: getOrderDetailsAPI.reducer,

    [Notification_Api.reducerPath]: Notification_Api.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [getlogocolorApi.reducerPath]: getlogocolorApi.reducer,

    // Products
    [productsApi.reducerPath]: productsApi.reducer,

    //Auth
    [AuthApi.reducerPath]: AuthApi.reducer,
    [ProfileApi.reducerPath]: ProfileApi.reducer,
    [uploadImage.reducerPath]: uploadImage.reducer,
    [UpdateMobile.reducerPath]: UpdateMobile.reducer,
    [ChangeMobile.reducerPath]: ChangeMobile.reducer,

    // Site Settings
    settings: settingsReducer,

    [PaymentApi.reducerPath]: PaymentApi.reducer,

    // User
    [getNotificationbyId.reducerPath]: getNotificationbyId.reducer,

    //Search
    [SearchApi.reducerPath]: SearchApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    })
      //Auth
      .concat(AuthApi.middleware)
      .concat(ProfileApi.middleware)
      .concat(uploadImage.middleware)

      .concat(UpdateMobile.middleware)
      .concat(ChangeMobile.middleware)

      //Products
      .concat(productsApi.middleware)

      //Search
      .concat(SearchApi.middleware)

      //User
      .concat(getNotificationbyId.middleware)

      .concat(attributeApi.middleware)
      .concat(filterproductsApi.middleware)

      .concat(cartApi.middleware)

      .concat(summaryApi.middleware)

      .concat(similarproductsApi.middleware)

      .concat(reviewApibyProductID.middleware)

      .concat(myordersApi.middleware)
      .concat(productsavailableApi.middleware)

      .concat(addproductreviewApi.middleware)

      .concat(getOrderDetailsAPI.middleware)

      .concat(Notification_Api.middleware)
      .concat(notificationApi.middleware)
      .concat(getlogocolorApi.middleware)

      .concat(postContactUs.middleware)

      .concat(PaymentApi.middleware),
});

setupListeners(store.dispatch);

export default store;
