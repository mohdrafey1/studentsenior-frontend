import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CollegeLinks from '../components/Links/CollegeLinks';
import { api, API_KEY } from '../config/apiConfiguration.js';
import Collegelink2 from '../components/Links/CollegeLink2.jsx';
import { capitalizeWords } from '../utils/Capitalize.js';
import { toast } from 'react-toastify';
import useApiFetch from '../hooks/useApiFetch.js';

const NotesPage = () => {
    const { collegeName } = useParams();
    const [initialNotes, setInitialNotes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [collegeId, setcollegeId] = useState('');
    const { useFetch, loadingFetch } = useApiFetch();

    useEffect(() => {
        const FetchNotes = async () => {
            try {
                const data = await useFetch(api.notes);
                const collegeid = localStorage.getItem(getCollegeId());
                const selectedColleges = data.filter(
                    (item) => item.college === collegeid
                );
                if (selectedColleges.length > 0) {
                    setInitialNotes(selectedColleges);
                }
            } catch (error) {
                console.log('Error Fetching Notes : ', error);
                toast.log('Error Fetching Notes  ');
            }
        };
        FetchNotes();
        saveToLocalStorage();
    }, []);

    const colleges = [
        {
            id: '66cb9952a9c088fc11800714',
            name: 'Integral University',
        },
        {
            id: '66cba84ce0e3a7e528642837',
            name: 'MPEC Kanpur',
        },
        {
            id: '66d08aff784c9f07a53507b9',
            name: 'GCET Noida',
        },
        {
            id: '66d40833ec7d66559acbf24c',
            name: 'KMC UNIVERSITY',
        },
    ];

    const saveToLocalStorage = () => {
        colleges.forEach((data) => {
            const formattedCollegeName = data.name
                .replace(/\s+/g, '-')
                .toLowerCase();
            // Save to localStorage
            localStorage.setItem(formattedCollegeName, data.id);
        });
    };
    const getCollegeId = () => {
        const currentURL = window.location.href;
        const regex = /college\/([^\/]+)\//;
        const match = currentURL.match(regex);
        if (match) {
            setcollegeId(match[1]);
        }
        return match[1];
    };

    const courses = [...new Set(initialNotes.map((note) => note.target))];
    const branches = selectedCourse
        ? [
              ...new Set(
                  initialNotes
                      .filter((note) => note.course === selectedCourse)
                      .map((note) => note.branch)
              ),
          ]
        : [];

    const filteredNotes = initialNotes.filter(
        (note) =>
            (selectedBranch ? note.target === selectedBranch : true) &&
            (selectedCourse ? note.target === selectedCourse : true) &&
            (searchTerm
                ? note.subjectName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                : true)
    );
    return (
        <div className="container bg-gradient-to-t from-sky-200 to bg-white min-w-full ">
            <CollegeLinks />
            <div className="max-w-7xl mx-auto p-5 min-h-full">
                <h1 className="sm:text-3xl font-bold mb-2 text-center">
                    Notes - {capitalizeWords(collegeName)}
                </h1>
                <p className="italic text-center text-xs sm:text-base">
                    "Get concise and clear notes to boost your exam
                    preparation."
                </p>
                <br />
                <div className="flex flex-col justify-center sm:flex-row sm:items-center sm:space-x-4 mb-5">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-4 py-2 bg-sky-500 text-white rounded-md mb-2 sm:mb-0"
                    >
                        {showForm ? 'Close Form' : 'Add Note'}
                    </button>
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border rounded-md w-full sm:w-64 mb-2 sm:mb-0"
                    />
                    <select
                        value={selectedCourse}
                        onChange={(e) => {
                            setSelectedCourse(e.target.value);
                            setSelectedBranch(''); // Reset branch when course changes
                        }}
                        className="p-2 border rounded-md mb-2 sm:mb-0"
                    >
                        <option value="">All Courses</option>
                        {courses.map((course, index) => (
                            <option key={index} value={course}>
                                {course}
                            </option>
                        ))}
                    </select>
                    {/* <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="p-2 border rounded-md"
                        disabled={!selectedCourse} // Disable if no course selected
                    >
                        <option value="">All Branches</option>
                        {branches.map((branch) => (
                            <option key={branch} value={branch}>
                                {branch}
                            </option>
                        ))}
                    </select> */}
                </div>

                {showForm && (
                    <div className="mb-5 p-5 bg-white shadow-md rounded-md">
                        <p>
                            To add a new note, please fill out the{' '}
                            <a
                                href="https://forms.gle/your-google-form-link"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                Google Form
                            </a>
                            .
                        </p>
                    </div>
                )}

                {filteredNotes.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 lg:gap-6">
                        {filteredNotes.map((note) => (
                            <div
                                key={note._id}
                                className="bg-white p-5 shadow-md rounded-md flex flex-col"
                            >
                                <div className="flex-grow">
                                    {' '}
                                    <h2 className="text-base lg:text-xl font-bold mb-2">
                                        {note.subjectName}
                                    </h2>
                                    <p className="mb-1 lg:text-base text-sm">
                                        <strong>By:</strong> {note.by.username}
                                    </p>
                                    <p className="mb-1 lg:text-base text-sm">
                                        <strong>For:</strong> {note.target}
                                    </p>
                                    <p className="mb-1 lg:text-base text-sm">
                                        <strong>Description:</strong>{' '}
                                        {note.description}
                                    </p>
                                </div>
                                <div className="my-4">
                                    <a
                                        href={note.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white bg-sky-500 p-2 mt-2 rounded-md hover:bg-blue-600 lg:text-base text-sm"
                                    >
                                        View Notes
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="col-span-4 flex justify-center items-center py-10 w-full">
                        {loadingFetch ? (
                            <i className="fas fa-spinner fa-pulse fa-5x"></i>
                        ) : (
                            <p className="text-center text-gray-500 mt-5">
                                No notes found for the selected filters.
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center mb-8">
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
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="mb-4">
                    If you have any past year questions or notes, please share
                    them with us.
                </p>
                <a
                    href="mailto:your-email@example.com"
                    className="inline-block px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                    Click Here to Share
                </a>
            </div>

            {/* <Footer /> */}
            <Collegelink2 />
        </div>
    );
};

export default NotesPage;
