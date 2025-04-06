import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
import { fetchUserData } from '../../redux/slices/userDataSlice.js';
import Button from '../../ui/Button.jsx';
import ConfirmPurchaseModal from './ConfirmPurchaseModal.jsx';
import {
    handleConfirmPurchaseUtil,
    handleOnlinePaymentUtil,
} from '../../utils/purchaseUtils.js';
import useApiRequest from '../../hooks/useApiRequest.js';
import { fetchSavedCollection } from '../../redux/slices/savedCollectionSlice.js';
import { useSaveResource } from '../../hooks/useSaveResource.js';

function SubjectPyqs() {
    const { collegeName, courseCode, subjectCode, branchCode } = useParams();
    const collegeId = useCollegeId(collegeName);

    const { saveResource, unsaveResource } = useSaveResource(
        subjectCode,
        branchCode,
        collegeId
    );

    const requireLogin = useRequireLogin();
    const [isModalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showEarnDialog, setShowEarnDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isBuyNowModalOpen, setBuyNowModalOpen] = useState(false);
    const [selectedPyq, setSelectedPyq] = useState(null);
    const [pyqIdtoDelete, setpyqIdtoDelete] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { apiRequest } = useApiRequest();

    const currentUser = useSelector((state) => state.user.currentUser);
    const ownerId = currentUser?._id;
    const { rewardBalance } = useSelector((state) => state.userData || {});
    const {
        subjectPyqs,
        subjectName,
        loading: loadingSubjectPyqs,
        error: PyqsError,
    } = useSelector((state) => state.subjectPyqs || {});
    const { savedPYQs } = useSelector((state) => state.savedCollection);

    // Fetch data on component mount
    useEffect(() => {
        dispatch(fetchUserData());
        dispatch(fetchSavedCollection());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchSubjectPyqs({ subjectCode, branchCode, collegeId }));
    }, [collegeId, subjectCode, branchCode, dispatch]);

    // Handler functions
    const handleBuyNowClick = (pyq) => {
        setSelectedPyq(pyq);
        setBuyNowModalOpen(true);
    };

    const handleCloseBuyNowModal = () => {
        setBuyNowModalOpen(false);
        setSelectedPyq(null);
    };

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
            setModalOpen(false);
        } catch (err) {
            console.error(err);
            toast.error('Failed to add pyq.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleConfirmPurchase = () => {
        handleConfirmPurchaseUtil(
            selectedPyq,
            api.newPyqs,
            navigate,
            () => setBuyNowModalOpen(false),
            `/${collegeName}/resources/${courseCode}/${branchCode}/pyqs/${subjectCode}/${selectedPyq?.slug}`
        );
    };

    const handleOnlinePayment = () => {
        handleOnlinePaymentUtil(
            selectedPyq,
            apiRequest,
            window.location.href,
            'pyq_purchase'
        );
    };

    const handleDeleteClick = (id) => {
        setpyqIdtoDelete(id);
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!pyqIdtoDelete) return;

        try {
            setDeleteLoading(true);
            const response = await fetch(`${api.newPyqs}/${pyqIdtoDelete}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await response.json();

            toast.success(data.message || 'PYQ deleted successfully.');
            dispatch(fetchSubjectPyqs({ subjectCode, branchCode, collegeId }));
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete PYQ.');
        } finally {
            setDeleteLoading(false);
            setShowDeleteDialog(false);
            setpyqIdtoDelete(null);
        }
    };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editPyqData, setEditPyqData] = useState({
        _id: null,
        isPaid: false,
        price: 0,
    });

    const handleEditClick = (pyq) => {
        setEditPyqData({
            _id: pyq._id,
            isPaid: pyq.isPaid,
            price: pyq.price || 0,
        });
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditPyqData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleUpdatePyq = async () => {
        try {
            setSubmitting(true);
            const response = await fetch(`${api.newPyqs}/${editPyqData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(editPyqData),
            });
            const data = await response.json();

            toast.success('PYQ updated successfully.');
            setIsEditModalOpen(false);
            dispatch(fetchSubjectPyqs({ subjectCode, branchCode, collegeId }));
        } catch (error) {
            console.error('Failed to update PYQ:', error);
            toast.error('Failed to update PYQ.');
        } finally {
            setSubmitting(false);
        }
    };

    // Loading state
    if (loadingSubjectPyqs) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <i className='fas fa-spinner fa-pulse text-4xl text-sky-500'></i>
            </div>
        );
    }

    // Error state
    if (PyqsError) {
        return (
            <div className='h-screen flex justify-center items-center px-4'>
                <div className='text-center'>
                    <p className='text-red-500 mb-4 font-medium'>{PyqsError}</p>
                    <Link
                        to={`/${collegeName}/resources/${courseCode}/${branchCode}`}
                        className='bg-sky-500 text-white rounded-md px-4 py-2 mt-3 hover:bg-sky-600 inline-block'
                    >
                        See Other Branches
                    </Link>
                </div>
            </div>
        );
    }

    const semester =
        subjectPyqs?.length > 0 ? subjectPyqs[0]?.subject?.semester || 1 : 1;

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen'>
            <DetailPageNavbar
                path={`${collegeName}/resources/${courseCode}/${branchCode}?semester=${semester}`}
            />

            {/* Page Header */}
            <header className='py-2'>
                <h1 className='text-xl md:text-3xl font-bold text-center text-gray-800'>
                    {capitalizeWords(collegeName)}: {subjectName || subjectCode}{' '}
                    PYQs
                </h1>
                <Seo
                    title={`${capitalizeWords(collegeName)}: ${
                        subjectName || subjectCode
                    } PYQs`}
                    desc={subjectPyqs
                        ?.map((pyq) => `${pyq.year} ${pyq.examType}`)
                        .join(' ')}
                />
            </header>

            {/* Action Buttons */}
            <div className='flex flex-wrap justify-center gap-3 md:gap-4 mb-4'>
                <Button
                    onClick={handleOpenAddPyqModal}
                    className='flex items-center gap-2'
                >
                    <i className='fa-solid fa-plus'></i> Add PYQs
                </Button>

                <Link
                    to={`/${collegeName}/resources/${courseCode}/${branchCode}/notes/${subjectCode}`}
                    className='px-4 py-2 bg-sky-400 hover:bg-sky-700 text-white rounded-md shadow-md transition duration-200 flex items-center gap-2'
                >
                    <i className='fa-solid fa-book'></i> View Notes
                </Link>

                <button
                    className='rounded-full p-2 hover:bg-gray-200 transition-all'
                    onClick={handleEarnDialog}
                    aria-label='Earn Info'
                >
                    <i className='text-2xl fa-solid fa-circle-info text-gray-600'></i>
                </button>
            </div>

            {/* PYQ Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'>
                {subjectPyqs?.length > 0 ? (
                    subjectPyqs?.map((pyq) => {
                        const isSaved = savedPYQs.some(
                            (savedPyq) => savedPyq.pyqId._id === pyq._id
                        );

                        return (
                            <div
                                key={pyq._id}
                                className='bg-white border border-gray-200 p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col '
                            >
                                {/* Card Header with badges */}
                                <div className='flex justify-between items-center mb-3'>
                                    <div className='flex items-center gap-2'>
                                        {pyq.owner?.profilePicture ? (
                                            <img
                                                src={pyq.owner.profilePicture}
                                                alt={`${pyq.owner?.username}'s Profile`}
                                                className='rounded-full w-8 h-8 object-cover'
                                                loading='lazy'
                                            />
                                        ) : (
                                            <div className='flex items-center justify-center rounded-full w-8 h-8 bg-gray-300 text-white font-bold'>
                                                {pyq.owner?.username?.charAt(
                                                    0
                                                ) || 'A'}
                                            </div>
                                        )}
                                        <span className='text-sm font-medium text-gray-700 truncate max-w-[120px]'>
                                            {pyq.owner?.username || 'Anonymous'}
                                        </span>
                                    </div>

                                    <div className='flex gap-1'>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                requireLogin(() => {
                                                    if (isSaved) {
                                                        unsaveResource(
                                                            'pyq',
                                                            pyq._id
                                                        );
                                                    } else {
                                                        saveResource(
                                                            'pyq',
                                                            pyq._id
                                                        );
                                                    }
                                                });
                                            }}
                                            className={`p-1 rounded-full ${
                                                isSaved
                                                    ? 'text-blue-500'
                                                    : 'text-gray-400 hover:text-blue-500'
                                            }`}
                                            title={
                                                isSaved
                                                    ? 'Unsave this PYQ'
                                                    : 'Save this PYQ'
                                            }
                                            aria-label={
                                                isSaved
                                                    ? 'Unsave this PYQ'
                                                    : 'Save this PYQ'
                                            }
                                        >
                                            <i className='fa-solid fa-bookmark text-lg'></i>
                                        </button>
                                    </div>
                                </div>

                                {/* PYQ Info */}
                                <div className='mb-4'>
                                    <h3 className='text-lg font-bold text-gray-800 mb-1'>
                                        {pyq.year}
                                    </h3>
                                    <p className='text-sm text-gray-600 mb-1'>
                                        {pyq.examType}
                                    </p>
                                    <div className='flex items-center text-xs text-gray-500'>
                                        <i className='fa-solid fa-eye mr-1'></i>
                                        <span>{pyq.clickCounts} views</span>
                                    </div>
                                </div>
                                {/* Badges */}
                                <div className='flex gap-2 mb-2'>
                                    {pyq.solved && (
                                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 flex-shrink-0'>
                                            <svg
                                                className='w-3 h-3 mr-1'
                                                fill='currentColor'
                                                viewBox='0 0 20 20'
                                                xmlns='http://www.w3.org/2000/svg'
                                            >
                                                <path
                                                    fillRule='evenodd'
                                                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                                    clipRule='evenodd'
                                                />
                                            </svg>
                                            Solved
                                        </span>
                                    )}
                                    {pyq.isPaid && (
                                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 flex-shrink-0'>
                                            <svg
                                                className='w-3 h-3 mr-1'
                                                fill='currentColor'
                                                viewBox='0 0 20 20'
                                                xmlns='http://www.w3.org/2000/svg'
                                            >
                                                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                                            </svg>
                                            Premium
                                        </span>
                                    )}
                                </div>

                                {/* Card Actions */}
                                <div className='flex justify-center mt-auto pt-2 border-t border-gray-100'>
                                    {pyq.owner._id === ownerId ? (
                                        <div className='flex gap-2 w-full'>
                                            <Link
                                                to={pyq.slug}
                                                className={`w-full flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                                                    pyq.isPaid
                                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg'
                                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                                                }`}
                                            >
                                                <i className='fa-solid fa-eye'></i>
                                                <span>View</span>
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleEditClick(pyq)
                                                }
                                                className='text-gray-500 hover:text-gray-700 transition-colors p-1.5'
                                                title='Edit PYQ'
                                                aria-label='Edit PYQ'
                                            >
                                                <i className='fa-regular fa-pen-to-square'></i>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteClick(pyq._id)
                                                }
                                                className='text-red-500 hover:text-red-600 transition-colors p-1.5'
                                                title='Delete PYQ'
                                                aria-label='Delete PYQ'
                                            >
                                                <i className='fa-solid fa-trash'></i>
                                            </button>
                                        </div>
                                    ) : pyq.purchasedBy?.includes(ownerId) ? (
                                        <Link
                                            to={pyq.slug}
                                            className={`w-full flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                                                pyq.isPaid
                                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                                            }`}
                                        >
                                            <i className='fa-solid fa-eye'></i>
                                            <span>View</span>
                                        </Link>
                                    ) : pyq.isPaid ? (
                                        <button
                                            onClick={() =>
                                                handleBuyNowClick(pyq)
                                            }
                                            className='bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-full text-sm flex items-center justify-center gap-1 w-full'
                                        >
                                            <i className='fa-solid fa-cart-shopping'></i>
                                            <span>
                                                Buy Now {pyq.price / 5}₹
                                            </span>
                                        </button>
                                    ) : (
                                        <Link
                                            to={pyq.slug}
                                            className={`w-full flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                                                pyq.isPaid
                                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg'
                                                    : 'bg-sky-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                                            }`}
                                        >
                                            <i className='fa-solid fa-eye'></i>
                                            <span>View</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className='col-span-full flex flex-col items-center justify-center py-16 px-4'>
                        <i className='fa-solid fa-file-circle-xmark text-4xl text-gray-400 mb-4'></i>
                        <p className='text-xl font-medium text-gray-600 text-center'>
                            No PYQs available for this subject yet.
                        </p>
                        <p className='text-gray-500 mt-2 text-center'>
                            Be the first to contribute by adding a previous year
                            question paper.
                        </p>
                        <button
                            onClick={handleOpenAddPyqModal}
                            className='mt-6 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md flex items-center gap-2'
                        >
                            <i className='fa-solid fa-plus'></i> Add PYQ
                        </button>
                    </div>
                )}
            </div>

            {/* Earn Rewards Info Modal */}
            {showEarnDialog && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4'>
                    <div className='bg-white p-5 rounded-lg shadow-xl w-full max-w-md'>
                        <div className='mb-4 text-gray-800'>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-xl font-bold'>
                                    Earn Rewards
                                </h2>
                                <button
                                    onClick={handleEarnDialog}
                                    className='p-1 hover:bg-gray-100 rounded-full'
                                    aria-label='Close'
                                >
                                    <i className='fa-solid fa-xmark text-xl'></i>
                                </button>
                            </div>
                            <div className='mt-4'>
                                <p className='font-medium'>
                                    Upload PYQs and earn reward points:
                                </p>
                                <ul className='list-disc ml-6 mt-2 space-y-1'>
                                    <li>1 PYQ upload = 10 reward points</li>
                                    <li>Rewards are given after approval</li>
                                    <li>Duplicate PYQs are not allowed</li>
                                    <li>
                                        PYQs should not be older than 2 years
                                    </li>
                                </ul>
                                <div className='mt-4 bg-blue-50 p-3 rounded-lg'>
                                    <p className='text-sm text-blue-800'>
                                        <i className='fa-solid fa-info-circle mr-2'></i>
                                        Your current reward balance:{' '}
                                        {rewardBalance || 0} points
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add PYQ Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title={`Add PYQ - ${capitalizeWords(collegeName)}`}
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

            {/* Buy Modal */}
            <ConfirmPurchaseModal
                isOpen={isBuyNowModalOpen}
                onClose={handleCloseBuyNowModal}
                selectedResource={selectedPyq}
                rewardBalance={rewardBalance}
                handleOnlinePayment={handleOnlinePayment}
                handleConfirmPurchase={handleConfirmPurchase}
                viewDemoPath={`${selectedPyq?.slug}`}
                title={'Buy This PYQ'}
            />

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteDialog}
                onClose={() => {
                    setShowDeleteDialog(false);
                    setpyqIdtoDelete(null);
                }}
                title='Confirm Deletion'
                footer={
                    <div className='flex py-3 gap-3 justify-end'>
                        <button
                            className='px-4 py-2 bg-white rounded-lg text-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                            onClick={() => {
                                setShowDeleteDialog(false);
                                setpyqIdtoDelete(null);
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className='px-4 py-2 bg-red-600 rounded-lg text-sm font-medium text-white hover:bg-red-700 disabled:opacity-70'
                            onClick={handleConfirmDelete}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? (
                                <i className='fa fa-spinner fa-spin'></i>
                            ) : (
                                <>
                                    <span>Delete</span>
                                </>
                            )}
                        </button>
                    </div>
                }
            >
                <div className='p-1'>
                    <p className='mb-2'>
                        Are you sure you want to delete this PYQ?
                    </p>
                    <p className='text-sm text-gray-500'>
                        This action cannot be undone.
                    </p>
                </div>
            </Modal>

            {/* Edit PYQ Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title='Edit PYQ'
            >
                <div className='space-y-4 p-1'>
                    <div className='flex items-center gap-2'>
                        <label
                            htmlFor='isPaid'
                            className='font-medium text-gray-800'
                        >
                            Make this PYQ paid:
                        </label>
                        <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                            <input
                                type='checkbox'
                                id='isPaid'
                                name='isPaid'
                                checked={editPyqData.isPaid}
                                onChange={handleEditChange}
                                className='toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer'
                            />
                            <label
                                htmlFor='isPaid'
                                className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                                    editPyqData.isPaid
                                        ? 'bg-green-400'
                                        : 'bg-gray-300'
                                }`}
                            ></label>
                        </div>
                    </div>

                    {editPyqData.isPaid && (
                        <div className='mt-3'>
                            <label
                                htmlFor='price'
                                className='block font-medium text-gray-800 mb-1'
                            >
                                Price (in points):
                            </label>
                            <input
                                type='number'
                                id='price'
                                name='price'
                                value={editPyqData.price}
                                onChange={handleEditChange}
                                className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500'
                                min='1'
                                placeholder='Enter price in points'
                            />
                            <p className='text-xs text-gray-500 mt-1'>
                                Users will pay {editPyqData.price / 5}₹ or{' '}
                                {editPyqData.price} points
                            </p>
                        </div>
                    )}

                    <div className='flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100'>
                        <button
                            onClick={() => setIsEditModalOpen(false)}
                            className='px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdatePyq}
                            className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-70'
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <i className='fa fa-spinner fa-spin mr-2'></i>
                                    Updating
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Add this CSS for toggle button */}
            <style jsx>{`
                .toggle-checkbox:checked {
                    right: 0;
                    border-color: #68d391;
                }
                .toggle-label {
                    transition: background-color 0.2s ease;
                }
                .toggle-checkbox {
                    right: 0;
                    transition: all 0.2s ease;
                    border-color: #cbd5e0;
                }
                .toggle-checkbox:checked + .toggle-label {
                    background-color: #68d391;
                }
            `}</style>
        </div>
    );
}

export default SubjectPyqs;
