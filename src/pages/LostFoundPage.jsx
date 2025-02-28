import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CollegeLinks from '../components/Links/CollegeLinks';
import Collegelink2 from '../components/Links/CollegeLink2';
import { capitalizeWords } from '../utils/Capitalize';
import Seo from '../components/SEO/Seo';
import LostFoundModal from '../components/LostFound/LostFoundModal';
import { toast } from 'react-toastify';
import useApiRequest from '../hooks/useApiRequest';
import { api } from '../config/apiConfiguration';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLostFoundItems } from '../redux/slices/lostFoundSlice';
import { useCollegeId } from '../hooks/useCollegeId';
import { API_KEY } from '../config/apiConfiguration';

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

    const fetchSignedImageUrl = async (imagePath, itemId) => {
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
    };

    useEffect(() => {
        lostfound.forEach((item) => {
            if (item.imageUrl && !imageUrls[item._id]) {
                fetchSignedImageUrl(item.imageUrl, item._id);
            }
        });
    }, [lostfound]);

    return (
        <div className="container bg-gradient-to-t from-sky-200 to-white min-h-screen w-full">
            <CollegeLinks />
            <div className="max-w-7xl mx-auto p-5 text-center">
                <h1 className="text-3xl font-bold mb-2">
                    Lost & Found - {capitalizeWords(collegeName)}
                </h1>
                <Seo
                    title={`Lost Found - ${capitalizeWords(collegeName)}`}
                    desc="Find or return lost items at your college."
                />
                <button
                    className="mt-4 px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition"
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
            <div className="flex justify-center items-center py-4">
                {loading ? (
                    <p className="text-center text-gray-600">
                        Loading items...
                    </p>
                ) : error ? (
                    <p className="text-center text-red-500">
                        Error fetching items
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl w-full">
                        {lostfound.length > 0 ? (
                            lostfound.map((item) => (
                                <Link key={item._id} to={`${item.slug}`}>
                                    <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col">
                                        {item.imageUrl ? (
                                            <img
                                                src={imageUrls[item._id] || ''}
                                                alt={item.name}
                                                className="h-40 w-full object-cover rounded-md"
                                            />
                                        ) : (
                                            <div className="h-40 w-full bg-gray-200 rounded-md flex items-center justify-center">
                                                <span className="text-gray-500">
                                                    No Image
                                                </span>
                                            </div>
                                        )}
                                        <h3 className="text-lg font-semibold mt-2">
                                            {item.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {item.description}
                                        </p>
                                        <p className="text-sm mt-1">
                                            Location:{' '}
                                            <span className="font-medium">
                                                {item.location}
                                            </span>
                                        </p>
                                        <p className="text-sm">
                                            Posted by:{' '}
                                            <span className="font-medium">
                                                {item.owner.username}
                                            </span>
                                        </p>
                                        <p
                                            className={`text-sm font-bold mt-1 ${
                                                item.type === 'lost'
                                                    ? 'text-red-500'
                                                    : 'text-green-500'
                                            }`}
                                        >
                                            {item.type.toUpperCase()}
                                        </p>
                                        <a
                                            href={`https://wa.me/${item.whatsapp}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-2 text-sky-600 text-sm hover:underline"
                                        >
                                            Contact on WhatsApp
                                        </a>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-center col-span-full text-gray-500">
                                No lost or found items available
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LostFoundPage;
