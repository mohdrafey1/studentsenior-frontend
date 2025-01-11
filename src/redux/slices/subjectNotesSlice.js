import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, API_KEY } from '../../config/apiConfiguration';

export const fetchSubjectNotes = createAsyncThunk(
    'subjectNotes/fetchSubjectNotes',
    async ({ subjectCode, branchCode, collegeId }, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${api.subjectNotes}/${branchCode}/${subjectCode}/${collegeId}`,
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
            return { notes: data.notes, subjectName: data.subjectName };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const subjectNotesSlice = createSlice({
    name: 'subjectNotes',
    initialState: {
        subjectNotes: [],
        subjectName: '',
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
                state.subjectNotes = action.payload.notes;
                state.subjectName = action.payload.subjectName;
                state.loading = false;
            })
            .addCase(fetchSubjectNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default subjectNotesSlice.reducer;
