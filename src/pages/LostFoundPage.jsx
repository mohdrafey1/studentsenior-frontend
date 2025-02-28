import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import CollegeLinks from '../components/Links/CollegeLinks';
import Collegelink2 from '../components/Links/CollegeLink2';
import Seo from '../components/SEO/Seo';
import LostFoundModal from '../components/LostFound/LostFoundModal';
import useApiRequest from '../hooks/useApiRequest';
import { api } from '../config/apiConfiguration';
import { fetchLostFoundItems } from '../redux/slices/lostFoundSlice';
import { useCollegeId } from '../hooks/useCollegeId';
import { API_KEY } from '../config/apiConfiguration';
import { capitalizeWords } from '../utils/Capitalize';

const LostFoundItem = ({ item, imageUrl }) => {
    const handleWhatsAppClick = (e) => {
        e.stopPropagation();
    };
    return (
        <Link
            to={`${item.slug}`}
            className="block hover:scale-105 transition-transform duration-300"
        >
            <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col relative hover:shadow-xl transition-shadow duration-300">
                {item.imageUrl ? (
                    <img
                        src={imageUrl || ''}
                        alt={item.name}
                        className="h-48 w-full object-cover rounded-md mb-4"
                    />
                ) : (
                    <div className="h-48 w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-md flex items-center justify-center mb-4">
                        <span className="text-gray-500 text-sm">
                            No Image Available
                        </span>
                    </div>
                )}

                {/* Status Tag */}
                <span
                    className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full 
                        ${
                            item.currentStatus === 'pending'
                                ? 'bg-yellow-500 text-white'
                                : item.currentStatus === 'claimed'
                                ? 'bg-blue-500 text-white'
                                : 'bg-green-500 text-white'
                        }`}
                >
                    {capitalizeWords(item.currentStatus)}
                </span>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {item.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                </p>
                <p className="text-sm text-gray-700 mb-1 truncate">
                    <span className="font-semibold">Location:</span>{' '}
                    {item.location}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                    <span className="font-semibold">Posted by:</span>{' '}
                    {item.owner.username}
                </p>
                <p
                    className={`text-sm font-bold mt-2 ${
                        item.type === 'lost' ? 'text-red-500' : 'text-green-500'
                    }`}
                >
                    {item.type.toUpperCase()}
                </p>
                <a
                    href={`https://wa.me/${item.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors duration-300"
                    onClick={handleWhatsAppClick}
                >
                    Contact on WhatsApp
                </a>
            </div>
        </Link>
    );
};

const LostFoundPage = () => {
    const { collegeName } = useParams();
    const collegeId = useCollegeId(collegeName);
    const [modalOpen, setModalOpen] = useState(false);
    const dispatch = useDispatch();
    const { apiRequest } = useApiRequest();

    const [imageUrls, setImageUrls] = useState({});
    const { lostfound, loading, error } = useSelector(
        (state) => state.lostfound
    );

    useEffect(() => {
        if (collegeId) {
            dispatch(fetchLostFoundItems(collegeId));
        }
    }, [collegeId, dispatch]);

    const handleSubmit = async (formData) => {
        try {
            const response = await apiRequest(api.lostfound, 'POST', formData);
            if (response.success === false) {
                toast.error(response.message);
                return;
            }
            toast.success(response.message || 'Request Created Successfully');
            setModalOpen(false);
            dispatch(fetchLostFoundItems(collegeId));
        } catch (error) {
            console.error(error);
            toast.error('Error adding item');
        }
    };

    const fetchSignedImageUrl = useCallback(async (imagePath, itemId) => {
        try {
            const response = await fetch(
                `${api.getSignedUrl}?fileUrl=${encodeURIComponent(imagePath)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY,
                    },
                    credentials: 'include',
                }
            );

            const data = await response.json();
            if (response.ok) {
                setImageUrls((prev) => ({ ...prev, [itemId]: data.signedUrl }));
            } else {
                throw new Error('Failed to get signed image URL');
            }
        } catch (error) {
            console.error('Error fetching signed image URL:', error);
        }
    }, []);

    useEffect(() => {
        lostfound.forEach((item) => {
            if (item.imageUrl && !imageUrls[item._id]) {
                fetchSignedImageUrl(item.imageUrl, item._id);
            }
        });
    }, [lostfound, imageUrls, fetchSignedImageUrl]);

    return (
        <div className=" mx-auto bg-gradient-to-t from-sky-200 to-white min-h-screen w-full">
            <CollegeLinks />
            <div className="max-w-7xl mx-auto p-4 text-center">
                <div>
                    <h1 className="text-lg sm:text-3xl font-bold mb-2 text-center">
                        Lost & Found - {capitalizeWords(collegeName)}
                    </h1>
                    <p className="italic text-center text-xs sm:text-base">
                        Add Found or Lost Item within you college to help each
                        other recover
                    </p>
                    <Seo
                        title={`Lost Found - ${capitalizeWords(collegeName)}`}
                        desc="Find or return lost items at your college."
                    />
                    <button
                        className="mt-4 px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors duration-300 shadow-md"
                        onClick={() => setModalOpen(true)}
                    >
                        Add Lost/Found Item
                    </button>
                </div>

                <Collegelink2 />
                <LostFoundModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSubmit={handleSubmit}
                />
                <div className="flex justify-center items-center py-8">
                    {error && (
                        <p className="text-center text-red-500">
                            Error fetching items
                        </p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl w-full px-4">
                        {lostfound.length > 0 ? (
                            lostfound.map((item) => (
                                <LostFoundItem
                                    key={item._id}
                                    item={item}
                                    imageUrl={imageUrls[item._id]}
                                />
                            ))
                        ) : (
                            <div className="flex justify-center items-center min-h-[300px]">
                                {loading ? (
                                    <i className="fas fa-spinner fa-pulse fa-5x text-sky-500"></i>
                                ) : (
                                    <p className="text-gray-600 text-lg">
                                        No lost or found items available
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LostFoundPage;
