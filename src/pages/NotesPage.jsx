import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import CollegeLinks from '../components/Links/CollegeLinks';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses } from '../redux/slices/courseSlice';
import Collegelink2 from '../components/Links/CollegeLink2.jsx';
import { capitalizeWords } from '../utils/Capitalize.js';
import pyq from '../../public/assets/pyq.png';
import notesandpyq from '../../public/assets/notes&pyq.png';

const NotesPage = () => {
    const { collegeName } = useParams();
    const dispatch = useDispatch();

    const {
        courses = [],
        loading,
        error,
    } = useSelector((state) => state.courses || {});

    useEffect(() => {
        if (!courses.length) {
            dispatch(fetchCourses(collegeName));
        }
    }, [collegeName, courses.length]);

    return (
        <div className="container bg-gradient-to-t from-sky-200 to bg-white min-w-full">
            <CollegeLinks />
            <div className="max-w-7xl mx-auto p-5 min-h-full">
                <h1 className="text-lg sm:text-3xl font-bold mb-2 text-center">
                    Notes - {capitalizeWords(collegeName)}
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
                                className="p-4 border rounded shadow-lg"
                            >
                                <div className="font-bold">
                                    {course.courseName}
                                </div>
                                <p>total branch : 10</p>
                                <p>total subject : 100</p>
                                <p>total notes : 100</p>
                                <div>
                                    <Link
                                        to={
                                            course.courseCode
                                                ? course.courseCode.toLowerCase()
                                                : '#'
                                        }
                                        className="text-blue-500 hover:underline"
                                        aria-label={`View details for ${course.courseName}`}
                                    >
                                        View
                                    </Link>
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

export default NotesPage;
