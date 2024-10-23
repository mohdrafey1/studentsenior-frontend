import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <ToastContainer autoClose={3000} position="top-center" />
            <main>{children}</main>
            <Footer />
        </>
    );
};

export default Layout;
