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

function SubjectPyqs() {
    const { collegeName, courseCode, subjectCode, branchCode } = useParams();
    const collegeId = useCollegeId(collegeName);
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

    const handleBuyNowClick = (pyq) => {
        setSelectedPyq(pyq);
        setBuyNowModalOpen(true);
    };

    const handleCloseBuyNowModal = () => {
        setBuyNowModalOpen(false);
        setSelectedPyq(null);
    };

    const currentUser = useSelector((state) => state.user.currentUser);
    const ownerId = currentUser?._id;

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchUserData());
        dispatch(fetchSavedCollection());
    }, [dispatch]);
    useEffect(() => {
        dispatch(fetchSubjectPyqs({ subjectCode, branchCode, collegeId }));
    }, [collegeId, subjectCode, branchCode]);

    const { rewardBalance } = useSelector((state) => state.userData || {});

    const {
        subjectPyqs,
        subjectName,
        loading: loadingSubjectPyqs,
        error: PyqsError,
    } = useSelector((state) => state.subjectPyqs || {});

    const { savedPYQs } = useSelector((state) => state.savedCollection);
    console.log(savedPYQs);

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

    const handleConfirmPurchase = async () => {
        handleConfirmPurchaseUtil(
            selectedPyq,
            api.newPyqs,
            navigate,
            () => setBuyNowModalOpen(false),
            `/${collegeName}/resources/${courseCode}/${branchCode}/pyqs/${subjectCode}/${selectedPyq.slug}`
        );
    };

    const { apiRequest } = useApiRequest();

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
            console.log(err);
            toast.error('Failed to delete PYQ.');
        } finally {
            setDeleteLoading(false);
            setShowDeleteDialog(false);
            setpyqIdtoDelete(null);
        }
    };

    const handleSavePyq = async (pyqId) => {
        try {
            const response = await apiRequest(
                `${api.savedData.savePyq}/${pyqId}`,
                'POST'
            );

            toast.success(response.message);

            dispatch(fetchSavedCollection());
            dispatch(fetchSubjectPyqs({ subjectCode, branchCode, collegeId }));
        } catch (err) {
            console.error('Error saving PYQ:', err);
            toast.error('Failed to save PYQ');
        }
    };

    const handleUnsavePyq = async (pyqId) => {
        try {
            const response = await apiRequest(
                `${api.savedData.unsavePyq}/${pyqId}`,
                'POST'
            );

            toast.success(response.message);

            dispatch(fetchSavedCollection());
            dispatch(fetchSubjectPyqs({ subjectCode, branchCode, collegeId }));
        } catch (err) {
            console.error('Error unsaving PYQ:', err);
            toast.error('Failed to unsave PYQ');
        }
    };

    const handleCloseDialog = () => {
        setShowDeleteDialog(false);
        setpyqIdtoDelete(null);
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

    if (loadingSubjectPyqs) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <i className='fas fa-spinner fa-pulse fa-5x'></i>
            </div>
        );
    }

    if (PyqsError) {
        return (
            <div className='h-screen flex justify-center items-center'>
                <div>
                    <p className='text-center text-red-500 mb-4'>{PyqsError}</p>
                    <Link
                        to={`/${collegeName}/resources/${courseCode}/${branchCode}`}
                        className='bg-sky-500 text-white rounded-md px-4 py-2 mt-3 hover:bg-sky-600'
                    >
                        See Other Branches
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='container mx-auto p-4 min-h-screen'>
            <DetailPageNavbar
                path={`${collegeName}/resources/${courseCode}/${branchCode}?semester=${subjectPyqs[0]?.subject?.semester || 1
                    }`}
            />
            <h1 className='sm:text-2xl font-extrabold text-center sm:mb-6 text-gray-800'>
                {capitalizeWords(collegeName)}: {subjectName || subjectCode}{' '}
                PYQs
            </h1>
            <Seo
                title={`${capitalizeWords(collegeName)}: ${subjectName || subjectCode
                    } PYQs`}
                desc={subjectPyqs
                    .map((pyq) => `${pyq.year} ${pyq.examType}`)
                    .join(' ')}
            />

            <div className='flex justify-center gap-4 items-center sm:mb-8'>
                <Button onClick={handleOpenAddPyqModal}>
                    <i className='fa-solid fa-plus'></i> Add PYQs
                </Button>

                <Link
                    to={`/${collegeName}/resources/${courseCode}/${branchCode}/notes/${subjectCode}`}
                    className='px-4 py-2 bg-sky-400 hover:bg-sky-700 text-white rounded-md shadow-md transition-transform transform hover:scale-105'
                >
                    View Notes
                </Link>
                <button
                    className='rounded-full p-3 hover:bg-gray-200  transition-all'
                    onClick={handleEarnDialog}
                >
                    <i className='text-3xl fa-solid fa-circle-info text-gray-600 '></i>
                </button>
            </div>

            {showEarnDialog && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50'>
                    <div className='bg-white p-6 rounded-lg shadow-xl w-full lg:m-4 m-6 max-w-lg '>
                        <div className='items-center mb-4 text-white'>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-2xl font-bold text-gray-900  '>
                                    Earn Money
                                </h2>
                                <button onClick={handleEarnDialog}>
                                    <i className='fa-solid fa-xmark text-2xl text-gray-900  '></i>
                                </button>
                            </div>
                            <div className='text-gray-800  mt-2'>
                                <p>
                                    You can upload PYQs and earn reward points:
                                </p>
                                <ul className='list-disc ml-6 mt-2'>
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

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:mx-40 xl:grid-cols-4 gap-6 px-4 py-6'>
                {subjectPyqs.length > 0 ? (
                    subjectPyqs.map((pyq) => {
                        const isSaved = savedPYQs.some(
                            (savedPyq) => savedPyq.pyqId._id === pyq._id
                        );
                        return (
                            <div
                                key={pyq._id}
                                className='bg-white  border border-gray-200  p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 relative overflow-hidden'
                            >
                                <div className='absolute top-3 right-3 flex gap-2'>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            requireLogin(() => {
                                                if (isSaved) {
                                                    handleUnsavePyq(pyq._id);
                                                } else {
                                                    handleSavePyq(pyq._id);
                                                }
                                            });
                                        }}
                                        className={`p-1 rounded-full ${isSaved
                                            ? 'text-blue-500'
                                            : 'text-gray-400 hover:text-blue-500'
                                            }`}
                                        title={
                                            isSaved
                                                ? 'Unsave this PYQ'
                                                : 'Save this PYQ'
                                        }
                                    >
                                        <i
                                            className={`fa-solid fa-bookmark text-xl`}
                                        ></i>
                                    </button>

                                    {pyq.isPaid && (
                                        <span className='bg-red-200 text-red-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm'>
                                            Paid
                                        </span>
                                    )}
                                    {pyq.solved && (
                                        <span className='bg-green-200 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm'>
                                            Solved
                                        </span>
                                    )}
                                </div>

                                <div className='flex items-center gap-3 mb-4'>
                                    {pyq.owner?.profilePicture ? (
                                        <img
                                            src={pyq.owner.profilePicture}
                                            alt={`${pyq.owner?.username}'s Profile`}
                                            className='rounded-full w-10 h-10 border-2 border-gray-200  object-cover'
                                        />
                                    ) : (
                                        <div className='flex items-center justify-center rounded-full w-10 h-10 bg-gray-300 text-white font-bold text-sm'>
                                            {pyq.owner?.username?.charAt(0) ||
                                                'A'}
                                        </div>
                                    )}
                                    <span className='text-sm font-semibold text-gray-700 '>
                                        {pyq.owner?.username || 'Anonymous'}
                                    </span>
                                </div>

                                <div className='mb-4'>
                                    <h3 className='text-lg font-bold text-gray-800   mb-1'>
                                        {pyq.year}
                                    </h3>
                                    <p className='text-sm text-gray-600  mb-2'>
                                        {pyq.examType}
                                    </p>
                                    <span className='text-xs text-gray-500 '>
                                        {pyq.clickCounts} views
                                    </span>
                                </div>

                                <div className='flex items-center justify-center mt-4 space-x-3'>
                                    {pyq.owner._id === ownerId ? (
                                        <div className='flex space-x-2'>
                                            <Link
                                                to={pyq.slug}
                                                className='bg-sky-500 hover:bg-sky-600 text-white px-4 py-1.5 rounded-full shadow-md transition-transform transform hover:scale-105 flex items-center gap-1'
                                            >
                                                <i className='fa-solid fa-eye text-sm'></i>
                                                View
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleEditClick(pyq)
                                                }
                                                className='text-gray-500 hover:text-gray-700  transition-colors duration-200'
                                                title='Edit Pyq'
                                            >
                                                <i className='fa-regular fa-pen-to-square text-lg'></i>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteClick(pyq._id);
                                                }}
                                                className='text-red-500 hover:text-red-600 transition-colors duration-200'
                                                title='Delete Pyq'
                                            >
                                                <i className='fa-solid fa-trash text-lg'></i>
                                            </button>
                                        </div>
                                    ) : pyq.purchasedBy?.includes(ownerId) ? (
                                        <Link
                                            to={pyq.slug}
                                            className='bg-sky-500 hover:bg-sky-600 text-white px-4 py-1.5 rounded-full shadow-md transition-transform transform hover:scale-105 flex items-center gap-1'
                                        >
                                            <i className='fa-solid fa-eye text-sm'></i>
                                            View
                                        </Link>
                                    ) : pyq.isPaid ? (
                                        <button
                                            onClick={() =>
                                                handleBuyNowClick(pyq)
                                            }
                                            className='bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-full shadow-md transition-transform transform hover:scale-105 flex items-center gap-1'
                                        >
                                            <i className='fa-solid fa-cart-shopping text-sm'></i>
                                            Buy Now {pyq.price / 5}₹
                                        </button>
                                    ) : (
                                        <Link
                                            to={pyq.slug}
                                            className='bg-sky-500 hover:bg-sky-600 text-white px-4 py-1.5 rounded-full shadow-md transition-transform transform hover:scale-105 flex items-center gap-1'
                                        >
                                            <i className='fa-solid fa-eye text-sm'></i>
                                            View
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className='col-span-full text-center text-gray-600  py-10'>
                        <p className='text-xl font-semibold'>
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

            <ConfirmPurchaseModal
                isOpen={isBuyNowModalOpen}
                onClose={handleCloseBuyNowModal}
                selectedResource={selectedPyq}
                rewardBalance={rewardBalance}
                handleOnlinePayment={handleOnlinePayment}
                handleConfirmPurchase={handleConfirmPurchase}
                viewDemoPath={`${selectedPyq?.slug}`}
                title={'Buy This Pyq'}
            />

            <Modal
                isOpen={showDeleteDialog}
                onClose={handleCloseDialog}
                title='Delete Confirmation'
                footer={
                    <div className='flex py-4 gap-3 lg:justify-end justify-center'>
                        <button
                            className='p-1 py-2 bg-white rounded-lg px-4 border-gray-400 text-sm ring-1 ring-inset ring-gray-300 cursor-pointer'
                            onClick={handleCloseDialog}
                        >
                            Cancel
                        </button>
                        <button
                            className='p-1 py-2 bg-red-600 rounded-lg px-4 text-sm font-semibold text-white cursor-pointer'
                            onClick={handleConfirmDelete}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? (
                                <i className='fa fa-spinner fa-spin'></i>
                            ) : (
                                <>
                                    <span>Confirm</span>
                                    &nbsp;
                                    <i className='fa-solid fa-trash fa-xl'></i>
                                </>
                            )}
                        </button>
                    </div>
                }
            >
                <p>Are you sure you want to delete this note?</p>
                <p className='text-sm text-gray-500'>
                    This action cannot be undone.
                </p>
            </Modal>

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title='Edit PYQ'
            >
                <div className='space-y-4'>
                    <div className='flex items-center gap-2'>
                        <label
                            htmlFor='isPaid'
                            className='font-semibold text-gray-800  '
                        >
                            Is Paid:
                        </label>
                        <input
                            type='checkbox'
                            id='isPaid'
                            name='isPaid'
                            checked={editPyqData.isPaid}
                            onChange={handleEditChange}
                        />
                    </div>

                    {editPyqData.isPaid && (
                        <div>
                            <label
                                htmlFor='price'
                                className='block font-semibold text-gray-800  '
                            >
                                Price:
                            </label>
                            <input
                                type='number'
                                id='price'
                                name='price'
                                value={editPyqData.price}
                                onChange={handleEditChange}
                                className='w-full px-3 py-2 border rounded-md'
                                min='1'
                            />
                        </div>
                    )}

                    <button
                        onClick={handleUpdatePyq}
                        className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md'
                        disabled={submitting}
                    >
                        {submitting ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default SubjectPyqs;
