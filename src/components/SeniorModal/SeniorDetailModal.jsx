import React from 'react';
import { colleges } from '../../hooks/useCollegeId';

const SeniorDetailModal = ({ senior, setIsDetailModalOpen }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            {/* Modal Container */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg m-4 ">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900   ">
                        Senior Details
                    </h2>
                    <button
                        className=" text-gray-900    transition"
                        onClick={() => setIsDetailModalOpen(false)}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                </div>

                {/* Image Section */}
                <div className="mb-4 flex justify-center">
                    <img
                        src={
                            senior.owner.profilePicture.replace('=s96-c', '') ||
                            senior.profilePicture
                        }
                        alt={senior.name}
                        className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover rounded-full shadow-sm"
                    />
                </div>

                {/* Senior Info Section */}
                <div className="mb-4">
                    <h3 className="text-lg sm:text-xl font-bold  text-gray-900    mb-2 text-center">
                        {senior.name}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <p className=" text-gray-900    text-base ">
                            <strong>Course:</strong> {senior.branch}
                        </p>
                        <p className=" text-gray-900    text-base ">
                            <strong>Year:</strong> {senior.year}
                        </p>
                        <p className=" text-gray-900    text-base ">
                            <strong>Domain:</strong> {senior.domain}
                        </p>
                        <p className=" text-gray-900    text-base ">
                            <strong>College:</strong>{' '}
                            {
                                colleges.find(
                                    (college) => college.id === senior.college
                                )?.name
                            }
                        </p>
                    </div>
                </div>

                {/* Social Media Links */}
                <div className="flex justify-center space-x-4 mb-6">
                    <a
                        target="_blank"
                        href={`https://api.whatsapp.com/send?phone=${encodeURIComponent(
                            senior.whatsapp.startsWith('+')
                                ? senior.whatsapp
                                : `+91${senior.whatsapp}`
                        )}&text=${encodeURIComponent(
                            `Hey ${senior.name}, I came from Student Senior. Can I talk with you ?`
                        )}`}
                        aria-label="WhatsApp"
                        className="text-green-600 hover:text-green-500 transition"
                    >
                        <i className="fa-brands fa-whatsapp text-2xl sm:text-3xl"></i>
                    </a>
                    {senior.telegram && (
                        <a
                            target="_blank"
                            href={`https://t.me/+91${senior.telegram}`}
                            aria-label="Telegram"
                            className="text-blue-600 hover:text-blue-500 transition"
                        >
                            <i className="fa-brands fa-telegram text-2xl sm:text-3xl"></i>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SeniorDetailModal;
