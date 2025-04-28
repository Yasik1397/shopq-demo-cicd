import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Config from "react-native-config";
import { GetValue } from "../../utils/storageutils";
const URL = Config?.API_URL;
const tenant_id = Config.SUBDOMAIN;

// User AccessToken

const baseURL = `${URL}/shopq-orders/`;
export const summaryApi = createApi({
  reducerPath: "summaryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: async (headers) => {
      const accessToken = await GetValue("token");
      let token = accessToken.data;
      headers.set("accept", "application/json");
      headers.set("Content-Type", "application/json");
      headers.set("origin", `${tenant_id}`);
      token = token.replace(/^"|"$/g, "");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSummary: builder.query({
      query: ({ amount }) => `/orders/summary/calculation?price=${amount}`,
    }),
  }),
});
export const { useGetSummaryQuery } = summaryApi;

export const myordersApi = createApi({
  reducerPath: "myordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: async (headers) => {
      const accessToken = await GetValue("token");
      let token = accessToken.data;
      headers.set("accept", "application/json");
      headers.set("Content-Type", "application/json");
      headers.set("origin", `${tenant_id}`);
      token = token.replace(/^"|"$/g, "");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getMyorders: builder.query({
      query: ({ userid, sort_value, search_value }) =>
        `orders?page=1&limit=100&user_id=${userid}&order_status=${
          sort_value || ""
        }&search=${search_value || ""}`,
    }),
  }),
});
export const { useGetMyordersQuery } = myordersApi;

export const getOrderDetailsAPI = createApi({
  reducerPath: "getOrderDetailsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: async (headers) => {
      const accessToken = await GetValue("token");
      let token = accessToken.data;
      headers.set("accept", "application/json");
      headers.set("Content-Type", "application/json");
      headers.set("origin", `${tenant_id}`);
      token = token.replace(/^"|"$/g, "");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getOrderDetails: builder.query({
      query: (orderid) => `/orders/get_order/${orderid}`,
    }),
  }),
});
export const { useGetOrderDetailsQuery } = getOrderDetailsAPI;
