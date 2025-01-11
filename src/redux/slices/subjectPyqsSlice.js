import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, API_KEY } from '../../config/apiConfiguration';

export const fetchSubjectPyqs = createAsyncThunk(
    'subjectPyqs/fetchSubjectPyqs',
    async ({ subjectCode, branchCode, collegeId }, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${api.newPyqs}/${branchCode}/${subjectCode}/${collegeId}`,
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
            return { pyqs: data.pyqs, subjectName: data.subjectName };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const subjectPyqsSlice = createSlice({
    name: 'subjectPyqs',
    initialState: {
        subjectPyqs: [],
        subjectName: '',
        loading: false,
        error: null,
    },
    reducers: {
        // Optional: Define additional reducers if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubjectPyqs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubjectPyqs.fulfilled, (state, action) => {
                state.subjectPyqs = action.payload.pyqs;
                state.subjectName = action.payload.subjectName;
                state.loading = false;
            })
            .addCase(fetchSubjectPyqs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default subjectPyqsSlice.reducer;
