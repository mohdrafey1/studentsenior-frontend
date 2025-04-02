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
            const randomStart = Math.max(
                0,
                Math.floor(Math.random() * (data.length - 3))
            );
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
                <div className="text-center">
                    <i className="fas fa-spinner fa-pulse fa-5x text-sky-600 mb-4"></i>
                    <p className="text-gray-600 font-medium">Loading senior profile...</p>
                </div>
            </div>
        );
    }

    if (!senior) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center bg-gradient-to-b from-sky-50 to-white">
                <div className="p-8 bg-white rounded-2xl shadow-xl max-w-md">
                    <i className="fas fa-user-slash text-4xl text-red-500 mb-4"></i>
                    <h1 className="text-2xl font-semibold text-gray-800 mb-3">
                        Senior Not Found!
                    </h1>
                    <p className="text-gray-600 mb-6">The senior profile you're looking for doesn't exist or may have been removed.</p>
                    <Link
                        to={`/college/${collegeName}/seniors`}
                        className="mt-4 px-6 py-3 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition duration-300 shadow-md inline-flex items-center"
                    >
                        <i className="fas fa-arrow-left mr-2"></i> See Other Seniors
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-w-full py-10 bg-gradient-to-b from-sky-50 to-white min-h-screen">
            <Seo
                title={`${senior.name} - Student Senior`}
                desc={`${senior.name} - ${senior.branch} - ${senior.domain} - ${senior.year}`}
            />
            <DetailPageNavbar path={`college/${collegeName}/seniors`} />

            <div className="container mx-auto px-4 lg:px-8 pt-6">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                    {/* Senior Details Card */}
                    <div className="w-full lg:w-1/3 bg-white shadow-xl rounded-2xl p-8 text-center transition hover:shadow-2xl border border-gray-100">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 blur opacity-20 transform scale-110"></div>
                            <img
                                src={
                                    senior.owner?.profilePicture.replace(
                                        '=s96-c',
                                        ''
                                    ) || senior.profilePicture
                                }
                                alt={senior.name}
                                className="h-48 w-48 rounded-full mx-auto shadow-lg transform transition duration-300 hover:scale-105 relative z-10 border-4 border-white"
                            />
                        </div>

                        <h2 className="mt-8 text-3xl font-bold text-gray-900">
                            {senior.name}
                        </h2>

                        <div className="mt-4 grid grid-cols-1 gap-3 bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center">
                                <div className="bg-sky-100 p-2 rounded-lg">
                                    <i className="fas fa-graduation-cap text-sky-600"></i>
                                </div>
                                <div className="ml-3 text-left">
                                    <p className="text-xs text-gray-500 font-medium">Course</p>
                                    <p className="text-sm font-semibold text-gray-800">{senior.branch}</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="bg-indigo-100 p-2 rounded-lg">
                                    <i className="fas fa-calendar-alt text-indigo-600"></i>
                                </div>
                                <div className="ml-3 text-left">
                                    <p className="text-xs text-gray-500 font-medium">Year</p>
                                    <p className="text-sm font-semibold text-gray-800">{senior.year}</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="bg-purple-100 p-2 rounded-lg">
                                    <i className="fas fa-laptop-code text-purple-600"></i>
                                </div>
                                <div className="ml-3 text-left">
                                    <p className="text-xs text-gray-500 font-medium">Domain</p>
                                    <p className="text-sm font-semibold text-gray-800">{senior.domain}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center space-x-4">
                            <a
                                href={`https://api.whatsapp.com/send?phone=${encodeURIComponent(
                                    senior.whatsapp.startsWith('+')
                                        ? senior.whatsapp
                                        : `+91${senior.whatsapp}`
                                )}&text=${encodeURIComponent(
                                    `Hey ${senior.name}, I came from Student Senior. Can I talk with you?`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp"
                                className="bg-green-500 text-white p-4 rounded-full hover:bg-green-600 transition duration-300 transform hover:scale-110 shadow-md"
                            >
                                <i className="fa-brands fa-whatsapp text-2xl"></i>
                            </a>

                            {senior.telegram && (
                                <a
                                    href={`https://t.me/+91${senior.telegram}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Telegram"
                                    className="bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600 transition duration-300 transform hover:scale-110 shadow-md"
                                >
                                    <i className="fa-brands fa-telegram text-2xl"></i>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Related Seniors */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                            <div className="flex items-center mb-6">
                                <div className="bg-indigo-100 p-3 rounded-lg mr-3">
                                    <i className="fas fa-users text-indigo-600"></i>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">
                                    Other Seniors You May Know
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {relatedSeniors.map((item) => (
                                    <Link
                                        to={`/college/${collegeName}/seniors/${item.slug}`}
                                        key={item.id}
                                        className="block bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transform hover:translate-y-[-5px] transition duration-300 border border-gray-100"
                                    >
                                        <div className="h-40 overflow-hidden relative">
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30"></div>
                                            <img
                                                src={
                                                    item.owner?.profilePicture.replace(
                                                        '=s96-c',
                                                        ''
                                                    ) || item.profilePicture
                                                }
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                {item.name}
                                            </h3>
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-600 flex items-center">
                                                    <span className="w-4 h-4 inline-flex items-center justify-center bg-sky-100 rounded-full mr-2">
                                                        <i className="fas fa-graduation-cap text-sky-600 text-xs"></i>
                                                    </span>
                                                    {item.branch}
                                                </p>
                                                <p className="text-sm text-gray-600 flex items-center">
                                                    <span className="w-4 h-4 inline-flex items-center justify-center bg-indigo-100 rounded-full mr-2">
                                                        <i className="fas fa-calendar-alt text-indigo-600 text-xs"></i>
                                                    </span>
                                                    {item.year}
                                                </p>
                                                <p className="text-sm text-gray-600 flex items-center">
                                                    <span className="w-4 h-4 inline-flex items-center justify-center bg-purple-100 rounded-full mr-2">
                                                        <i className="fas fa-laptop-code text-purple-600 text-xs"></i>
                                                    </span>
                                                    {item.domain}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-8 text-center">
                                <Link
                                    to={`/college/${collegeName}/seniors`}
                                    className="inline-flex items-center px-6 py-3 text-white bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full hover:from-sky-600 hover:to-indigo-700 transition duration-300 shadow-md"
                                >
                                    <i className="fas fa-users mr-2"></i>
                                    See All Seniors
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SeniorDetail;