import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Config from "react-native-config";
import { GetValue } from "../../utils/storageutils";
const URL = Config?.API_URL;

const baseURL = `${URL}/shopq-products/`;
const tenant_id = Config.SUBDOMAIN;

export const similarproductsApi = createApi({
  reducerPath: "similarproductsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      headers.set("origin", `${tenant_id}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSimilarProducts: builder.query({
      query: ({ id }) => {
        return `products?similarproduct_id=${id}`;
      },
    }),
  }),
});
export const { useGetSimilarProductsQuery } = similarproductsApi;

export const filterproductsApi = createApi({
  reducerPath: "filterproductsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      headers.set("origin", `${tenant_id}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    filterProducts: builder.query({
      query: ({
        min_off_percentage,
        max_off_percentage,
        category_id,
        max_price,
        min_price,
        rating,
        brand_ids,
        parent_variant_ids,
        child_variant_ids,
      }) => {
        return `products?min_off_percentage=${
          min_off_percentage
            ? typeof min_off_percentage === "number"
              ? min_off_percentage
              : 0
            : 0
        }&max_off_percentage=${
          max_off_percentage
            ? typeof max_off_percentage === "number"
              ? max_off_percentage
              : 100
            : 100
        }&brands_ids=${brand_ids ? brand_ids : ""}&min_price=${
          min_price ? min_price : 0
        }&max_price=${max_price ? max_price : 10000}&rating=${
          rating ? rating : ""
        }&parent_variant_ids=${
          parent_variant_ids ? parent_variant_ids : ""
        }&child_variant_ids=${
          child_variant_ids ? child_variant_ids : ""
        }&child_category_id=${category_id ? category_id : ""}`;
      },
    }),
  }),
});
export const { useFilterProductsQuery } = filterproductsApi;

export const reviewApibyProductID = createApi({
  reducerPath: "reviewApibyProductID",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: async (headers) => {
      const accessToken = await GetValue("token");
      const token = accessToken?.data;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        headers.set("origin", `${tenant_id}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getReviewbyProductID: builder.query({
      query: ({ product_id, user_id }) => {
        console.log("Query Parameters:", product_id, user_id);
        let url = `reviews?product_id=${product_id}`;
        if (user_id) {
          url += `&user_id=${user_id}`;
        }
        console.log("url: ", url);

        return url;
      },
    }),
  }),
});

export const { useGetReviewbyProductIDQuery } = reviewApibyProductID;

export const productsavailableApi = createApi({
  reducerPath: "productsavailableApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      headers.set("origin", `${tenant_id}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    productsavailableApi: builder.query({
      query: ({ product_id, variant, user_id }) => {
        console.log(
          "Query Parametersggggggggggggggg:",
          product_id,
          variant,
          user_id
        );
        return `products/check-availability/${product_id}?variant=${variant}&user_id=${user_id}`;
      },
    }),
  }),
});

export const { useProductsavailableApiQuery } = productsavailableApi;

export const addproductreviewApi = createApi({
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
  reducerPath: "addproductreviewApi",
  endpoints: (builder) => ({
    addproductreviewApi: builder.mutation({
      query: (data) => ({
        url: "reviews",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const { useAddproductreviewApiMutation } = addproductreviewApi;
