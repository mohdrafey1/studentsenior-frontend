import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, API_KEY } from '../../config/apiConfiguration';

// Async thunk for giving opportunities
export const fetchGiveOpportunity = createAsyncThunk(
    'giveOpportunities/fetchGiveOpportunity',
    async (collegeId, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${api.giveOpportunity}/college/${collegeId}`,
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

const giveOpportunitySlice = createSlice({
    name: 'giveOpportunities',
    initialState: {
        giveOpportunities: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGiveOpportunity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGiveOpportunity.fulfilled, (state, action) => {
                state.giveOpportunities = action.payload;
                state.loading = false;
            })
            .addCase(fetchGiveOpportunity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default giveOpportunitySlice.reducer;
