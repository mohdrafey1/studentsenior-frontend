import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import CollegeLinks from '../components/Links/CollegeLinks';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses } from '../redux/slices/courseSlice';
import Collegelink2 from '../components/Links/CollegeLink2.jsx';
import { capitalizeWords } from '../utils/Capitalize.js';
import pyq from '../../public/assets/pyq.png';
import notesandpyq from '../../public/assets/notes&pyq.png';

const ResourcesPage = () => {
    const { collegeName } = useParams();
    const dispatch = useDispatch();

    const {
        courses = [],
        loading,
        error,
    } = useSelector((state) => state.courses || {});

    useEffect(() => {
        if (!courses.length) {
            dispatch(fetchCourses());
        }
    }, [collegeName, courses.length]);

    return (
        <div className="container bg-gradient-to-t from-sky-200 to bg-white min-w-full">
            <CollegeLinks />
            <div className="max-w-7xl mx-auto p-5 min-h-full">
                <h1 className="text-lg sm:text-3xl font-bold mb-2 text-center">
                    Resources - {capitalizeWords(collegeName)}
                </h1>
                <p className="italic text-center text-xs sm:text-base">
                    "Get concise and clear notes to boost your exam
                    preparation."
                </p>
                <br />
            </div>

            <div className="mb-8 mx-auto max-w-7xl">
                {loading ? (
                    <p className="text-center">Loading courses...</p>
                ) : error ? (
                    <p className="text-center text-red-500">
                        Error loading courses: {error}
                    </p>
                ) : courses.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {courses.map((course) => (
                            <div
                                key={course._id}
                                className="p-6 bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                            >
                                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                                    {course.courseName}
                                </h2>
                                <div className="text-sm text-gray-600 mb-4">
                                    <p>
                                        Total Branches:{' '}
                                        <span className="font-medium text-gray-800">
                                            10
                                        </span>
                                    </p>
                                    <p>
                                        Total Subjects:{' '}
                                        <span className="font-medium text-gray-800">
                                            100
                                        </span>
                                    </p>
                                    <p>
                                        Total Notes:{' '}
                                        <span className="font-medium text-gray-800">
                                            100
                                        </span>
                                    </p>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <Link
                                        to={
                                            course.courseCode
                                                ? course.courseCode.toLowerCase()
                                                : '#'
                                        }
                                        className="text-sky-600 font-medium hover:underline"
                                        aria-label={`View details for ${course.courseName}`}
                                    >
                                        View Details
                                    </Link>
                                    <span className="text-sm text-gray-500">
                                        {course.courseCode
                                            ? `Code: ${course.courseCode}`
                                            : 'No Code'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center">
                        No courses available at the moment.
                    </p>
                )}
            </div>

            <div className="lg:flex w-full justify-center gap-5">
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
                <div className="bg-white p-6 rounded-lg shadow-3xl text-center mb-8 lg:w-80 lg:m-0 lg:mb-4 m-4">
                    <img
                        src={notesandpyq}
                        alt="Upload PYQs and notes"
                        className="w-36 mx-auto"
                    />
                    <p className="mb-4">
                        If you have any PYQs or notes, please share them with
                        us.
                    </p>
                    <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSebji3Hfr-6Volc7KJwk4entnuXH803AAVF1QnHYGPK7AtjPw/viewform?usp=sf_link"
                        className="inline-block px-6 py-3 bg-sky-500 text-white font-bold rounded-lg hover transition-colors duration-200"
                        target="_blank"
                    >
                        Click Here To Share PYQs
                    </a>
                </div>
            </div>

            <Collegelink2 />
        </div>
    );
};

export default ResourcesPage;
