import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetValue } from "../../utils/storageutils";
import Config from "react-native-config";
import { endpoints } from "../endpoints";
const tenant_id = Config.SUBDOMAIN;

const baseURL = endpoints.settings;
const prepareHeaders = async () => {
  const headers = new Headers();
  const accessToken = await GetValue("token");
  let token = accessToken.data;
  headers.set("accept", "application/json");
  headers.set("Content-Type", "application/json");
  headers.set("origin", `${tenant_id}`);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};

export const getTerms = createAsyncThunk("getTerms", async (type) => {
  try {
    const headers = await prepareHeaders();
    const response = await fetch(`${baseURL}/cms-pages?type=${type}`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
});

const termsSlice = createSlice({
  name: "terms",
  initialState: {
    data: null,
    status: "idle",
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Terms
    builder.addCase(getTerms.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getTerms.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(getTerms.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default termsSlice.reducer;