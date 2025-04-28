import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Config from "react-native-config";
import { GetValue } from "../../../utils/storageutils";

const URL = Config?.API_URL;
const baseURL = `${URL}/shopq-cart/`;
const tenant_id = Config.SUBDOMAIN;
export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: async (headers) => {
      const accessToken = await GetValue("token");
      let token = accessToken.data;
      headers.set("Content-Type", "application/json");
      headers.set("origin", `${tenant_id}`);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    //Get Cart Details by User Id
    getCart: builder.query({
      query: (id) => `/cart/user/${id}`,
    }),
  }),
});
export const { useGetCartQuery } = cartApi;
