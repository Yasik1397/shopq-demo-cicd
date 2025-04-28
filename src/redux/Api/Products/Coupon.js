import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Config from "react-native-config";
import { endpoints } from "../../endpoints";
import { GetValue } from "../../../utils/storageutils";

// Base URL and tenant_id
const baseURL = endpoints.admin;
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


// Thunk to get all coupons
export const getAllCoupens = createAsyncThunk("getAllCoupens", async () => {
 const headers = await prepareHeaders();
  const response = await fetch(`${baseURL}/coupons`, {
    method: "GET",
    headers,
  });
  const result = await response.json();
  return result;
});

// Thunk to validate a coupon
export const validateCoupon = createAsyncThunk(
  "validateCoupon",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${baseURL}/coupons/${data.id}?user_id=${data.user_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            set: { origin: tenant_id },
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to validate coupon");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  data: null,
  status: "idle",
  loading: false,
  error: null,
  validationResult: null,
  validationError: null,
};

// Slice
const couponSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all coupons
      .addCase(getAllCoupens.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(getAllCoupens.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "success";
        state.data = action.payload;
      })
      .addCase(getAllCoupens.rejected, (state) => {
        state.loading = false;
        state.status = "failed";
      })
      // Validate coupon
      .addCase(validateCoupon.pending, (state) => {
        state.loading = true;
        state.status = "validating";
        state.validationError = null;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "validated";
        state.validationResult = action.payload;
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.validationError = action.payload;
      });
  },
});

export default couponSlice.reducer;
