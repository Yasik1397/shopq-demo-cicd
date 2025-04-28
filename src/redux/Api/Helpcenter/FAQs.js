import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { GetValue } from "../../../utils/storageutils";
import { endpoints } from "../../endpoints";
import Config from "react-native-config";

const base_url = endpoints?.settings;
const tenant_id = Config.SUBDOMAIN;
const prepareHeaders = async () => {
  const accessToken = await GetValue('token');
  let token = accessToken.data;
  const Header = new Headers();
  Header.append('Content-Type', 'application/json');
  Header.append('origin', tenant_id);
  if (token) {
    Header.append('Authorization', `Bearer ${token}`);
  }
  return Header;
};
export const getFAQdata = createAsyncThunk("helpcenter/faq", async () => {
 const headers = await prepareHeaders();
  try {
    const response = await fetch(
      `${base_url}/cms-pages?type=faq`,
      {
        method: "GET",
        headers,
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
});
const initialState = {
  data: [],
  status: "idle",
  loading: false,
  error: null,
};
const FAQSlice = createSlice({
  name: "FAQ",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFAQdata.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(getFAQdata.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getFAQdata.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default FAQSlice.reducer;
