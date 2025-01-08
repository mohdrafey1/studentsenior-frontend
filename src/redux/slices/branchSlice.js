import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, API_KEY } from '../../config/apiConfiguration';

export const fetchBranches = createAsyncThunk(
    'branches/fetchBranches',
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${api.branches}/${courseId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
            });
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

const branchSlice = createSlice({
    name: 'branches',
    initialState: {
        branches: [],
        loading: false,
        error: null,
    },
    reducers: {
        // Optional: Define additional reducers if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBranches.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBranches.fulfilled, (state, action) => {
                state.branches = action.payload;
                state.loading = false;
            })
            .addCase(fetchBranches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default branchSlice.reducer;
