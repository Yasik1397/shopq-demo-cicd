import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Config from 'react-native-config';
import {GetValue} from '../../utils/storageutils';
// user token

const URL = Config?.API_URL;
const baseURL = `${URL}/shopq-admin/`;
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

export const getUserData = createAsyncThunk('getUserData', async data => {
  const headers = await prepareHeaders();
  const response = await fetch(`${baseURL}users/${data?.id}`, {
    method: 'GET',
    headers,
  });
  const result = await response.json();
  return result;
});

const initialState = {
  user: null,
  status: 'idle',
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getUserData.pending, state => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'success';
        state.user = action.payload;
      })
      .addCase(getUserData.rejected, state => {
        state.loading = false;
        state.status = 'failed';
      });
  },
});

export default userSlice.reducer;
