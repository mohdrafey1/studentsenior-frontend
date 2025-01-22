import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCollegeId } from '../../hooks/useCollegeId.js';
import { api } from '../../config/apiConfiguration.js';
import Modal from '../../utils/Dialog.jsx';
import AddNotes from './AddNotes.jsx';
import { toast } from 'react-toastify';
import useApiRequest from '../../hooks/useApiRequest.js';
import { capitalizeWords } from '../../utils/Capitalize.js';
import { fetchSubjectNotes } from '../../redux/slices/subjectNotesSlice.js';
import DetailPageNavbar from '../../DetailPages/DetailPageNavbar.jsx';
import useRequireLogin from '../../hooks/useRequireLogin.js';

function SubjectNotes() {
    const { collegeName, courseCode, subjectCode, branchCode } = useParams();
    const collegeId = useCollegeId(collegeName);
    const [isModalOpen, setModalOpen] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [noteIdToDelete, setNoteIdToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const requireLogin = useRequireLogin();
    const [showEarnDialog, setShowEarnDialog] = useState(false);


    const currentUser = useSelector((state) => state.user.currentUser);
    const ownerId = currentUser?._id;

    const { apiRequest, loading: loadingApiRequest } = useApiRequest();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchSubjectNotes({ subjectCode, branchCode, collegeId }));
    }, [collegeId, subjectCode, branchCode]);

    const {
        subjectNotes,
        subjectName,
        loading: loadingSubjectNotes,
        error: notesError,
    } = useSelector((state) => state.subjectNotes || {});

    const handleOpenAddNoteModal = () => {
        requireLogin(() => setModalOpen(true));
    };

    const handleEarnDialog = () => {
        setShowEarnDialog(!showEarnDialog);
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
            dispatch(fetchSubjectNotes({ subjectCode, branchCode, collegeId }));
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

    const likeNotes = async (noteId) => {
        try {
            // Optimistically update the UI for better UX
            const updatedNotes = subjectNotes.map((note) => {
                if (note._id === noteId) {
                    const isLiked = note.likes.includes(ownerId);
                    return {
                        ...note,
                        likes: isLiked
                            ? note.likes.filter((id) => id !== ownerId)
                            : [...note.likes, ownerId],
                    };
                }
                return note;
            });

            dispatch({
                type: 'subjectNotes/updateNotes',
                payload: updatedNotes,
            });

            // Make the API request
            const response = await apiRequest(
                `${api.subjectNotes}/${noteId}/like`,
                'POST'
            );
            toast.success(
                response.message || 'Note liked/unliked successfully.'
            );

            // Sync UI with the server response
            dispatch(fetchSubjectNotes({ subjectCode, branchCode, collegeId }));
        } catch (err) {
            console.error('Error liking/unliking note:', err);
            toast.error('Failed to like/unlike the note. Please try again.');
        }
    };

    if (loadingSubjectNotes) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <i className="fas fa-spinner fa-pulse fa-5x"></i>
            </div>
        );
    }

    if (notesError) {
        return <p className="text-center text-red-500">Error: {notesError}</p>;
    }

    return (
        <div className="container mx-auto p-4 min-h-screen">
            <DetailPageNavbar
                path={`${collegeName}/resources/${courseCode}/${branchCode}`}
            />
            <h1 className="sm:text-2xl font-bold text-center mb-2">
                {capitalizeWords(collegeName)}: {subjectName} Notes
            </h1>

            <div className="flex justify-center items-center mb-4">
                <button
                    onClick={handleOpenAddNoteModal}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                    <i className="fa-solid fa-plus"></i> Add Note
                </button>
                <button className="content-center rounded-full px-2 py-3" onClick={handleEarnDialog}>
                    <i className="text-3xl fa-solid fa-circle-info"></i>
                </button>
            </div>
            {
                showEarnDialog && (<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg lg:m-4 m-6 dark:bg-gray-800">
                        <div className="items-center mb-4 text-white">
                            <div className='flex justify-between items-center'>
                                <h2 className="text-xl sm:text-2xl pb-1 font-bold text-gray-900 dark:text-white ">
                                    Earn Money
                                </h2>
                                <button onClick={handleEarnDialog}>
                                    <i class="fa-solid fa-xmark text-2xl"></i>
                                </button>
                            </div>
                            <p>You can add notes and earn reward points:</p>
                            <p className="mt-2">
                                Here are the rules for earning reward points:
                            </p>
                            <ul className="list-disc ml-4 mt-2">
                                <li>1 unit note = 5 reward points</li>
                                <li>
                                    You can upload 1 unit or the whole in one upload
                                </li>
                                <li>
                                    Rewards will be given only after the notes are
                                    approved
                                </li>
                                <li>Duplicate and invalid notes are not allowed</li>
                                <li>
                                    Labs will be approved only once unless they are
                                    better than the previous submission
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>)
            }

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:mx-20 gap-4">
                {subjectNotes.length > 0 ? (
                    subjectNotes.map((note) => (
                        <div
                            key={note._id}
                            className="border p-4 rounded-lg shadow hover:shadow-lg transition duration-200"
                        >
                            <div className="flex justify-between mb-2">
                                <div className="flex gap-2">
                                    {note.owner.profilePicture ? (
                                        <img
                                            src={note.owner?.profilePicture}
                                            alt="Author Profile"
                                            className="rounded-full w-8 h-8 sm:mr-2"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center rounded-full w-8 h-8 bg-gray-300 text-white font-bold">
                                            A
                                        </div>
                                    )}

                                    <span className="text-sm font-medium mt-1">
                                        {note.owner?.username || 'Anonymous'}
                                    </span>
                                </div>
                            </div>
                            <h2 className="text-lg font-semibold">
                                Title: {note.title}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {note.description || 'No description'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {new Date(note.createdAt).toLocaleDateString()}{' '}
                                <span className="ml-1 mt-1 text-[8px] text-gray-500 ">
                                    {note.clickCounts} views
                                </span>
                            </p>

                            <div className="flex items-center justify-between mt-3">
                                <button
                                    onClick={() => likeNotes(note._id)}
                                    className={`flex items-center space-x-1 ${Array.isArray(note.likes) &&
                                        note.likes.includes(ownerId)
                                        ? 'text-red-500'
                                        : 'text-gray-600'
                                        } hover:text-red-500`}
                                    title="Like this note"
                                >
                                    <i className="fa-regular fa-heart"></i>
                                    <span>
                                        {Array.isArray(note.likes)
                                            ? note.likes.length
                                            : 0}
                                    </span>
                                </button>

                                <Link
                                    to={note.slug}
                                    className="rounded-md px-2 bg-sky-400 text-white hover:underline inline-block"
                                >
                                    View
                                </Link>

                                {note.owner._id === ownerId && (
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDeleteClick(note._id);
                                        }}
                                        title="Delete Note"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-screen text-center text-gray-600">
                        No notes available for this subject. Please add if you
                        have any.
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                title={`Add Note:- ${collegeName.toUpperCase()}`}
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
                    subjectCode={subjectCode}
                    subjectName={subjectName}
                    branchCode={branchCode}
                    collegeId={collegeId}
                    submitting={submitting}
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
