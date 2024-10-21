import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="text-center py-20">
            <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
            <p className="mt-4">The page you're looking for doesn't exist.</p>
            <Link
                to="/"
                className="mt-6 inline-block bg-blue-500 text-white px-4 py-2 rounded"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFoundPage;
