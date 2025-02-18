import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import CollegeLinks from '../components/Links/CollegeLinks';
import Collegelink2 from '../components/Links/CollegeLink2';
import { capitalizeWords } from '../utils/Capitalize';
import { api } from '../config/apiConfiguration';
import { fetchGiveOpportunity } from '../redux/slices/giveOpportunitySlice';
import useApiRequest from '../hooks/useApiRequest';
import { useCollegeId } from '../hooks/useCollegeId';
import useRequireLogin from '../hooks/useRequireLogin';
import Seo from '../components/SEO/Seo';

const OpportunitiesPage = () => {
    const { collegeName } = useParams();
    const collegeId = useCollegeId(collegeName);
    const requireLogin = useRequireLogin();
    const dispatch = useDispatch();
    const { apiRequest } = useApiRequest();
    const currentUser = useSelector((state) => state.user.currentUser);
    const ownerId = currentUser?._id;

    const {
        giveOpportunities,
        loading: giveOpportunitiesLoading,
        error: giveOpportunitiesError,
    } = useSelector((state) => state.giveOpportunities || {});

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
                        'Opportunity added successfully. Pending approval.'
                    );
                } catch (err) {
                    toast.error('Error adding opportunity.');
                }
            } else {
                toast.error('College not found.');
            }
        });
    };

    const handleDeleteOpportunity = async (id) => {
        setLoadingStates((prev) => ({ ...prev, [id]: true }));
        try {
            await apiRequest(`${api.giveOpportunity}/${id}`, 'DELETE');
            dispatch(fetchGiveOpportunity(collegeId));
            toast.success('Opportunity deleted successfully.');
        } catch (error) {
            toast.error('Error deleting opportunity.');
        } finally {
            setLoadingStates((prev) => ({ ...prev, [id]: false }));
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
                <Seo
                    title={`Opportunities - ${capitalizeWords(collegeName)}`}
                    desc="Get job and internship opportunities in your college."
                />
                <div className="flex justify-center items-center my-3">
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-sky-500 hover:bg-blue-600 transition text-white rounded-lg shadow-md"
                    >
                        Add Opportunity
                    </button>
                </div>

                {/* Add Opportunity Modal */}
                {showModal && (
                    <Modal onClose={() => setShowModal(false)}>
                        <OpportunityForm
                            opportunity={newGiveOpportunity}
                            onChange={setNewGiveOpportunity}
                            onSubmit={handleGiveOpportunitySubmit}
                            buttonText="Submit"
                        />
                    </Modal>
                )}

                {/* Edit Opportunity Modal */}
                {showEditModal && (
                    <Modal onClose={() => setShowEditModal(false)}>
                        <OpportunityForm
                            opportunity={newGiveOpportunity}
                            onChange={setNewGiveOpportunity}
                            onSubmit={handleUpdateOpportunity}
                            buttonText="Update"
                        />
                    </Modal>
                )}

                {/* Delete Confirmation Dialog */}
                {showDeleteDialog && (
                    <Modal onClose={handleCloseDialog}>
                        <div className="p-6 bg-white rounded-lg">
                            <h3 className="text-2xl font-semibold mb-4">
                                Delete Confirmation
                            </h3>
                            <p>
                                Are you sure you want to delete this
                                opportunity?
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={handleCloseDialog}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                                    disabled={
                                        loadingStates[opportunityIdDelete]
                                    }
                                >
                                    {loadingStates[opportunityIdDelete] ? (
                                        <i className="fas fa-spinner fa-spin"></i>
                                    ) : (
                                        'Delete'
                                    )}
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}

                {/* Opportunities List */}
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
                                <OpportunityCard
                                    key={opportunity._id}
                                    opportunity={opportunity}
                                    ownerId={ownerId}
                                    onDeleteClick={() =>
                                        handleDeleteClick(opportunity._id)
                                    }
                                    onEditClick={() =>
                                        handleEditClick(opportunity)
                                    }
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center min-h-[300px]">
                            {giveOpportunitiesLoading ? (
                                <i className="fas fa-spinner fa-pulse fa-5x text-sky-500"></i>
                            ) : (
                                <p className="text-gray-600 text-lg">
                                    No opportunities available at the moment.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Collegelink2 />
        </div>
    );
};

// Modal Component
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

// OpportunityForm Component
const OpportunityForm = ({ opportunity, onChange, onSubmit, buttonText }) => (
    <form onSubmit={onSubmit} className="p-6 bg-white rounded-lg">
        <h3 className="text-2xl font-semibold mb-4">Provide Job Details</h3>
        <input
            type="text"
            placeholder="Job Name"
            value={opportunity.name}
            onChange={(e) => onChange({ ...opportunity, name: e.target.value })}
            className="p-3 border rounded-lg mb-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
        />
        <textarea
            placeholder="Job Description"
            value={opportunity.description}
            onChange={(e) =>
                onChange({ ...opportunity, description: e.target.value })
            }
            className="p-3 border rounded-lg mb-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
        />
        <input
            type="number"
            placeholder="WhatsApp Number (Optional)"
            value={opportunity.whatsapp}
            onChange={(e) =>
                onChange({ ...opportunity, whatsapp: e.target.value })
            }
            className="p-3 border rounded-lg mb-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <input
            type="email"
            placeholder="Email"
            value={opportunity.email}
            onChange={(e) =>
                onChange({ ...opportunity, email: e.target.value })
            }
            className="p-3 border rounded-lg mb-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
        />
        <button
            type="submit"
            className="px-5 py-3 bg-sky-500 hover:bg-sky-600 transition text-white rounded-lg shadow-md w-full"
        >
            {buttonText}
        </button>
    </form>
);

// OpportunityCard Component
const OpportunityCard = ({
    opportunity,
    ownerId,
    onDeleteClick,
    onEditClick,
}) => (
    <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-200">
        <Link to={`./${opportunity.slug}`} className="block">
            <h3 className="sm:text-xl font-bold mb-3 text-gray-700">
                {opportunity.name}
            </h3>
            <div className="bg-gray-100 p-3 rounded-lg mb-4 max-h-32 overflow-y-auto">
                <p className="text-gray-600 line-clamp-2">
                    {opportunity.description}
                </p>
            </div>
            <Link
                to={`./${opportunity.slug}`}
                className="block bg-sky-400 py-1 px-4 rounded-lg w-fit text-gray-100"
            >
                View
            </Link>
        </Link>
        {opportunity.owner._id === ownerId && (
            <div className="flex justify-between items-center mt-3">
                <button
                    onClick={onDeleteClick}
                    className="text-red-500 px-2 rounded-lg"
                    title="Delete Post"
                >
                    <i className="fa-solid fa-trash fa-xl"></i>
                </button>
                <button
                    onClick={onEditClick}
                    className="text-blue-500 px-2 rounded-lg"
                    title="Edit Post"
                >
                    <i className="fa-solid fa-pen fa-xl"></i>
                </button>
            </div>
        )}
    </div>
);

export default OpportunitiesPage;
