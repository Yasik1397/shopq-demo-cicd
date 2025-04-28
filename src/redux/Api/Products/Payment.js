import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { endpoints } from "../../endpoints";
import Config from "react-native-config";

const baseURL = endpoints.orders;
const tenant_id = Config.SUBDOMAIN;

export const PaymentApi = createApi({
  reducerPath: "postPayment",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => headers.set("origin", `${tenant_id}`),
  }),
  endpoints: (builder) => ({
    postPayment: builder.mutation({
      query: (data) => ({
        url: "/create_order_payment",
        method: "POST",
        body: data,
      }),
    }),
    updatePayment: builder.mutation({
      query: (data) => ({
        url: "/update_order_payment",
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const { usePostPaymentMutation, useUpdatePaymentMutation } = PaymentApi;
