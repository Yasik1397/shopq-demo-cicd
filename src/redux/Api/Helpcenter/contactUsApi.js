import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { endpoints } from "../../endpoints";
import Config from "react-native-config";

const baseURL = endpoints?.admin;
const tenant_id = Config.SUBDOMAIN;
export const postContactUs = createApi({
  reducerPath: "postContactUsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      headers.set("origin", `${tenant_id}`);
      return headers;
    }
  }),
  endpoints: (builder) => ({
    postContactUs: builder.mutation({
      query: (data) => ({
        url: "/contact_us",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const { usePostContactUsMutation } = postContactUs;
