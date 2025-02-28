import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCollegeId } from '../hooks/useCollegeId.js';
import { api, API_KEY } from '../config/apiConfiguration.js';
import DetailPageNavbar from '../DetailPages/DetailPageNavbar.jsx';
import Seo from '../components/SEO/Seo.jsx';
import { toast } from 'react-toastify';

const LostFoundItemDetail = () => {
    const { collegeName, slug } = useParams();
    const collegeId = useCollegeId(collegeName);
    const currentUser = useSelector((state) => state.user.currentUser);
    const ownerId = currentUser?._id;

    const [lostFoundItem, setLostFoundItem] = useState(null);
    const [signedImageUrl, setSignedImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal State
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        currentStatus: 'pending',
    });

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
                setFormData({
                    name: data.name,
                    description: data.description,
                    location: data.location,
                    currentStatus: data.currentStatus,
                });
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

    // Handle Input Change in Modal
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Submit Updated Data
    const handleUpdateItem = async () => {
        try {
            const response = await fetch(`${api.lostfound}/${slug}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update item');
            }

            const updatedData = await response.json();

            // Ensure the correct item object is set
            setLostFoundItem((prev) => ({
                ...prev,
                ...updatedData.item, // Extracting 'item' from API response
            }));

            setIsEditing(false);
            toast.success('Item updated successfully!');
        } catch (error) {
            console.error('Error updating item:', error);
            toast.error('Failed to update item.');
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-t from-sky-50 to-white min-h-screen py-16 px-8 md:px-32">
                <DetailPageNavbar />
                <p className="text-center text-gray-600">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gradient-to-t from-sky-50 to-white min-h-screen py-16 px-8 md:px-32">
                <DetailPageNavbar />
                <div className="text-center text-red-500">
                    <p>Error: {error}</p>
                </div>
            </div>
        );
    }

    if (!lostFoundItem) {
        return (
            <div className="bg-gradient-to-t from-sky-50 to-white min-h-screen py-16 px-8 md:px-32">
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
            <Seo title={lostFoundItem.name} description={lostFoundItem?.name} />
            <div className="bg-gradient-to-t from-sky-50 to-white min-h-screen py-16 px-8 md:px-32">
                <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6 max-w-4xl mx-auto">
                    <h1 className="font-bold text-4xl text-sky-800">
                        {lostFoundItem.name}
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Posted by: {lostFoundItem.owner?.username}
                    </p>

                    {signedImageUrl ? (
                        <img
                            src={signedImageUrl}
                            alt="Lost Found Item"
                            className="w-full h-96 object-cover rounded-lg shadow-md"
                        />
                    ) : (
                        <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                            No Image Available
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Status */}
                        <div className="flex items-center space-x-2">
                            <strong className="text-sky-700 text-lg">
                                Status:
                            </strong>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                    lostFoundItem.currentStatus === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : lostFoundItem.currentStatus ===
                                          'claimed'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-green-100 text-green-800'
                                }`}
                            >
                                {lostFoundItem.currentStatus}
                            </span>
                        </div>

                        {/* Location */}
                        <div>
                            <strong className="text-sky-700 text-lg">
                                Location:
                            </strong>
                            <p className="text-gray-700 mt-1">
                                {lostFoundItem.location}
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <strong className="text-sky-700 text-lg">
                                Description:
                            </strong>
                            <p className="text-gray-700 mt-1">
                                {lostFoundItem.description}
                            </p>
                        </div>

                        {/* Type */}
                        <div>
                            <strong className="text-sky-700 text-lg">
                                Type:
                            </strong>
                            <p
                                className={`mt-1 text-sm font-semibold ${
                                    lostFoundItem.isLost
                                        ? 'text-red-500'
                                        : 'text-green-500'
                                }`}
                            >
                                {lostFoundItem.isLost ? 'Lost' : 'Found'}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6">
                            {ownerId === lostFoundItem.owner?._id ? (
                                <button
                                    className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit Details
                                </button>
                            ) : (
                                <a
                                    href={`https://wa.me/${lostFoundItem.whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                                >
                                    Contact on WhatsApp
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-2xl shadow-lg w-11/12 max-w-md">
                        <h2 className="text-2xl font-bold text-sky-800 mb-6">
                            Edit Item
                        </h2>

                        <div className="space-y-4">
                            <label className="block text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />

                            <label className="block text-gray-700">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            ></textarea>

                            <label className="block text-gray-700">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />

                            <label className="block text-gray-700">
                                Current Status
                            </label>
                            <select
                                name="currentStatus"
                                value={formData.currentStatus}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="pending">Pending</option>
                                <option value="claimed">Claimed</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>

                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 transition text-white rounded-lg shadow-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateItem}
                                className="px-6 py-2 bg-sky-600 hover:bg-sky-700 transition text-white rounded-lg shadow-md"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LostFoundItemDetail;
