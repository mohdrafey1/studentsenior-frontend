import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ScrollToTop from './utils/ScrollToTop';
import RoutesComponent from './routesComponent';
import HistoryTracker from './utils/HistoryTracker';

const App = () => {
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
