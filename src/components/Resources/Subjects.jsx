import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBranches } from '../../redux/slices/branchSlice.js';
import { fetchCourses } from '../../redux/slices/courseSlice.js';
import { fetchSubjects } from '../../redux/slices/subjectSlice.js';
import { toast } from 'react-toastify';

function Subjects() {
    const { branchCode, courseCode } = useParams();
    const [activeSemester, setActiveSemester] = useState(null);
    const dispatch = useDispatch();

    const {
        branches,
        loading: branchesLoading,
        error: branchesError,
    } = useSelector((state) => state.branches || {});
    const {
        courses,
        loading: coursesLoading,
        error: coursesError,
    } = useSelector((state) => state.courses || {});
    const {
        subjects,
        loading: subjectsLoading,
        error: subjectsError,
    } = useSelector((state) => state.subjects || {});

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [groupedSubjects, setGroupedSubjects] = useState({});

    // Fetch courses if not already fetched
    useEffect(() => {
        if (!courses.length) {
            dispatch(fetchCourses());
        }
    }, [dispatch, courses.length]);

    // Find selected course when courses are fetched
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
    }, [courses, courseCode]);

    // Fetch branches when selected course is found
    useEffect(() => {
        if (selectedCourse && !branches.length) {
            dispatch(fetchBranches(selectedCourse._id));
        }
    }, [selectedCourse, dispatch, branches.length]);

    // Find selected branch when branches are fetched
    useEffect(() => {
        if (branches.length) {
            const foundBranch = branches.find(
                (branch) =>
                    branch.branchCode.toLowerCase() === branchCode.toLowerCase()
            );
            if (foundBranch) {
                setSelectedBranch(foundBranch);
            } else {
                toast.error('Branch not found for branchCode');
            }
        }
    }, [branches, branchCode]);

    console.log(selectedBranch);

    // Fetch subjects when selected branch is found
    useEffect(() => {
        if (selectedBranch) {
            dispatch(fetchSubjects(selectedBranch._id));
        }
    }, [selectedBranch]);

    // Group subjects by semester
    useEffect(() => {
        if (subjects.length) {
            const grouped = subjects.reduce((acc, subject) => {
                const { semester } = subject;
                if (!acc[semester]) {
                    acc[semester] = [];
                }
                acc[semester].push(subject);
                return acc;
            }, {});
            setGroupedSubjects(grouped);

            // Set the first semester as the default active semester
            const semesters = Object.keys(grouped).sort((a, b) => a - b);
            if (semesters.length > 0) {
                setActiveSemester(semesters[0]);
            }
        }
    }, [subjects]);

    if (subjectsLoading || coursesLoading || branchesLoading) {
        return <p className="text-center">Loading subjects...</p>;
    }

    if (subjectsError || coursesError || branchesError) {
        return (
            <p className="text-center text-red-500">
                Error: {subjectsError || coursesError || branchesError}
            </p>
        );
    }

    if (!selectedBranch) {
        return <p className="text-center text-red-500">Branch not found!</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-4">
                Subjects for Branch: {branchCode}
            </h1>

            {/* Semester Tabs */}
            <div className="flex justify-start lg:justify-center space-x-4 mb-6 overflow-x-scroll">
                {Object.keys(groupedSubjects)
                    .sort((a, b) => a - b)
                    .map((semester) => (
                        <button
                            key={semester}
                            className={`min-w-16 px-2 sm:px-4 py-2 rounded ${
                                activeSemester === semester
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                            } hover:bg-blue-400 transition duration-200`}
                            onClick={() => setActiveSemester(semester)}
                        >
                            Sem {semester}
                        </button>
                    ))}
            </div>

            {/* Subjects for Active Semester */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {activeSemester &&
                groupedSubjects[activeSemester]?.length > 0 ? (
                    groupedSubjects[activeSemester].map((subject) => (
                        <div
                            key={subject._id}
                            className="border p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
                        >
                            <div>
                                <h2 className="text-lg font-semibold mb-2 text-gray-800">
                                    {subject.subjectName}
                                </h2>
                                <p className="text-sm text-gray-600 mb-1">
                                    Code:{' '}
                                    <span className="font-medium">
                                        {subject.subjectCode}
                                    </span>
                                </p>
                                <p className="text-sm text-gray-600 mb-4">
                                    Total Notes:{' '}
                                    <span className="font-medium">100</span>
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <Link
                                    to={`notes/${subject.subjectCode.toLowerCase()}`}
                                    state={{ subjectId: subject._id }}
                                    className="px-4 py-2 bg-sky-500 text-white font-medium text-center rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                    aria-label={`View details for ${subject.subjectName}`}
                                >
                                    Notes
                                </Link>
                                <Link
                                    to={`pyqs/${subject.subjectCode.toLowerCase()}`}
                                    state={{ subjectId: subject._id }}
                                    className=" px-4 py-2 bg-sky-500 text-white font-medium text-center rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                    aria-label={`View details for ${subject.subjectName}`}
                                >
                                    Pyq
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600">
                        No subjects available for Semester {activeSemester}.
                    </p>
                )}
            </div>
        </div>
    );
}

export default Subjects;
