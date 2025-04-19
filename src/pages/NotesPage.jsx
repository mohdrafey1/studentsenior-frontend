import React, { useState, useEffect } from 'react';
import { Pagination } from '@nextui-org/react';
import CollegeLinks from '../components/Links/CollegeLinks';
import { Link, useParams } from 'react-router-dom';
import Collegelink2 from '../components/Links/CollegeLink2.jsx';
import { capitalizeWords } from '../utils/Capitalize.js';
import NotesCard from '../components/Cards/NotesCard.jsx';
import notesandpyq from '/assets/notes&pyq.png';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes } from '../redux/slices/NotesSlice.js';
import { useCollegeId } from '../hooks/useCollegeId.js';
import Seo from '../components/SEO/Seo.jsx';
import useRequireLogin from '../hooks/useRequireLogin.js';
import Modal from '../utils/Dialog.jsx';
import Button from '../ui/Button.jsx';
import AddNotes from '../components/Resources/AddNotes.jsx';
import { api } from '../config/apiConfiguration.js';
import { toast } from 'react-toastify';

const NotesPage = () => {
    const { collegeName } = useParams();
    const collegeId = useCollegeId(collegeName);
    const requireLogin = useRequireLogin();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const dispatch = useDispatch();
    const { notes, loading } = useSelector((state) => state.notes || {});

    useEffect(() => {
        dispatch(fetchNotes(collegeId));
    }, [collegeId]);

    const handleOpenAddNoteModal = () => {
        requireLogin(() => setModalOpen(true));
    };

    const handleAddNote = async (formData) => {
        try {
            setSubmitting(true);
            const response = await fetch(`${api.subjectNotes}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (data.success === false) {
                toast.error(data.message);
                return;
            }
            toast.success(data.message);
            setSubmitting(false);
            setModalOpen(false);
        } catch (err) {
            console.error(err);
            toast.error('Failed to add note.');
            setSubmitting(false);
        } finally {
            setSubmitting(false);
        }
    };

    // Extract unique values for filters
    const courses = [
        ...new Set(
            notes.map((note) => note.subject?.branch?.course?.courseName)
        ),
    ];
    const branches = selectedCourse
        ? [
              ...new Set(
                  notes
                      .filter(
                          (note) =>
                              note.subject.branch?.course?.courseName ===
                              selectedCourse
                      )
                      .map((note) => note.subject?.branch?.branchName)
              ),
          ]
        : [];
    const examTypes = [...new Set(notes.map((note) => note.examType))];

    // Filtered notes
    const filterednotes = notes.filter((note) => {
        return (
            (selectedSemester
                ? note.subject?.semester === Number(selectedSemester)
                : true) &&
            (selectedBranch
                ? note.subject?.branch?.branchName === selectedBranch
                : true) &&
            (selectedCourse
                ? note.subject?.branch?.course?.courseName === selectedCourse
                : true) &&
            (searchTerm
                ? note.subject.subjectName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                : true)
        );
    });

    // Pagination logic
    const [currentPage, setCurrentPage] = useState(1);
    const notesPerPage = 8;
    const indexOfLastnote = currentPage * notesPerPage;
    const indexOfFirstnote = indexOfLastnote - notesPerPage;
    const currentnotes = filterednotes.slice(indexOfFirstnote, indexOfLastnote);
    const totalPages = Math.ceil(filterednotes.length / notesPerPage);

    return (
        <div className='container bg-gradient-to-t from-sky-200 to bg-white min-h-screen min-w-full'>
            <CollegeLinks />
            <div className='max-w-7xl mx-auto px-4'>
                <div className='mb-8'>
                    <h1 className='text-lg sm:text-3xl font-bold mb-2 text-center'>
                        Notes - {capitalizeWords(collegeName)}
                    </h1>
                    <p className='italic text-center text-xs sm:text-base'>
                        Get concise and clear notes to boost your exam
                        preparation."
                    </p>
                    <Seo
                        title={`${capitalizeWords(collegeName)} - Notes`}
                        desc='Access past year question notes, understand trends, improve strategies, and ace exams confidently with a well-organized, easy-to-use database for students.'
                    />
                    <div className='flex items-center justify-center mt-4'>
                        <Button
                            onClick={handleOpenAddNoteModal}
                            className='flex items-center gap-2'
                        >
                            <i className='fa-solid fa-plus'></i> Add Notes
                        </Button>
                    </div>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-4 sm:justify-center gap-2 sm:gap-4 mb-4'>
                    <input
                        type='text'
                        placeholder='Search by Subject Name'
                        className='p-2 px-3 border rounded-3xl w-full sm:w-auto'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <select
                        className='p-2 px-3 border rounded-3xl w-full sm:w-auto'
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        value={selectedSemester}
                    >
                        <option value=''>All Semesters</option>
                        <option value='1'>1st</option>
                        <option value='2'>2nd</option>
                        <option value='3'>3rd</option>
                        <option value='4'>4th</option>
                        <option value='5'>5th</option>
                        <option value='6'>6th</option>
                        <option value='7'>7th</option>
                    </select>
                    <select
                        className='p-2 px-3 border rounded-3xl w-full sm:w-auto'
                        onChange={(e) => {
                            setSelectedCourse(e.target.value);
                            setSelectedBranch(''); // Reset branch when course changes
                        }}
                        value={selectedCourse}
                    >
                        <option value=''>All Courses</option>
                        {courses.map((course) => (
                            <option key={course} value={course}>
                                {course}
                            </option>
                        ))}
                    </select>
                    <select
                        className='p-2 px-3 border rounded-3xl w-full sm:w-auto'
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        value={selectedBranch}
                        disabled={!selectedCourse}
                    >
                        <option value=''>All Branches</option>
                        {branches.map((branch) => (
                            <option key={branch} value={branch}>
                                {branch}
                            </option>
                        ))}
                    </select>
                </div>

                {currentnotes.length > 0 ? (
                    <NotesCard notes={currentnotes} />
                ) : (
                    <div className='col-span-4 flex justify-center items-center py-10 w-full'>
                        {loading ? (
                            <i className='fas fa-spinner fa-pulse fa-5x'></i>
                        ) : (
                            <div className='text-center p-4 bg-white rounded-lg shadow-3xl'>
                                <p className='text-xl font-semibold text-gray-700'>
                                    No notes found matching the criteria. Try
                                    adjusting your filters.
                                    <br /> If You have any Notes, Please Provide
                                    us{' '}
                                    <Link
                                        to={`/college/${collegeName}/resources`}
                                        className='text-blue-500'
                                    >
                                        Click
                                    </Link>
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <div className='flex justify-center my-6'>
                    <Pagination
                        showControls
                        color='primary'
                        total={totalPages}
                        initialPage={1}
                        onChange={(page) => setCurrentPage(page)}
                        className='pagination'
                        size='lg'
                        variant='flat'
                    />
                </div>
            </div>
            <div className='lg:flex w-full justify-center gap-5'>
                <div className='bg-white p-6 rounded-lg shadow-3xl text-center mb-8 lg:w-80 lg:m-0 lg:mb-4 m-4'>
                    <img
                        src={notesandpyq}
                        alt='pyq upload'
                        className='w-36 mx-auto'
                    />
                    <p className='mb-4'>
                        If you have any notes or notes, please share them with
                        us.
                    </p>
                    <Link
                        to={`/college/${collegeName}/resources`}
                        className='inline-block px-6 py-3 w-full bg-sky-500 text-white font-bold rounded-lg hover transition-colors duration-200'
                    >
                        Click Here To Share notes
                    </Link>
                </div>
            </div>
            <Collegelink2 />
            {/* Add Note Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title={`Add Note - ${capitalizeWords(collegeName)}`}
                size='lg'
            >
                <AddNotes
                    collegeId={collegeId}
                    submitting={submitting}
                    onSubmit={handleAddNote}
                />
            </Modal>
        </div>
    );
};

export default NotesPage;
