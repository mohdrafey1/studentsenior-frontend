import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from 'react-router-dom';
import MainPage from './pages/MainPage';
import CollegePage from './pages/CollegePage';
import SeniorsPage from './pages/SeniorsPage';
import PYQPage from './pages/PYQPage';
import StorePage from './pages/StorePage';
import CommunityPage from './pages/CommunityPage';
import WhatsAppGroupPage from './pages/WhatsAppGroupPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import NotesPage from './pages/NotesPage';
import AddSenior from './Forms/AddSenior';
import AddCollege from './Forms/AddCollege';
import AboutPage from './pages/AboutPage';
import Signup from './pages/Signup';
import SignIn from './pages/Signin';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import InstallPage from './pages/InstallPage';

const App = () => {
    const user = false;
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/college/:collegeName" element={<CollegePage />} />
                <Route
                    path="/college/:collegeName/seniors"
                    element={<SeniorsPage />}
                />
                <Route path="/college/:collegeName/pyq" element={<PYQPage />} />
                <Route
                    path="/college/:collegeName/store"
                    element={<StorePage />}
                />
                <Route
                    path="/college/:collegeName/community"
                    element={<CommunityPage />}
                />
                <Route
                    path="/college/:collegeName/whatsapp-group"
                    element={<WhatsAppGroupPage />}
                />
                <Route
                    path="/college/:collegeName/opportunities"
                    element={<OpportunitiesPage />}
                />
                <Route
                    path="/college/:collegeName/notes"
                    element={<NotesPage />}
                />
                <Route path="/become-a-senior" element={<AddSenior />} />
                <Route path="/add-college" element={<AddCollege />} />
                <Route path="/about-us" element={<AboutPage />} />
                <Route
                    path="/sign-in"
                    element={user ? <Navigate to="/" /> : <SignIn />}
                />
                <Route path="/sign-up" element={<Signup />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/profile" element={<Profile />} />
                </Route>
                <Route path="/install" element={<InstallPage />} />
            </Routes>
        </Router>
    );
};

export default App;
