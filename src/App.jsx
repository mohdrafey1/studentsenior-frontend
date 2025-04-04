import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ScrollToTop from './utils/ScrollToTop';
import RoutesComponent from './routesComponent';
import HistoryTracker from './utils/HistoryTracker';
import { useDispatch } from 'react-redux';
import { fetchSavedCollection } from './redux/slices/savedCollectionSlice';

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSavedCollection());
    }, [dispatch]);

    return (
        <Router>
            <ScrollToTop />
            <HistoryTracker />
            <Layout>
                <RoutesComponent />
            </Layout>
        </Router>
    );
};

export default App;
