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
import {
    fetchSubjectNotes,
    updateNoteLikes,
} from '../../redux/slices/subjectNotesSlice.js';
import DetailPageNavbar from '../../DetailPages/DetailPageNavbar.jsx';
import useRequireLogin from '../../hooks/useRequireLogin.js';
import Seo from '../SEO/Seo.jsx';

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
            dispatch(updateNoteLikes({ noteId, ownerId }));
            const response = await apiRequest(
                `${api.subjectNotes}/${noteId}/like`,
                'POST'
            );
            toast.success(
                response.message || 'Note liked/unliked successfully.'
            );
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
        return (
            <div className="h-screen flex justify-center items-center">
                <div>
                    <p className="text-center text-red-500 mb-4">
                        {notesError}
                    </p>
                    <Link
                        to={`/${collegeName}/resources/${courseCode}/${branchCode}`}
                        className="bg-sky-500 text-white rounded-md px-4 py-2 mt-3 hover:bg-sky-600"
                    >
                        See Other Subjects
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
                {capitalizeWords(collegeName)}: {subjectName} Notes
            </h1>
            <Seo
                title={`${capitalizeWords(collegeName)}: ${subjectName} Notes`}
                desc={subjectNotes
                    .slice(0, 5)
                    .map((note) => note.title)
                    .join(' ')}
            />

            <div className="flex justify-center gap-4 items-center sm:mb-8">
                <button
                    onClick={handleOpenAddNoteModal}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md transition-transform transform hover:scale-105"
                >
                    <i className="fa-solid fa-plus"></i> Add Note
                </button>
                <Link
                    to={`/${collegeName}/resources/${courseCode}/${branchCode}/pyqs/${subjectCode}`}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-md transition-transform transform hover:scale-105"
                >
                    View PYQs
                </Link>
                <button
                    className="rounded-full p-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                    onClick={handleEarnDialog}
                >
                    <i className="text-3xl fa-solid fa-circle-info"></i>
                </button>
            </div>
            <p className="text-center dark:text-gray-500 -translate-y-2">
                Like good notes to keep them on top
            </p>
            {showEarnDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg lg:m-4 m-6 dark:bg-gray-800">
                        <div className="items-center mb-4 text-white">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl sm:text-2xl pb-1 font-bold text-gray-900 dark:text-white ">
                                    Earn Money
                                </h2>
                                <button onClick={handleEarnDialog}>
                                    <i className="fa-solid fa-xmark text-2xl text-gray-900 dark:text-white"></i>
                                </button>
                            </div>
                            <div className="text-gray-900 dark:text-white">
                                <p>You can add notes and earn reward points:</p>
                                <p className="mt-2">
                                    Here are the rules for earning reward
                                    points:
                                </p>
                                <ul className="list-disc ml-4 mt-2">
                                    <li>1 unit note = 5 reward points</li>
                                    <li>
                                        You can upload 1 unit or the whole in
                                        one upload
                                    </li>
                                    <li>
                                        Rewards will be given only after the
                                        notes are approved
                                    </li>
                                    <li>
                                        Duplicate and invalid notes are not
                                        allowed
                                    </li>
                                    <li>
                                        Labs will be approved only once unless
                                        they are better than the previous
                                        submission
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:mx-20">
                {subjectNotes.length > 0 ? (
                    subjectNotes.map((note) => (
                        <div
                            key={note._id}
                            className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between h-full"
                        >
                            <Link to={note.slug} className="block">
                                <div className="p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        {note.owner?.profilePicture ? (
                                            <img
                                                src={note.owner.profilePicture}
                                                alt="Author Profile"
                                                className="rounded-full w-10 h-10 border border-gray-300 object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center rounded-full w-10 h-10 bg-gray-300 text-white font-bold">
                                                A
                                            </div>
                                        )}
                                        <span className="text-sm font-semibold text-gray-700">
                                            {note.owner?.username ||
                                                'Anonymous'}
                                        </span>
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
                                        {note.title}
                                    </h2>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {note.description || 'No description'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {new Date(
                                            note.createdAt
                                        ).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                            month: 'long',
                                        })}
                                    </p>
                                </div>
                            </Link>
                            <div className="border-t border-gray-100 p-4 flex justify-between items-center">
                                <span className="text-xs text-gray-500">
                                    {note.clickCounts} views
                                </span>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            likeNotes(note._id);
                                        }}
                                        className={`text-lg transition-colors duration-200 ${
                                            Array.isArray(note.likes) &&
                                            note.likes.includes(ownerId)
                                                ? 'text-red-500'
                                                : 'text-gray-400 hover:text-red-500'
                                        }`}
                                        title="Like this note"
                                    >
                                        <i className="fa-regular fa-heart"></i>
                                    </button>
                                    {note.owner._id === ownerId && (
                                        <button
                                            className="text-red-500 hover:text-red-600 transition-colors duration-200"
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
                        </div>
                    ))
                ) : (
                    <div className="h-screen text-center text-gray-600 col-span-full">
                        No notes available for this subject. Please add if you
                        have any.
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                title={`Add Note:- ${collegeName.toUpperCase()}`}
                onClose={() => setModalOpen(false)}
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
