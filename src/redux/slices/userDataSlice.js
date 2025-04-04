import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, API_KEY } from '../../config/apiConfiguration';

// Async thunk to fetch user data
export const fetchUserData = createAsyncThunk(
    'userData/fetchUserData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${api.userData}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
                credentials: 'include',
            });
            const data = await response.json();

            if (!response.ok || data.success === false) {
                throw new Error(data.message || 'Failed to fetch user data');
            }

            return {
                rewardPoints: data.rewardPoints,
                rewardBalance: data.rewardBalance,
                rewardRedeemed: data.rewardRedeemed,
                userTransaction: data.transactions,
                userProductAdd: data.productsAdded,
                userPyqAdd: data.pyqAdded,
                userNoteAdd: data.notesAdded,
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const userDataSlice = createSlice({
    name: 'userData',
    initialState: {
        rewardPoints: 0,
        rewardBalance: 0,
        rewardRedeemed: 0,
        userTransaction: [],
        userProductAdd: [],
        userPyqAdd: [],
        userNoteAdd: [],
        loading: false,
        error: null,
    },
    reducers: {
        // Optional: Define additional reducers if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.rewardPoints = action.payload.rewardPoints;
                state.rewardBalance = action.payload.rewardBalance;
                state.rewardRedeemed = action.payload.rewardRedeemed;
                state.userTransaction = action.payload.userTransaction;
                state.userProductAdd = action.payload.userProductAdd;
                state.userPyqAdd = action.payload.userPyqAdd;
                state.userNoteAdd = action.payload.userNoteAdd;
                state.loading = false;
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default userDataSlice.reducer;
