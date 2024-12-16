import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ScrollToTop from './utils/ScrollToTop';
import RoutesComponent from './routesComponent';

const App = () => {
    const [updateAvailable, setUpdateAvailable] = useState(false);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker
                    .register('/sw.js')
                    .then((registration) => {
                        console.log('Service Worker registered:', registration);

                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;

                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed') {
                                    if (navigator.serviceWorker.controller) {
                                        // New service worker installed, prompt user to refresh
                                        setUpdateAvailable(true);
                                    }
                                }
                            });
                        });
                    })
                    .catch((error) => {
                        console.error(
                            'Service Worker registration failed:',
                            error
                        );
                    });
            });
        }
    }, []);

    const handleRefresh = () => {
        // Send a message to the service worker to skip waiting and take control
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'SKIP_WAITING',
            });
        }
        window.location.reload();
    };

    return (
        <Router>
            <ScrollToTop />
            <Layout>
                <RoutesComponent />
                {updateAvailable && (
                    <div className="update-notification">
                        <p>A new update is available!</p>
                        <button onClick={handleRefresh}>Refresh Now</button>
                    </div>
                )}
            </Layout>
        </Router>
    );
};

export default App;
