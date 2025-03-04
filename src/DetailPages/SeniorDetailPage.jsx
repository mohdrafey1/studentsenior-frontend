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
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <i className="fas fa-spinner fa-pulse fa-5x text-blue-600"></i>
            </div>
        );
    }

    if (!senior) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Senior Not Found!
                </h1>
                <Link
                    to={`/college/${collegeName}/seniors`}
                    className="mt-6 px-6 py-3 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition duration-300 shadow-md"
                >
                    See Other Seniors
                </Link>
            </div>
        );
    }

    return (
        <div className="min-w-full py-10">
            <DetailPageNavbar path={`college/${collegeName}/seniors`} />

            <div className="container mx-auto px-4 lg:px-16">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                    {/* Senior Details Card */}
                    <div className="w-full lg:w-1/3 bg-white shadow-xl rounded-2xl p-6 text-center transition hover:shadow-2xl">
                        <img
                            src={
                                senior.owner?.profilePicture.replace(
                                    '=s96-c',
                                    ''
                                ) || senior.profilePicture
                            }
                            alt={senior.name}
                            className="h-48 w-48 rounded-full mx-auto shadow-lg transform transition duration-300 hover:scale-110"
                        />
                        <Seo
                            title={`${senior.name} - Student Senior`}
                            desc={`${senior.name} - ${senior.branch} - ${senior.domain} - ${senior.year}`}
                        />
                        <h3 className="mt-6 text-2xl font-bold text-gray-900">
                            {senior.name}
                        </h3>
                        <p className="text-md text-gray-700 font-medium">
                            Course: {senior.branch}
                        </p>
                        <p className="text-md text-gray-700">
                            Year: {senior.year}
                        </p>
                        <p className="text-md text-gray-700">
                            Domain: {senior.domain}
                        </p>
                        <div className="flex justify-center space-x-6 mt-6">
                            <a
                                href={`https://api.whatsapp.com/send?phone=${encodeURIComponent(
                                    senior.whatsapp.startsWith('+')
                                        ? senior.whatsapp
                                        : `+91${senior.whatsapp}`
                                )}&text=${encodeURIComponent(
                                    `Hey ${senior.name}, I came from Student Senior. Can I talk with you ?`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp"
                                className="text-green-600 hover:text-green-700 transition duration-300 transform hover:scale-110"
                            >
                                <i className="fa-brands fa-whatsapp text-3xl"></i>
                            </a>
                            {senior.telegram && (
                                <a
                                    href={`https://t.me/+91${senior.telegram}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Telegram"
                                    className="text-blue-600 hover:text-blue-700 transition duration-300 transform hover:scale-110"
                                >
                                    <i className="fa-brands fa-telegram text-3xl"></i>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Related Seniors */}
                    <div className="w-full lg:w-2/3">
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">
                            Other Seniors You May Know
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {relatedSeniors.map((item) => (
                                <Link
                                    to={`/college/${collegeName}/seniors/${item.slug}`}
                                    key={item.id}
                                    className="block bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transform hover:scale-105 transition duration-300"
                                >
                                    <img
                                        src={
                                            item.owner?.profilePicture.replace(
                                                '=s96-c',
                                                ''
                                            ) || item.profilePicture
                                        }
                                        alt={item.name}
                                        className="w-full h-32 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Course: {item.branch}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Year: {item.year}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Domain: {item.domain}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <Link to={`/college/${collegeName}/seniors`}>
                            <div className="inline-block px-6 py-3 my-5 mx-auto text-white bg-sky-600 rounded-full hover:bg-sky-700 transition duration-300">
                                <p>See All Seniors</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SeniorDetail;
