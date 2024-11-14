import React, { useState, useEffect } from 'react';
import { Pagination } from '@nextui-org/react';
import CollegeLinks from '../components/Links/CollegeLinks';
import { useParams } from 'react-router-dom';
import { api } from '../config/apiConfiguration.js';
import Collegelink2 from '../components/Links/CollegeLink2.jsx';
import { capitalizeWords } from '../utils/Capitalize.js';
import { toast } from 'react-toastify';
import useApiFetch from '../hooks/useApiFetch.js';
import PyqCard from '../components/Cards/PyqCard.jsx';

const PYQPage = () => {
    const { collegeName } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedExamType, setSelectedExamType] = useState('');
    const [pyqs, setPyqs] = useState([]);
    const [collegeId, setCollegeId] = useState('');
    const { useFetch, loadingFetch } = useApiFetch();

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

    useEffect(() => {
        colleges.forEach((data) => {
            const formattedCollegeName = data.name
                .replace(/\s+/g, '-')
                .toLowerCase();
            localStorage.setItem(formattedCollegeName, data.id);
        });
    }, []);

    useEffect(() => {
        if (!collegeName) return;

        const formattedCollegeName = collegeName
            .replace(/\s+/g, '-')
            .toLowerCase();
        const savedCollegeId = localStorage.getItem(formattedCollegeName);

        if (savedCollegeId) {
            setCollegeId(savedCollegeId);
        }
    }, [collegeName]);

    useEffect(() => {
        if (!collegeId) return;

        const fetchPYQs = async () => {
            try {
                const url = `${api.pyq}/all/${collegeId}`;
                const data = await useFetch(url);
                setPyqs(data);
            } catch (error) {
                console.error('Error fetching PYQs:', error);
                toast.error('Error fetching PYQs');
            }
        };

        fetchPYQs();
    }, [collegeId]);

    // Filter options
    const courses = [...new Set(pyqs.map((paper) => paper.course))];
    const branches = selectedCourse
        ? [
              ...new Set(
                  pyqs
                      .filter((paper) => paper.course === selectedCourse)
                      .flatMap((paper) => paper.branch)
              ),
          ]
        : [];
    const examTypes = [...new Set(pyqs.map((paper) => paper.examType))];

    const filteredPapers = pyqs.filter((paper) => {
        return (
            (selectedYear ? paper.year === selectedYear : true) &&
            (selectedSemester ? paper.semester === selectedSemester : true) &&
            (selectedBranch ? paper.branch.includes(selectedBranch) : true) &&
            (selectedCourse ? paper.course === selectedCourse : true) &&
            (selectedExamType ? paper.examType === selectedExamType : true) &&
            (searchTerm
                ? paper.subjectName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                : true)
        );
    });

    // Pagination logic
    const [currentPage, setCurrentPage] = useState(1);
    const papersPerPage = 6;
    const indexOfLastPaper = currentPage * papersPerPage;
    const indexOfFirstPaper = indexOfLastPaper - papersPerPage;
    const currentPapers = filteredPapers.slice(
        indexOfFirstPaper,
        indexOfLastPaper
    );
    const totalPages = Math.ceil(filteredPapers.length / papersPerPage);

    return (
        <div className="container bg-gradient-to-t from-sky-200 to bg-white min-h-screen min-w-full">
            <CollegeLinks />
            <div className="max-w-7xl mx-auto p-4 md:p-8">
                <h1 className="sm:text-3xl font-bold mb-5 text-center">
                    Previous Year Question Paper <br />
                    <span>( </span>
                    {capitalizeWords(collegeName)} <span>)</span>
                </h1>

                <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-2 sm:gap-4 mb-4">
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
                        <option value="2021-2022">2021-2022</option>
                        <option value="2022-2023">2022-2023</option>
                        <option value="2023-2024">2023-2024</option>
                        <option value="2024-2025">2024-2025</option>
                    </select>
                    <select
                        className="p-2 border rounded-md w-full sm:w-auto"
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        value={selectedSemester}
                    >
                        <option value="">All Semesters</option>
                        <option value="1">1st</option>
                        <option value="2">2nd</option>
                        <option value="3">3rd</option>
                        <option value="4">4th</option>
                        <option value="5">5th</option>
                        <option value="6">6th</option>
                        <option value="7">7th</option>
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
                        disabled={!selectedCourse}
                    >
                        <option value="">All Branches</option>
                        {branches.map((branch) => (
                            <option key={branch} value={branch}>
                                {branch}
                            </option>
                        ))}
                    </select>
                    <select
                        className="p-2 border rounded-md w-full sm:w-auto"
                        onChange={(e) => setSelectedExamType(e.target.value)}
                        value={selectedExamType}
                    >
                        <option value="">All Exam Types</option>
                        {examTypes.map((examType) => (
                            <option key={examType} value={examType}>
                                {examType}
                            </option>
                        ))}
                    </select>
                </div>

                {currentPapers.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3  gap-2 lg:gap-6">
                        <PyqCard Pyqs={currentPapers} />
                    </div>
                ) : (
                    <>
                        <div className="col-span-4 flex justify-center items-center py-10 w-full">
                            {loadingFetch ? (
                                <i className="fas fa-spinner fa-pulse fa-5x"></i>
                            ) : (
                                <div className="text-center p-4 bg-white rounded-lg shadow-md">
                                    <p className="text-xl font-semibold text-gray-700">
                                        No papers found matching the criteria.
                                        Try adjusting your filters.
                                        <br /> If You have any PYQ paper, Please
                                        Provide us{' '}
                                        <a
                                            href="https://docs.google.com/forms/d/e/1FAIpQLSebji3Hfr-6Volc7KJwk4entnuXH803AAVF1QnHYGPK7AtjPw/viewform?usp=sf_link"
                                            className="text-blue-500"
                                            target="_blank"
                                        >
                                            Click
                                        </a>
                                    </p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                <div className="flex justify-center mt-6">
                    <Pagination
                        showControls
                        color="success"
                        total={totalPages}
                        initialPage={1}
                        onChange={(page) => setCurrentPage(page)}
                        className="pagination"
                    />
                </div>
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
            <div className="bg-white p-6 rounded-lg shadow-md text-center mb-8">
                <p className="mb-4">
                    If you have any PYQs or notes, please share them with us.
                </p>
                <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSebji3Hfr-6Volc7KJwk4entnuXH803AAVF1QnHYGPK7AtjPw/viewform?usp=sf_link"
                    className="inline-block px-6 py-3 bg-sky-500 text-white font-bold rounded-lg hover transition-colors duration-200"
                    target="_blank"
                >
                    Click Here To Share PYQs
                </a>
            </div>
            {/* <Footer /> */}
            <Collegelink2 />
        </div>
    );
};

export default PYQPage;
