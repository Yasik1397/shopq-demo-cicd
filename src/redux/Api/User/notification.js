import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Config from "react-native-config";
import { endpoints } from "../../endpoints";

const baseURL = endpoints.mobile;
const tenant_id = Config.SUBDOMAIN;

export const getNotificationbyId = createApi({
  reducerPath: "getNotificationbyId",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      headers.set("origin", `${tenant_id}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getNotificationbyId: builder.query({
      query: (id) => {
        return `/notifications/${id}`;
      },
    }),
  }),
});
export const { useGetNotificationbyIdQuery } = getNotificationbyId;
