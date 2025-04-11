import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, API_KEY } from '../../config/apiConfiguration';

export const fetchSavedCollection = createAsyncThunk(
    'savedCollection/fetchSavedCollection',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${api.savedData.savedCollection}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue({
                    message: data.message || 'Failed to fetch saved collection',
                    status: data.statusCode || response.status,
                });
            }

            return {
                savedPYQs: data.savedPYQs || [],
                savedNotes: data.savedNotes || [],
                purchasedPYQs: data.purchasedPYQs || [],
                purchasedNotes: data.purchasedNotes || [],
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const savedCollectionSlice = createSlice({
    name: 'savedCollection',
    initialState: {
        savedPYQs: [],
        savedNotes: [],
        purchasedPYQs: [],
        purchasedNotes: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSavedCollection.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSavedCollection.fulfilled, (state, action) => {
                state.savedPYQs = action.payload.savedPYQs;
                state.savedNotes = action.payload.savedNotes;
                state.purchasedPYQs = action.payload.purchasedPYQs;
                state.purchasedNotes = action.payload.purchasedNotes;
                state.loading = false;
            })
            .addCase(fetchSavedCollection.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default savedCollectionSlice.reducer;
