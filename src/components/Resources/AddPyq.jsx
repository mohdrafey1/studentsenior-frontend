import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../config/apiConfiguration';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../redux/slices/courseSlice';
import { fetchBranches } from '../../redux/slices/branchSlice';
import { fetchSubjects } from '../../redux/slices/subjectSlice';
import SearchableSelect from '../../ui/SearchableSelect';

function AddPyq({
    subjectCode,
    branchCode,
    subjectName,
    collegeId,
    onSubmit,
    submitting,
}) {
    const dispatch = useDispatch();
    const [year, setYear] = useState('');
    const [examType, setExamType] = useState('');
    const [solved, setSolved] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [price, setPrice] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    const {
        courses = [],
        loading: courseLoading,
        error: courseError,
    } = useSelector((state) => state.courses || {});

    const {
        branches = [],
        loading: branchLoading,
        error: branchError,
    } = useSelector((state) => state.branches || {});

    const {
        subjects = [],
        loading: subjectsLoading,
        error: subjectsError,
    } = useSelector((state) => state.subjects || {});

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    useEffect(() => {
        if (course) {
            dispatch(fetchBranches(course));
            setSelectedBranch('');
            setSelectedSubject('');
        }
    }, [course, dispatch]);

    useEffect(() => {
        if (selectedBranch) {
            dispatch(fetchSubjects(selectedBranch));
            setSelectedSubject('');
        }
    }, [selectedBranch, dispatch]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                toast.error('Only PDF files are allowed.');
                return;
            }
            if (selectedFile.size > 10 * 1024 * 1024) {
                toast.error('File size exceeds 10MB.');
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error('Please select a file to upload.');
            return;
        }

        if (!branchCode) {
            if (!course) {
                toast.error('Please select a course.');
                return;
            }
            if (!selectedBranch) {
                toast.error('Please select a branch.');
                return;
            }
            if (!selectedSubject) {
                toast.error('Please select a subject.');
                return;
            }
        }

        const fileName = `${subjectCode || selectedSubject}-${Date.now()}.pdf`;
        const fileType = file.type;

        try {
            setLoading(true);
            // Step 1: Get pre-signed URL
            const response = await fetch(`${api.presignedUrl}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    fileName: `ss-pyq/${fileName}`,
                    fileType,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get presigned URL');
            }

            const { uploadUrl, key } = await response.json();

            toast.warning('Uploading PYQ, Please Wait');

            // Step 2: Upload file directly to S3
            await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': fileType,
                },
                body: file,
            });

            // Step 3: Submit metadata to the server
            const formData = {
                year,
                examType,
                solved,
                isPaid,
                price: isPaid ? price : 0,
                subjectCode: selectedSubject || subjectCode,
                branchCode: selectedBranch || branchCode,
                college: collegeId,
                fileUrl: `https://studentsenior.s3.ap-south-1.amazonaws.com/${key}`,
            };

            onSubmit(formData);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error('Failed to upload file.');
            setLoading(false);
        }
    };

    // Format data for searchable selects
    const courseOptions = courses.map((course) => ({
        value: course.courseCode,
        label: course.courseName,
    }));

    const branchOptions = branches.map((branch) => ({
        value: branch.branchCode,
        label: branch.branchName,
    }));

    const subjectOptions = subjects.map((subject) => ({
        value: subject.subjectCode,
        label: subject.subjectName,
    }));

    const examTypeOptions = [
        { value: 'midsem1', label: 'Midsem 1' },
        { value: 'midsem2', label: 'Midsem 2' },
        { value: 'improvement', label: 'Improvement' },
        { value: 'endsem', label: 'Endsem' },
    ];

    const yearOptions = [
        { value: '2020-21', label: '2020-21' },
        { value: '2022-23', label: '2022-23' },
        { value: '2023-24', label: '2023-24' },
        { value: '2024-25', label: '2024-25' },
    ];

    return (
        <form
            onSubmit={handleSubmit}
            className='space-y-4 bg-white rounded-xl shadow-sm'
        >
            {!branchCode && (
                <div className='space-y-4'>
                    <SearchableSelect
                        options={courseOptions}
                        value={course}
                        onChange={setCourse}
                        placeholder='Select Course'
                        label='Course'
                        loading={courseLoading}
                        errorState={courseError}
                        required={true}
                    />

                    {course && (
                        <SearchableSelect
                            options={branchOptions}
                            value={selectedBranch}
                            onChange={setSelectedBranch}
                            placeholder='Select Branch'
                            label='Branch'
                            loading={branchLoading}
                            errorState={branchError}
                            required={true}
                        />
                    )}

                    {selectedBranch && (
                        <SearchableSelect
                            options={subjectOptions}
                            value={selectedSubject}
                            onChange={setSelectedSubject}
                            placeholder='Select Subject'
                            label='Subject'
                            loading={subjectsLoading}
                            errorState={subjectsError}
                            required={true}
                        />
                    )}
                </div>
            )}

            {branchCode && (
                <div>
                    <label className='block font-semibold text-sky-500 mb-1'>
                        Subject
                    </label>
                    <div className='flex items-center border border-gray-300 p-3 rounded-lg bg-gray-100'>
                        <input
                            type='text'
                            className='w-full bg-transparent focus:outline-none'
                            value={subjectName}
                            readOnly
                        />
                    </div>
                </div>
            )}

            <div className='grid grid-cols-2 gap-4'>
                <div>
                    <label className='block font-semibold text-sky-500 mb-1'>
                        Year
                    </label>
                    <select
                        className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent'
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        required
                    >
                        <option value='' disabled>
                            Select Year
                        </option>
                        {yearOptions.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className='block font-semibold text-sky-500 mb-1'>
                        Exam Type
                    </label>
                    <select
                        className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent'
                        value={examType}
                        onChange={(e) => setExamType(e.target.value)}
                        required
                    >
                        <option value='' disabled>
                            Select Exam Type
                        </option>
                        {examTypeOptions.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className='block font-semibold text-sky-500 mb-1'>
                    Upload PDF (Max 10MB)
                </label>
                <input
                    id='file-upload'
                    type='file'
                    className='w-full border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-sky-500 file:text-white hover:file:bg-sky-600'
                    accept='.pdf'
                    onChange={handleFileChange}
                    required
                />
            </div>

            <div className='mt-4 flex items-center gap-4'>
                <span className='text-gray-700'>Is this solved?</span>
                <label className='relative inline-flex items-center cursor-pointer'>
                    <input
                        type='checkbox'
                        checked={solved}
                        onChange={(e) => setSolved(e.target.checked)}
                        className='sr-only peer'
                    />
                    <div className="w-11 h-6 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500 hover:peer-checked:bg-sky-600"></div>
                </label>
            </div>

            {solved && (
                <div className='mt-4 p-4 bg-sky-50 rounded-lg border border-sky-100'>
                    <div className='flex items-center gap-4 mb-4'>
                        <span className='text-gray-700'>Is this paid?</span>
                        <label className='relative inline-flex items-center cursor-pointer'>
                            <input
                                type='checkbox'
                                id='isPaid'
                                checked={isPaid}
                                onChange={(e) => setIsPaid(e.target.checked)}
                                className='sr-only peer'
                            />
                            <div className="w-11 h-6 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500 hover:peer-checked:bg-sky-600"></div>
                        </label>
                    </div>

                    {isPaid && (
                        <div className='animate-fadeIn'>
                            <label className='block font-semibold text-sky-500 mb-1'>
                                Price (in Points - 5 points = 1 INR)
                            </label>
                            <input
                                type='number'
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent'
                                required
                                min='1'
                            />
                        </div>
                    )}
                </div>
            )}

            <button
                type='submit'
                className={`w-full mt-4 bg-sky-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-sky-600 transition-all duration-200 ${
                    loading || submitting
                        ? 'opacity-70 cursor-not-allowed flex items-center justify-center'
                        : ''
                }`}
                disabled={loading || submitting}
            >
                {loading || submitting ? (
                    <>
                        <svg
                            className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                        >
                            <circle
                                className='opacity-25'
                                cx='12'
                                cy='12'
                                r='10'
                                stroke='currentColor'
                                strokeWidth='4'
                            ></circle>
                            <path
                                className='opacity-75'
                                fill='currentColor'
                                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                            ></path>
                        </svg>
                        {loading ? 'Uploading...' : 'Submitting...'}
                    </>
                ) : (
                    'Add PYQ'
                )}
            </button>
        </form>
    );
}

export default AddPyq;
