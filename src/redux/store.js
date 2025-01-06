import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice.js';
import seniorReducer from './slices/seniorSlice.js';
import courseReducer from './slices/courseSlice.js';
import branchReducer from './slices/branchSlice.js';
import subjectReducer from './slices/subjectSlice.js';
import productReducer from './slices/productSlice.js';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
    user: userReducer,
    seniors: seniorReducer,
    courses: courseReducer,
    branches: branchReducer,
    subjects: subjectReducer,
    products: productReducer,
});

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
