import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, API_KEY } from '../../config/apiConfiguration';

export const fetchColleges = createAsyncThunk(
    'colleges/fetchColleges',
    async (collegeId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${api.college}`, {
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

const collegeSlice = createSlice({
    name: 'colleges',
    initialState: {
        colleges: [],
        loading: false,
        error: null,
    },
    reducers: {
        // Optional: Define additional reducers if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchColleges.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchColleges.fulfilled, (state, action) => {
                state.colleges = action.payload;
                state.loading = false;
            })
            .addCase(fetchColleges.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default collegeSlice.reducer;
