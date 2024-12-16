import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ScrollToTop from './utils/ScrollToTop';
import RoutesComponent from './routesComponent';

const App = () => {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.addEventListener('statechange', (event) => {
                    if (event.target.state === 'activated') {
                        window.location.reload();
                    }
                });
            });
        }
    }, []);

    return (
        <Router>
            <ScrollToTop />
            <Layout>
                <RoutesComponent />
            </Layout>
        </Router>
    );
};

export default App;
