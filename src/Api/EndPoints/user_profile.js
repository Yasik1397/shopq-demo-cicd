import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Config from "react-native-config";
import { GetValue } from "../../utils/storageutils";
const URL = Config?.API_URL;

const baseURL = `${URL}/shopq-admin/`;
const tenant_id = Config.SUBDOMAIN;

export const Notification_Api = createApi({
  reducerPath: "Notification_Api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      headers.set("origin", `${tenant_id}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    Notification_Api: builder.query({
      query: ({ id }) => {
        return `notifications/${id}`;
      },
    }),
  }),
});
export const { useNotification_ApiQuery } = Notification_Api;

// During Authentication
export const ChangeMobile = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      headers.set("origin", tenant_id);
      return headers;
    },
  }),
  reducerPath: "ChangeMobile",
  endpoints: (builder) => ({
    ChangeMobile: builder.mutation({
      query: ({ country_code, mobile_number, email, newmobile }) => {
        const params = new URLSearchParams({
          country_code,
          mobile_number,
          email,
        });
        console.log("params: ", params);

        if (newmobile) {
          params.append("update_mobile_number", `${newmobile}`,);
          params.append("country_code", `${country_code}`,);
        }

        return {
          url: `change-mobile-number?${params.toString()}`,
          method: "PATCH",
        };
      },
    }),
  }),
});

export const { useChangeMobileMutation } = ChangeMobile;

// In Profile
export const UpdateMobile = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      headers.set("origin", `${tenant_id}`);
      return headers;
    },
  }),
  reducerPath: "UpdateMobile",
  endpoints: (builder) => ({
    UpdateMobile: builder.mutation({
      query: (data) => ({
        url: `users/change/${
          data?.id
        }?change_mobile_number=${encodeURIComponent(data?.country_code)}${
          data?.mobile_number
        }${data?.otp ? "&otp=" + data?.otp : ""}`,
        method: "PATCH",
      }),
    }),
  }),
});

export const { useUpdateMobileMutation } = UpdateMobile;
