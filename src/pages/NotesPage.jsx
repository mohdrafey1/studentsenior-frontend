import React, { useState, useEffect } from 'react';
import CollegeLinks from '../components/Links/CollegeLinks';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { API_BASE_URL, API_KEY } from '../config/apiConfiguration.js';
import Collegelink2 from '../components/Links/CollegeLink2.jsx';

const NotesPage = () => {
    const [initialNotes, setInitialNotes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setisLoading] = useState(true);
    const [collegeId, setcollegeId] = useState('');

    useEffect(() => {
        const FetchNotes = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/notes`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY,
                    },
                });
                setisLoading(false);
                const data = await response.json();
                const collegeid = localStorage.getItem(getCollegeId());
                const selectedColleges = data.filter(
                    (item) => item.college === collegeid
                );
                if (selectedColleges.length > 0) {
                    setInitialNotes(selectedColleges);
                }
            } catch (error) {
                console.log('Error Fetching Notes : ', error);
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
            name: 'MPGI Kanpur',
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

    const courses = [...new Set(initialNotes.map((note) => note.course))];
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
            (selectedBranch ? note.branch === selectedBranch : true) &&
            (selectedCourse ? note.course === selectedCourse : true) &&
            (searchTerm
                ? note.title.toLowerCase().includes(searchTerm.toLowerCase())
                : true)
    );
    return (
        <div className="container bg-sky-100 min-w-full ">
            <Header />
            <CollegeLinks />
            <div className="max-w-7xl mx-auto p-5 bg-sky-100 min-h-full">
                <h1 className="text-3xl font-bold mb-5 text-center">Notes</h1>
                <p className="italic text-center">
                    "Get concise and clear notes to boost your exam
                    preparation."
                </p>
                <br />
                <div className="flex flex-col justify-center sm:flex-row sm:items-center sm:space-x-4 mb-5">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md mb-2 sm:mb-0"
                    >
                        {showForm ? 'Close Form' : 'Add Note'}
                    </button>
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border rounded-md w-full sm:w-64 mb-2 sm:mb-0"
                        disabled
                    />
                    <select
                        value={selectedCourse}
                        onChange={(e) => {
                            setSelectedCourse(e.target.value);
                            setSelectedBranch(''); // Reset branch when course changes
                        }}
                        className="p-2 border rounded-md mb-2 sm:mb-0"
                        disabled
                    >
                        <option value="">All Courses</option>
                        {courses.map((course, index) => (
                            <option key={index} value={course}>
                                {course}
                            </option>
                        ))}
                    </select>
                    <select
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
                    </select>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredNotes.map((note) => (
                            <div
                                key={note._id}
                                className="bg-white p-5 shadow-md rounded-md"
                            >
                                <h2 className="text-xl font-bold mb-2">
                                    {note.subjectName}
                                </h2>
                                <p className="mb-1">
                                    <strong>By:</strong> {note.by.username}
                                </p>
                                <p className="mb-1">
                                    <strong>For:</strong> {note.target}
                                </p>
                                <p className="mb-1">
                                    <strong>Description:</strong>{' '}
                                    {note.description}
                                </p>
                                <br />
                                <a
                                    href={note.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white bg-blue-500 p-2 mt-2 rounded-md hover:bg-blue-600"
                                >
                                    View Notes
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div
                            className={`${
                                isLoading ? 'block' : 'hidden'
                            } text-center`}
                        >
                            <div role="status">
                                <svg
                                    aria-hidden="true"
                                    className="inline w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                    />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                        <br />
                        {!isLoading && filteredNotes.length == 0 ? (
                            <p className="text-center text-gray-500 mt-5">
                                No notes found for the selected filters.
                            </p>
                        ) : null}
                    </>
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
                    href="https://docs.google.com/forms/d/e/1FAIpQLSebji3Hfr-6Volc7KJwk4entnuXH803AAVF1QnHYGPK7AtjPw/viewform?usp=sf_link"
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

            <Footer />
            <Collegelink2 />
        </div>
    );
};

export default NotesPage;
