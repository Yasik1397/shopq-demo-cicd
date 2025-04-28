import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Config from 'react-native-config';
import { GetValue } from '../../../utils/storageutils';
import { endpoints } from '../../endpoints';
const baseURL = endpoints.settings;
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

export const getStoreData = createAsyncThunk('StoreData', async () => {
  const headers = await prepareHeaders();
  const response = await fetch(`${baseURL}/store`, {
    method: 'GET',
    headers,
  });
  const result = await response.json();
  console.log('result: ', result);
  return result;
});

const initialState = {
  data: {},
  status: 'idle',
  loading: false,
  error: null,
};

const storeSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getStoreData.pending, state => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(getStoreData.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'success';
        state.data = action.payload;
      })
      .addCase(getStoreData.rejected, state => {
        state.loading = false;
        state.status = 'failed';
      });
  },
});

export default storeSlice.reducer;
