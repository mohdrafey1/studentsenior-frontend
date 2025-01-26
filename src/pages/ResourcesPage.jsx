import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import CollegeLinks from '../components/Links/CollegeLinks';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses } from '../redux/slices/courseSlice';
import Collegelink2 from '../components/Links/CollegeLink2.jsx';
import { capitalizeWords } from '../utils/Capitalize.js';

const ResourcesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { collegeName } = useParams();
    const dispatch = useDispatch();

    const {
        courses = [],
        loading,
        error,
    } = useSelector((state) => state.courses || {});

    useEffect(() => {
        dispatch(fetchCourses());
    }, [collegeName]);

    const filteredCourses = courses.filter((course) => {
        const courseNameMatch = course.courseName
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const courseCodeMatch = course.courseCode
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        return courseNameMatch || courseCodeMatch;
    });

    return (
        <div className="container bg-gradient-to-t from-sky-200 to-white min-w-full sm:pb-8 grid place-items-center">
            <CollegeLinks />
            <div className="max-w-7xl mx-auto px-5 min-h-full">
                <h1 className="text-lg sm:text-3xl font-bold mb-2 text-center">
                    Resources - {capitalizeWords(collegeName)}
                </h1>
                <p className="italic text-center text-xs sm:text-base">
                    "Get concise and clear notes to boost your exam
                    preparation."
                </p>
                <br />
                {/* Search Bar */}
                <div className="mb-2 flex justify-center">
                    <input
                        type="text"
                        placeholder="Search by course name or code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded-lg shadow-md w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                </div>
            </div>

            <div className="m-4 sm:m-8 2xl:m-auto max-w-7xl">
                {error && (
                    <div className="text-red-500 text-center">
                        Failed to load courses: {error}
                    </div>
                )}

                {filteredCourses.length > 0 ? (
                    <div className="flex justify-center min-h-screen min-w-screen">
                        <div className="w-full max-w-6xl lg:px-4">
                            <table className="table-auto w-full bg-white rounded-lg shadow-md overflow-hidden">
                                <thead className="bg-sky-500 text-white">
                                    <tr>
                                        <th className="border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2 text-left">
                                            Course Name
                                        </th>
                                        <th className="border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2 text-left">
                                            Subject Code
                                        </th>
                                        <th className="border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2 text-left">
                                            Total Notes / Pyqs
                                        </th>
                                        <th className="border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2 text-left">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCourses.map((course, index) => (
                                        <tr
                                            key={course._id}
                                            className={
                                                index % 2 === 0
                                                    ? 'bg-gray-100'
                                                    : 'bg-white'
                                            }
                                        >
                                            <td className="border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2">
                                                {course.courseName}
                                            </td>
                                            <td className="border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2">
                                                {course.courseCode}
                                            </td>
                                            <td className="border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2">
                                                {course.totalNotes || 0} /{' '}
                                                {course.totalPyqs || 0}
                                            </td>
                                            <td className="border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2">
                                                <Link
                                                    to={`/${collegeName}/resources/${course.courseCode.toLowerCase()}`}
                                                    className="px-3 py-1 bg-sky-500 text-white rounded hover:underline transition-colors duration-200"
                                                    aria-label={`View details for ${course.courseName}`}
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
                ) : (
                    <div className="flex justify-center items-center min-h-screen">
                        {loading ? (
                            <i className="fas fa-spinner fa-pulse fa-5x"></i>
                        ) : (
                            <p>No courses available at the moment.</p>
                        )}
                    </div>
                )}
            </div>

            {/* <div className="lg:flex w-full justify-center gap-5">
                <div className="bg-white p-6 rounded-lg shadow-3xl text-center mb-8 lg:w-80 lg:m-0 lg:mb-4 m-4">
                    <img
                        src={pyq}
                        alt="Buy solved question paper"
                        className="w-36 mx-auto"
                    />
                    <p className="mb-4">
                        Get solved questions for just ₹29. <br />
                        <a className="text-sm text-gray-500">
                            Terms and conditions apply.
                        </a>
                    </p>
                    <a
                        target="_blank"
                        href="https://forms.gle/NwFvj1Jz5gxvmHfdA"
                        className="inline-block px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors duration-200"
                    >
                        Buy Solved Question Paper
                    </a>
                </div>
            </div> */}

            <Collegelink2 />
        </div>
    );
};

export default ResourcesPage;
