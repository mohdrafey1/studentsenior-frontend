import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useApiFetch from '../../hooks/useApiFetch.js';
import { useCollegeId } from '../../hooks/useCollegeId.js';
import { api } from '../../config/apiConfiguration.js';
import Modal from '../../utils/Dialog.jsx';
import AddNotes from './AddNotes.jsx';
import { toast } from 'react-toastify';
import useApiRequest from '../../hooks/useApiRequest.js';
import { capitalizeWords } from '../../utils/Capitalize.js';

function SubjectNotes() {
    const { collegeName, subjectCode } = useParams();
    const collegeId = useCollegeId(collegeName);
    const [notes, setNotes] = useState([]);
    const [error, setError] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [noteIdToDelete, setNoteIdToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const currentUser = useSelector((state) => state.user.currentUser);
    const ownerId = currentUser?._id;

    const location = useLocation();
    const { subjectId } = location.state || {};

    const { useFetch, loadingFetch } = useApiFetch();
    const { apiRequest, loading } = useApiRequest();

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const data = await useFetch(
                    `${api.subjectNotes}/${subjectId}/${collegeId}`
                );
                setNotes(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch notes');
            }
        };

        fetchNotes();
    }, [subjectId]);

    const handleAddNote = async (formData) => {
        try {
            const data = await apiRequest(
                `${api.subjectNotes}`,
                'POST',
                formData,
                true
            );
            setModalOpen(false);
            toast.success(data.message);
        } catch (err) {
            console.log(err);
            toast.error('Failed to add note.');
        }
    };

    const handleDeleteClick = (id) => {
        setNoteIdToDelete(id);
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!noteIdToDelete) return;

        try {
            setDeleteLoading(true);
            const response = await apiRequest(
                `${api.subjectNotes}/${noteIdToDelete}`,
                'DELETE'
            );
            setNotes((prevNotes) =>
                prevNotes.filter((note) => note._id !== noteIdToDelete)
            );
            toast.success(response.message || 'Note deleted successfully.');
        } catch (err) {
            console.log(err);
            toast.error('Failed to delete note.');
        } finally {
            setDeleteLoading(false);
            setShowDeleteDialog(false);
            setNoteIdToDelete(null);
        }
    };

    const handleCloseDialog = () => {
        setShowDeleteDialog(false);
        setNoteIdToDelete(null);
    };

    if (loadingFetch) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <i className="fas fa-spinner fa-pulse fa-5x"></i>
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-500">Error: {error}</p>;
    }

    return (
        <div className="container mx-auto p-4 h-screen">
            <h1 className="text-2xl font-bold text-center mb-2">
                {capitalizeWords(collegeName)}: {subjectCode.toUpperCase()}
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
                    Add Note
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.length > 0 ? (
                    notes.map((note) => (
                        <div
                            key={note._id}
                            className="border p-4 rounded-lg shadow hover:shadow-lg transition duration-200"
                        >
                            <h1 className="text-2xl font-bold">
                                {note.subject?.subjectName}
                            </h1>
                            <h2 className="text-lg font-semibold">
                                {note.title}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {note.description || 'No description'}
                            </p>
                            <a
                                href={note.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline mt-2 inline-block"
                            >
                                View Notes
                            </a>
                            {note.owner._id === ownerId && (
                                <div className="flex space-x-2">
                                    <button
                                        className="bg-red-500 text-white px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm hover:bg-red-600"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDeleteClick(note._id);
                                        }}
                                        title="Delete Note"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="h-screen text-center text-gray-600">
                        No notes available for this subject, Please Add if you
                        have.
                    </div>
                )}
            </div>
            <Modal
                isOpen={isModalOpen}
                title="Add Note"
                footer={
                    <button
                        className="p-1 py-2 flex bg-white rounded-lg px-4 border-gray-400 text-sm ring-1 ring-inset ring-gray-300 cursor-pointer"
                        onClick={() => setModalOpen(false)}
                    >
                        Cancel
                    </button>
                }
            >
                <AddNotes
                    subject={subjectCode}
                    college={collegeName}
                    subjectId={subjectId}
                    collegeId={collegeId}
                    onSubmit={handleAddNote}
                />
            </Modal>
            <Modal
                isOpen={showDeleteDialog}
                onClose={handleCloseDialog}
                title="Delete Confirmation"
                footer={
                    <div className="flex py-4 gap-3 lg:justify-end justify-center">
                        <button
                            className="p-1 py-2 bg-white rounded-lg px-4 border-gray-400 text-sm ring-1 ring-inset ring-gray-300 cursor-pointer"
                            onClick={handleCloseDialog}
                        >
                            Cancel
                        </button>
                        <button
                            className="p-1 py-2 bg-red-600 rounded-lg px-4 text-sm font-semibold text-white cursor-pointer"
                            onClick={handleConfirmDelete}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? (
                                <i className="fa fa-spinner fa-spin"></i>
                            ) : (
                                <>
                                    <span>Confirm</span>
                                    &nbsp;
                                    <i className="fa-solid fa-trash fa-xl"></i>
                                </>
                            )}
                        </button>
                    </div>
                }
            >
                <p>Are you sure you want to delete this note?</p>
                <p className="text-sm text-gray-500">
                    This action cannot be undone.
                </p>
            </Modal>
        </div>
    );
}

export default SubjectNotes;
