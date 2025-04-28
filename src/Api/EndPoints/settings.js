import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Config from "react-native-config";

const URL = Config?.API_URL;
const tenant_id = Config.SUBDOMAIN;

const baseURL2 = `${URL}/shopq-auth-admin/`;


export const getlogocolorApi = createApi({
  reducerPath: "getlogocolorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL2,
  }),
  endpoints: (builder) => ({
    getlogocolorApi: builder.query({
      query: () => "logo_banner_color/get_all_logo_banner_color",
    }),
  }),
});
export const { useGetlogocolorApiQuery } = getlogocolorApi;


