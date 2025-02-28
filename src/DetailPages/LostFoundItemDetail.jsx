import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCollegeId } from '../hooks/useCollegeId.js';
import { api, API_KEY } from '../config/apiConfiguration.js';
import DetailPageNavbar from '../DetailPages/DetailPageNavbar.jsx';
import Seo from '../components/SEO/Seo.jsx';

const LostFoundItemDetail = () => {
    const { collegeName, slug } = useParams();
    const collegeId = useCollegeId(collegeName);
    const [lostFoundItem, setLostFoundItem] = useState(null);
    const [signedImageUrl, setSignedImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLostFoundItemDetail = async () => {
            if (!collegeId) return;

            try {
                const response = await fetch(`${api.lostfound}/${slug}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                if (!data || data.success === false) {
                    throw new Error(data.message || 'Item not found');
                }

                setLostFoundItem(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLostFoundItemDetail();
    }, [collegeId, slug]);

    // Fetch signed URL for item image
    useEffect(() => {
        const fetchSignedUrlForImage = async () => {
            if (lostFoundItem && lostFoundItem.imageUrl) {
                try {
                    const response = await fetch(
                        `${api.getSignedUrl}?fileUrl=${lostFoundItem.imageUrl}`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-api-key': API_KEY,
                            },
                        }
                    );

                    const data = await response.json();
                    if (response.ok && data.signedUrl) {
                        setSignedImageUrl(data.signedUrl);
                    } else {
                        throw new Error(
                            data.message || 'Failed to get signed URL.'
                        );
                    }
                } catch (err) {
                    console.error('Error getting signed URL for image:', err);
                    setSignedImageUrl(null);
                }
            }
        };

        fetchSignedUrlForImage();
    }, [lostFoundItem]);

    if (loading) {
        return (
            <div className="bg-gray-100 py-16 px-8 md:px-32 min-h-screen">
                <DetailPageNavbar />
                <p className="text-center text-gray-600">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-100 py-16 px-8 md:px-32 min-h-screen">
                <DetailPageNavbar />
                <div className="text-center text-red-500">
                    <p>Error: {error}</p>
                </div>
            </div>
        );
    }

    if (!lostFoundItem) {
        return (
            <div className="bg-gray-100 py-16 px-8 md:px-32 min-h-screen">
                <DetailPageNavbar />
                <div className="text-center text-gray-600">
                    <p>No item found.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <DetailPageNavbar />
            <Seo
                title={lostFoundItem.name}
                description={lostFoundItem.description.slice(0, 100)}
            />
            <div className="bg-gray-100 py-16 px-8 md:px-32 min-h-screen">
                <div className="flex flex-col md:flex-row gap-16">
                    {/* Lost & Found Item Details */}
                    <div className="space-y-8 w-full md:w-3/4">
                        <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
                            <h1 className="font-semibold text-3xl text-blue-600">
                                {lostFoundItem.name}
                            </h1>
                            <p className="text-gray-600 text-sm">
                                Posted by: {lostFoundItem.owner.username}
                            </p>

                            {/* Display Item Image if Available */}
                            {signedImageUrl ? (
                                <div className="mt-4">
                                    <img
                                        src={signedImageUrl}
                                        alt="Lost Found Item"
                                        className="w-full max-h-96 object-contain rounded-lg shadow-md"
                                    />
                                </div>
                            ) : (
                                <p className="text-gray-500">
                                    No image available
                                </p>
                            )}

                            <hr className="my-4 border-t border-gray-300" />
                            <div className="space-y-4">
                                <p className="font-semibold text-xl text-gray-700">
                                    Item Description
                                </p>
                                <p className="text-gray-600">
                                    {lostFoundItem.description}
                                </p>
                            </div>
                            <p className="text-sm">
                                <strong>Location:</strong>{' '}
                                {lostFoundItem.location}
                            </p>
                            <p className="text-sm">
                                <strong>Status:</strong>{' '}
                                <span
                                    className={`font-bold ${
                                        lostFoundItem.type === 'lost'
                                            ? 'text-red-500'
                                            : 'text-green-500'
                                    }`}
                                >
                                    {lostFoundItem.type.toUpperCase()}
                                </span>
                            </p>

                            <div className="flex gap-3 mt-4">
                                <a
                                    href={`https://api.whatsapp.com/send?phone=${lostFoundItem.whatsapp}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 bg-sky-500 hover:bg-blue-500 transition text-white rounded-lg"
                                >
                                    Contact on WhatsApp
                                </a>
                                {lostFoundItem.email && (
                                    <a
                                        href={`mailto:${lostFoundItem.email}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-4 py-2 bg-sky-500 hover:bg-blue-500 transition text-white rounded-lg"
                                    >
                                        Email
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Placeholder for Future Features */}
                    <div className="w-full md:w-1/3 space-y-6">
                        <div className="bg-gray-200 p-6 rounded-lg shadow-md text-center">
                            Additional features coming soon...
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LostFoundItemDetail;
