import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Config from 'react-native-config';
import {GetValue} from '../../../utils/storageutils';

const URL = Config?.API_URL;
const baseURL = `${URL}/shopq-settings/category?type=main`;
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

export const getCategories = createAsyncThunk('getCategories', async () => {
  const headers = await prepareHeaders();
  const response = await fetch(`${baseURL}/get_all_admin_category`, {
    method: 'GET',
    headers,
  });
  const result = await response.json();
  return result;
});

const initialState = {
  data: null,
  status: 'idle',
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getCategories.pending, state => {
        state.loading = false;
        state.status = 'loading';
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        (state.loading = false),
          (state.status = 'success'),
          (state.data = action.payload);
      })
      .addCase(getCategories.rejected, state => {
        (state.loading = false), (state.status = 'failed');
      });
  },
});

export default categorySlice.reducer;
