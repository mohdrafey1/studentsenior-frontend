import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, API_KEY } from '../../config/apiConfiguration.js';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { signOut } from '../../redux/user/userSlice.js';
import DetailPageNavbar from '../../DetailPages/DetailPageNavbar.jsx';
import Seo from '../SEO/Seo.jsx';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import 'pdfjs-dist/legacy/web/pdf_viewer.css';

// Set up PDF.js worker (adjust the path if you host it yourself)
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

/* LazyPDFPage Component:
   - Receives the loaded PDF document, page number, and a scale factor.
   - Uses an Intersection Observer to render the page only when its placeholder image is in view.
*/
const LazyPDFPage = ({ pdf, pageNum, scale = 1.5 }) => {
    const [pageSrc, setPageSrc] = useState(null);
    const imgRef = useRef(null);

    useEffect(() => {
        if (!pdf) return;

        const observer = new IntersectionObserver(
            (entries, observerInstance) => {
                entries.forEach(async (entry) => {
                    if (entry.isIntersecting && !pageSrc) {
                        try {
                            const page = await pdf.getPage(pageNum);
                            const viewport = page.getViewport({ scale });
                            const canvas = document.createElement('canvas');
                            const context = canvas.getContext('2d');
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;

                            await page.render({
                                canvasContext: context,
                                viewport: viewport,
                            }).promise;

                            setPageSrc(canvas.toDataURL());
                            observerInstance.unobserve(entry.target);
                        } catch (error) {
                            console.error(
                                `Error rendering page ${pageNum}:`,
                                error
                            );
                        }
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }
        return () => observer.disconnect();
    }, [pdf, pageNum, scale, pageSrc]);

    return (
        <img
            ref={imgRef}
            src={pageSrc}
            alt={`Page ${pageNum}`}
            style={{ width: '100%', marginBottom: '20px' }}
        />
    );
};

function NotesView() {
    const { courseCode, branchCode, subjectCode, slug, collegeName } =
        useParams();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [countdown, setCountdown] = useState(45);
    const [canDownload, setCanDownload] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false);

    const dispatch = useDispatch();

    // Fetch the note data from your backend API.
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
                    credentials: 'include',
                });
                const data = await response.json();
                if (data.statusCode === 401 && data.success === false) {
                    dispatch(signOut());
                    toast.error('Please log in again to see the notes');
                    throw new Error('Unauthorized');
                }
                if (response.ok) {
                    setNote(data.note);
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

    // Once note is fetched and we have a file URL, load the PDF document.
    // Load PDF Document for Viewing
    useEffect(() => {
        const fetchSignedUrlForView = async () => {
            if (note && note.fileUrl) {
                try {
                    // Request signed URL for viewing
                    const response = await fetch(
                        `${api.getSignedUrl}?fileUrl=${note.fileUrl}`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-api-key': API_KEY,
                            },
                        }
                    );

                    const data = await response.json();
                    if (response.ok) {
                        // Load the PDF using the signed URL
                        const loadingTask = pdfjsLib.getDocument(
                            data.signedUrl
                        );
                        const pdf = await loadingTask.promise;
                        setPdfDoc(pdf);
                    } else {
                        throw new Error(
                            data.message || 'Failed to get signed URL.'
                        );
                    }
                } catch (err) {
                    console.error('Error getting signed URL for view:', err);
                    setError('Failed to load PDF document.');
                }
            }
        };

        fetchSignedUrlForView();
    }, [note]);

    // Fetch Signed URL for Download
    useEffect(() => {
        const fetchSignedUrlForDownload = async () => {
            if (canDownload && note && note.fileUrl) {
                try {
                    const response = await fetch(
                        `${api.getSignedUrl}?fileUrl=${note.fileUrl}`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-api-key': API_KEY,
                            },
                        }
                    );

                    const data = await response.json();
                    if (response.ok) {
                        setSignedUrl(data.signedUrl); // Store Signed URL for download
                    } else {
                        throw new Error(
                            data.message ||
                                'Failed to get signed URL for download.'
                        );
                    }
                } catch (error) {
                    console.error(
                        'Error fetching signed URL for download:',
                        error
                    );
                }
            }
        };

        fetchSignedUrlForDownload();
    }, [canDownload, note]);

    // Download countdown logic.
    const handleDownloadClick = () => {
        setCanDownload(false);
        setShowCountdown(true);
        let timer = countdown;
        const interval = setInterval(() => {
            timer -= 1;
            setCountdown(timer);
            if (timer === 0) {
                clearInterval(interval);
                setCanDownload(true);
                setShowCountdown(false);
                setCountdown(45); // Reset countdown for next use.
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
        return (
            <div className="h-screen flex justify-center items-center">
                <div>
                    <p className="text-center text-red-500 mb-4">{error}</p>
                    <Link
                        to={`/${collegeName}/resources/${courseCode}/${branchCode}/notes/${subjectCode}`}
                        className="bg-sky-500 text-white rounded-md px-4 py-2 mt-3 hover:bg-sky-600"
                    >
                        See Other Notes
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto sm:px-2 min-h-screen">
            <DetailPageNavbar
                path={`${collegeName}/resources/${courseCode}/${branchCode}/notes/${subjectCode}`}
            />
            {note ? (
                <div>
                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-bold text-gray-800 mt-4">
                            {note.title}
                        </h1>
                        <p className="text-lg text-gray-600 mt-2">
                            Subject: {note.subject.subjectName} (
                            {note.subject.subjectCode})
                            <Seo
                                title={`${note.subject.subjectName} (${note.subject.subjectCode})`}
                            />
                        </p>
                    </div>

                    {/* PDF Viewer */}
                    <div className="flex justify-center w-full my-5">
                        <div className="pdf-viewer md:w-4/5 lg:w-3/5">
                            {pdfDoc ? (
                                Array.from({ length: pdfDoc.numPages }).map(
                                    (_, index) => (
                                        <LazyPDFPage
                                            key={index}
                                            pdf={pdfDoc}
                                            pageNum={index + 1}
                                            scale={1.5}
                                        />
                                    )
                                )
                            ) : (
                                <p>Loading PDF...</p>
                            )}
                        </div>
                    </div>

                    {/* Download Button */}
                    <div className="flex justify-center mb-4">
                        <button
                            onClick={handleDownloadClick}
                            disabled={canDownload}
                            className={`bg-sky-500 text-white rounded-md px-4 py-2 mt-3 hover:bg-sky-600 ${
                                canDownload ? '' : 'cursor-not-allowed'
                            }`}
                            title="Download Note PDF"
                        >
                            {canDownload ? (
                                <a
                                    href={signedUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Download now
                                </a>
                            ) : showCountdown ? (
                                `Download ${countdown}s`
                            ) : (
                                'Download'
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
