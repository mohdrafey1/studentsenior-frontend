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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {branches.map((branch) => (
                    <div
                        key={branch._id}
                        className="border p-4 rounded-lg shadow hover:shadow-lg transition duration-200"
                    >
                        <h2 className="text-lg font-semibold">{branch.name}</h2>
                        <p className="text-sm text-gray-600">
                            Name: {branch.branchName}
                        </p>
                        <p className="text-sm text-gray-600">
                            Code: {branch.branchCode}
                        </p>
                        <p>Total subjects: 100</p>
                        <p>Total notes: 100</p>

                        <Link
                            to={branch.branchCode.toLowerCase()}
                            className="text-blue-500 hover:underline"
                            aria-label={`View details for ${branch.name}`}
                        >
                            View
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Branches;
