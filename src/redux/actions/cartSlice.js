import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Config from "react-native-config";
import { GetValue } from "../../utils/storageutils";
import { endpoints } from "../endpoints";

const baseURL = endpoints.cart
const tenant_id = Config.SUBDOMAIN;

// Helper function for headers
const prepareHeaders = async () => {
  const accessToken = await GetValue("token");
  let token = accessToken.data;
  token = token?.replace(/^"|"$/g, "");
  return {
    "Content-Type": "application/json",
    origin: tenant_id,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Thunks for async actions

// Fetch cart by user ID
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      const headers = await prepareHeaders();
      const response = await fetch(`${baseURL}/cart/user/${userId}`, {
        method: "GET",
        headers,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch cart");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (cartItem, { rejectWithValue }) => {
    try {
      const headers = await prepareHeaders();
      const response = await fetch(`${baseURL}/cart`, {
        method: "POST",
        headers,
        body: JSON.stringify(cartItem),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to add to cart");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update cart by ID
export const updateCartById = createAsyncThunk(
  "cart/updateCartById",
  async ({ id, ...updates }, { rejectWithValue }) => {
    try {
      const headers = await prepareHeaders();
      const response = await fetch(`${baseURL}/cart/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to update cart");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete cart item by ID
export const deleteCartById = createAsyncThunk(
  "cart/deleteCartById",
  async (id, { rejectWithValue }) => {
    try {
      const headers = await prepareHeaders();
      const response = await fetch(`${baseURL}/cart/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!response.ok) throw new Error("Failed to delete cart item");
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.records || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart.push(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Cart
      .addCase(updateCartById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartById.fulfilled, (state, action) => {
        state.loading = false;
        const updatedItem = action.payload;
        const index = state.cart.findIndex(
          (item) => item.id === updatedItem.id
        );
        if (index !== -1) {
          state.cart[index] = {
            ...state.cart[index],
            ...updatedItem,
          };
        }
      })
      .addCase(updateCartById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Cart
      .addCase(deleteCartById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCartById.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = state.cart.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteCartById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
