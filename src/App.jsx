import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import CollegePage from './pages/CollegePage';
import SeniorsPage from './pages/SeniorsPage';
import PYQPage from './pages/PYQPage';
import StorePage from './pages/StorePage';
import CommunityPage from './pages/CommunityPage';
import WhatsAppGroupPage from './pages/WhatsAppGroupPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import NotesPage from './pages/NotesPage';

const App = () => {
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
            </Routes>
        </Router>
    );
};

export default App;
