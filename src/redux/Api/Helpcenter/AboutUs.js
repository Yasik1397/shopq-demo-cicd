import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { endpoints } from "../../endpoints";
import { GetValue } from "../../../utils/storageutils";
import Config from "react-native-config";


const tenant_id = Config.SUBDOMAIN;
const base_url = endpoints?.settings;
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
export const getAboutUs = createAsyncThunk("helpcenter/aboutus", async () => {
  try {
    const headers = await prepareHeaders();
    const response = await fetch(`${base_url}/cms-pages?cms_id=1`,{
      method: "GET",
      headers,
    });
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
const AboutUsSlice = createSlice({
  name: "FAQ",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAboutUs.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(getAboutUs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAboutUs.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default AboutUsSlice.reducer;
