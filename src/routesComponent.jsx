import React from 'react';
import { Route, Routes, Navigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import MainPage from './pages/MainPage';
import CollegePage from './pages/CollegePage';
import SeniorsPage from './pages/SeniorsPage';
import PYQPage from './pages/PYQPage';
import StorePage from './pages/StorePage';
import CommunityPage from './pages/CommunityPage';
import WhatsAppGroupPage from './pages/WhatsAppGroupPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import AddSenior from './Forms/AddSenior';
import AddCollege from './Forms/AddCollege';
import AboutPage from './pages/AboutPage';
import Signup from './pages/Signup';
import SignIn from './pages/Signin';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import InstallPage from './pages/InstallPage';
import NotFoundPage from './components/NotFoundPage';
import ContactUs from './Forms/ContactUs';
import PrivacyPolicy from './others/PrivacyPolicy';
import PostDetail from './DetailPages/PostDetail';
import FAQPage from './others/FAQPage';
import ProductDetail from './DetailPages/ProductDetail';
import SeniorDetailPage from './DetailPages/SeniorDetailPage';
import RequestPYQ from './Forms/RequestPYQ';
import Branches from './components/Resources/Branches';
import Subjects from './components/Resources/Subjects';
import SubjectNotes from './components/Resources/SubjectNotes';
import ResourcesPage from './pages/ResourcesPage';
import SubjectPyqs from './components/Resources/SubjectPyqs';
import NotesView from './components/Resources/NotesView';
import PyqView from './components/Resources/PyqView';
import OpportunityDetails from './DetailPages/OpportunityDetails';
import DonationPage from './others/DonationPage';
import AddPointsPage from './components/AddPoints/AddPointsPage';
import RefundPolicy from './others/RefundPolicy';
import TermsAndConditions from './others/TermsAndConditions';
import LeaderBoardPage from './pages/LeaderBoardPage';
import LostFoundPage from './pages/LostFoundPage';
import NotesPage from './pages/NotesPage';
import LostFoundItemDetail from './DetailPages/LostFoundItemDetail';
import ShippingPolicy from './others/ShippingPolicy';
import Courses from './pages/Courses';
import Cart from './pages/Cart';
import PaymentComplete from './pages/PaymentComplete';
import SavedCollection from './pages/savedCollection';

const validColleges = ['integral-university', 'mpec-kanpur'];

const ValidateCollegeRoute = ({ children }) => {
    const { collegeName } = useParams();

    if (!validColleges.includes(collegeName)) {
        return <Navigate to='/not-found' replace />;
    }

    return children;
};

const RoutesComponent = () => {
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

    return (
        <Routes>
            <Route path='/' element={<MainPage />} />

            {/* College Routes */}
            <Route
                path='/college/:collegeName'
                element={
                    <ValidateCollegeRoute>
                        <CollegePage />
                    </ValidateCollegeRoute>
                }
            />
            <Route
                path='/college/:collegeName/seniors'
                element={
                    <ValidateCollegeRoute>
                        <SeniorsPage />
                    </ValidateCollegeRoute>
                }
            />
            <Route
                path='/college/:collegeName/seniors/:slug'
                element={
                    <ValidateCollegeRoute>
                        <SeniorDetailPage />
                    </ValidateCollegeRoute>
                }
            />
            <Route
                path='/college/:collegeName/pyq'
                element={
                    <ValidateCollegeRoute>
                        <PYQPage />
                    </ValidateCollegeRoute>
                }
            />

            <Route
                path='/college/:collegeName/notes'
                element={
                    <ValidateCollegeRoute>
                        <NotesPage />
                    </ValidateCollegeRoute>
                }
            />

            <Route
                path='/college/:collegeName/store'
                element={
                    <ValidateCollegeRoute>
                        <StorePage />
                    </ValidateCollegeRoute>
                }
            />
            <Route
                path='/college/:collegeName/store/:slug'
                element={
                    <ValidateCollegeRoute>
                        <ProductDetail />
                    </ValidateCollegeRoute>
                }
            />
            <Route
                path='/college/:collegeName/community'
                element={
                    <ValidateCollegeRoute>
                        <CommunityPage />
                    </ValidateCollegeRoute>
                }
            />
            <Route
                path='/college/:collegeName/community/post/:id'
                element={
                    <ValidateCollegeRoute>
                        <PostDetail />
                    </ValidateCollegeRoute>
                }
            />
            <Route
                path='/college/:collegeName/whatsapp-group'
                element={
                    <ValidateCollegeRoute>
                        <WhatsAppGroupPage />
                    </ValidateCollegeRoute>
                }
            />
            <Route
                path='/college/:collegeName/opportunities'
                element={
                    <ValidateCollegeRoute>
                        <OpportunitiesPage />
                    </ValidateCollegeRoute>
                }
            />
            <Route
                path='/college/:collegeName/resources'
                element={
                    <ValidateCollegeRoute>
                        <ResourcesPage />
                    </ValidateCollegeRoute>
                }
            />
            <Route
                path='/:collegeName/resources/:courseCode'
                element={
                    <ValidateCollegeRoute>
                        <Branches />
                    </ValidateCollegeRoute>
                }
            />
            <Route
                path='/:collegeName/resources/:courseCode/:branchCode'
                element={
                    <ValidateCollegeRoute>
                        <Subjects />
                    </ValidateCollegeRoute>
                }
            />
            <Route
                path='/:collegeName/resources/:courseCode/:branchCode/notes/:subjectCode'
                element={
                    <ValidateCollegeRoute>
                        <SubjectNotes />
                    </ValidateCollegeRoute>
                }
            />
            <Route
                path='/:collegeName/resources/:courseCode/:branchCode/pyqs/:subjectCode'
                element={
                    <ValidateCollegeRoute>
                        <SubjectPyqs />
                    </ValidateCollegeRoute>
                }
            />

            <Route
                path='/college/:collegeName/opportunities/:slug'
                element={
                    <ValidateCollegeRoute>
                        <OpportunityDetails />
                    </ValidateCollegeRoute>
                }
            />

            <Route
                path='/college/:collegeName/lost-found'
                element={
                    <ValidateCollegeRoute>
                        <LostFoundPage />
                    </ValidateCollegeRoute>
                }
            />

            <Route
                path='/college/:collegeName/lost-found/:slug'
                element={
                    <ValidateCollegeRoute>
                        <LostFoundItemDetail />
                    </ValidateCollegeRoute>
                }
            />

            {/* Static Routes */}
            <Route path='/becomesenior' element={<AddSenior />} />
            <Route path='/add-college' element={<AddCollege />} />
            <Route path='/about-us' element={<AboutPage />} />
            <Route path='/contact-us' element={<ContactUs />} />

            {/* Authentication Routes */}
            <Route
                path='/sign-in'
                element={isAuthenticated ? <Navigate to='/' /> : <SignIn />}
            />
            <Route path='/sign-up' element={<Signup />} />

            {/* Private Routes */}
            <Route element={<PrivateRoute />}>
                <Route path='/collections' element={<SavedCollection />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/add-points' element={<AddPointsPage />} />
                <Route
                    path='/:collegeName/resources/:courseCode/:branchCode/notes/:subjectCode/:slug'
                    element={
                        <ValidateCollegeRoute>
                            <NotesView />
                        </ValidateCollegeRoute>
                    }
                />
                <Route
                    path='/:collegeName/resources/:courseCode/:branchCode/pyqs/:subjectCode/:slug'
                    element={
                        <ValidateCollegeRoute>
                            <PyqView />
                        </ValidateCollegeRoute>
                    }
                />
            </Route>

            {/* Other Pages */}
            <Route path='/leaderboard' element={<LeaderBoardPage />} />
            <Route path='/request-pyq' element={<RequestPYQ />} />
            <Route path='/install' element={<InstallPage />} />
            <Route path='/not-found' element={<NotFoundPage />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy />} />
            <Route path='/faq' element={<FAQPage />} />
            <Route
                path='/terms-and-conditions'
                element={<TermsAndConditions />}
            />
            <Route path='/refund-policy' element={<RefundPolicy />} />
            <Route path='/shipping-policy' element={<ShippingPolicy />} />
            <Route path='/courses' element={<Courses />} />
            <Route path='/cart' element={<Cart />} />

            <Route path='/payment-complete' element={<PaymentComplete />} />

            {/* <Route path="/donation" element={<DonationPage />} /> */}

            {/* Catch-all for undefined routes */}
            <Route path='*' element={<NotFoundPage />} />
        </Routes>
    );
};

export default RoutesComponent;
