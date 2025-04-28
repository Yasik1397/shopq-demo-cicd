import Config from "react-native-config";

const BaseUrl = Config?.API_URL;

export const endpoints = {
  products: `${BaseUrl}/shopq-products`,
  cart: `${BaseUrl}/shopq-cart`,
  orders: `${BaseUrl}/shopq-orders`,
  settings: `${BaseUrl}/shopq-settings`,
  mobile: `${BaseUrl}/shopq-admin`,
  admin: `${BaseUrl}/shopq-auth-admin`,
};
