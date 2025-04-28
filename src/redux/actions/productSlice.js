import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import Config from 'react-native-config';
import {endpoints} from '../endpoints';
import {GetValue} from '../../utils/storageutils';

const baseURL = endpoints.products;
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

export const fetchProducts = createAsyncThunk(
  'products/fetch',
  async (params, {rejectWithValue}) => {
    try {
      const headers = await prepareHeaders();

      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.min_off_percentage !== undefined)
        queryParams.append('min_off_percentage', params.min_off_percentage);
      if (params.max_off_percentage !== undefined)
        queryParams.append('max_off_percentage', params.max_off_percentage);
      if (params.brand_ids) queryParams.append('brands_ids', params.brand_ids);
      if (params.min_price !== undefined)
        queryParams.append('min_price', params.min_price);
      if (params.max_price !== undefined)
        queryParams.append('max_price', params.max_price);
      if (params.rating) queryParams.append('rating', params.rating);
      if (params.parent_variant_ids)
        queryParams.append('parent_variant_ids', params.parent_variant_ids);
      if (params.child_variant_ids)
        queryParams.append('child_variant_ids', params.child_variant_ids);
      if (params.child_category_id)
        queryParams.append('child_category_id', params.child_category_id);

      if (params.sort_by_column === 'most_rating') {
        queryParams.append('rating_is_five', true);
      } else {
        if (params.sort_by) queryParams.append('sort_by', params.sort_by);
        if (params.sort_by_column)
          queryParams.append('sort_by_column', params.sort_by_column);
      }

      const url = `${baseURL}products?${queryParams.toString()}`;
      const response = await fetch(url, {method: 'GET', headers});

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  },
);

// Async Thunk to Fetch Product by ID
export const fetchproductDetails = createAsyncThunk(
  'product/fetchById',
  async ({productid, userid, product_sku, product_slug}, {rejectWithValue}) => {
    try {
      const headers = await prepareHeaders();

      let url = `${baseURL}/products/${productid}`;
      if (product_sku) {
        url = `${baseURL}/products/get-product?product_slug=${product_slug}&product_sku=${product_sku}&user_id=${userid}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  },
);

export const fetchReviewsByProductID = createAsyncThunk(
  'reviews/fetchByProductID',
  async ({product_id}, {rejectWithValue}) => {
    try {
      const headers = await prepareHeaders();

      const response = await fetch(
        `${baseURL}/reviews?product_id=${product_id}`,
        {
          method: 'GET',
          headers,
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  },
);

// Slice Definition
const productSlice = createSlice({
  name: 'product',
  initialState: {
    data: null,
    details: null,
    reviews: null,
    similar: null,
    loading: {
      product: false,
      details: false,
      reviews: false,
    },
    error: {
      product: null,
      details: null,
      reviews: null,
    },
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.loading.product = true;
        state.error.product = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading.product = false;
        state.data = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading.product = false;
        state.error.product = action.payload;
      })

      // Product Details
      .addCase(fetchproductDetails.pending, state => {
        state.loading.details = true;
        state.error.details = null;
      })
      .addCase(fetchproductDetails.fulfilled, (state, action) => {
        state.loading.details = false;
        state.details = action.payload;
      })
      .addCase(fetchproductDetails.rejected, (state, action) => {
        state.loading.details = false;
        state.error.details = action.payload;
      })

      // Reviews
      .addCase(fetchReviewsByProductID.pending, state => {
        state.loading.reviews = true;
        state.error.reviews = null;
      })
      .addCase(fetchReviewsByProductID.fulfilled, (state, action) => {
        state.loading.reviews = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsByProductID.rejected, (state, action) => {
        state.loading.reviews = false;
        state.error.reviews = action.payload;
      });
  },
});

export default productSlice.reducer;
