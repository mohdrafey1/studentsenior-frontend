import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSubjects } from '../../redux/slices/subjectSlice.js';
import { capitalizeWords } from '../../utils/Capitalize.js';
import DetailPageNavbar from '../../DetailPages/DetailPageNavbar.jsx';
import Seo from '../SEO/Seo.jsx';
import { CompactSpinner } from '../../ui/Spinner.jsx';

function Subjects() {
    const { collegeName, branchCode, courseCode } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [activeSemester, setActiveSemester] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();

    const {
        subjects,
        loading: subjectsLoading,
        error: subjectsError,
    } = useSelector((state) => state.subjects || {});

    const [groupedSubjects, setGroupedSubjects] = useState({});

    useEffect(() => {
        dispatch(fetchSubjects(branchCode));
    }, [courseCode, branchCode, collegeName]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const semester = queryParams.get('semester');
        if (semester) {
            setActiveSemester(semester);
        } else if (!activeSemester) {
            setActiveSemester('1');
        }
    }, [location.search, activeSemester]);

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

            const semesters = Object.keys(grouped).sort((a, b) => a - b);
            if (semesters.length > 0 && !activeSemester) {
                setActiveSemester(semesters[0]);
            }
        } else {
            setGroupedSubjects({});
        }
    }, [subjects, activeSemester]);

    const handleSemesterChange = (semester) => {
        setActiveSemester(semester);
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('semester', semester);
        navigate(`${location.pathname}?${queryParams.toString()}`);
    };

    const filteredSubjects = Object.keys(groupedSubjects).reduce(
        (acc, semester) => {
            acc[semester] = groupedSubjects[semester].filter(
                (subject) =>
                    subject.subjectName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    subject.subjectCode
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
            return acc;
        },
        {}
    );

    if (subjectsLoading) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <DetailPageNavbar path={`college/${collegeName}/resources`} />
                <div className='col-span-full flex justify-center h-screen py-12 w-full'>
                    <div className='text-center'>
                        <CompactSpinner />
                    </div>
                </div>
            </div>
        );
    }

    if (subjectsError) {
        return (
            <p className='text-center text-red-500'>Error: {subjectsError}</p>
        );
    }

    return (
        <div className='container mx-auto p-4'>
            <DetailPageNavbar path={`${collegeName}/resources/${courseCode}`} />
            <h1 className='text-2xl font-bold text-center mb-2'>
                {capitalizeWords(collegeName)}: {branchCode.toUpperCase()}
            </h1>
            <Seo
                title={`${capitalizeWords(
                    collegeName
                )}: ${branchCode.toUpperCase()}`}
                desc={Object.keys(groupedSubjects)
                    .slice(0, 5)
                    .sort((a, b) => a - b)
                    .map((semester) => semester)
                    .join(', ')}
            />

            <h2 className='text-xs sm:text-lg text-center mb-4'>
                Semester subjects or Code may vary across different colleges,
                please adjust accordingly
            </h2>

            {/* Semester Tabs */}
            <div className='flex justify-start lg:justify-center space-x-4 mb-6 pb-2 overflow-x-scroll'>
                {Object.keys(groupedSubjects)
                    .sort((a, b) => a - b)
                    .map((semester) => (
                        <button
                            key={semester}
                            className={`min-w-16 px-2 sm:px-4 py-2 rounded ${
                                activeSemester === semester
                                    ? 'bg-sky-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                            } hover:bg-sky-400 transition duration-200`}
                            onClick={() => handleSemesterChange(semester)}
                        >
                            Sem {semester}
                        </button>
                    ))}
            </div>

            {/* Search Input */}
            <div className='mb-2 flex justify-center'>
                <input
                    type='text'
                    placeholder='Search by Subject Name or Code'
                    className='border border-gray-300 px-4 py-2 rounded-lg shadow-md w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-sky-500'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Subjects Table */}
            {activeSemester && filteredSubjects[activeSemester]?.length > 0 ? (
                <div className='overflow-x-auto lg:mx-20 xl:mx-40 min-h-screen'>
                    <table className='table-auto w-full bg-white rounded-lg shadow-md overflow-hidden'>
                        <thead className='bg-sky-500 text-white'>
                            <tr>
                                <th className='border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2 text-left'>
                                    Subject Name
                                </th>
                                <th className='border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2 text-left'>
                                    Code
                                </th>
                                <th className='border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2 text-left'>
                                    Total Notes / Pyqs
                                </th>
                                <th className='border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2 text-center'>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubjects[activeSemester].map((subject) => (
                                <tr
                                    key={subject._id}
                                    className='hover:bg-gray-100'
                                >
                                    <td className='border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2'>
                                        {subject.subjectName}
                                    </td>
                                    <td className='border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2'>
                                        {subject.subjectCode}
                                    </td>
                                    <td className='border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2'>
                                        {subject.totalNotes || 0} /{' '}
                                        {subject.totalPyqs || 0}
                                    </td>
                                    <td className='border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2 text-center'>
                                        <Link
                                            to={`notes/${subject.subjectCode.toLowerCase()}`}
                                            className='px-1 sm:px-3 py-1 bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors duration-200 mx-1'
                                            aria-label={`View Notes for ${subject.subjectName}`}
                                        >
                                            Notes
                                        </Link>
                                        <Link
                                            to={`pyqs/${subject.subjectCode.toLowerCase()}`}
                                            state={{ subjectId: subject._id }}
                                            className='px-1 sm:px-3 py-1 bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors duration-200 mx-1'
                                            aria-label={`View PYQs for ${subject.subjectName}`}
                                        >
                                            Pyqs
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className='text-center text-gray-600'>
                    No subjects available for Semester {activeSemester}.
                </p>
            )}
        </div>
    );
}

export default Subjects;
