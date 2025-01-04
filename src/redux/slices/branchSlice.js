import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../config/apiConfiguration';

export const fetchBranches = createAsyncThunk(
    'branches/fetchBranches',
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${api.branches}/${courseId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'KHAZANA_123',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch branches');
            }
            const data = await response.json();
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
