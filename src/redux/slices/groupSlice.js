import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, API_KEY } from '../../config/apiConfiguration';

export const fetchGroups = createAsyncThunk(
    'groups/fetchGroups',
    async (collegeId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${api.group}/college/${collegeId}`, {
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

const groupSlice = createSlice({
    name: 'groups',
    initialState: {
        groups: [],
        loading: false,
        error: null,
    },
    reducers: {
        // Optional: Define additional reducers if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGroups.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGroups.fulfilled, (state, action) => {
                state.groups = action.payload;
                state.loading = false;
            })
            .addCase(fetchGroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default groupSlice.reducer;
