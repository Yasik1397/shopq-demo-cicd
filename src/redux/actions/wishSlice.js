import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Config from "react-native-config";
import { endpoints } from "../endpoints";
import { GetValue } from "../../utils/storageutils";

const baseURL = endpoints.products;
const tenant_id = Config.SUBDOMAIN;

// Utility to prepare headers
const prepareHeaders = async () => {
  const headers = new Headers();
  const accessToken = await GetValue("token");
  let token = accessToken.data;
  headers.set("Content-Type", "application/json");
  headers.set("origin", `${tenant_id}`);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};

// Async Thunks
export const fetchWishlistById = createAsyncThunk(
  "wishlist/fetchWishlistById",
  async (userId, { rejectWithValue }) => {
    try {
      const headers = await prepareHeaders();
      const response = await fetch(`${baseURL}/wishlist/user/${userId}`, {
        method: "GET",
        headers,
      });
      if (!response.ok) throw new Error("Failed to fetch wishlist");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (data, { rejectWithValue }) => {
    try {
      const headers = await prepareHeaders();
      const response = await fetch(`${baseURL}/wishlist`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to add to wishlist");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (id, { rejectWithValue }) => {
    try {
      const headers = await prepareHeaders();
      const response = await fetch(`${baseURL}/wishlist/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!response.ok) throw new Error("Failed to remove from wishlist");
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlistById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlistById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.records;
      })
      .addCase(fetchWishlistById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to Wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove from Wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((item) => item.id !== action.payload);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default wishlistSlice.reducer;
