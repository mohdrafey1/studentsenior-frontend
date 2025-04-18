import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, API_KEY } from '../../config/apiConfiguration';

export const fetchNotes = createAsyncThunk(
    'notes/fetchNotes',
    async (collegeId, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${api.subjectNotes}/college/${collegeId}`,
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

const notesSlice = createSlice({
    name: 'notes',
    initialState: {
        notes: [],
        loading: false,
        error: null,
    },
    reducers: {
        // Optional: Define additional reducers if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotes.fulfilled, (state, action) => {
                state.notes = action.payload;
                state.loading = false;
            })
            .addCase(fetchNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default notesSlice.reducer;
