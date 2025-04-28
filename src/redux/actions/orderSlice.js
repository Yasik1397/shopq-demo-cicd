import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Config from "react-native-config";
import { GetValue } from "../../utils/storageutils";
import { endpoints } from "../endpoints";

const baseURL = endpoints.orders;
const tenant_id = Config.SUBDOMAIN;

// Helper function to set headers
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

// Thunks for API calls

// Get My Orders
export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async ({ userid, sort_value, search_value }, { rejectWithValue }) => {
    try {
      const headers = await prepareHeaders();
      const response = await fetch(
        `${baseURL}/orders?page=1&limit=100&user_id=${userid}&order_status=${
          sort_value || ""
        }&search=${search_value || ""}`,
        { headers }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch orders");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get Order Details by Id
export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async (Id, { rejectWithValue }) => {
    try {
      const headers = await prepareHeaders();
      const response = await fetch(`${baseURL}/orders/get_order/${Id}`, {
        headers,
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch order details");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    myOrders: [],
    orderDetails: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch My Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch Order Details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orderDetails = action.payload.records;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export default ordersSlice.reducer;
