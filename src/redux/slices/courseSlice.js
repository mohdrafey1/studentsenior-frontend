import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../config/apiConfiguration';

export const fetchCourses = createAsyncThunk(
    'courses/fetchCourses',
    async (collegeId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${api.courses}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'KHAZANA_123',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const courseSlice = createSlice({
    name: 'courses',
    initialState: {
        courses: [],
        loading: false,
        error: null,
    },
    reducers: {
        // Optional: Define additional reducers if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.courses = action.payload;
                state.loading = false;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default courseSlice.reducer;
