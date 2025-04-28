import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Config from "react-native-config";

const URL = Config.API_URL;
const baseURL = `${URL}/shopq-admin/notifications/`;
const tenant_id = Config.SUBDOMAIN;

export const notificationApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set("origin", `${tenant_id}`);

      return headers;
    },
  }),
  reducerPath: "notificationApi",
  endpoints: (builder) => ({
    notificationApi: builder.mutation({
      query: (data) => {
        return {
          url: `${data?.userid}?${
            data?.notificationid
              ? `notification_id=${data?.notificationid}`
              : `mark_as_all_read=true`
          }`,
          method: "PATCH",
        };
      },
    }),
  }),
});
export const { useNotificationApiMutation } = notificationApi;
