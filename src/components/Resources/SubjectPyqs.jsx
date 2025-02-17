import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCollegeId } from '../../hooks/useCollegeId.js';
import { api } from '../../config/apiConfiguration.js';
import Modal from '../../utils/Dialog.jsx';
import { toast } from 'react-toastify';
import { capitalizeWords } from '../../utils/Capitalize.js';
import DetailPageNavbar from '../../DetailPages/DetailPageNavbar.jsx';
import AddPyq from './AddPyq.jsx';
import { fetchSubjectPyqs } from '../../redux/slices/subjectPyqsSlice.js';
import useRequireLogin from '../../hooks/useRequireLogin.js';
import Seo from '../SEO/Seo.jsx';

function SubjectPyqs() {
    const { collegeName, courseCode, subjectCode, branchCode } = useParams();
    const collegeId = useCollegeId(collegeName);
    const requireLogin = useRequireLogin();
    const [isModalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showEarnDialog, setShowEarnDialog] = useState(false);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchSubjectPyqs({ subjectCode, branchCode, collegeId }));
    }, [collegeId, subjectCode, branchCode]);

    const {
        subjectPyqs,
        subjectName,
        loading: loadingSubjectPyqs,
        error: PyqsError,
    } = useSelector((state) => state.subjectPyqs || {});

    const handleOpenAddPyqModal = () => {
        requireLogin(() => setModalOpen(true));
    };

    const handleEarnDialog = () => {
        setShowEarnDialog(!showEarnDialog);
    };

    const handleAddPyq = async (formData) => {
        try {
            setSubmitting(true);
            const response = await fetch(`${api.newPyqs}`, {
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
            setSubmitting(false);
            console.error(err);
            toast.error('Failed to add pyq.');
            setModalOpen(false);
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingSubjectPyqs) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <i className="fas fa-spinner fa-pulse fa-5x"></i>
            </div>
        );
    }

    if (PyqsError) {
        return (
            <div className="h-screen flex justify-center items-center">
                <div>
                    <p className="text-center text-red-500 mb-4">{PyqsError}</p>
                    <Link
                        to={`/${collegeName}/resources/${courseCode}/${branchCode}`}
                        className="bg-sky-500 text-white rounded-md px-4 py-2 mt-3 hover:bg-sky-600"
                    >
                        See Other Branches
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 min-h-screen">
            <DetailPageNavbar
                path={`${collegeName}/resources/${courseCode}/${branchCode}`}
            />
            <h1 className="sm:text-2xl font-extrabold text-center sm:mb-6 text-gray-800 dark:text-white">
                {capitalizeWords(collegeName)}: {subjectName || subjectCode}{' '}
                PYQs
            </h1>
            <Seo
                title={` ${capitalizeWords(collegeName)}: ${
                    subjectName || subjectCode
                } PYQs`}
                desc={subjectPyqs
                    .map((pyq) => `${pyq.year} ${pyq.examType}`)
                    .join(' ')}
            />

            <div className="flex justify-center gap-4 items-center sm:mb-8">
                <button
                    onClick={handleOpenAddPyqModal}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md transition-transform transform hover:scale-105"
                >
                    <i className="fa-solid fa-plus"></i> Add PYQs
                </button>
                <Link
                    to={`/${collegeName}/resources/${courseCode}/${branchCode}/notes/${subjectCode}`}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-md transition-transform transform hover:scale-105"
                >
                    View Notes
                </Link>
                <button
                    className="rounded-full p-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                    onClick={handleEarnDialog}
                >
                    <i className="text-3xl fa-solid fa-circle-info text-gray-600 dark:text-gray-300"></i>
                </button>
            </div>

            {showEarnDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full lg:m-4 m-6 max-w-lg dark:bg-gray-800">
                        <div className="items-center mb-4 text-white">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Earn Money
                                </h2>
                                <button onClick={handleEarnDialog}>
                                    <i className="fa-solid fa-xmark text-2xl text-gray-900 dark:text-white"></i>
                                </button>
                            </div>
                            <div className="text-gray-800 dark:text-gray-300 mt-2">
                                <p>
                                    You can upload PYQs and earn reward points:
                                </p>
                                <ul className="list-disc ml-6 mt-2">
                                    <li>1 PYQ upload = 10 reward points</li>
                                    <li>Rewards are given after approval</li>
                                    <li>Duplicate PYQs are not allowed</li>
                                    <li>
                                        PYQs should not be older than 2 years
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-6 sm:px-4 py-6">
                {subjectPyqs.length > 0 ? (
                    subjectPyqs.map((pyq) => (
                        <Link to={pyq.slug} key={pyq._id} className="relative">
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
                                {pyq.solved && (
                                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                                        Solved
                                    </span>
                                )}
                                <div className="space-y-3">
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                                        {pyq.year}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {pyq.examType}
                                    </p>
                                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                                        {pyq.clickCounts} views
                                    </span>
                                    <div className="flex items-center justify-center mt-4">
                                        <Link
                                            to={pyq.slug}
                                            className="bg-sky-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-md transition-transform transform hover:scale-105"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-4 text-center text-gray-600 dark:text-gray-400">
                        <p className="text-xl">
                            No PYQs available for this subject. Please add if
                            you have any.
                        </p>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title={`PYQ - ${collegeName.toUpperCase()}`}
            >
                <AddPyq
                    subjectCode={subjectCode}
                    branchCode={branchCode}
                    subjectName={subjectName}
                    collegeId={collegeId}
                    onSubmit={handleAddPyq}
                    submitting={submitting}
                />
            </Modal>
        </div>
    );
}

export default SubjectPyqs;
