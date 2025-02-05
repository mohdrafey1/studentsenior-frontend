import React, { useState, useEffect } from 'react';
import CollegeLinks from '../components/Links/CollegeLinks';
import Collegelink2 from '../components/Links/CollegeLink2';
import { capitalizeWords } from '../utils/Capitalize.js';
import { Link, useParams } from 'react-router-dom';
import { api } from '../config/apiConfiguration.js';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import useApiRequest from '../hooks/useApiRequest.js';
import { useCollegeId } from '../hooks/useCollegeId.js';
import { fetchGiveOpportunity } from '../redux/slices/giveOpportunitySlice.js';
import useRequireLogin from '../hooks/useRequireLogin.js';
import Dialog from '../utils/Dialog.jsx';

const OpportunitiesPage = () => {
    const { collegeName } = useParams();
    const collegeId = useCollegeId(collegeName);
    const requireLogin = useRequireLogin();
    const [newGiveOpportunity, setNewGiveOpportunity] = useState({
        name: '',
        description: '',
        whatsapp: '',
        email: '',
    });
    const [loadingStates, setLoadingStates] = useState({});
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [opportunityIdDelete, setOpportunityIdDelete] = useState(null);
    const [editingOpportunity, setEditingOpportunity] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const { apiRequest } = useApiRequest();
    const currentUser = useSelector((state) => state.user.currentUser);
    const ownerId = currentUser?._id;

    const dispatch = useDispatch();
    const {
        giveOpportunities,
        loading: giveOpportunitiesLoading,
        error: giveOpportunitiesError,
    } = useSelector((state) => state.giveOpportunities || {});

    useEffect(() => {
        if (collegeId) {
            dispatch(fetchGiveOpportunity(collegeId));
        }
    }, [collegeId, dispatch]);

    const handleGiveOpportunitySubmit = async (e) => {
        e.preventDefault();

        requireLogin(async () => {
            if (collegeId) {
                try {
                    await apiRequest(`${api.giveOpportunity}`, 'POST', {
                        ...newGiveOpportunity,
                        college: collegeId,
                    });

                    setNewGiveOpportunity({
                        name: '',
                        description: '',
                        whatsapp: '',
                        email: '',
                    });
                    setShowModal(false);
                    toast.success(
                        'Give Opportunity Added Successfully. Available once approved.'
                    );
                } catch (err) {
                    console.log('Error adding opportunity:', err);
                }
            } else {
                toast.error('College not found.');
            }
        });
    };

    const handleDeleteOpportunity = async (giveOpportunitiesId) => {
        setLoadingStates((prev) => ({ ...prev, [giveOpportunitiesId]: true }));
        try {
            await apiRequest(
                `${api.giveOpportunity}/${giveOpportunitiesId}`,
                'DELETE'
            );

            dispatch(fetchGiveOpportunity(collegeId));

            toast.success('Give opportunity deleted successfully');
        } catch (error) {
            console.error('Error deleting Give Opportunity:', error);
        } finally {
            setLoadingStates((prev) => ({
                ...prev,
                [giveOpportunitiesId]: false,
            }));
        }
    };

    const handleDeleteClick = (opportunityId) => {
        setOpportunityIdDelete(opportunityId);
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!opportunityIdDelete) return;

        setLoadingStates((prev) => ({
            ...prev,
            [opportunityIdDelete]: true,
        }));

        try {
            await handleDeleteOpportunity(opportunityIdDelete);
        } catch (error) {
            toast.error('Error deleting opportunity.');
        } finally {
            setLoadingStates((prev) => ({
                ...prev,
                [opportunityIdDelete]: false,
            }));
            setShowDeleteDialog(false);
            setOpportunityIdDelete(null);
        }
    };

    const handleCloseDialog = () => {
        setShowDeleteDialog(false);
        setOpportunityIdDelete(null);
    };

    const handleEditClick = (opportunity) => {
        setEditingOpportunity(opportunity);
        setNewGiveOpportunity({
            name: opportunity.name,
            description: opportunity.description,
            whatsapp: opportunity.whatsapp || '',
            email: opportunity.email,
        });
        setShowEditModal(true);
    };

    const handleUpdateOpportunity = async (e) => {
        e.preventDefault();

        requireLogin(async () => {
            if (editingOpportunity && collegeId) {
                try {
                    await apiRequest(
                        `${api.giveOpportunity}/${editingOpportunity._id}`,
                        'PUT',
                        { ...newGiveOpportunity, college: collegeId }
                    );

                    setNewGiveOpportunity({
                        name: '',
                        description: '',
                        whatsapp: '',
                        email: '',
                    });
                    setShowEditModal(false);
                    setEditingOpportunity(null);
                    dispatch(fetchGiveOpportunity(collegeId));
                    toast.success('Opportunity updated successfully.');
                } catch (err) {
                    toast.error('Error updating opportunity.');
                }
            }
        });
    };

    return (
        <div className="container bg-gradient-to-t from-sky-200 to-white min-h-screen px-6 py-8 min-w-full">
            <CollegeLinks />

            <div className="max-w-7xl mx-auto">
                <h1 className="text-lg sm:text-3xl font-bold mb-4 text-center">
                    Opportunities - {capitalizeWords(collegeName)}
                </h1>

                <div className="flex justify-center items-center my-3">
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-sky-500 hover:bg-blue-600 transition text-white rounded-lg shadow-md"
                    >
                        Add Opportunity
                    </button>
                </div>

                {/* Modal for Adding Opportunity */}
                {showModal && (
                    <Modal onClose={() => setShowModal(false)}>
                        <form
                            onSubmit={handleGiveOpportunitySubmit}
                            className="p-6 bg-white rounded-lg"
                        >
                            <h3 className="text-2xl font-semibold mb-4">
                                Provide Job Details
                            </h3>

                            <input
                                type="text"
                                placeholder="Job Name"
                                value={newGiveOpportunity.name}
                                onChange={(e) =>
                                    setNewGiveOpportunity({
                                        ...newGiveOpportunity,
                                        name: e.target.value,
                                    })
                                }
                                className="p-3 border rounded-lg mb-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                                required
                            />

                            <textarea
                                placeholder="Job Description"
                                value={newGiveOpportunity.description}
                                onChange={(e) =>
                                    setNewGiveOpportunity({
                                        ...newGiveOpportunity,
                                        description: e.target.value,
                                    })
                                }
                                className="p-3 border rounded-lg mb-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                                required
                            ></textarea>

                            <input
                                type="number"
                                placeholder="WhatsApp Number (Optional)"
                                value={newGiveOpportunity.whatsapp}
                                onChange={(e) =>
                                    setNewGiveOpportunity({
                                        ...newGiveOpportunity,
                                        whatsapp: e.target.value,
                                    })
                                }
                                className="p-3 border rounded-lg mb-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />

                            <input
                                type="email"
                                placeholder="Email"
                                value={newGiveOpportunity.email}
                                onChange={(e) =>
                                    setNewGiveOpportunity({
                                        ...newGiveOpportunity,
                                        email: e.target.value,
                                    })
                                }
                                className="p-3 border rounded-lg mb-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                                required
                            />

                            <button
                                type="submit"
                                className="px-5 py-3 bg-sky-500 hover:bg-sky-600 transition text-white rounded-lg shadow-md w-full"
                            >
                                Submit
                            </button>
                        </form>
                    </Modal>
                )}

                <div className="grid grid-cols-1 gap-6 mt-8">
                    {giveOpportunitiesError && (
                        <div className="text-red-500 text-center">
                            Failed to load opportunities:{' '}
                            {giveOpportunitiesError}
                        </div>
                    )}

                    {giveOpportunities.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                            {giveOpportunities.map((opportunity) => (
                                <div
                                    key={opportunity._id}
                                    className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-200"
                                >
                                    <Link
                                        to={`./${opportunity.slug}`}
                                        className="block"
                                    >
                                        <h3 className="sm:text-xl font-bold mb-3 text-gray-700">
                                            {opportunity.name}
                                        </h3>
                                        <div className="bg-gray-100 p-3 rounded-lg mb-4 max-h-32 overflow-y-auto">
                                            <p className="text-gray-600 line-clamp-2">
                                                {opportunity.description}
                                            </p>
                                        </div>
                                    </Link>
                                    <div className="flex justify-between items-center mt-3">
                                        {opportunity.owner._id === ownerId && (
                                            <div>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteClick(
                                                            opportunity._id
                                                        )
                                                    }
                                                    className="text-red-500 px-2 rounded-lg"
                                                    title="Delete Post"
                                                >
                                                    <i className="fa-solid fa-trash fa-xl"></i>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleEditClick(
                                                            opportunity
                                                        )
                                                    }
                                                    className="text-blue-500 px-2 rounded-lg"
                                                    title="Edit Post"
                                                >
                                                    <i className="fa-solid fa-pen fa-xl"></i>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center min-h-[300px]">
                            {giveOpportunitiesLoading ? (
                                <i className="fas fa-spinner fa-pulse fa-5x text-sky-500"></i>
                            ) : (
                                <p className="text-gray-600 text-lg">
                                    No Opportunity available at the moment.
                                </p>
                            )}
                        </div>
                    )}

                    {showDeleteDialog && (
                        <Dialog
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
                                        disabled={
                                            loadingStates[opportunityIdDelete]
                                        }
                                    >
                                        {loadingStates[opportunityIdDelete] ? (
                                            <i className="fa fa-spinner fa-spin"></i>
                                        ) : (
                                            <>
                                                <span>Confirm</span>
                                                &nbsp;
                                                <i className="fa-solid fa-trash fa-xl text-sm"></i>
                                            </>
                                        )}
                                    </button>
                                </div>
                            }
                        >

                            <p>Are you sure you want to delete this item?</p>
                            <p className="text-sm text-gray-500">
                                This action cannot be undone.
                            </p>
                        </Dialog>
                    )}
                    {showEditModal && (
                        <Modal onClose={() => setShowEditModal(false)}>
                            <form
                                onSubmit={handleUpdateOpportunity}
                                className="p-6 bg-white"
                            >
                                <h3 className="text-2xl font-semibold mb-4">
                                    Edit Job Details
                                </h3>
                                <input
                                    type="text"
                                    placeholder="Job Name"
                                    value={newGiveOpportunity.name}
                                    onChange={(e) =>
                                        setNewGiveOpportunity({
                                            ...newGiveOpportunity,
                                            name: e.target.value,
                                        })
                                    }
                                    className="p-3 border rounded-lg mb-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    required
                                />
                                <textarea
                                    placeholder="Job Description"
                                    value={newGiveOpportunity.description}
                                    onChange={(e) =>
                                        setNewGiveOpportunity({
                                            ...newGiveOpportunity,
                                            description: e.target.value,
                                        })
                                    }
                                    className="p-3 border rounded-lg mb-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="WhatsApp Number (Optional)"
                                    value={newGiveOpportunity.whatsapp}
                                    onChange={(e) =>
                                        setNewGiveOpportunity({
                                            ...newGiveOpportunity,
                                            whatsapp: e.target.value,
                                        })
                                    }
                                    className="p-3 border rounded-lg mb-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={newGiveOpportunity.email}
                                    onChange={(e) =>
                                        setNewGiveOpportunity({
                                            ...newGiveOpportunity,
                                            email: e.target.value,
                                        })
                                    }
                                    className="p-3 border rounded-lg mb-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="px-5 py-3 bg-sky-500 hover:bg-sky-600 transition text-white rounded-lg shadow-md w-full"
                                >
                                    Update
                                </button>
                            </form>
                        </Modal>
                    )}
                </div>
            </div>

            <Collegelink2 />
        </div>
    );
};

const Modal = ({ onClose, children }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-2 lg:m-0 m-4 rounded-2xl shadow-md w-full max-w-lg">
            <button
                onClick={onClose}
                className="text-gray-500 text-4xl hover:text-gray-700 float-right pr-4 pt-2"
            >
                &times;
            </button>
            {children}
        </div>
    </div>
);

export default OpportunitiesPage;
