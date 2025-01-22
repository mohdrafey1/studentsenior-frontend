import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, API_KEY } from '../../config/apiConfiguration.js';
import { toast } from 'react-toastify';
import DetailPageNavbar from '../../DetailPages/DetailPageNavbar.jsx';

function NotesView() {
    const { courseCode, branchCode, subjectCode, slug, collegeName } =
        useParams();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [countdown, setCountdown] = useState(5); // Initial countdown
    const [canDownload, setCanDownload] = useState(false); // Button state
    const [showCountdown, setShowCountdown] = useState(false); // Control showing countdown

    useEffect(() => {
        const fetchNote = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${api.subjectNotes}/${slug}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setNote(data.note);
                } else {
                    throw new Error(data.message || 'Failed to fetch note.');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to fetch note.');
                toast.error('Failed to fetch note.');
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
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
                setCountdown(5); // Reset countdown for next use
            }
        }, 1000);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <i className="fas fa-spinner fa-pulse fa-5x text-sky-500"></i>
                    <p className="mt-4 text-lg text-gray-600">
                        Loading note...
                    </p>
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
                path={`${collegeName}/resources/${courseCode}/${branchCode}/notes/${subjectCode}`}
            />
            {note ? (
                <div>
                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {note.title}
                        </h1>
                        <p className="text-lg text-gray-600 mt-2">
                            Subject: {note.subject.subjectName} (
                            {note.subject.subjectCode})
                        </p>
                    </div>

                    {/* PDF Viewer */}
                    <div className="flex justify-center w-full my-5">
                        <iframe
                            src={`https://docs.google.com/gview?url=${note.fileUrl}&embedded=true`}
                            width="100%"
                            height="600"
                            className="block max-w-screen-lg w-full rounded-md shadow-md border-none"
                            title="PDF Viewer"
                        ></iframe>
                    </div>
                    <div className="flex justify-center mb-4">
                        <button
                            onClick={handleDownloadClick}
                            disabled={canDownload}
                            className={`bg-sky-500 text-white rounded-md px-4 py-2 mt-3 hover:bg-sky-600 ${canDownload ? '' : 'cursor-not-allowed'
                                }`}
                            title="Download Note PDF"
                        >
                            {canDownload ? (
                                <a
                                    href={note.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Download now
                                </a>
                            ) : (
                                showCountdown ? `Download ${countdown}s` : "Download"
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-600">Note not found.</p>
            )}
        </div>
    );
}

export default NotesView;
