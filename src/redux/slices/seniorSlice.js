//will implement later, was just trying and it work awesome ...

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, API_KEY } from '../../config/apiConfiguration';

export const fetchSeniors = createAsyncThunk(
    'seniors/fetchSeniors',
    async (collegeId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${api.senior}/college/${collegeId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch seniors');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const seniorSlice = createSlice({
    name: 'seniors',
    initialState: {
        seniors: [],
        loading: false,
        error: null,
    },
    reducers: {
        // Optional: Define additional reducers if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSeniors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSeniors.fulfilled, (state, action) => {
                state.seniors = action.payload;
                state.loading = false;
            })
            .addCase(fetchSeniors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default seniorSlice.reducer;
