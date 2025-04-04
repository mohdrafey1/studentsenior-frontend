import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, API_KEY } from '../../config/apiConfiguration';

export const fetchLostFoundItems = createAsyncThunk(
    'lostfound/fetchLostFoundItems',
    async (collegeId, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${api.lostfound}/college/${collegeId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY,
                    },
                }
            );
            const data = await response.json();
            if (data.success === false) {
                throw new Error(data.message);
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const lostFoundSlice = createSlice({
    name: 'lostfound',
    initialState: {
        lostfound: [],
        loading: false,
        error: null,
    },
    reducers: {
        // Optional: Define additional reducers if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLostFoundItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLostFoundItems.fulfilled, (state, action) => {
                state.lostfound = action.payload;
                state.loading = false;
            })
            .addCase(fetchLostFoundItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default lostFoundSlice.reducer;
