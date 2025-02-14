import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { api, API_KEY } from '../../config/apiConfiguration.js';
import { toast } from 'react-toastify';
import DetailPageNavbar from '../../DetailPages/DetailPageNavbar.jsx';
import Seo from '../SEO/Seo.jsx';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import 'pdfjs-dist/legacy/web/pdf_viewer.css';

// Set up PDF.js worker (adjust the path if you host it yourself)
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

    // Fetch pyq data from the backend
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

    // Once pyq is fetched and a fileUrl is available, load the PDF document.
    useEffect(() => {
        const loadPdf = async () => {
            if (pyq && pyq.fileUrl) {
                try {
                    const loadingTask = pdfjsLib.getDocument(pyq.fileUrl);
                    const pdf = await loadingTask.promise;
                    setPdfDoc(pdf);
                } catch (err) {
                    console.error('Error loading PDF document:', err);
                    setError('Failed to load PDF document.');
                }
            }
        };

        loadPdf();
    }, [pyq]);

    // Download countdown handler
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
                                        href={pyq.fileUrl}
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
        </div>
    );
}

export default PyqView;
