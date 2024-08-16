import React from 'react';
import CollegeLinks from '../components/Links/CollegeLinks';
import Header from '../components/Header/Header';

const PYQPage = () => {
    return (
        <div className="container bg-sky-100">
            <Header />
            <CollegeLinks />
            <div className="max-w-7xl mx-auto p-5 bg-sky-100 min-h-screen">
                <h1 className="text-3xl font-bold mb-5 text-center">
                    Previous Year Questions (PYQ)
                </h1>
                <div className="bg-white p-6 rounded-lg shadow-md text-center mb-8">
                    <p className="mb-4 text-2xl">
                        You can find all the Previous year question papers.
                    </p>
                    <a
                        href="https://drive.google.com/your-google-drive-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-sky-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                        View PYQ Papers
                    </a>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center mb-8">
                    <p className="mb-4 text-2xl">
                        Get solved question paper for just ₹29 only. <br />
                        <span className="text-sm text-gray-500">
                            Terms and conditions apply.
                        </span>
                    </p>
                    <a
                        href="#"
                        className="inline-block px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors duration-200"
                    >
                        Buy Solved Question Paper
                    </a>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="mb-4 text-2xl">
                        If you have any Previous year questions or notes, please
                        share them with us.
                    </p>
                    <a
                        href="mailto:your-email@example.com"
                        className="inline-block px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors duration-200"
                    >
                        Click Here to Share
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PYQPage;
