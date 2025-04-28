import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Config from "react-native-config";
const URL = Config?.API_URL;

const baseURL = `${URL}/shopq-products/`;
const tenant_id = Config.SUBDOMAIN;

export const SearchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      headers.set("origin", `${tenant_id}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    //Global Search
    getGlobalsearch: builder.query({
      query: ({ search_value, user_id }) => {
        return `products?min_price=0${
          search_value.trim() ? "&search=" + search_value : ""
        }${user_id ? "&user_id=" + user_id : ""}`;
      },
    }),

    //Get Recent Search
    GetRecentSearch: builder.query({
      query: (user_id) => {
        return `products/search-key-get/${user_id}`;
      },
    }),

    //Delete Recent Search
    deleteRecent: builder.mutation({
      query: ({ user_id, delete_value }) => {
        return {
          url: `products/search-key-remove/${user_id}?search_key=${delete_value}`,
          method: "DELETE",
        };
      },
    }),
  }),
});
export const {
  useGetGlobalsearchQuery,
  useGetRecentSearchQuery,
  useDeleteRecentMutation,
} = SearchApi;
