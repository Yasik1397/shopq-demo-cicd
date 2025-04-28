import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Config from "react-native-config";
import { endpoints } from "../../endpoints";

const baseURL = endpoints.products;
const tenant_id = Config.SUBDOMAIN;

const Header = new Headers();
Header.append("Content-Type", "application/json");
Header.append("origin", tenant_id);


export const SettingsData = createAsyncThunk("SettingsData", async () => {
  const response = await fetch(`${baseURL}/site_settings`, {
    method: "GET",
    headers: Header,
  });
  const result = await response.json();
  return result;
});

const initialState = {
  data: {},
  status: "idle",
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(SettingsData.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(SettingsData.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "success";
        state.data = action.payload;
      })
      .addCase(SettingsData.rejected, (state) => {
        state.loading = false;
        state.status = "failed";
      });
  },
});

export default settingsSlice.reducer;
