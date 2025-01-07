import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBranches } from '../../redux/slices/branchSlice.js';
import { fetchCourses } from '../../redux/slices/courseSlice.js';

const Branches = () => {
    const { collegeName, courseCode } = useParams();
    const [selectedCourse, setSelectedCourse] = useState(null);

    const dispatch = useDispatch();

    const {
        branches = [],
        loading,
        error,
    } = useSelector((state) => state.branches || {});
    const { courses = [] } = useSelector((state) => state.courses || {});

    useEffect(() => {
        if (!courses.length) {
            dispatch(fetchCourses());
        }
    }, [dispatch, courses.length]);

    useEffect(() => {
        if (courses.length) {
            const foundCourse = courses.find(
                (course) =>
                    course.courseCode.toLowerCase() === courseCode.toLowerCase()
            );

            if (foundCourse) {
                setSelectedCourse(foundCourse);
            } else {
                toast.error('Course not found for courseCode');
            }
        }
    }, [courseCode, courses]);

    console.log(selectedCourse);

    useEffect(() => {
        if (selectedCourse && selectedCourse._id) {
            dispatch(fetchBranches(selectedCourse._id));
        }
    }, [selectedCourse, branches.length, dispatch]);

    if (loading) {
        return <p className="text-center">Loading branches...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">Error: {error}</p>;
    }

    if (!selectedCourse) {
        return <p className="text-center text-red-500">Course not found!</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-4">
                Branches - {collegeName}
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:mx-20">
                {branches.map((branch) => (
                    <div
                        key={branch._id}
                        className="p-6 bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
                    >
                        <div>
                            <h2 className="text-xl font-semibold mb-2 text-gray-800">
                                {branch.branchName}
                            </h2>
                            <div className="text-sm text-gray-600 mb-4">
                                <p>
                                    Total Subjects:{' '}
                                    <span className="font-medium text-gray-800">
                                        {branch.subjectCount}
                                    </span>
                                </p>
                                <p>
                                    Total Notes:{' '}
                                    <span className="font-medium text-gray-800">
                                        {branch.notesCount}
                                    </span>
                                </p>
                                <p>
                                    Code:{' '}
                                    <span className="font-medium text-gray-800">
                                        {branch.branchCode || 'N/A'}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Link
                                to={
                                    branch.branchCode
                                        ? branch.branchCode.toLowerCase()
                                        : '#'
                                }
                                className="inline-block px-4 py-2 bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-600 transition-colors duration-200"
                                aria-label={`View details for ${branch.branchName}`}
                            >
                                Explore
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Branches;
