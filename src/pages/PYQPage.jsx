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
    const [selectedExamType, setSelectedExamType] = useState('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const papersPerPage = 6; // Number of papers per page

    const papers = [
        {
            subjectName: 'Engineering Mathematics I',
            subjectCode: 'MT101',
            semester: '1st',
            year: '2022-23',
            branch: 'CSE, EC, BME, EE, DSAI',
            course: 'B.Tech',
            examType: 'Midsem 1',
            link: 'https://drive.google.com/file/d/1gMkzGZ4d_dVtTGgJEWezjWd17_ovj78k/view?usp=drive_link',
        },
        {
            subjectName: 'Basic Electrical Engineering',
            subjectCode: 'EE102',
            semester: '1st',
            year: '2022-23',
            branch: 'CSE, EC, BME, EE, DSAI',
            course: 'B.Tech',
            examType: 'Midsem 1',
            link: 'https://drive.google.com/file/d/1O3FTyqig1MAruSue51a-nMpAfQLVt3W2/view?usp=drive_link',
        },
        {
            subjectName: 'Basics Electronics',
            subjectCode: 'EC101',
            semester: '1st',
            year: '2022-23',
            branch: 'CSE, EC, BME, EE, DSAI',
            course: 'B.Tech',
            examType: 'Midsem 1',
            link: 'https://drive.google.com/file/d/1H7TrAbA27mv-V_w4bGKQqjSbgZD_8zdw/view?usp=drive_link',
        },
        {
            subjectName: 'Physics',
            subjectCode: 'PY101',
            semester: '1st',
            year: '2022-23',
            branch: 'CSE, EC, BME, EE, DSAI',
            course: 'B.Tech',
            examType: 'Midsem 1',
            link: 'https://drive.google.com/file/d/19pRSOt5oZRd6-Pd7PmPQnOWESaKSWpOf/view?usp=drive_link',
        },
        {
            subjectName: 'Basics Professional Communication',
            subjectCode: 'LN101',
            semester: '1st',
            year: '2022-23',
            branch: 'CSE, EC, BME, EE, DSAI',
            course: 'B.Tech',
            examType: 'Midsem 1',
            link: 'https://drive.google.com/file/d/1gs9e4wlG-vxAk-xQRTkMCD8w8kFHayy_/view?usp=drive_link',
        },
        {
            subjectName: 'Engineering Mathematics I',
            subjectCode: 'MT101',
            semester: '1st',
            year: '2022-23',
            branch: 'CSE, EC, BME, EE, DSAI',
            course: 'B.Tech',
            examType: 'Midsem 2',
            link: 'https://drive.google.com/file/d/1rfrN_F5W7MLJJy5hrnaiGvUV2DYaaPsQ/view?usp=drive_link',
        },
        {
            subjectName: 'Basic Electrical Engineering',
            subjectCode: 'EE102',
            semester: '1st',
            year: '2022-23',
            branch: 'CSE, EC, BME, EE, DSAI',
            course: 'B.Tech',
            examType: 'Midsem 2',
            link: 'https://drive.google.com/file/d/1rivqTXfu8578Ui6ejaD_kGmD_iFHjCtC/view?usp=drive_link',
        },
        {
            subjectName: 'Basics Electronics',
            subjectCode: 'EC101',
            semester: '1st',
            year: '2022-23',
            branch: 'CSE, EC, BME, EE, DSAI',
            course: 'B.Tech',
            examType: 'Midsem 2',
            link: 'https://drive.google.com/file/d/1lTgjUHNfn-t0hle88YIor1zJvm3KtH1S/view?usp=drive_link',
        },
        {
            subjectName: 'Physics',
            subjectCode: 'PY101',
            semester: '1st',
            year: '2022-23',
            branch: 'CSE, EC, BME, EE, DSAI',
            course: 'B.Tech',
            examType: 'Midsem 2',
            link: 'https://drive.google.com/file/d/1j0--AIrpl1gQjULTsXObGnkiEObN6sxQ/view?usp=drive_link',
        },
        {
            subjectName: 'Basics Professional Communication',
            subjectCode: 'LN101',
            semester: '1st',
            year: '2022-23',
            branch: 'CSE, EC, BME, EE, DSAI',
            course: 'B.Tech',
            examType: 'Midsem 2',
            link: 'https://drive.google.com/file/d/1Y1gB6BqeJbQUSDPZl6_GkVKVW9PQHFWv/view?usp=drive_link',
        },
        {
            subjectName: 'Engineering Mathematics I',
            subjectCode: 'MT101',
            semester: '1st',
            year: '2022-23',
            branch: 'CSE, EC, BME, EE, DSAI',
            course: 'B.Tech',
            examType: 'Endsem',
            link: 'https://drive.google.com/file/d/1JX21WiQGADS9aJ7wcL0e1XgNUKfezfWG/view?usp=drive_link',
        },
        {
            subjectName: 'Basic Electrical Engineering',
            subjectCode: 'EE102',
            semester: '1st',
            year: '2022-23',
            branch: 'CSE, EC, BME, EE, DSAI',
            course: 'B.Tech',
            examType: 'Endsem',
            link: 'https://drive.google.com/file/d/1Jf6P9YAumEK5K9Y78JU0YFHWAYD9PcrA/view?usp=drive_link',
        },
        {
            subjectName: 'Physics',
            subjectCode: 'PY101',
            semester: '1st',
            year: '2022-23',
            branch: 'CSE, EC, BME, EE, DSAI',
            course: 'B.Tech',
            examType: 'Endsem',
            link: 'https://drive.google.com/file/d/1JIC7k5xweu9X2npoVqrTC3LaoanfJwCT/view?usp=drive_link',
        },
        {
            subjectName: 'Basics Professional Communication',
            subjectCode: 'LN101',
            semester: '1st',
            year: '2022-23',
            branch: 'CSE, EC, BME, EE, DSAI',
            course: 'B.Tech',
            examType: 'Endsem',
            link: 'https://drive.google.com/file/d/1JH6sK8Jua2vPUjxUXcA78AdHLTyNMXji/view?usp=drive_link',
        },
        {
            subjectName: 'Advertising Management',
            subjectCode: 'BM134',
            semester: '2nd',
            year: '2022-23',
            branch: 'BBA',
            course: 'BBA',
            examType: 'Midsem 1',
            link: 'https://drive.google.com/file/d/1ClM5DvScWe1_r73pOmenMNwaMzIbYs-5/view?usp=drive_link',
        },
        {
            subjectName: 'Business Finance',
            subjectCode: 'BM130',
            semester: '2nd',
            year: '2022-23',
            branch: 'BBA',
            course: 'BBA',
            examType: 'Midsem 1',
            link: 'https://drive.google.com/file/d/1CtR7pBMJbl1nH9oJsOZITfSKbp0hvTVm/view?usp=drive_link',
        },
        {
            subjectName: 'Business Mathematics',
            subjectCode: 'BM133',
            semester: '2nd',
            year: '2022-23',
            branch: 'BBA',
            course: 'BBA',
            examType: 'Midsem 1',
            link: 'https://drive.google.com/file/d/1CoZ5dNTcykZZA__57Lv95_ciaw7U1f9F/view?usp=drive_link',
        },
        {
            subjectName: 'First Aid and Health',
            subjectCode: 'z020201',
            semester: '2nd',
            year: '2022-23',
            branch: 'BBA',
            course: 'BBA',
            examType: 'Midsem 1',
            link: 'https://drive.google.com/file/d/1CyZ-qoIjTkBSVq6HTWEVbj3juR8Jcn2-/view?usp=drive_link',
        },
        {
            subjectName: 'Human Resource Development',
            subjectCode: 'BM131',
            semester: '2nd',
            year: '2022-23',
            branch: 'BBA',
            course: 'BBA',
            examType: 'Midsem 1',
            link: 'https://drive.google.com/file/d/1CqkUWmblXsK4IxtrSNwWM_lhdkgztqrO/view?usp=drive_link',
        },
        {
            subjectName: 'Marketing Theory and Practice',
            subjectCode: 'F020201TB',
            semester: '2nd',
            year: '2022-23',
            branch: 'BBA',
            course: 'BBA',
            examType: 'Midsem 1',
            link: 'https://drive.google.com/file/d/1Cpa93QPVyCxPf6k3DxuY-htGgzD834wK/view?usp=drive_link',
        },
        {
            subjectName: 'Organizational Behaviour',
            subjectCode: 'BM129',
            semester: '2nd',
            year: '2022-23',
            branch: 'BBA',
            course: 'BBA',
            examType: 'Midsem 1',
            link: 'https://drive.google.com/file/d/1CxxupP2ki_ymLGdoQl_T_wIpnYhhv89S/view?usp=drive_link',
        },
    ];

    const courses = [...new Set(papers.map((paper) => paper.course))];
    const branches = selectedCourse
        ? [
              ...new Set(
                  papers
                      .filter((paper) => paper.course === selectedCourse)
                      .flatMap((paper) =>
                          paper.branch.split(',').map((branch) => branch.trim())
                      )
              ),
          ]
        : [];
    const examTypes = [...new Set(papers.map((paper) => paper.examType))];

    const filteredPapers = papers.filter(
        (paper) =>
            (selectedYear ? paper.year === selectedYear : true) &&
            (selectedSemester ? paper.semester === selectedSemester : true) &&
            (selectedBranch
                ? paper.branch
                      .split(',')
                      .map((branch) => branch.trim())
                      .includes(selectedBranch)
                : true) &&
            (selectedCourse ? paper.course === selectedCourse : true) &&
            (selectedExamType ? paper.examType === selectedExamType : true) &&
            (searchTerm
                ? paper.subjectName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                : true)
    );

    // Pagination logic
    const indexOfLastPaper = currentPage * papersPerPage;
    const indexOfFirstPaper = indexOfLastPaper - papersPerPage;
    const currentPapers = filteredPapers.slice(
        indexOfFirstPaper,
        indexOfLastPaper
    );

    const totalPages = Math.ceil(filteredPapers.length / papersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                        <option value="2022-23">2022-23</option>
                        <option value="2023-24">2023-24</option>
                        <option value="2024-25">2024-25</option>
                    </select>
                    <select
                        className="p-2 border rounded-md w-full sm:w-auto"
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        value={selectedSemester}
                    >
                        <option value="">All Semesters</option>
                        <option value="1st">1st</option>
                        <option value="2nd">2nd</option>
                        <option value="3rd">3rd</option>
                        <option value="4th">4th</option>
                        <option value="5th">5th</option>
                        <option value="6th">6th</option>
                        <option value="7th">7th</option>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {currentPapers.map((paper, index) => (
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
                                <p className="mb-2">
                                    Exam Type: {paper.examType}
                                </p>
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
                            No papers found matching the criteria. Try adjusting
                            your filters.
                            <br /> If You have any PYQ paper, Please Provide us{' '}
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                        <ul className="flex">
                            {[...Array(totalPages).keys()].map((number) => (
                                <li
                                    key={number + 1}
                                    className={`px-3 py-1 mx-1 border rounded-md cursor-pointer ${
                                        currentPage === number + 1
                                            ? 'bg-sky-500 text-white'
                                            : 'bg-white text-gray-700'
                                    }`}
                                    onClick={() => paginate(number + 1)}
                                >
                                    {number + 1}
                                </li>
                            ))}
                        </ul>
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
                    href="#"
                    className="inline-block px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors duration-200"
                >
                    Buy Solved Question Paper
                </a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
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
            <Footer />
        </div>
    );
};

export default PYQPage;
