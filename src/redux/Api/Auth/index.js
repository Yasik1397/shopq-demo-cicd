import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { endpoints } from "../../endpoints";
import Config from "react-native-config";
import { GetValue } from "../../../utils/storageutils";

const baseURL = endpoints?.mobile;
const tenant_id = Config.SUBDOMAIN;

// User Authentication Api
export const AuthApi = createApi({
  reducerPath: "AuthApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => headers.set("origin", `${tenant_id}`),
  }),
  endpoints: (builder) => ({
    Login: builder.mutation({
      query: (data) => ({
        url: `/auth/users/user-login?mobile_number=${
          data?.mobile_number
        }&country_code=${encodeURIComponent(data?.country_code)}&fcm_token=${
          data?.fcm_token
        }&${data?.resend ? "&resend=true" : "&resend=false"}`,
        method: "POST",
      }),
    }),
    VerifyMobile: builder.mutation({
      query: ({ mobile_number, country_code, mobile_number_otp }) => {
        const queryParams = new URLSearchParams({
          mobile_number,
          country_code,
          mobile_number_otp,
        });
        console.log('queryParams: ', queryParams);
        return {
          url: `/users/verify-email-otp?${queryParams.toString()}`,
          method: "POST",
        };
      },
    }),
    VerifyEmail: builder.mutation({
      query: ({ email, otp }) => ({
        url: `/users/verify-email-otp?email=${email}&otp=${otp}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useVerifyMobileMutation,
  useVerifyEmailMutation,
} = AuthApi;

export const ProfileApi = createApi({
  reducerPath: "ProfileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: async (headers) => {
      const accessToken = await GetValue("token");
      let token = accessToken.data;
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
      headers.set("origin", `${tenant_id}`);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/users/${data?.id}`,
        method: "PUT",
        body: data?.updatedata,
      }),
    }),
    deleteProfile: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
    }),
    logoutProfile: builder.mutation({
      query: (id) => ({
        url: `/auth/users/user-logout${id}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useDeleteProfileMutation,
  useLogoutProfileMutation,
} = ProfileApi;

export const uploadImage = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      headers.set("origin", `${tenant_id}`);
      return headers;
    },
  }),
  reducerPath: "uploadImage",
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: ({ id, formData }) => {
        return {
          url: `users/profile/${id}`,
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});
export const { useUploadImageMutation } = uploadImage;
