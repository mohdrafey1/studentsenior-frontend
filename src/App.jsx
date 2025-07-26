import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ScrollToTop from './utils/ScrollToTop';
import RoutesComponent from './routesComponent';
import HistoryTracker from './utils/HistoryTracker';
import { useDispatch } from 'react-redux';
import { signInSuccess, signOut } from './redux/user/userSlice';
import { fetchSavedCollection } from './redux/slices/savedCollectionSlice';
import { API_BASE_URL } from './config/apiConfiguration';

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            const user = await fetch(`${API_BASE_URL}/api/user/data`, {
                credentials: 'include',
            });
            const userData = await user.json();
            dispatch(signInSuccess(userData));
        };
        fetchUser();
        dispatch(fetchSavedCollection())
            .unwrap()
            .catch((error) => {
                if (error?.status === 401) {
                    dispatch(signOut());
                }
            });
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
