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

function SubjectPyqs() {
    const { collegeName, courseCode, subjectCode, branchCode } = useParams();
    const collegeId = useCollegeId(collegeName);
    const requireLogin = useRequireLogin();
    const [isModalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

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
        return <p className="text-center text-red-500">Error: {PyqsError}</p>;
    }

    return (
        <div className="container mx-auto p-4 min-h-screen">
            <DetailPageNavbar
                path={`${collegeName}/resources/${courseCode}/${branchCode}`}
            />
            <h1 className="text-2xl font-bold text-center mb-2">
                {capitalizeWords(collegeName)}: {subjectName || subjectCode}{' '}
                Pyqs
            </h1>

            <div className="my-5 text-center">
                <button
                    onClick={handleOpenAddPyqModal}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                    Add Pyq
                </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4 py-6">
                {subjectPyqs.length > 0 ? (
                    subjectPyqs.map((pyq) => (
                        <div
                            key={pyq._id}
                            className="justify-center flex bg-white border border-gray-200 p-5 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="space-y-3">
                                <p className="text-lg font-semibold text-gray-700">
                                    {pyq.year || 'No description'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {pyq.examType}
                                </p>
                                <span className="ml-1 mt-1 text-[8px] text-gray-500 ">
                                    {pyq.clickCounts} views
                                </span>
                                <div className="flex items-center justify-between mt-4">
                                    <Link
                                        to={pyq.slug}
                                        className="bg-sky-400 text-white px-4 py-2 rounded-lg hover:bg-sky-500 transition duration-300"
                                    >
                                        View
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-4 text-center text-gray-600">
                        <p className="text-xl">
                            No PYQs available for this subject. Please add if
                            you have any.
                        </p>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                title={`PYQ - ${collegeName.toUpperCase()}`}
                footer={
                    <button
                        className="p-1 py-2 flex bg-white rounded-lg px-4 border-gray-400 text-sm ring-1 ring-inset ring-gray-300 cursor-pointer"
                        onClick={() => setModalOpen(false)}
                    >
                        Cancel
                    </button>
                }
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
