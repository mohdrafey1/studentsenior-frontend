import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
    useParams,
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
import Layout from './components/Layout/Layout';
import NotFoundPage from './components/NotFoundPage';
import ContactUs from './Forms/ContactUs';
import PrivacyPolicy from './others/PrivacyPolicy';
import PostDetail from './DetailPages/PostDetail';
import ScrollToTop from './utils/ScrollToTop';

const validColleges = [
    'integral-university',
    'mpec-kanpur',
    'gcet-noida',
    'kmc-university',
];

const ValidateCollegeRoute = ({ children }) => {
    const { collegeName } = useParams();

    if (!validColleges.includes(collegeName)) {
        return <Navigate to="/not-found" replace />;
    }

    return children;
};

const App = () => {
    const user = false;
    // will implement later
    // const userData = localStorage.getItem('persist:root');
    // const object = JSON.parse(userData);
    // const currentUser = object.user;
    // console.log(object);
    // console.log(object.user);

    return (
        <Router>
            <ScrollToTop />
            <Layout>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route
                        path="/college/:collegeName"
                        element={
                            <ValidateCollegeRoute>
                                <CollegePage />
                            </ValidateCollegeRoute>
                        }
                    />
                    <Route
                        path="/college/:collegeName/seniors"
                        element={
                            <ValidateCollegeRoute>
                                <SeniorsPage />
                            </ValidateCollegeRoute>
                        }
                    />
                    <Route
                        path="/college/:collegeName/pyq"
                        element={
                            <ValidateCollegeRoute>
                                <PYQPage />
                            </ValidateCollegeRoute>
                        }
                    />
                    <Route
                        path="/college/:collegeName/store"
                        element={
                            <ValidateCollegeRoute>
                                <StorePage />
                            </ValidateCollegeRoute>
                        }
                    />
                    <Route
                        path="/college/:collegeName/community"
                        element={
                            <ValidateCollegeRoute>
                                <CommunityPage />
                            </ValidateCollegeRoute>
                        }
                    />
                    <Route
                        path="/college/:collegeName/community/post/:id"
                        element={
                            <ValidateCollegeRoute>
                                <PostDetail />
                            </ValidateCollegeRoute>
                        }
                    />
                    <Route
                        path="/college/:collegeName/whatsapp-group"
                        element={
                            <ValidateCollegeRoute>
                                <WhatsAppGroupPage />
                            </ValidateCollegeRoute>
                        }
                    />
                    <Route
                        path="/college/:collegeName/opportunities"
                        element={
                            <ValidateCollegeRoute>
                                <OpportunitiesPage />
                            </ValidateCollegeRoute>
                        }
                    />
                    <Route
                        path="/college/:collegeName/notes"
                        element={
                            <ValidateCollegeRoute>
                                <NotesPage />
                            </ValidateCollegeRoute>
                        }
                    />

                    <Route path="/becomesenior" element={<AddSenior />} />
                    <Route path="/add-college" element={<AddCollege />} />
                    <Route path="/about-us" element={<AboutPage />} />
                    <Route path="/contact-us" element={<ContactUs />} />

                    <Route
                        path="/sign-in"
                        element={user ? <Navigate to="/" /> : <SignIn />}
                    />
                    <Route path="/sign-up" element={<Signup />} />

                    <Route element={<PrivateRoute />}>
                        <Route path="/profile" element={<Profile />} />
                    </Route>

                    <Route path="/install" element={<InstallPage />} />

                    <Route path="/not-found" element={<NotFoundPage />} />

                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
