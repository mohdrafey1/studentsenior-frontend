import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice.js';
import seniorReducer from './slices/seniorSlice.js';
import courseReducer from './slices/courseSlice.js';
import branchReducer from './slices/branchSlice.js';
import subjectReducer from './slices/subjectSlice.js';
import productReducer from './slices/productSlice.js';
import groupReducer from './slices/groupSlice.js';
import pyqReducer from './slices/pyqSlice.js';
import getOpportunitiesReducer from './slices/getOpportunitySlice.js';
import giveOpportunitiesReducer from './slices/giveOpportunitySlice.js';
import postReducer from './slices/postSlice.js';
import subjectNotesReducer from '../redux/slices/subjectNotesSlice.js';
import subjectPyqsReducer from '../redux/slices/subjectPyqsSlice.js';
import userDataReducer from '../redux/slices/userDataSlice.js';
import collegeReducer from '../redux/slices/collegeSlice.js';
import notesReducer from '../redux/slices/NotesSlice.js';
import lostfoundReducer from '../redux/slices/lostFoundSlice.js';
import savedCollectionReducer from '../redux/slices/savedCollectionSlice.js';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
    user: userReducer,
    seniors: seniorReducer,
    courses: courseReducer,
    branches: branchReducer,
    subjects: subjectReducer,
    products: productReducer,
    groups: groupReducer,
    pyqs: pyqReducer,
    getOpportunities: getOpportunitiesReducer,
    giveOpportunities: giveOpportunitiesReducer,
    posts: postReducer,
    subjectNotes: subjectNotesReducer,
    subjectPyqs: subjectPyqsReducer,
    userData: userDataReducer,
    colleges: collegeReducer,
    notes: notesReducer,
    lostfound: lostfoundReducer,
    savedCollection: savedCollectionReducer,
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
