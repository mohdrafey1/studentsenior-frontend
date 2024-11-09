import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import useApiFetch from '../hooks/useApiFetch';
import { toast } from 'react-toastify';
import { api } from '../config/apiConfiguration';

function PyqDetail() {
    const { collegeName, id } = useParams();
    const [pyq, setPyq] = useState(null);
    const [error, setError] = useState(null);

    const url = `${api.pyq}/${id}`;
    const { useFetch, loadingFetch } = useApiFetch();

    const fetchPyq = async () => {
        try {
            const data = await useFetch(url);
            setPyq(data);
            console.log(data);
            setError(null);
        } catch (error) {
            setError('No PYQ found with this ID');
            setPyq(null);
            console.log(error);
            toast.error('Something Error Occourred Fetching Pyq');
        }
    };

    useEffect(() => {
        fetchPyq();
    }, [id]);

    const handleShare = () => {
        const postUrl = window.location.href;
        if (navigator.share) {
            navigator
                .share({ title: 'Student Senior Pyq', url: postUrl })
                .catch((error) => console.log('Share failed:', error));
        } else {
            navigator.clipboard
                .writeText(postUrl)
                .then(() => toast.success('Link copied to clipboard!'))
                .catch(() => toast.error('Failed to copy link.'));
        }
    };

    if (loadingFetch || !pyq) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                {loadingFetch ? (
                    <i className="fas fa-spinner fa-pulse fa-5x"></i>
                ) : (
                    <p className="text-center text-gray-500 mt-5">{error}</p>
                )}
            </div>
        );
    }

    return (
        <>
            <div className="container bg-gradient-to-t from-sky-200 to bg-white min-h-screen min-w-full relative">
                <div className="main">
                    <div className="fixed top-0 left-0 z-30 w-full bg-white z-100 top-panel shadow-md h-16 flex items-center justify-between px-5">
                        <div className="text-gray-600">
                            <Link to={`/college/${collegeName}/pyq`}>
                                <i className="fa-solid fa-arrow-left-long fa-2xl"></i>
                            </Link>
                        </div>
                        <div
                            className="text-center hover:text-blue-300"
                            onClick={handleShare}
                        >
                            <i className="fa-regular fa-share-from-square fa-xl"></i>
                            <p>Share</p>
                        </div>
                    </div>
                    {/* PYQ Details */}
                    <div className="flex flex-col items-center sm:px-4 space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            {pyq?.subjectName}
                        </h2>
                        <div className="flex md:flex-row md:justify-around w-full max-w-screen-lg bg-white rounded-md shadow-lg p-3">
                            <div className="text-gray-600 mb-3 md:mb-0 w-1/2">
                                <p className="font-semibold">
                                    Subject Code:{' '}
                                    <span className="font-normal">
                                        {pyq?.subjectCode}
                                    </span>
                                </p>
                                <p className="font-semibold">
                                    Semester:{' '}
                                    <span className="font-normal">
                                        {pyq?.semester}
                                    </span>
                                </p>
                                <p className="font-semibold">
                                    Exam Type:{' '}
                                    <span className="font-normal">
                                        {pyq?.examType}
                                    </span>
                                </p>
                            </div>
                            <div className="text-gray-600 w-1/2">
                                <p className="font-semibold">
                                    Course:{' '}
                                    <span className="font-normal">
                                        {pyq?.course}
                                    </span>
                                </p>
                                <p className="font-semibold">
                                    Year:{' '}
                                    <span className="font-normal">
                                        {pyq?.year}
                                    </span>
                                </p>

                                <p className="font-semibold">
                                    Branch:{' '}
                                    <span className="font-normal">
                                        {Array.isArray(pyq?.branch)
                                            ? pyq?.branch.join(', ')
                                            : pyq?.branch}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* PDF Viewer */}
                        <div className="flex justify-center w-full my-5">
                            {pyq && pyq.link ? (
                                <iframe
                                    src={pyq.link.replace('/view', '/preview')}
                                    width="100%"
                                    height="500"
                                    className="max-w-screen-lg w-full rounded-md shadow-md"
                                    title="PDF Viewer"
                                ></iframe>
                            ) : (
                                <p className="text-red-500">No PDF available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PyqDetail;
