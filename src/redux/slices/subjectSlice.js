import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../config/apiConfiguration';

export const fetchSubjects = createAsyncThunk(
    'subjects/fetchSubjects',
    async (branchId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${api.subjects}/${branchId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'KHAZANA_123',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch subjects');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const subjectSlice = createSlice({
    name: 'subjects',
    initialState: {
        subjects: [],
        loading: false,
        error: null,
    },
    reducers: {
        // Optional: Define additional reducers if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubjects.fulfilled, (state, action) => {
                state.subjects = action.payload;
                state.loading = false;
            })
            .addCase(fetchSubjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default subjectSlice.reducer;
