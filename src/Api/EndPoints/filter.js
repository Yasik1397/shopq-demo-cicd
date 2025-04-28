import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Config from "react-native-config";

const URL = Config?.API_URL;
const tenant_id = Config.SUBDOMAIN;

const baseURL = `${URL}/shopq-auth-admin/`;

export const attributeApi = createApi({
  reducerPath: "attributeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      headers.set("origin", `${tenant_id}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // get attributes by category id
    getattributes: builder.query({
      query: ({ category_id }) => {
        return `admin-category-attribute/?category_id=${category_id}&active=true`;
      },
    }),
    // get brands
    getbrands: builder.query({
      query: () => {
        return `attribute?attribute_type=brands`;
      },
    }),
  }),
});
export const { useGetbrandsQuery, useGetattributesQuery } = attributeApi;
