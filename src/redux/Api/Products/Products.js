import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Config from "react-native-config";
const URL = Config?.API_URL;

const baseURL = `${URL}/shopq-products/`;
const tenant_id = Config.SUBDOMAIN;

// get products
export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      headers.set("origin", `${tenant_id}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();

        // Add only non-null and non-undefined values to the query
        if (params.page) queryParams.append("page", params.page);
        if (params.limit) queryParams.append("limit", params.limit);
        if (params.min_off_percentage !== undefined)
          queryParams.append("min_off_percentage", params.min_off_percentage);
        if (params.max_off_percentage !== undefined)
          queryParams.append("max_off_percentage", params.max_off_percentage);
        if (params.brand_ids)
          queryParams.append("brands_ids", params.brand_ids);
        if (params.min_price !== undefined)
          queryParams.append("min_price", params.min_price);
        if (params.max_price !== undefined)
          queryParams.append("max_price", params.max_price);
        if (params.rating) queryParams.append("rating", params.rating);
        if (params.parent_variant_ids)
          queryParams.append("parent_variant_ids", params.parent_variant_ids);
        if (params.child_variant_ids)
          queryParams.append("child_variant_ids", params.child_variant_ids);
        if (params.child_category_id)
          queryParams.append("child_category_id", params.child_category_id);

        // Handle sort_by and sort_by_column logic
        if (params.sort_by_column === "most_rating") {
          queryParams.append("rating_is_five", true);
        } else {
          if (params.sort_by) queryParams.append("sort_by", params.sort_by);
          if (params.sort_by_column)
            queryParams.append("sort_by_column", params.sort_by_column);
        }

        return `products?${queryParams.toString()}`;
      },
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;

