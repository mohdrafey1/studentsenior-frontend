import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../config/apiConfiguration';

export const fetchSubjectNotes = createAsyncThunk(
    'subjects/fetchSubjectNotes',
    async (subjectId, collegeId, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${api.subjectNotes}/${subjectId}/${collegeId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': 'KHAZANA_123',
                    },
                }
            );
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

const subjectNotesSlice = createSlice({
    name: 'subjectNotes',
    initialState: {
        subjectNotes: [],
        loading: false,
        error: null,
    },
    reducers: {
        // Optional: Define additional reducers if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubjectNotes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubjectNotes.fulfilled, (state, action) => {
                state.subjects = action.payload;
                state.loading = false;
            })
            .addCase(fetchSubjectNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default subjectNotesSlice.reducer;
