import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { API_KEY_URL } from '../config/apiConfiguration';
import { toast } from 'react-toastify';

const DetailPageNavbar = ({ path }) => {
    const { collegeName } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const handleBackNavigation = () => {
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate(`/college/${collegeName}/${path}`);
        }
    };

    const handleShare = async () => {
        const postUrl = window.location.href;

        try {
            const response = await fetch(
                'https://ssurl.studentsenior.com/api/shorten',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY_URL,
                    },
                    body: JSON.stringify({ originalUrl: postUrl }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                const shortUrl = data.shortUrl;

                if (navigator.share) {
                    navigator
                        .share({ title: 'Student Senior', url: shortUrl })
                        .catch((error) => console.log('Share failed:', error));
                } else {
                    navigator.clipboard
                        .writeText(shortUrl)
                        .then(() =>
                            toast.success('Shortened link copied to clipboard!')
                        )
                        .catch(() => alert('Failed to copy link.'));
                }
            } else {
                toast.error('Failed to shorten the URL.');
            }
        } catch (error) {
            console.log('Error shortening the URL:', error);
            toast.error('Failed to shorten the URL.');
        }
    };

    return (
        <div className="fixed top-0 left-0 z-30 w-full bg-white shadow-md h-16 flex items-center justify-between px-5">
            <div className="text-gray-600">
                <div className="text-gray-600" onClick={handleBackNavigation}>
                    <i className="fa-solid fa-arrow-left-long fa-2xl"></i>
                </div>
            </div>
            <div
                className="text-center hover:text-blue-300"
                onClick={handleShare}
            >
                <i className="fa-regular fa-share-from-square fa-xl"></i>
                <p>Share</p>
            </div>
        </div>
    );
};

export default DetailPageNavbar;
