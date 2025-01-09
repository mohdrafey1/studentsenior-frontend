import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, API_KEY } from '../../config/apiConfiguration';

export const fetchGetOpportunity = createAsyncThunk(
    'getOpportunities/fetchGetOpportunity',
    async (collegeId, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${api.getOpportunity}/college/${collegeId}`,
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
    name: 'getOpportunities',
    initialState: {
        getOpportunities: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGetOpportunity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGetOpportunity.fulfilled, (state, action) => {
                state.getOpportunities = action.payload;
                state.loading = false;
            })
            .addCase(fetchGetOpportunity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default giveOpportunitySlice.reducer;
