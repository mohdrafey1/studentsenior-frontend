import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBranches } from '../../redux/slices/branchSlice.js';
import { fetchCourses } from '../../redux/slices/courseSlice.js';
import { capitalizeWords } from '../../utils/Capitalize.js';
import DetailPageNavbar from '../../DetailPages/DetailPageNavbar.jsx';

const Branches = () => {
    const { collegeName, courseCode } = useParams();
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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
    }, [collegeName]);

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

    useEffect(() => {
        if (selectedCourse && selectedCourse._id) {
            dispatch(fetchBranches(selectedCourse._id));
        }
    }, [selectedCourse]);

    const filteredBranches = branches.filter((branch) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
            branch.branchName.toLowerCase().includes(lowerSearchTerm) ||
            branch.branchCode.toLowerCase().includes(lowerSearchTerm)
        );
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <i className="fas fa-spinner fa-pulse fa-5x"></i>
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-500">Error: {error}</p>;
    }

    return (
        <div className="container mx-auto p-4 min-h-screen">
            <DetailPageNavbar path={`resource/${courseCode}`} />
            <h1 className="sm:text-2xl font-bold text-center mb-2">
                {capitalizeWords(collegeName)}: {courseCode.toUpperCase()}
            </h1>
            {/* Search Input */}
            <div className="mb-2 flex justify-center">
                <input
                    type="text"
                    placeholder="Search by Branch Name or Code"
                    className="border border-gray-300 px-4 py-2 rounded-lg shadow-md w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="overflow-x-auto lg:mx-20 xl:mx-40">
                <table className="table-auto w-full bg-white rounded-lg shadow-md overflow-hidden">
                    <thead className="bg-sky-500 text-white">
                        <tr>
                            <th className="border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2 text-left">
                                Branch Name
                            </th>
                            <th className="border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2 text-left">
                                Code
                            </th>
                            <th className="border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2 text-left">
                                Total Notes
                            </th>
                            <th className="border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2 text-left">
                                Total Pyqs
                            </th>
                            <th className="border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2 text-left">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBranches.map((branch) => (
                            <tr key={branch._id} className="hover:bg-gray-100">
                                <td className="border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2">
                                    {branch.branchName}
                                </td>
                                <td className="border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2">
                                    {branch.branchCode || 'N/A'}
                                </td>
                                <td className="border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2">
                                    100
                                </td>
                                <td className="border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2">
                                    100
                                </td>
                                <td className="border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2">
                                    <Link
                                        to={
                                            branch.branchCode
                                                ? branch.branchCode.toLowerCase()
                                                : '#'
                                        }
                                        className="px-3 py-1 bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors duration-200"
                                        aria-label={`View details for ${branch.branchName}`}
                                    >
                                        Explore
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Branches;
