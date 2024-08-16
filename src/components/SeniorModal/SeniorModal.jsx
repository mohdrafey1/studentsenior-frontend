import React from 'react';

const SeniorModal = ({ senior, onClose }) => {
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-4">{senior.name}</h2>
                <p className="mb-2">
                    <strong>Course:</strong> {senior.course}
                </p>
                <p className="mb-2">
                    <strong>Branch:</strong> {senior.branch}
                </p>
                <p className="mb-2">
                    <strong>Year:</strong> {senior.year}
                </p>
                <p className="mb-2">
                    <strong>Favorite Domain:</strong> {senior.domain}
                </p>
                <p className="mb-4">
                    <strong>Hobbies:</strong> {senior.hobbies}
                </p>
                <div className="flex space-x-4">
                    <a
                        href={senior.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-500"
                    >
                        WhatsApp
                    </a>
                    <a
                        href={senior.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                    >
                        Telegram
                    </a>
                    <a
                        href={senior.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-500"
                    >
                        Instagram
                    </a>
                </div>
                <button
                    onClick={onClose}
                    className="mt-5 p-2 bg-red-500 text-white rounded-md"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default SeniorModal;
