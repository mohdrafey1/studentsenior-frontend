import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ConfirmPurchaseModal from './ConfirmPurchaseModal.jsx';
import { api, API_KEY } from '../../config/apiConfiguration.js';
import { toast } from 'react-toastify';
import DetailPageNavbar from '../../DetailPages/DetailPageNavbar.jsx';
import Seo from '../SEO/Seo.jsx';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import 'pdfjs-dist/legacy/web/pdf_viewer.css';
import { signOut } from '../../redux/user/userSlice.js';
import { fetchUserData } from '../../redux/slices/userDataSlice.js';
import {
    handleConfirmPurchaseUtil,
    handleOnlinePaymentUtil,
} from '../../utils/purchaseUtils.js';
import useApiRequest from '../../hooks/useApiRequest.js';
import { PYQ_DOWNLOAD_TIMER } from '../../config/constant.js';

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


function AdPlacement({ id }) {
    const adContainerRef = useRef(null);

    useEffect(() => {
        const adScriptSrc =
            'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4435788387381825';

        const initializeAd = () => {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error('AdSense error:', e);
            }
        };

        const existingScript = document.querySelector(`script[src="${adScriptSrc}"]`);

        if (!existingScript) {
            const script = document.createElement('script');
            script.src = adScriptSrc;
            script.async = true;
            script.crossOrigin = 'anonymous';
            script.onload = initializeAd;
            document.head.appendChild(script);
        } else {
            initializeAd();
        }

        return () => {
            if (adContainerRef.current) {
                adContainerRef.current.innerHTML = '';
            }
        };
    }, [id]);

    return (
        <div
            ref={adContainerRef}
            className="ad-container my-4 p-4 bg-gray-100 rounded-lg border border-gray-300 text-center"
            style={{ minWidth: '300px' }}
            data-testid={`ad-container-${id}`}
        >
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-4435788387381825"
                data-ad-slot="8136832666"
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
            <p className="text-xs text-gray-500 mt-1" data-testid="ad-label">
                Advertisement
            </p>
        </div>
    );
}


