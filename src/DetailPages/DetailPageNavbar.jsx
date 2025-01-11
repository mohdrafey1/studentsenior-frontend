import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { originalHandleShare } from '../utils/handleShare';

const DetailPageNavbar = ({ path, handleShare = originalHandleShare }) => {
    const { collegeName } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    const handleBackNavigation = () => {
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate(`/${path}`);
        }
    };

    return (
        <div className="fixed top-0 left-0 z-30 w-full bg-white shadow-md h-16 flex items-center justify-between px-5">
            <div className="text-gray-600">
                <div className="text-gray-600" onClick={handleBackNavigation}>
                    <i className="fa-solid fa-arrow-left-long fa-2xl"></i>
                </div>
            </div>
            <button
                className="text-center hover:text-blue-300"
                onClick={() => handleShare(setLoading)}
                disabled={loading}
            >
                {loading ? (
                    <i className="fa fa-spinner fa-spin"></i>
                ) : (
                    <>
                        <i className="fa-regular fa-share-from-square fa-xl"></i>
                        <p>Share</p>
                    </>
                )}
            </button>
        </div>
    );
};

export default DetailPageNavbar;
