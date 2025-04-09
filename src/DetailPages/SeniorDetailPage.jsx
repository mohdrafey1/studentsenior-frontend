import React, { useEffect, useState } from 'react';
import DetailPageNavbar from './DetailPageNavbar';
import { useParams, Link } from 'react-router-dom';
import { useCollegeId } from '../hooks/useCollegeId';
import { toast } from 'react-toastify';
import useApiFetch from '../hooks/useApiFetch';
import { api } from '../config/apiConfiguration';
import Seo from '../components/SEO/Seo';

function SeniorDetail() {
    const { collegeName, slug } = useParams();
    const collegeId = useCollegeId(collegeName);
    const [senior, setSenior] = useState(null);
    const { useFetch, loadingFetch } = useApiFetch();
    const [relatedSeniors, setRelatedSeniors] = useState([]);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const fetchSenior = async () => {
        try {
            const data = await useFetch(`${api.senior}/${slug}`);
            setSenior(data);
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while fetching the senior details.');
        }
    };

    const fetchRelatedSeniors = async () => {
        try {
            const data = await useFetch(`${api.senior}/college/${collegeId}`);
            const randomStart = Math.max(0, Math.floor(Math.random() * (data.length - 3)));
            setRelatedSeniors(data.slice(randomStart, randomStart + 3));
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while fetching related seniors.');
        }
    };

    useEffect(() => {
        fetchSenior();
        fetchRelatedSeniors();
    }, [slug]);

    if (loadingFetch) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-sky-50 to-white">
                <div className="text-center space-y-4">
                    <div className="relative w-20 h-20 mx-auto">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 animate-pulse opacity-20"></div>
                        <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                            <i className="fas fa-user-graduate text-3xl text-sky-600 animate-pulse"></i>
                        </div>
                    </div>
                    <h3 className="text-xl font-medium text-gray-700">Loading profile...</h3>
                    <p className="text-gray-500">Fetching senior details</p>
                </div>
            </div>
        );
    }

    if (!senior) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-50 to-white p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center transform transition-all hover:scale-[1.01]">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-100 to-red-200"></div>
                        <i className="fas fa-user-slash text-4xl text-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></i>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-3">Profile Not Found</h1>
                    <p className="text-gray-600 mb-6">
                        The senior profile you're looking for doesn't exist or may have been removed.
                    </p>
                    <Link
                        to={`/college/${collegeName}/seniors`}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-full hover:from-sky-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        <i className="fas fa-arrow-left mr-2"></i>
                        Browse Seniors
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-w-full py-10 bg-gradient-to-b from-sky-50 to-white min-h-screen">
            <Seo
                title={`${senior.name} | ${senior.branch} - Student Senior`}
                desc={`Connect with ${senior.name}, ${senior.year}  ${senior.branch} student specializing in ${senior.domain}. Contact via WhatsApp or Telegram.`}
            />

            <DetailPageNavbar
                path={`college/${collegeName}/seniors`}
                title="Back to Seniors"
            />

            <div className="container mx-auto px-4 lg:px-8 pt-6">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Senior Profile Card */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white shadow-xl rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl border border-gray-100 overflow-hidden">
                            {/* Profile Image with Loading State */}
                            <div className="relative mx-auto w-48 h-48 mb-6">
                                {!isImageLoaded && (
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-100 to-indigo-100 animate-pulse"></div>
                                )}
                                <img
                                    src={senior.owner?.profilePicture?.replace('=s96-c', '=s400-c') || senior.profilePicture}
                                    alt={senior.name}
                                    className={`w-full h-full rounded-full object-cover border-4 border-white shadow-lg transition-all duration-500 ${isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                                    loading="lazy"
                                    onLoad={() => setIsImageLoaded(true)}
                                />
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-400/20 to-indigo-500/20 pointer-events-none"></div>
                            </div>

                            <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
                                {senior.name}
                            </h2>

                            <div className="flex justify-center mb-6">
                                <span className="bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    {senior.year}
                                </span>
                            </div>

                            {/* Profile Details */}
                            <div className="space-y-4">
                                <div className="flex items-center p-3 bg-sky-50 rounded-lg">
                                    <div className="bg-sky-100 p-2 rounded-lg mr-3">
                                        <i className="fas fa-graduation-cap text-sky-600"></i>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Course</p>
                                        <p className="text-sm font-semibold text-gray-800">{senior.branch}</p>
                                    </div>
                                </div>

                                <div className="flex items-center p-3 bg-indigo-50 rounded-lg">
                                    <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                                        <i className="fas fa-laptop-code text-indigo-600"></i>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Domain</p>
                                        <p className="text-sm font-semibold text-gray-800">{senior.domain}</p>
                                    </div>
                                </div>

                                {senior.bio && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500 font-medium mb-1">About</p>
                                        <p className="text-sm text-gray-700">{senior.bio}</p>
                                    </div>
                                )}
                            </div>

                            {/* Contact Buttons */}
                            <div className="mt-8 flex justify-center space-x-4">
                                <a
                                    href={`https://api.whatsapp.com/send?phone=${encodeURIComponent(
                                        senior.whatsapp.startsWith('+') ? senior.whatsapp : `+91${senior.whatsapp}`
                                    )}&text=${encodeURIComponent(
                                        `Hi ${senior.name}, I found your profile on Student Senior. I'd like to connect with you regarding ${senior.domain}.`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110"
                                    aria-label="Contact via WhatsApp"
                                >
                                    <i className="fa-brands fa-whatsapp text-2xl"></i>
                                </a>

                                {senior.telegram && (
                                    <a
                                        href={`https://t.me/+91${senior.telegram}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110"
                                        aria-label="Contact via Telegram"
                                    >
                                        <i className="fa-brands fa-telegram text-2xl"></i>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Related Seniors Section */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                            <div className="flex items-center mb-8">
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-lg mr-4 text-white">
                                    <i className="fas fa-users text-xl"></i>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">
                                    Connect With Other Seniors
                                </h3>
                            </div>

                            {relatedSeniors.length > 0 ? (
                                <div className="space-y-10">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {relatedSeniors.map((item) => (
                                            <Link
                                                to={`/college/${collegeName}/seniors/${item.slug}`}
                                                key={item.id}
                                                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                                            >
                                                <div className="relative h-48 overflow-hidden">
                                                    <img
                                                        src={item.owner?.profilePicture?.replace('=s96-c', '=s400-c') || item.profilePicture}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80"></div>
                                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                                        <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                                                    </div>
                                                </div>

                                                <div className="flex-grow p-5 bg-gradient-to-br from-white to-gray-50">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                                                <i className="fas fa-graduation-cap text-sm"></i>
                                                            </div>
                                                            <p className="ml-3 text-gray-700">{item.branch}</p>
                                                        </div>

                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-sky-100 text-sky-600">
                                                                <i className="fas fa-calendar-alt text-sm"></i>
                                                            </div>
                                                            <p className="ml-3 text-gray-700">{item.year}</p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                                        <button className="w-full text-center py-2 text-indigo-600 font-medium group-hover:text-indigo-800 transition-colors">
                                                            View Profile <i className="fas fa-arrow-right ml-1 transition-transform group-hover:translate-x-1"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="mt-8 text-center">
                                        <Link
                                            to={`/college/${collegeName}/seniors`}
                                            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                                        >
                                            <i className="fas fa-users mr-2"></i>
                                            Explore All Seniors
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                        <i className="fas fa-user-friends text-2xl text-gray-400"></i>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Senior Profiles</h3>
                                    <p className="text-gray-500">We don't have any related senior profiles to show right now.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SeniorDetail;