function PyqView() {
    const { courseCode, branchCode, subjectCode, slug, collegeName } =
        useParams();
    const [pyq, setPyq] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [countdown, setCountdown] = useState(PYQ_DOWNLOAD_TIMER);
    const [canDownload, setCanDownload] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false);
    const [signedUrl, setSignedUrl] = useState('');
    const [loadingPreview, setLoadingPreview] = useState(false);

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
    const fetchSignedUrlForDownload = async () => {
        if (canDownload && pyq && pyq.fileUrl) {
            setLoadingPreview(true);
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
                    setSignedUrl(data.signedUrl);
                    toast.success('File is ready to view!');
                } else {
                    throw new Error(
                        data.message || 'Failed to get signed URL for download.'
                    );
                }
            } catch (error) {
                console.error('Error fetching signed URL for download:', error);
            } finally {
                setLoadingPreview(false);
            }
        }
    };

    useEffect(() => {
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

    const navigate = useNavigate();

    const handleConfirmPurchase = async () => {
        handleConfirmPurchaseUtil(selectedPyq, api.newPyqs, navigate, () =>
            setBuyNowModalOpen(false)
        );
        await fetchpyq();
        window.location.reload();
    };

    const { apiRequest } = useApiRequest();

    const handleOnlinePayment = () => {
        handleOnlinePaymentUtil(
            selectedPyq,
            apiRequest,
            window.location.href,
            'pyq_purchase'
        );
    };

    useEffect(() => {
        const handleContextMenu = (e) => e.preventDefault();
        const handleKeyDown = (e) => {
            if (
                e.ctrlKey &&
                (e.key === 'p' || e.key === 's' || e.key === 'u')
            ) {
                e.preventDefault();
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        const blockDevTools = (e) => {
            if (
                e.keyCode === 123 || // F12
                (e.ctrlKey &&
                    e.shiftKey &&
                    (e.key === 'I' || e.key === 'J' || e.key === 'C')) || // Ctrl+Shift+I/J/C
                (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'J')) // Cmd+Option+I/J (Mac)
            ) {
                e.preventDefault();
            }
        };

        document.addEventListener('keydown', blockDevTools);
        return () => {
            document.removeEventListener('keydown', blockDevTools);
        };
    }, []);

    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <DetailPageNavbar path={`college/${collegeName}/resources`} />
                <div className='text-center'>
                    <i className='fas fa-spinner fa-pulse fa-5x text-sky-500'></i>
                    <p className='mt-4 text-lg text-gray-600'>Loading pyq...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='h-screen flex justify-center items-center'>
                <div>
                    <p className='text-center text-red-500 mb-4'>{error}</p>
                    <Link
                        to={`/${collegeName}/resources/${courseCode}/${branchCode}/pyqs/${subjectCode}`}
                        className='bg-sky-500 text-white rounded-md px-4 py-2 mt-3 hover:bg-sky-600'
                    >
                        See Other Pyq
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='container mx-auto sm:px-4 min-h-screen'>
            <DetailPageNavbar
            // path={`${collegeName}/resources/${courseCode}/${branchCode}/pyqs/${subjectCode}`}
            />
            {pyq ? (
                <div>
                    <div className='flex flex-col items-center px-2'>
                        <p className='text-lg text-gray-600 mt-2'>
                            Subject: {pyq.subject.subjectName} ({pyq.examType} -{' '}
                            {pyq.year})
                            <Seo
                                title={`${pyq.subject.subjectName} (${pyq.examType} - ${pyq.year})`}
                            />
                        </p>
                        {pyq.solved && (
                            <span className='bg-green-200 rounded-md px-2 py-1 font-bold'>
                                Solved
                            </span>
                        )}
                    </div>

                    {/* PDF Viewer */}
                    <div className='flex justify-center w-full my-5'>
                        <div className='pdf-viewer md:w-4/5 lg:w-3/5 px-1'>
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
                                                <React.Fragment key={index}>
                                                    <LazyPDFPage
                                                        pdf={pdfDoc}
                                                        pageNum={index + 1}
                                                        scale={1.5}
                                                    />
                                                    {/* Show ad after first page */}
                                                    {/* will implement if needed */}
                                                </React.Fragment>
                                            ))}
                                            <div className='text-center mt-5'>
                                                <button
                                                    onClick={() =>
                                                        handleBuyNowClick(pyq)
                                                    }
                                                    className='bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-full shadow-md transition-transform transform hover:scale-105'
                                                >
                                                    Purchase to View All Pages (
                                                    {pyq.price / 5}₹)
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        // If user is the owner or has bought it, show all pages
                                        Array.from({
                                            length: pdfDoc.numPages,
                                        }).map((_, index) => (
                                            <React.Fragment key={index}>
                                                <LazyPDFPage
                                                    pdf={pdfDoc}
                                                    pageNum={index + 1}
                                                    scale={1.5}
                                                />
                                                {/* Show ads after every 3 pages */}
                                                {(index + 1) % 5 === 0 && (
                                                    <AdPlacement id={`page-${index}`} />
                                                )}
                                            </React.Fragment>
                                        ))
                                    )}
                                    {/* Bottom ad after all pages */}
                                    <AdPlacement id="bottom" />
                                </>
                            ) : (
                                <p>Loading PDF...</p>
                            )}
                        </div>
                    </div>

                    {!pyq.solved && (
                        <div className='flex justify-center mb-5'>
                            {!pyq.solved && (
                                <div className='flex justify-center mb-5'>
                                    {canDownload ? (
                                        <div className='flex flex-col justify-center items-center'>
                                            <p className='text-center text-sm text-gray-500 mb-2'>
                                                If you see no preview, please
                                                click on refresh preview and try
                                                again:
                                            </p>

                                            <a
                                                href={signedUrl}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='max-w-fit bg-sky-500 text-white rounded-md px-4 py-2 mt-3 hover:bg-sky-600 transition-transform transform hover:scale-105'
                                            >
                                                View Now
                                            </a>
                                            <button
                                                onClick={
                                                    fetchSignedUrlForDownload
                                                }
                                                className={`bg-yellow-500 text-white px-4 py-2 mt-5 rounded-md hover:bg-yellow-600 ${loadingPreview
                                                    ? 'cursor-wait'
                                                    : ''
                                                    }`}
                                                disabled={loadingPreview}
                                            >
                                                {loadingPreview ? (
                                                    <i className='fas fa-spinner fa-pulse'></i>
                                                ) : (
                                                    'Refresh Preview'
                                                )}
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleDownloadClick}
                                            disabled={false}
                                            className='bg-sky-500 text-white rounded-md px-4 py-2 mt-3 hover:bg-sky-600 cursor-pointer'
                                            title='Download pyq PDF'
                                        >
                                            {showCountdown
                                                ? `Download ${countdown}s`
                                                : 'Download'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <p className='text-center text-gray-600'>pyq not found.</p>
            )}

            <ConfirmPurchaseModal
                isOpen={isBuyNowModalOpen}
                onClose={handleCloseBuyNowModal}
                selectedResource={selectedPyq}
                rewardBalance={rewardBalance}
                handleOnlinePayment={handleOnlinePayment}
                handleConfirmPurchase={handleConfirmPurchase}
                title={'Buy This Pyq'}
            />
        </div>
    );
}

export default PyqView;