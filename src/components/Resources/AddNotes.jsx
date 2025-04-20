import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../config/apiConfiguration';
import SearchableSelect from '../../ui/SearchableSelect';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBranches } from '../../redux/slices/branchSlice';
import { fetchSubjects } from '../../redux/slices/subjectSlice';
import { fetchCourses } from '../../redux/slices/courseSlice';

function AddNotes({
    subjectCode,
    subjectName,
    branchCode,
    collegeId,
    onSubmit,
    submitting,
}) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [isPaid, setIsPaid] = useState(false);
    const [price, setPrice] = useState('');
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
            if (selectedFile.size > 50 * 1024 * 1024) {
                toast.error('File size exceeds 50MB.');
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

        const fileName = `${title}-${Date.now()}.pdf`;
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
                    fileName: `ss-notes/${fileName}`,
                    fileType,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get presigned URL');
            }

            const { uploadUrl, key } = await response.json();

            toast.warning('Uploading notes');

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
                title,
                description,
                subjectCode: selectedSubject || subjectCode,
                branchCode: selectedBranch || branchCode,
                college: collegeId,
                isPaid,
                price: isPaid ? price : 0,
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

    return (
        <form onSubmit={handleSubmit} className='space-y-2 bg-white '>
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
                    <label className='block font-semibold text-sky-500 sm:mb-1'>
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
            <div>
                <label className='block font-semibold text-sky-500 sm:mb-2'>
                    Title
                </label>
                <input
                    type='text'
                    className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className='block font-semibold text-sky-500 sm:mb-2'>
                    Description (optional)
                </label>
                <textarea
                    className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
            </div>
            <div>
                <label className='block font-semibold text-sky-500 sm:mb-2'>
                    Upload PDF (Max 50MB)
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

            {/* Payment Section - Full Width */}
            <div className='mt-4 p-4 bg-sky-50 rounded-lg border border-sky-100'>
                <div className='flex items-center justify-between flex-wrap gap-4'>
                    <div className='flex items-center gap-2'>
                        <span className='text-gray-700 font-medium'>
                            Is this paid content?
                        </span>
                        <label className='relative inline-flex items-center cursor-pointer'>
                            <input
                                type='checkbox'
                                checked={isPaid}
                                onChange={(e) => setIsPaid(e.target.checked)}
                                className='sr-only peer'
                            />
                            <div className="w-11 h-6 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500 hover:peer-checked:bg-sky-600"></div>
                        </label>
                    </div>

                    {isPaid && (
                        <div className='flex-grow max-w-xs'>
                            <label className='block font-semibold text-sky-500 mb-1 text-sm'>
                                Price (in Points - 5 points = 1 INR)
                            </label>
                            <input
                                type='number'
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className='w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent'
                                required
                                min='1'
                                placeholder='Enter price in points'
                            />
                        </div>
                    )}
                </div>
            </div>

            <button
                type='submit'
                className={`w-full bg-sky-400 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-sky-500 transition-colors duration-200 ${
                    loading || submitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={loading || submitting}
            >
                {loading || submitting ? (
                    <span className='flex items-center justify-center'>
                        <i className='fas fa-spinner fa-pulse mr-2'></i>
                        {loading ? 'Uploading...' : 'Submitting...'}
                    </span>
                ) : (
                    'Add Note'
                )}
            </button>
        </form>
    );
}

export default AddNotes;
