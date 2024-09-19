import React from 'react';

const SeniorDetailModal = ({ senior, setIsDetailModalOpen }) => {
    const colleges = [
        { id: '66cb9952a9c088fc11800714', name: 'Integral University' },
        { id: '66cba84ce0e3a7e528642837', name: 'MPGI Kanpur' },
        { id: '66d08aff784c9f07a53507b9', name: 'GCET Noida' },
        { id: '66d40833ec7d66559acbf24c', name: 'KMC UNIVERSITY' },
    ];

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Senior Details</h2>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{senior.name}</h3>
                    <button
                        className="text-gray-500 hover:text-gray-700"
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
                <div className="mb-4">
                    <img
                        src={senior.profilePicture}
                        alt={senior.name}
                        className="w-full h-80 object-cover rounded"
                    />
                </div>
                <div className="mb-4">
                    <p>
                        <strong>Course:</strong> {senior.branch}
                    </p>
                    <p>
                        <strong>Year:</strong> {senior.year}
                    </p>
                    <p>
                        <strong>Domain:</strong> {senior.domain}
                    </p>
                </div>
                <div className="mb-4">
                    <p>
                        <a
                            target="_blank"
                            href={`https://api.whatsapp.com/send?phone=${senior.whatsapp}`}
                            aria-label="WhatsApp"
                            className="hover:text-gray-400"
                        >
                            Whatsapp
                            <i className="fa-brands fa-whatsapp ml-2 text-2xl"></i>
                        </a>
                    </p>
                    <p>
                        <a
                            target="_blank"
                            href={`https://t.me/+91${senior.telegram}`}
                            aria-label="Telegram"
                            className="hover:text-gray-400"
                        >
                            Telegram
                            <i className="fa-brands fa-telegram text-2xl"></i>
                        </a>
                    </p>
                </div>
                <div>
                    <p>
                        College:{' '}
                        {
                            colleges.find(
                                (college) => college.id === senior.college
                            )?.name
                        }
                    </p>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                        onClick={() => setIsDetailModalOpen(false)}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeniorDetailModal;
