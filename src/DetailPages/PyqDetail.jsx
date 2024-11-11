import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import useApiFetch from '../hooks/useApiFetch';
import { toast } from 'react-toastify';
import { api } from '../config/apiConfiguration';
import DetailPageNavbar from './DetailPageNavbar';

function PyqDetail() {
    const { collegeName, id } = useParams();
    const [pyq, setPyq] = useState(null);
    const [error, setError] = useState(null);
    const [suggestedpyqs, setSuggestedpyqs] = useState([]);
    const [collegeId, setCollegeId] = useState('');

    const url = `${api.pyq}/${id}`;
    const { useFetch, loadingFetch } = useApiFetch();

    const fetchPyq = async () => {
        try {
            const data = await useFetch(url);
            setPyq(data);
            setError(null);
            fetchSuggestedpyqs(data);
        } catch (error) {
            setError('No PYQ found with this ID');
            setPyq(null);
            console.log(error);
            toast.error('Something Error Occurred Fetching Pyq');
        }
    };

    const fetchSuggestedpyqs = async (data) => {
        if (!collegeId) return;
        const { year, semester, course, branch, examType } = data;
        const query = {
            year,
            semester,
            course,
            branch: Array.isArray(branch) ? branch.join(',') : branch,
            examType,
        };

        const suggestedUrl = `${
            api.pyq
        }/${collegeId}/${id}/related-pyqs?${new URLSearchParams(
            query
        ).toString()}`;
        try {
            const pyqs = await useFetch(suggestedUrl);
            setSuggestedpyqs(pyqs);
        } catch (error) {
            console.log('Error fetching related pyqs:', error);
        }
    };

    useEffect(() => {
        const formattedCollegeName = collegeName
            .replace(/\s+/g, '-')
            .toLowerCase();
        const savedCollegeId = localStorage.getItem(formattedCollegeName);

        if (savedCollegeId) {
            setCollegeId(savedCollegeId);
        }
    }, [collegeName]);

    useEffect(() => {
        if (collegeId) fetchPyq();
    }, [id, collegeId]);

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
            <DetailPageNavbar path={'pyq'} />
            <div className="main flex">
                <div className="flex-1 px-3 py-4">
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
                    <div className="flex flex-col justify-center shadow-md p-4 rounded-md bg-sky-100">
                        <h3 className="text-xl font-semibold  mb-4 text-center text-sky-600">
                            Get This Filter All Pyq
                        </h3>
                        <div>
                            <p className="mb-2  text-xs lg:text-base">
                                Semester: {pyq.semester}
                            </p>
                            <p className="mb-2  text-xs lg:text-base">
                                Year: {pyq.year}
                            </p>
                            <p className="mb-2  text-xs lg:text-base">
                                Exam Type: {pyq.examType}
                            </p>
                            <p className="mb-2  text-xs lg:text-base">
                                Course : {pyq.course}
                            </p>
                            <p className="mb-2  text-xs lg:text-base">
                                Branch:{' '}
                                {Array.isArray(pyq.branch)
                                    ? pyq.branch.join(', ')
                                    : pyq.branch}
                            </p>
                        </div>
                        <Link
                            to={`/college/${collegeName}/pyq/bundle?year=${pyq.year}&semester=${pyq.semester}&course=${pyq.course}&branch=${pyq.branch}&examType=${pyq.examType}`}
                            className="inline-block bg-sky-500 text-white px-4 py-2 rounded-md text-center hover:bg-red-300 transition-colors text-xs lg:text-base"
                        >
                            View
                        </Link>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 my-4 text-center">
                        Related pyqs
                    </h3>

                    <div className="space-y-4">
                        {suggestedpyqs.length > 0 ? (
                            suggestedpyqs.map((pyq) => (
                                <div
                                    key={pyq._id}
                                    className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                                >
                                    <h4 className="text-lg font-semibold text-gray-800">
                                        {pyq.subjectName}
                                    </h4>
                                    <p className="text-gray-600">
                                        Exam Type:{' '}
                                        <span className="font-normal">
                                            {pyq.examType}
                                        </span>
                                    </p>
                                    <p className="text-gray-600">
                                        Year:{' '}
                                        <span className="font-normal">
                                            {pyq.year}
                                        </span>
                                    </p>
                                    <p className="text-gray-600">
                                        Semester:{' '}
                                        <span className="font-normal">
                                            {pyq.semester}
                                        </span>
                                    </p>
                                    <p className="text-gray-600">
                                        Branch:{' '}
                                        <span className="font-normal">
                                            {Array.isArray(pyq.branch)
                                                ? pyq.branch.join(', ')
                                                : pyq.branch}
                                        </span>
                                    </p>
                                    <div className="mt-4 flex justify-center">
                                        <Link
                                            to={`/college/${collegeName}/pyq/${pyq._id}`}
                                            className="bg-sky-500 text-white px-4 py-2 rounded-md text-center hover:bg-red-300 transition-colors text-xs lg:text-base"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">
                                No related pyqs found
                            </p>
                        )}
                    </div>
                </div>
            </div>{' '}
            {/* Suggested pyqs Small Screen */}
            <div className="lg:hidden w-full bg-white p-5 shadow-lg space-y-4 mt-5">
                <div className="flex flex-col justify-center shadow-md p-4 rounded-md bg-sky-100">
                    <div>
                        <h3 className="text-xl font-semibold  mb-4 text-center text-sky-600">
                            Get This Filter All Pyq
                        </h3>
                    </div>
                    <div className="flex gap-2 sm:gap-4 flex-wrap">
                        <p className="mb-2  text-xs sm:text-base">
                            Semester: {pyq.semester}
                        </p>
                        <p className="mb-2  text-xs sm:text-base">
                            Year: {pyq.year}
                        </p>
                        <p className="mb-2  text-xs sm:text-base">
                            Exam Type: {pyq.examType}
                        </p>
                        <p className="mb-2  text-xs sm:text-base">
                            Course : {pyq.course}
                        </p>
                        <p className="mb-2  text-xs sm:text-base">
                            Branch:{' '}
                            {Array.isArray(pyq.branch)
                                ? pyq.branch.join(', ')
                                : pyq.branch}
                        </p>
                    </div>
                    <div className="flex justify-center sm:mt-4">
                        <Link
                            to={`/college/${collegeName}/pyq/bundle?year=${pyq.year}&semester=${pyq.semester}&course=${pyq.course}&branch=${pyq.branch}&examType=${pyq.examType}`}
                            className="w-full sm:w-1/4 bg-sky-500 text-white px-4 py-2 rounded-md text-center hover:bg-red-300 transition-colors text-xs lg:text-base"
                        >
                            View
                        </Link>
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                    Related pyqs
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {suggestedpyqs.length > 0 ? (
                        suggestedpyqs.map((pyq) => (
                            <div
                                key={pyq._id}
                                className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 flex flex-col"
                            >
                                <div className="flex-grow">
                                    <h4 className="text-sm  mb-2  font-semibold text-gray-800 ">
                                        {pyq.subjectName}
                                    </h4>
                                    <p className="text-gray-600 mb-2 text-xs">
                                        Exam Type:{' '}
                                        <span className="font-normal">
                                            {pyq.examType}
                                        </span>
                                    </p>
                                    <p className="text-gray-600 mb-2  text-xs">
                                        Year:{' '}
                                        <span className="font-normal">
                                            {pyq.year}
                                        </span>
                                    </p>
                                    <p className="text-gray-600  mb-2 text-xs">
                                        Semester:{' '}
                                        <span className="font-normal">
                                            {pyq.semester}
                                        </span>
                                    </p>
                                    <p className="text-gray-600 mb-2  text-xs">
                                        Branch:{' '}
                                        <span className="font-normal">
                                            {Array.isArray(pyq.branch)
                                                ? pyq.branch.join(', ')
                                                : pyq.branch}
                                        </span>
                                    </p>
                                </div>
                                <div className="mt-4 flex justify-center">
                                    <Link
                                        to={`/college/${collegeName}/pyq/${pyq._id}`}
                                        className="bg-sky-500 text-white px-4 py-2 rounded-md text-center hover:bg-red-300 transition-colors text-xs lg:text-base"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No related pyqs found</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PyqDetail;
