import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCollegeId } from '../../hooks/useCollegeId.js';
import { api } from '../../config/apiConfiguration.js';
import Modal from '../../utils/Dialog.jsx';
import ConfirmPurchaseModal from './ConfirmPurchaseModal.jsx';
import AddNotes from './AddNotes.jsx';
import { toast } from 'react-toastify';
import useApiRequest from '../../hooks/useApiRequest.js';
import { capitalizeWords } from '../../utils/Capitalize.js';
import {
    fetchSubjectNotes,
    updateNoteLikes,
} from '../../redux/slices/subjectNotesSlice.js';
import {
    handleConfirmPurchaseUtil,
    handleOnlinePaymentUtil,
} from '../../utils/purchaseUtils.js';
import DetailPageNavbar from '../../DetailPages/DetailPageNavbar.jsx';
import useRequireLogin from '../../hooks/useRequireLogin.js';
import Seo from '../SEO/Seo.jsx';
import { fetchUserData } from '../../redux/slices/userDataSlice.js';
import Button from '../../ui/Button.jsx';
import { fetchSavedCollection } from '../../redux/slices/savedCollectionSlice.js';
import { useSaveResource } from '../../hooks/useSaveResource.js';
import { CompactSpinner } from '../../ui/Spinner.jsx';

function SubjectNotes() {
    const { collegeName, courseCode, subjectCode, branchCode } = useParams();
    const collegeId = useCollegeId(collegeName);

    const { saveResource, unsaveResource } = useSaveResource();

    const [isModalOpen, setModalOpen] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [noteIdToDelete, setNoteIdToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const requireLogin = useRequireLogin();
    const [showEarnDialog, setShowEarnDialog] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [isBuyNowModalOpen, setBuyNowModalOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const currentUser = useSelector((state) => state.user.currentUser);
    const ownerId = currentUser?._id;

    const { apiRequest, loading: loadingApiRequest } = useApiRequest();

    useEffect(() => {
        dispatch(fetchUserData());
        dispatch(fetchSavedCollection());
    }, []);

    useEffect(() => {
        dispatch(fetchSubjectNotes({ subjectCode, branchCode, collegeId }));
    }, [collegeId, subjectCode, branchCode]);

    const { rewardBalance } = useSelector((state) => state.userData || {});

    const {
        subjectNotes,
        subjectName,
        loading: loadingSubjectNotes,
        error: notesError,
    } = useSelector((state) => state.subjectNotes || {});

    const { savedNotes } = useSelector((state) => state.savedCollection || {});

    // Handlers (same as before)
    const handleBuyNowClick = (note) => {
        setSelectedNote(note);
        setBuyNowModalOpen(true);
    };

    const handleCloseBuyNowModal = () => {
        setBuyNowModalOpen(false);
        setSelectedNote(null);
    };

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

    const handleConfirmPurchase = async () => {
        handleConfirmPurchaseUtil(
            selectedNote,
            api.subjectNotes,
            navigate,
            () => setBuyNowModalOpen(false),
            `/${collegeName}/resources/${courseCode}/${branchCode}/notes/${subjectCode}/${selectedNote.slug}`
        );
    };

    const handleOnlinePayment = () => {
        handleOnlinePaymentUtil(
            selectedNote,
            apiRequest,
            window.location.href,
            'note_purchase'
        );
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

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editNoteData, setEditNoteData] = useState({
        _id: null,
        isPaid: false,
        price: 0,
    });

    const handleEditClick = (note) => {
        setEditNoteData({
            _id: note._id,
            isPaid: note.isPaid,
            price: note.price || 0,
        });
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditNoteData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleUpdatenote = async () => {
        try {
            setSubmitting(true);
            const response = await fetch(
                `${api.subjectNotes}/${editNoteData._id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(editNoteData),
                }
            );
            const data = await response.json();

            toast.success('note updated successfully.');
            setIsEditModalOpen(false);
            dispatch(fetchSubjectNotes({ subjectCode, branchCode, collegeId }));
        } catch (error) {
            console.error('Failed to update note:', error);
            toast.error('Failed to update note.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingSubjectNotes) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <DetailPageNavbar path={`college/${collegeName}/resources`} />
                <div className='col-span-full flex justify-center h-screen py-12 w-full'>
                    <div className='text-center'>
                        <CompactSpinner />
                    </div>
                </div>
            </div>
        );
    }

    if (notesError) {
        return (
            <div className='min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50'>
                <div className='bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center'>
                    <div className='text-red-500 mb-4'>
                        <i className='fas fa-exclamation-circle text-4xl'></i>
                    </div>
                    <h2 className='text-xl font-bold text-gray-800 mb-2'>
                        Error Loading Notes
                    </h2>
                    <p className='text-gray-600 mb-6'>{notesError}</p>
                    <Link
                        to={`/${collegeName}/resources/${courseCode}/${branchCode}`}
                        className='inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors'
                    >
                        Back to Subjects
                    </Link>
                </div>
            </div>
        );
    }

    const semester =
        subjectNotes?.length > 0 ? subjectNotes[0]?.subject?.semester || 1 : 1;

    return (
        <div className='min-h-screen bg-gray-50'>
            <DetailPageNavbar
                path={`${collegeName}/resources/${courseCode}/${branchCode}?semester=${semester}`}
            />

            {/* Header Section */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
                <div className='text-center mb-4'>
                    <h1 className='text-xl md:text-3xl font-bold text-gray-900 mb-2'>
                        {capitalizeWords(collegeName)}: {subjectName} Notes
                    </h1>
                    <p className='text-gray-600'>
                        Access and contribute study materials for this subject
                    </p>
                </div>

                <Seo
                    title={`${capitalizeWords(
                        collegeName
                    )}: ${subjectName} Notes`}
                    desc={subjectNotes
                        ?.slice(0, 5)
                        .map((note) => note.title)
                        .join(' ')}
                />

                {/* Action Bar */}
                <div className='flex flex-wrap justify-center gap-4 mb-8'>
                    <Button
                        onClick={handleOpenAddNoteModal}
                        variant='primary'
                        className='flex items-center gap-2'
                    >
                        <i className='fas fa-plus'></i> Add Note
                    </Button>

                    <Link
                        to={`/${collegeName}/resources/${courseCode}/${branchCode}/pyqs/${subjectCode}`}
                        className='flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-colors'
                    >
                        <i className='fas fa-file-alt'></i> View PYQs
                    </Link>

                    <button
                        onClick={handleEarnDialog}
                        className='p-2 text-gray-500 hover:text-blue-600 transition-colors'
                        aria-label='Earn rewards information'
                    >
                        <i className='fas fa-info-circle text-xl'></i>
                    </button>
                </div>

                {/* Notes Grid */}
                {subjectNotes?.length > 0 ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                        {subjectNotes?.map((note) => {
                            const isSaved = savedNotes.some(
                                (savedNote) => savedNote.noteId._id === note._id
                            );
                            return (
                                <div
                                    key={note._id}
                                    className='bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 flex flex-col'
                                >
                                    {/* Note Header */}
                                    <div className='p-4 flex-1'>
                                        <div className='flex justify-between items-start mb-3'>
                                            {/* Author Info */}
                                            <div className='flex items-center gap-2'>
                                                {note.owner?.profilePicture ? (
                                                    <img
                                                        src={
                                                            note.owner
                                                                .profilePicture
                                                        }
                                                        alt='Author'
                                                        className='w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm'
                                                    />
                                                ) : (
                                                    <div className='w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold'>
                                                        {note.owner?.username?.charAt(
                                                            0
                                                        ) || 'A'}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className='text-sm font-medium text-gray-900'>
                                                        {note.owner?.username ||
                                                            'Anonymous'}
                                                    </p>
                                                    <p className='text-xs text-gray-500'>
                                                        {new Date(
                                                            note.createdAt
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Badges and Save Button */}
                                            <div className='flex items-center gap-2'>
                                                {note.isPaid && (
                                                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                                                        Paid
                                                    </span>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        requireLogin(() => {
                                                            if (isSaved) {
                                                                unsaveResource(
                                                                    'note',
                                                                    note._id
                                                                );
                                                            } else {
                                                                saveResource(
                                                                    'note',
                                                                    note._id
                                                                );
                                                            }
                                                        });
                                                    }}
                                                    className={`text-xl ${
                                                        isSaved
                                                            ? 'text-blue-500'
                                                            : 'text-gray-300 hover:text-blue-500'
                                                    }`}
                                                    aria-label={
                                                        isSaved
                                                            ? 'Unsave note'
                                                            : 'Save note'
                                                    }
                                                >
                                                    <i
                                                        className={`fas ${
                                                            isSaved
                                                                ? 'fa-bookmark'
                                                                : 'fa-bookmark'
                                                        }`}
                                                    ></i>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Note Content */}
                                        <div className='mb-4'>
                                            <h3 className='text-lg font-semibold text-gray-900 mb-2 line-clamp-2'>
                                                {note.title}
                                            </h3>
                                            <p className='text-sm text-gray-600 line-clamp-3'>
                                                {note.description ||
                                                    'No description provided'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Note Footer */}
                                    <div className='border-t border-gray-100 px-4 py-3 bg-gray-50'>
                                        <div className='flex justify-between items-center'>
                                            {/* Stats */}
                                            <div className='flex items-center gap-3'>
                                                <span className='text-xs text-gray-500 flex items-center gap-1'>
                                                    <i className='fas fa-eye'></i>{' '}
                                                    {note.clickCounts}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        likeNotes(note._id);
                                                    }}
                                                    className={`text-sm flex items-center gap-1 ${
                                                        Array.isArray(
                                                            note.likes
                                                        ) &&
                                                        note.likes.includes(
                                                            ownerId
                                                        )
                                                            ? 'text-red-500'
                                                            : 'text-gray-400 hover:text-red-500'
                                                    }`}
                                                >
                                                    <i className='fas fa-heart'></i>
                                                    {Array.isArray(note.likes)
                                                        ? note.likes.length
                                                        : 0}
                                                </button>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className='flex items-center gap-2'>
                                                {note.owner._id === ownerId ? (
                                                    <>
                                                        <Link
                                                            to={note.slug}
                                                            className='text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
                                                        >
                                                            View
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                handleEditClick(
                                                                    note
                                                                )
                                                            }
                                                            className='p-1.5 text-gray-500 hover:text-blue-600 transition-colors'
                                                            aria-label='Edit note'
                                                        >
                                                            <i className='fas fa-edit'></i>
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleDeleteClick(
                                                                    note._id
                                                                );
                                                            }}
                                                            className='p-1.5 text-gray-500 hover:text-red-600 transition-colors'
                                                            aria-label='Delete note'
                                                        >
                                                            <i className='fas fa-trash'></i>
                                                        </button>
                                                    </>
                                                ) : note.purchasedBy?.includes(
                                                      ownerId
                                                  ) ? (
                                                    <Link
                                                        to={note.slug}
                                                        className='text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
                                                    >
                                                        View
                                                    </Link>
                                                ) : note.isPaid ? (
                                                    <button
                                                        onClick={() =>
                                                            handleBuyNowClick(
                                                                note
                                                            )
                                                        }
                                                        className='text-sm px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-1 transition-colors'
                                                    >
                                                        <i className='fas fa-shopping-cart'></i>
                                                        {note.price / 5}₹
                                                    </button>
                                                ) : (
                                                    <Link
                                                        to={note.slug}
                                                        className='text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
                                                    >
                                                        View
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className='bg-white rounded-xl shadow-sm p-8 text-center'>
                        <div className='mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                            <i className='fas fa-file-alt text-3xl text-gray-400'></i>
                        </div>
                        <h3 className='text-lg font-medium text-gray-900 mb-2'>
                            No Notes Available
                        </h3>
                        <p className='text-gray-600 mb-6'>
                            Be the first to contribute notes for this subject
                        </p>
                        <Button
                            onClick={handleOpenAddNoteModal}
                            variant='primary'
                            className='flex items-center gap-2 mx-auto'
                        >
                            <i className='fas fa-plus'></i> Add Note
                        </Button>
                    </div>
                )}
            </div>

            {/* Earn Rewards Modal */}
            <Modal
                isOpen={showEarnDialog}
                onClose={handleEarnDialog}
                title='Earn Reward Points'
                size='md'
            >
                <div className='space-y-4'>
                    <div className='bg-blue-50 p-4 rounded-lg'>
                        <p className='font-medium text-blue-800'>
                            Your current reward balance:{' '}
                            <span className='font-bold'>
                                {rewardBalance || 0}
                            </span>{' '}
                            points
                        </p>
                    </div>

                    <div className='space-y-3'>
                        <h4 className='font-medium text-gray-900'>
                            How to earn points:
                        </h4>
                        <ul className='space-y-2'>
                            <li className='flex items-start gap-2'>
                                <span className='inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex-shrink-0'>
                                    1
                                </span>
                                <span>1 unit note = 5 reward points</span>
                            </li>
                            <li className='flex items-start gap-2'>
                                <span className='inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex-shrink-0'>
                                    2
                                </span>
                                <span>
                                    Upload 1 unit or complete notes in one
                                    upload
                                </span>
                            </li>
                            <li className='flex items-start gap-2'>
                                <span className='inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex-shrink-0'>
                                    3
                                </span>
                                <span>Rewards are given after approval</span>
                            </li>
                            <li className='flex items-start gap-2'>
                                <span className='inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex-shrink-0'>
                                    4
                                </span>
                                <span>
                                    Duplicate and invalid notes are rejected
                                </span>
                            </li>
                            <li className='flex items-start gap-2'>
                                <span className='inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex-shrink-0'>
                                    5
                                </span>
                                <span>
                                    Lab manuals approved only if better than
                                    existing
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className='pt-4 flex justify-end'>
                        <Button onClick={handleEarnDialog} variant='secondary'>
                            Close
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Add Note Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title={`Add Note - ${capitalizeWords(collegeName)}`}
                size='lg'
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

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteDialog}
                onClose={handleCloseDialog}
                title='Confirm Deletion'
                size='sm'
            >
                <div className='space-y-4'>
                    <p className='text-gray-700'>
                        Are you sure you want to delete this note?
                    </p>
                    <p className='text-sm text-gray-500'>
                        This action cannot be undone.
                    </p>

                    <div className='flex justify-end gap-3 pt-4'>
                        <Button onClick={handleCloseDialog} variant='secondary'>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
                            variant='danger'
                            loading={deleteLoading}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Buy Now Modal */}
            <ConfirmPurchaseModal
                isOpen={isBuyNowModalOpen}
                onClose={handleCloseBuyNowModal}
                selectedResource={selectedNote}
                rewardBalance={rewardBalance}
                handleOnlinePayment={handleOnlinePayment}
                handleConfirmPurchase={handleConfirmPurchase}
                viewDemoPath={`${selectedNote?.slug}`}
                title='Purchase Note'
            />

            {/* Edit Note Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title='Edit Note Settings'
                size='sm'
            >
                <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                        <label
                            htmlFor='isPaid'
                            className='font-medium text-gray-700'
                        >
                            Paid Content
                        </label>
                        <div className='relative inline-block w-12 mr-2 align-middle select-none'>
                            <input
                                type='checkbox'
                                id='isPaid'
                                name='isPaid'
                                checked={editNoteData.isPaid}
                                onChange={handleEditChange}
                                className='toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform'
                            />
                            <label
                                htmlFor='isPaid'
                                className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${
                                    editNoteData.isPaid
                                        ? 'bg-green-500'
                                        : 'bg-gray-300'
                                }`}
                            ></label>
                        </div>
                    </div>

                    {editNoteData.isPaid && (
                        <div className='space-y-2'>
                            <label
                                htmlFor='price'
                                className='block font-medium text-gray-700'
                            >
                                Price (in points)
                            </label>
                            <input
                                type='number'
                                id='price'
                                name='price'
                                value={editNoteData.price}
                                onChange={handleEditChange}
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                                min='1'
                                placeholder='Enter price'
                            />
                            <p className='text-xs text-gray-500'>
                                Users will pay {editNoteData.price / 5}₹ or{' '}
                                {editNoteData.price} points
                            </p>
                        </div>
                    )}

                    <div className='flex justify-end gap-3 pt-4'>
                        <Button
                            onClick={() => setIsEditModalOpen(false)}
                            variant='secondary'
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdatenote}
                            variant='primary'
                            loading={submitting}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default SubjectNotes;
