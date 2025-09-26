import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, credentials, {
                withCredentials: true,
            });
            return response.data; // response.data tiene { token, user }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al iniciar sesión');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: JSON.parse(localStorage.getItem('authUser')) || null,
        token: localStorage.getItem('authToken') || null,       // agregamos token al estado
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('authUser');
            localStorage.removeItem('authToken');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token; // guardamos token

                localStorage.setItem('authUser', JSON.stringify(action.payload.user));
                localStorage.setItem('authToken', action.payload.token);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
