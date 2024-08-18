import React, { useState } from 'react';
import CollegeLinks from '../components/Links/CollegeLinks';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const PYQPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');

    const papers = [
        {
            subjectName: 'Mathematics I',
            subjectCode: 'MATH101',
            semester: '1st',
            year: '2021',
            branch: 'CSE',
            course: 'B.Tech',
            link: 'https://drive.google.com/your-link-to-pdf',
        },
        {
            subjectName: 'Physics',
            subjectCode: 'PHYS101',
            semester: '1st',
            year: '2020',
            branch: 'CSE',
            course: 'B.Tech',
            link: 'https://drive.google.com/your-link-to-pdf',
        },
        {
            subjectName: 'Management Basics',
            subjectCode: 'MGMT101',
            semester: '1st',
            year: '2021',
            branch: 'IT',
            course: 'BBA',
            link: 'https://drive.google.com/your-link-to-pdf',
        },
        // Add more papers as needed
    ];

    // Extract unique courses and branches based on the selected course
    const courses = [...new Set(papers.map((paper) => paper.course))];
    const branches = selectedCourse
        ? [
              ...new Set(
                  papers
                      .filter((paper) => paper.course === selectedCourse)
                      .map((paper) => paper.branch)
              ),
          ]
        : [];

    const filteredPapers = papers.filter(
        (paper) =>
            (selectedYear ? paper.year === selectedYear : true) &&
            (selectedSemester ? paper.semester === selectedSemester : true) &&
            (selectedBranch ? paper.branch === selectedBranch : true) &&
            (selectedCourse ? paper.course === selectedCourse : true) &&
            (searchTerm
                ? paper.subjectName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                : true)
    );

    return (
        <div className="container bg-sky-100 min-h-screen">
            <Header />
            <CollegeLinks />
            <div className="max-w-7xl mx-auto p-4 md:p-8 bg-sky-100">
                <h1 className="text-3xl font-bold mb-5 text-center">
                    Previous Year Questions (PYQ)
                </h1>
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by Subject Name"
                        className="p-2 border rounded-md w-full sm:w-auto"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="p-2 border rounded-md w-full sm:w-auto"
                        onChange={(e) => setSelectedYear(e.target.value)}
                        value={selectedYear}
                    >
                        <option value="">All Years</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                        <option value="2019">2019</option>
                    </select>
                    <select
                        className="p-2 border rounded-md w-full sm:w-auto"
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        value={selectedSemester}
                    >
                        <option value="">All Semesters</option>
                        <option value="1st">1st</option>
                        <option value="2nd">2nd</option>
                    </select>
                    <select
                        className="p-2 border rounded-md w-full sm:w-auto"
                        onChange={(e) => {
                            setSelectedCourse(e.target.value);
                            setSelectedBranch(''); // Reset branch when course changes
                        }}
                        value={selectedCourse}
                    >
                        <option value="">All Courses</option>
                        {courses.map((course) => (
                            <option key={course} value={course}>
                                {course}
                            </option>
                        ))}
                    </select>
                    <select
                        className="p-2 border rounded-md w-full sm:w-auto"
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        value={selectedBranch}
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

                {filteredPapers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredPapers.map((paper, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-lg shadow-md"
                            >
                                <h2 className="text-xl font-bold mb-2">
                                    {paper.subjectName}
                                </h2>
                                <p className="mb-2">
                                    Subject Code: {paper.subjectCode}
                                </p>
                                <p className="mb-2">
                                    Semester: {paper.semester}
                                </p>
                                <p className="mb-2">Year: {paper.year}</p>
                                <a
                                    href={paper.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-4 py-2 mt-2 bg-sky-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                >
                                    View PDF
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-4 bg-white rounded-lg shadow-md">
                        <p className="text-xl font-semibold text-gray-700">
                            No papers found matching the criteria. Please try
                            adjusting your filters.
                        </p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default PYQPage;
