import React, { useState } from 'react';
import CollegeLinks from '../components/Links/CollegeLinks';
import Header from '../components/Header/Header';

const initialNotes = [
    {
        id: 1,
        title: 'Introduction to React',
        by: 'John Doe',
        for: 'B.Tech CSE',
        branch: 'CSE',
        course: 'B.Tech',
        description:
            'An overview of React basics including components, state, and props.',
        link: 'https://drive.google.com/file/d/1ex3EXAMPLE/view',
    },
    {
        id: 2,
        title: 'Data Structures and Algorithms',
        by: 'Jane Smith',
        for: 'B.Tech CSE',
        branch: 'CSE',
        course: 'B.Tech',
        description:
            'Detailed notes on various data structures and algorithms.',
        link: 'https://drive.google.com/file/d/2ex3EXAMPLE/view',
    },
    {
        id: 3,
        title: 'Operating Systems',
        by: 'Alice Johnson',
        for: 'B.Tech CSE',
        branch: 'CSE',
        course: 'B.Tech',
        description:
            'Comprehensive notes covering process management, memory management, and more.',
        link: 'https://drive.google.com/file/d/3ex3EXAMPLE/view',
    },
    {
        id: 4,
        title: 'Database Management Systems',
        by: 'Bob Brown',
        for: 'B.Tech ECE',
        branch: 'ECE',
        course: 'B.Tech',
        description:
            'Introduction to DBMS concepts, including SQL and NoSQL databases.',
        link: 'https://drive.google.com/file/d/4ex3EXAMPLE/view',
    },
    {
        id: 5,
        title: 'Computer Networks',
        by: 'Mary Davis',
        for: 'MBA IT',
        branch: 'IT',
        course: 'MBA',
        description:
            'Key concepts of computer networking, including TCP/IP and network protocols.',
        link: 'https://drive.google.com/file/d/5ex3EXAMPLE/view',
    },
];

const NotesPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const branches = [...new Set(initialNotes.map((note) => note.branch))];
    const courses = [...new Set(initialNotes.map((note) => note.course))];

    const filteredNotes = initialNotes.filter(
        (note) =>
            (selectedBranch ? note.branch === selectedBranch : true) &&
            (selectedCourse ? note.course === selectedCourse : true) &&
            (searchTerm
                ? note.title.toLowerCase().includes(searchTerm.toLowerCase())
                : true)
    );

    return (
        <div className="container bg-sky-100">
            <Header />
            <CollegeLinks />
            <div className="max-w-7xl mx-auto p-5 bg-sky-100 min-h-screen">
                <h1 className="text-3xl font-bold mb-5 text-center">Notes</h1>
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
                    />
                    <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="p-2 border rounded-md mb-2 sm:mb-0"
                    >
                        <option value="">All Branches</option>
                        {branches.map((branch) => (
                            <option key={branch} value={branch}>
                                {branch}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="p-2 border rounded-md"
                    >
                        <option value="">All Courses</option>
                        {courses.map((course) => (
                            <option key={course} value={course}>
                                {course}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredNotes.map((note) => (
                        <div
                            key={note.id}
                            className="bg-white p-5 shadow-md rounded-md"
                        >
                            <h2 className="text-xl font-bold mb-2">
                                {note.title}
                            </h2>
                            <p className="mb-1">
                                <strong>By:</strong> {note.by}
                            </p>
                            <p className="mb-1">
                                <strong>For:</strong> {note.for}
                            </p>
                            <p className="mb-1">
                                <strong>Description:</strong> {note.description}
                            </p>
                            <a
                                href={note.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                View Notes
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotesPage;
