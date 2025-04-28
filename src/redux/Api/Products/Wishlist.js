import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Config from "react-native-config";
import { GetValue } from "../../../utils/storageutils";
import { endpoints } from "../../endpoints";

const baseURL = endpoints.products;
const tenant_id = Config.SUBDOMAIN;

export const wishlistApi = createApi({
  reducerPath: "wishlistApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: async (headers) => {
      const accessToken = await GetValue("token");
      let token = accessToken.data;
      headers.set("Content-Type", "application/json");
      headers.set("origin", `${tenant_id}`);
      token = token?.replace(/^"|"$/g, "");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    //Get Wishlist by User Id
    getWishlistbyId: builder.query({
      query: (userid) => `/wishlist/user/${userid}`,
    }),

    // Remove from Wishlist by Id
    removeFromWishlist: builder.mutation({
      query: (id) => ({
        url: `/wishlist/${id}`,
        method: "DELETE",
      }),
    }),

    // Add to Wishlist
    addToWishlist: builder.mutation({
      query: (data) => ({
        url: "/wishlist",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetWishlistbyIdQuery,
  useRemoveFromWishlistMutation,
  useAddToWishlistMutation,
} = wishlistApi;
