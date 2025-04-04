import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, API_KEY } from '../../config/apiConfiguration';

export const fetchPyqs = createAsyncThunk(
    'pyqs/fetchPyqs',
    async (collegeId, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${api.newPyqs}/college/${collegeId}`,
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

const pyqSlice = createSlice({
    name: 'pyqs',
    initialState: {
        pyqs: [],
        loading: false,
        error: null,
    },
    reducers: {
        // Optional: Define additional reducers if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPyqs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPyqs.fulfilled, (state, action) => {
                state.pyqs = action.payload;
                state.loading = false;
            })
            .addCase(fetchPyqs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default pyqSlice.reducer;
