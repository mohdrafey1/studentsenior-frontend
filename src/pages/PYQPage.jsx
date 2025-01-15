import React, { useState, useEffect } from 'react';
import { Pagination } from '@nextui-org/react';
import CollegeLinks from '../components/Links/CollegeLinks';
import { Link, useParams } from 'react-router-dom';
import Collegelink2 from '../components/Links/CollegeLink2.jsx';
import { capitalizeWords } from '../utils/Capitalize.js';
import PyqCard from '../components/Cards/PyqCard.jsx';
import pyq from '../../public/assets/pyq.png';
import notesandpyq from '../../public/assets/notes&pyq.png';
import request from '../../public/assets/request.png';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPyqs } from '../redux/slices/pyqSlice.js';
import { useCollegeId } from '../hooks/useCollegeId.js';

const PYQPage = () => {
    const { collegeName } = useParams();
    const collegeId = useCollegeId(collegeName);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedExamType, setSelectedExamType] = useState('');

    const dispatch = useDispatch();
    const { pyqs, loading } = useSelector((state) => state.pyqs || {});

    useEffect(() => {
        dispatch(fetchPyqs(collegeId));
    }, [collegeId]);

    // Extract unique values for filters
    const courses = [
        ...new Set(
            pyqs.map((paper) => paper.subject?.branch?.course?.courseName)
        ),
    ];
    const branches = selectedCourse
        ? [
              ...new Set(
                  pyqs
                      .filter(
                          (paper) =>
                              paper.subject.branch?.course?.courseName ===
                              selectedCourse
                      )
                      .map((paper) => paper.subject?.branch?.branchName)
              ),
          ]
        : [];
    const examTypes = [...new Set(pyqs.map((paper) => paper.examType))];

    // Filtered papers
    const filteredPapers = pyqs.filter((paper) => {
        return (
            (selectedYear ? paper.year === selectedYear : true) &&
            (selectedSemester
                ? paper.subject?.semester === Number(selectedSemester)
                : true) &&
            (selectedBranch
                ? paper.subject?.branch?.branchName === selectedBranch
                : true) &&
            (selectedCourse
                ? paper.subject?.branch?.course.courseName === selectedCourse
                : true) &&
            (selectedExamType ? paper.examType === selectedExamType : true) &&
            (searchTerm
                ? paper.subject.subjectName
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
                <h1 className="text-lg sm:text-3xl font-bold mb-5 text-center">
                    Previous Year Question Paper <br />
                    <span>( </span>
                    {capitalizeWords(collegeName)} <span>)</span>
                </h1>

                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 sm:justify-center gap-2 sm:gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search by Subject Name"
                        className="p-2 px-3 border rounded-3xl w-full sm:w-auto"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="p-2 px-3 border rounded-3xl w-full sm:w-auto"
                        onChange={(e) => setSelectedYear(e.target.value)}
                        value={selectedYear}
                    >
                        <option value="">All Years</option>
                        <option value="2021-22">2021-2022</option>
                        <option value="2022-23">2022-2023</option>
                        <option value="2023-24">2023-2024</option>
                        <option value="2024-25">2024-2025</option>
                    </select>
                    <select
                        className="p-2 px-3 border rounded-3xl w-full sm:w-auto"
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
                        className="p-2 px-3 border rounded-3xl w-full sm:w-auto"
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
                        className="p-2 px-3 border rounded-3xl w-full sm:w-auto"
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
                        className="p-2 px-3 border rounded-3xl w-full sm:w-auto"
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
                    <div className="col-span-4 flex justify-center items-center py-10 w-full">
                        {loading ? (
                            <i className="fas fa-spinner fa-pulse fa-5x"></i>
                        ) : (
                            <div className="text-center p-4 bg-white rounded-lg shadow-3xl">
                                <p className="text-xl font-semibold text-gray-700">
                                    No papers found matching the criteria. Try
                                    adjusting your filters.
                                    <br /> If You have any PYQ paper, Please
                                    Provide us{' '}
                                    <Link
                                        to={`/${collegeName}/resources`}
                                        className="text-blue-500"
                                    >
                                        Click
                                    </Link>
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-center mt-6">
                    <Pagination
                        showControls
                        color="primary"
                        total={totalPages}
                        initialPage={1}
                        onChange={(page) => setCurrentPage(page)}
                        className="pagination"
                        size="lg"
                        variant="flat"
                    />
                </div>
            </div>
            <div className="lg:flex w-full justify-center gap-5">
                <div className="bg-white p-6 rounded-lg shadow-3xl text-center mb-8 lg:w-80 lg:m-0 lg:mb-4 m-4">
                    <img src={pyq} alt="pyq sell" className="w-36 mx-auto" />
                    <p className="mb-4">
                        Get solved questions for just ₹29. <br />
                        <a className="text-sm text-gray-500">
                            Terms and conditions apply.
                        </a>
                    </p>
                    <a
                        target="_blank"
                        href="https://forms.gle/NwFvj1Jz5gxvmHfdA"
                        className="inline-block px-6 py-3 w-full bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors duration-200"
                    >
                        Buy Solved Question Paper
                    </a>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-3xl text-center mb-8 lg:w-80 lg:m-0 lg:mb-4 m-4">
                    <img
                        src={notesandpyq}
                        alt="pyq upload"
                        className="w-36 mx-auto"
                    />
                    <p className="mb-4">
                        If you have any PYQs or notes, please share them with
                        us.
                    </p>
                    <Link
                        to={`/${collegeName}/resources`}
                        className="inline-block px-6 py-3 w-full bg-sky-500 text-white font-bold rounded-lg hover transition-colors duration-200"
                    >
                        Click Here To Share PYQs
                    </Link>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-3xl text-center mb-8 lg:w-80 lg:m-0 lg:mb-4 m-4">
                    <img
                        src={request}
                        alt="request pyq "
                        className="w-36 mx-auto p-4"
                    />
                    <p className="mb-4">
                        {/* Request a Previous Year's Question Paper<br /> */}
                        <a className="text-sm text-gray-500">
                            Can't find the PYQ you need? Request it here, and
                            we'll send it to you shortly!
                        </a>
                    </p>
                    <Link
                        to="/request-pyq"
                        className="inline-block px-6 py-3 w-full bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors duration-200"
                    >
                        Request PYQ
                    </Link>
                </div>
            </div>
            <Collegelink2 />
        </div>
    );
};

export default PYQPage;
