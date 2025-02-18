import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Modal from '../../utils/Dialog.jsx';
import { api, API_KEY } from '../../config/apiConfiguration.js';
import { toast } from 'react-toastify';
import DetailPageNavbar from '../../DetailPages/DetailPageNavbar.jsx';
import Seo from '../SEO/Seo.jsx';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import 'pdfjs-dist/legacy/web/pdf_viewer.css';
import { signOut } from '../../redux/user/userSlice.js';
import { fetchUserData } from '../../redux/slices/userDataSlice.js';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// LazyPDFPage component – renders its page only when it scrolls into view.
const LazyPDFPage = ({ pdf, pageNum, scale = 1.5 }) => {
    const [pageSrc, setPageSrc] = useState(null);
    const imgRef = useRef(null);

    useEffect(() => {
        if (!pdf) return;

        const observer = new IntersectionObserver(
            (entries, observer) => {
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
                            observer.unobserve(entry.target);
                        } catch (err) {
                            console.error(
                                `Error rendering page ${pageNum}:`,
                                err
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

function PyqView() {
    const { courseCode, branchCode, subjectCode, slug, collegeName } =
        useParams();
    const [pyq, setPyq] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [countdown, setCountdown] = useState(45);
    const [canDownload, setCanDownload] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false);
    const [signedUrl, setSignedUrl] = useState('');

    const [isBuyNowModalOpen, setBuyNowModalOpen] = useState(false);
    const [selectedPyq, setSelectedPyq] = useState(null);

    const handleBuyNowClick = (pyq) => {
        setSelectedPyq(pyq);
        setBuyNowModalOpen(true);
    };

    const handleCloseBuyNowModal = () => {
        setBuyNowModalOpen(false);
        setSelectedPyq(null);
    };

    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);
    const ownerId = currentUser?._id;

    useEffect(() => {
        dispatch(fetchUserData());
    }, []);
    const { rewardBalance } = useSelector((state) => state.userData || {});

    const fetchpyq = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${api.newPyqs}/${slug}`, {
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
                setPyq(data.pyq);
            }
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to fetch pyq.');
            toast.error(err.message || 'Failed to fetch pyq.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch pyq data from the backend
    useEffect(() => {
        fetchpyq();
    }, [slug]);

    // Load PDF Document for Viewing
    useEffect(() => {
        const fetchSignedUrlForView = async () => {
            if (pyq && pyq.fileUrl) {
                try {
                    // Request signed URL for viewing
                    const response = await fetch(
                        `${api.getSignedUrl}?fileUrl=${pyq.fileUrl}`,
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
    }, [pyq]);

    // Fetch Signed URL for Download
    useEffect(() => {
        const fetchSignedUrlForDownload = async () => {
            if (canDownload && pyq && pyq.fileUrl) {
                try {
                    const response = await fetch(
                        `${api.getSignedUrl}?fileUrl=${pyq.fileUrl}`,
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
    }, [canDownload, pyq]);

    // Download Button Logic
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
                setCountdown(45);
            }
        }, 1000);
    };

    const handleConfirmPurchase = async () => {
        try {
            const response = await fetch(
                `${api.newPyqs}/purchase/${selectedPyq._id}`,
                {
                    method: 'POST',
                    credentials: 'include',
                }
            );
            const data = await response.json();

            toast.success(data.message || 'Purchase successful');
            setBuyNowModalOpen(false);
            fetchpyq();
        } catch (error) {
            console.error('Error purchasing PYQ:', error);
            toast.error('Failed to purchase PYQ');
        }
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
        return (
            <div className="h-screen flex justify-center items-center">
                <div>
                    <p className="text-center text-red-500 mb-4">{error}</p>
                    <Link
                        to={`/${collegeName}/resources/${courseCode}/${branchCode}/pyqs/${subjectCode}`}
                        className="bg-sky-500 text-white rounded-md px-4 py-2 mt-3 hover:bg-sky-600"
                    >
                        See Other Pyq
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto sm:px-4 min-h-screen">
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
                            Subject: {pyq.subject.subjectName} ({pyq.examType} -{' '}
                            {pyq.year})
                            <Seo
                                title={`${pyq.subject.subjectName} (${pyq.examType} - ${pyq.year})`}
                            />
                        </p>
                        {pyq.solved && (
                            <span className="bg-green-200 rounded-md px-2 py-1 font-bold">
                                Solved
                            </span>
                        )}
                    </div>

                    {/* PDF Viewer */}
                    <div className="flex justify-center w-full my-5">
                        <div className="pdf-viewer md:w-4/5 lg:w-3/5">
                            {pdfDoc ? (
                                <>
                                    {pyq.isPaid &&
                                    pyq.owner._id !== ownerId &&
                                    !pyq.purchasedBy.includes(ownerId) ? (
                                        // If the PYQ is paid and user is not owner or buyer, show only the first 2 pages
                                        <>
                                            {Array.from({
                                                length: Math.min(
                                                    2,
                                                    pdfDoc.numPages
                                                ),
                                            }).map((_, index) => (
                                                <LazyPDFPage
                                                    key={index}
                                                    pdf={pdfDoc}
                                                    pageNum={index + 1}
                                                    scale={1.5}
                                                />
                                            ))}
                                            <div className="text-center mt-5">
                                                <button
                                                    onClick={() =>
                                                        handleBuyNowClick(pyq)
                                                    }
                                                    className="bg-sky-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-md transition-transform transform hover:scale-105"
                                                >
                                                    Purchase to View All Pages (
                                                    {pyq.price}P)
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        // If user is the owner or has bought it, show all pages
                                        Array.from({
                                            length: pdfDoc.numPages,
                                        }).map((_, index) => (
                                            <LazyPDFPage
                                                key={index}
                                                pdf={pdfDoc}
                                                pageNum={index + 1}
                                                scale={1.5}
                                            />
                                        ))
                                    )}
                                </>
                            ) : (
                                <p>Loading PDF...</p>
                            )}
                        </div>
                    </div>

                    {!pyq.solved && (
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
                    )}
                </div>
            ) : (
                <p className="text-center text-gray-600">pyq not found.</p>
            )}

            <Modal
                isOpen={isBuyNowModalOpen}
                onClose={handleCloseBuyNowModal}
                title="Buy this PYQ"
            >
                {selectedPyq && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">
                            Available Points: {rewardBalance}
                        </h2>
                        <p>Price for this PYQ: {selectedPyq.price} Points</p>

                        <div className="flex justify-center items-end gap-4 mt-4">
                            {rewardBalance >= selectedPyq.price ? (
                                <button
                                    onClick={handleConfirmPurchase}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                                >
                                    Confirm Purchase
                                </button>
                            ) : (
                                <p className="text-red-500">
                                    Insufficient points. You need{' '}
                                    {selectedPyq.price - rewardBalance} more
                                    points.
                                </p>
                            )}
                            <Link
                                to="/add-points"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                            >
                                Add Points
                            </Link>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default PyqView;
