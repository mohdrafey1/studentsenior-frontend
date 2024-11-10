import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import useApiFetch from '../hooks/useApiFetch';
import { toast } from 'react-toastify';
import { api } from '../config/apiConfiguration';

function PyqDetail() {
    const { collegeName, id } = useParams();
    const [pyq, setPyq] = useState(null);
    const [error, setError] = useState(null);
    const [suggestedPapers, setSuggestedPapers] = useState([]);

    const url = `${api.pyq}/${id}`;
    const { useFetch, loadingFetch } = useApiFetch();

    const fetchPyq = async () => {
        try {
            const data = await useFetch(url);
            setPyq(data);
            setError(null);
            fetchSuggestedPapers(data);
        } catch (error) {
            setError('No PYQ found with this ID');
            setPyq(null);
            console.log(error);
            toast.error('Something Error Occurred Fetching Pyq');
        }
    };

    const fetchSuggestedPapers = async (data) => {
        const { year, semester, course, branch, examType } = data;
        const query = {
            year,
            semester,
            course,
            branch: Array.isArray(branch) ? branch.join(',') : branch,
            examType,
        };

        const suggestedUrl = `${api.pyq}/s/related-pyqs?${new URLSearchParams(
            query
        ).toString()}`;
        try {
            const papers = await useFetch(suggestedUrl);
            setSuggestedPapers(papers);
        } catch (error) {
            console.log('Error fetching related papers:', error);
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
        <div className="container bg-gradient-to-t from-sky-200 to bg-white min-h-screen min-w-full relative">
            <div className="main flex">
                <div className="flex-1 px-3 py-4">
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

                {/* Sidebar Section */}
                <div className="w-1/4 hidden lg:block bg-white p-5 shadow-lg max-h-screen overflow-y-auto">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                        Related Papers
                    </h3>
                    <div className="space-y-4">
                        {suggestedPapers.length > 0 ? (
                            suggestedPapers.map((paper) => (
                                <div
                                    key={paper._id}
                                    className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                                >
                                    <h4 className="text-lg font-semibold text-gray-800">
                                        {paper.subjectName}
                                    </h4>
                                    <p className="text-gray-600">
                                        Exam Type:{' '}
                                        <span className="font-normal">
                                            {paper.examType}
                                        </span>
                                    </p>
                                    <p className="text-gray-600">
                                        Year:{' '}
                                        <span className="font-normal">
                                            {paper.year}
                                        </span>
                                    </p>
                                    <p className="text-gray-600">
                                        Semester:{' '}
                                        <span className="font-normal">
                                            {paper.semester}
                                        </span>
                                    </p>
                                    <p className="text-gray-600">
                                        Branch:{' '}
                                        <span className="font-normal">
                                            {Array.isArray(paper.branch)
                                                ? paper.branch.join(', ')
                                                : paper.branch}
                                        </span>
                                    </p>
                                    <div className="mt-4 flex justify-center">
                                        <Link
                                            to={`/college/${collegeName}/pyq/${paper._id}`}
                                            className="bg-sky-500 text-white px-4 py-2 rounded-md text-center hover:bg-red-300 transition-colors text-xs lg:text-base"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">
                                No related papers found
                            </p>
                        )}
                    </div>
                </div>
            </div>{' '}
            {/* Suggested Papers (Small Screen) */}
            <div className="lg:hidden w-full bg-white p-5 shadow-lg space-y-4 mt-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                    Related Papers
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {suggestedPapers.length > 0 ? (
                        suggestedPapers.map((paper) => (
                            <div
                                key={paper._id}
                                className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 flex flex-col"
                            >
                                <div className="flex-grow">
                                    <h4 className="text-sm  mb-2  font-semibold text-gray-800 ">
                                        {paper.subjectName}
                                    </h4>
                                    <p className="text-gray-600 mb-2 text-xs">
                                        Exam Type:{' '}
                                        <span className="font-normal">
                                            {paper.examType}
                                        </span>
                                    </p>
                                    <p className="text-gray-600 mb-2  text-xs">
                                        Year:{' '}
                                        <span className="font-normal">
                                            {paper.year}
                                        </span>
                                    </p>
                                    <p className="text-gray-600  mb-2 text-xs">
                                        Semester:{' '}
                                        <span className="font-normal">
                                            {paper.semester}
                                        </span>
                                    </p>
                                    <p className="text-gray-600 mb-2  text-xs">
                                        Branch:{' '}
                                        <span className="font-normal">
                                            {Array.isArray(paper.branch)
                                                ? paper.branch.join(', ')
                                                : paper.branch}
                                        </span>
                                    </p>
                                </div>
                                <div className="mt-4 flex justify-center">
                                    <Link
                                        to={`/college/${collegeName}/pyq/${paper._id}`}
                                        className="bg-sky-500 text-white px-4 py-2 rounded-md text-center hover:bg-red-300 transition-colors text-xs lg:text-base"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No related papers found</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PyqDetail;
