import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, API_KEY } from '../../config/apiConfiguration.js';
import { toast } from 'react-toastify';
import DetailPageNavbar from '../../DetailPages/DetailPageNavbar.jsx';

function PyqView() {
    const { courseCode, branchCode, subjectCode, slug, collegeName } =
        useParams();
    const [pyq, setPyq] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [countdown, setCountdown] = useState(45);
    const [canDownload, setCanDownload] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false); // State for showing countdown

    useEffect(() => {
        const fetchpyq = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${api.newPyqs}/${slug}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setPyq(data.pyq);
                } else {
                    throw new Error(data.message || 'Failed to fetch pyq.');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to fetch pyq.');
                toast.error('Failed to fetch pyq.');
            } finally {
                setLoading(false);
            }
        };

        fetchpyq();
    }, [slug]);

    const handleDownloadClick = () => {
        setCanDownload(false); // Disable download initially
        setShowCountdown(true); // Show countdown when button is clicked
        let timer = countdown;

        const interval = setInterval(() => {
            timer -= 1;
            setCountdown(timer);

            if (timer === 0) {
                clearInterval(interval); // Clear the interval once countdown reaches 0
                setCanDownload(true); // Enable download
                setShowCountdown(false); // Hide countdown
                setCountdown(45); // Reset countdown for next use
            }
        }, 1000);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <i className="fas fa-spinner fa-pulse fa-5x text-sky-500"></i>
                    <p className="mt-4 text-lg text-gray-600">Loading pyq...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="container mx-auto px-4 sm:px-2 min-h-screen">
            <DetailPageNavbar
                path={`${collegeName}/resources/${courseCode}/${branchCode}/pyqs/${subjectCode}`}
            />
            {pyq ? (
                <div>
                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {pyq.title}
                        </h1>
                        <p className="text-lg text-gray-600 mt-2">
                            Subject: {pyq.subject.subjectName} ( {pyq.examType}{' '}
                            - {pyq.year} )
                        </p>
                    </div>

                    {/* PDF Viewer */}
                    <div className="flex justify-center w-full my-5">
                        <iframe
                            src={`https://docs.google.com/gview?url=${pyq.fileUrl}&embedded=true`}
                            width="100%"
                            height="600"
                            className="block max-w-screen-lg w-full rounded-md shadow-md border-none"
                            title="PDF Viewer"
                        ></iframe>
                    </div>
                    <div className="flex justify-center mb-5">
                        <button
                            onClick={handleDownloadClick}
                            disabled={canDownload}
                            className={`bg-sky-500 text-white rounded-md px-4 py-2 mt-3 hover:bg-sky-600 ${
                                canDownload ? '' : 'cursor-not-allowed'
                            }`}
                            title="Download pyq PDF"
                        >
                            {canDownload ? (
                                <a
                                    href={pyq.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Download now
                                </a>
                            ) : (
                                showCountdown ? `Download ${countdown}s`:"Download"
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-600">pyq not found.</p>
            )}
        </div>
    );
}

export default PyqView;
