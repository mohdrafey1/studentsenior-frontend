import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCollegeId } from '../../hooks/useCollegeId.js';
import { api } from '../../config/apiConfiguration.js';
import Modal from '../../utils/Dialog.jsx';
import { toast } from 'react-toastify';
import useApiRequest from '../../hooks/useApiRequest.js';
import { capitalizeWords } from '../../utils/Capitalize.js';
import DetailPageNavbar from '../../DetailPages/DetailPageNavbar.jsx';
import AddPyq from './AddPyq.jsx';
import { fetchSubjectPyqs } from '../../redux/slices/subjectPyqsSlice.js';

function SubjectPyqs() {
    const { collegeName, courseCode, subjectCode, branchCode } = useParams();
    const collegeId = useCollegeId(collegeName);
    const [isModalOpen, setModalOpen] = useState(false);

    const { apiRequest, loading: loadingApiRequest } = useApiRequest();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchSubjectPyqs({ subjectCode, branchCode, collegeId }));
    }, [collegeId, subjectCode, branchCode]);

    const {
        subjectPyqs,
        loading: loadingSubjectPyqs,
        error: PyqsError,
    } = useSelector((state) => state.subjectPyqs || {});

    const handleAddPyq = async (formData) => {
        try {
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

            setModalOpen(false);
        } catch (err) {
            console.error(err);
            toast.error('Failed to add pyq.');
            setModalOpen(false);
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
                path={`resource/${courseCode}/${branchCode}/${subjectCode}`}
            />
            <h1 className="text-2xl font-bold text-center mb-2">
                {capitalizeWords(collegeName)}: {subjectCode.toUpperCase()} Pyqs
            </h1>
            <h2 className="text-center text-xs">
                Subject Code may vary across different colleges, ignore if not
                match{' '}
            </h2>
            <div className="my-5 text-center">
                <button
                    onClick={() => setModalOpen(true)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                    Add Pyq
                </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:mx-20 gap-4">
                {subjectPyqs.length > 0 ? (
                    subjectPyqs.map((pyq) => (
                        <div
                            key={pyq._id}
                            className="border p-4 rounded-lg shadow hover:shadow-lg transition duration-200"
                        >
                            <h2 className="text-lg font-semibold">
                                Subject Name: {pyq.subject?.subjectName}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {pyq.year || 'No description'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {pyq.examType}
                            </p>

                            <div className="flex items-center justify-between mt-3">
                                <Link
                                    to={pyq.slug}
                                    className="rounded-md px-2 bg-sky-400 text-white hover:underline inline-block"
                                >
                                    View
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-screen text-center text-gray-600">
                        No Pyq available for this subject. Please add if you
                        have any.
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                title="Add pyq"
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
                    college={collegeName}
                    collegeId={collegeId}
                    onSubmit={handleAddPyq}
                />
            </Modal>
        </div>
    );
}

export default SubjectPyqs;
