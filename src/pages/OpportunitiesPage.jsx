import React, { useState, useEffect } from 'react';
import CollegeLinks from '../components/Links/CollegeLinks';
import Collegelink2 from '../components/Links/CollegeLink2';
import { capitalizeWords } from '../utils/Capitalize.js';
import { useParams } from 'react-router-dom';
import { api } from '../config/apiConfiguration.js';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import useApiFetch from '../hooks/useApiFetch.js';
import useApiRequest from '../hooks/useApiRequest.js';
import { useCollegeId } from '../hooks/useCollegeId.js';
import { fetchGetOpportunity } from '../redux/slices/getOpportunitySlice.js';
import { fetchGiveOpportunity } from '../redux/slices/giveOpportunitySlice.js';
import useRequireLogin from '../hooks/useRequireLogin.js';

const OpportunitiesPage = () => {
    const { collegeName } = useParams();
    const collegeId = useCollegeId(collegeName);
    const requireLogin = useRequireLogin();
    const [showGetForm, setShowGetForm] = useState(false);
    const [showGiveForm, setShowGiveForm] = useState(false);
    const [loadingStates, setLoadingStates] = useState({});
    const [newGetOpportunity, setNewGetOpportunity] = useState({
        name: '',
        description: '',
        whatsapp: '',
        email: '',
    });
    const [newGiveOpportunity, setNewGiveOpportunity] = useState({
        name: '',
        description: '',
        whatsapp: '',
        email: '',
    });
    const [editingOpportunity, setEditingOpportunity] = useState(null);
    const [editedOpportunity, setEditedOpportunity] = useState({
        name: '',
        description: '',
        whatsapp: '',
        email: '',
    });
    const [isEditing, setIsEditing] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { useFetch, loadingFetch } = useApiFetch();
    const { apiRequest, loading } = useApiRequest();
    const currentUser = useSelector((state) => state.user.currentUser);
    const ownerId = currentUser?._id;

    const dispatch = useDispatch();
    const {
        getOpportunities,
        loading: getOpportunitiesLoading,
        error: getOpportunitiesError,
    } = useSelector((state) => state.getOpportunities);

    useEffect(() => {
        if (collegeId) {
            dispatch(fetchGetOpportunity(collegeId));
        }
    }, [collegeId, dispatch]);

    const handleGetOpportunitySubmit = async (e) => {
        e.preventDefault();

        if (!requireLogin()) return;

        if (collegeId) {
            try {
                await apiRequest(api.getOpportunity, 'POST', {
                    ...newGetOpportunity,
                    college: collegeId,
                });

                setNewGetOpportunity({
                    name: '',
                    description: '',
                    whatsapp: '',
                    email: '',
                });
                setShowGetForm(false);
                toast.success(
                    'Get Opportunity Added SuccessFully , Available Once Approved'
                );
            } catch (err) {
                console.error(err);
                toast.error(err);
            }
        } else {
            toast.error('College not found.');
        }
    };

    const handleEditClick = (opportunity) => {
        setEditingOpportunity(opportunity._id);
        setEditedOpportunity({
            name: opportunity.name,
            description: opportunity.description,
            whatsapp: opportunity.whatsapp,
            email: opportunity.email,
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleEditOpportunitySubmit = async (e) => {
        e.preventDefault();
        try {
            await apiRequest(
                `${api.getOpportunity}/${editingOpportunity}`,
                'PUT',
                editedOpportunity
            );
            dispatch(fetchGetOpportunity(collegeId));
            setEditingOpportunity(null);
            setIsModalOpen(false);
            toast.success('Get opportunity edited successfully');
        } catch (error) {
            console.error('Error updating opportunity:', error);
        }
    };

    const DeleteGetOpportunity = async (getOpportunitiesId) => {
        setLoadingStates((prev) => ({ ...prev, [getOpportunitiesId]: true }));
        try {
            await apiRequest(
                `${api.getOpportunity}/${getOpportunitiesId}`,
                'DELETE'
            );

            dispatch(fetchGetOpportunity(collegeId));

            toast.success('Get opportunity deleted successfully');
        } catch (error) {
            console.error('Error deleting Get Opportunity:', error);
        } finally {
            setLoadingStates((prev) => ({
                ...prev,
                [getOpportunitiesId]: false,
            }));
        }
    };

    const {
        giveOpportunities,
        loading: giveOpportunitiesLoading,
        error: giveOpportunitiesError,
    } = useSelector((state) => state.giveOpportunities || {});

    useEffect(() => {
        dispatch(fetchGiveOpportunity(collegeId));
    }, []);

    const handleGiveOpportunitySubmit = async (e) => {
        e.preventDefault();

        if (!requireLogin()) return;

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
                setShowGiveForm(false);
                toast.success(
                    'Give Opportunity Added SuccessFully , Available Once Approved'
                );
            } catch (err) {
                // toast.error(err);
                console.log(err);
            }
        } else {
            toast.error('College not found.');
        }
    };

    const handleGiveOpportunityClick = (opportunity) => {
        setEditingOpportunity(opportunity._id);
        setEditedOpportunity({
            name: opportunity.name,
            description: opportunity.description,
            whatsapp: opportunity.whatsapp,
            email: opportunity.email,
        });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleEditGiveOpportunitySubmit = async (e) => {
        e.preventDefault();
        try {
            await apiRequest(
                `${api.giveOpportunity}/${editingOpportunity}`,
                'PUT',
                editedOpportunity
            );

            dispatch(fetchGiveOpportunity(collegeId));

            setEditingOpportunity(null);
            setIsModalOpen(false);
            toast.success('Give opportunity updated successfully');
        } catch (error) {
            console.error('Error updating opportunity:', error);
        }
    };

    const DeleteGiveOpportunity = async (giveOpportunitiesId) => {
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

    return (
<div className="container bg-gradient-to-t from-sky-200 to-white min-h-screen min-w-full px-6 py-8">
    <CollegeLinks />

    <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <button
                onClick={() => setShowGiveForm(!showGiveForm)}
                className="px-5 py-3 bg-green-500 hover:bg-green-600 transition text-white rounded-lg shadow-md"
            >
                {showGiveForm ? 'Close Form' : 'Give Opportunity'}
            </button>
        </div>

        {showGiveForm && (
            <form
                onSubmit={handleGiveOpportunitySubmit}
                className="p-6 bg-white shadow-lg rounded-lg"
            >
                <h3 className="text-2xl font-semibold mb-4">Provide Job Details</h3>

                <input
                    type="text"
                    placeholder="Job Name"
                    value={newGiveOpportunity.name}
                    onChange={(e) => setNewGiveOpportunity({ ...newGiveOpportunity, name: e.target.value })}
                    className="p-3 border rounded-lg mb-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                />

                <textarea
                    placeholder="Job Description"
                    value={newGiveOpportunity.description}
                    onChange={(e) => setNewGiveOpportunity({ ...newGiveOpportunity, description: e.target.value })}
                    className="p-3 border rounded-lg mb-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                ></textarea>

                <input
                    type="number"
                    placeholder="WhatsApp Number (Optional)"
                    value={newGiveOpportunity.whatsapp}
                    onChange={(e) => setNewGiveOpportunity({ ...newGiveOpportunity, whatsapp: e.target.value })}
                    className="p-3 border rounded-lg mb-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={newGiveOpportunity.email}
                    onChange={(e) => setNewGiveOpportunity({ ...newGiveOpportunity, email: e.target.value })}
                    className="p-3 border rounded-lg mb-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                />

                <button type="submit" className="px-5 py-3 bg-sky-500 hover:bg-sky-600 transition text-white rounded-lg shadow-md">
                    Submit
                </button>
            </form>
        )}

        <div className="grid grid-cols-1 gap-6 mt-8">
            {giveOpportunitiesError && (
                <div className="text-red-500 text-center">
                    Failed to load opportunities: {error}
                </div>
            )}

            {giveOpportunities.length > 0 ? (
                giveOpportunities.map((opportunity) => (
                    <div key={opportunity._id} className="bg-white p-6 shadow-lg rounded-lg">
                        <h3 className="mb-2 text-lg font-semibold">
                            <strong>Job Name:</strong> {opportunity.name}
                        </h3>

                        <div className="bg-gray-100 mb-3 rounded-lg max-h-40 overflow-y-auto p-3">
                            <p>{opportunity.description}</p>
                        </div>

                        <div className="flex gap-3">
                            <a href={`https://api.whatsapp.com/send?phone=${opportunity.whatsapp}`} target="_blank" rel="noreferrer">
                                <button className="px-4 py-2 bg-sky-500 hover:bg-blue-500 transition text-white rounded-lg">
                                    Contact Us
                                </button>
                            </a>

                            <a href={`mailto:${opportunity.email}`} target="_blank" rel="noreferrer">
                                <button className="px-4 py-2 bg-sky-500 hover:bg-blue-500 transition text-white rounded-lg">
                                    Email Us
                                </button>
                            </a>

                            {opportunity.owner._id === ownerId && (
                                <>
                                    <button
                                        onClick={() => handleGiveOpportunityClick(opportunity)}
                                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 transition text-white rounded-lg"
                                    >
                                        <i className="fa-regular fa-pen-to-square"></i>
                                    </button>

                                    <button
                                        onClick={() => DeleteGiveOpportunity(opportunity._id)}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-400 transition text-white rounded-lg"
                                        disabled={loading[opportunity._id]}
                                    >
                                        {loadingStates[opportunity._id] ? (
                                            <i className="fa fa-spinner fa-spin"></i>
                                        ) : (
                                            <i className="fa-solid fa-trash"></i>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex justify-center items-center min-h-screen">
                    {giveOpportunitiesLoading ? (
                        <i className="fas fa-spinner fa-pulse fa-5x"></i>
                    ) : (
                        <p>No Opportunity available at the moment.</p>
                    )}
                </div>
            )}
        </div>
    </div>

    <Collegelink2 />
</div>

    );
};

const Modal = ({ isOpen, onClose, onSubmit, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 float-right"
                >
                    &times;
                </button>
                <form onSubmit={onSubmit} className="p-5">
                    {children}
                </form>
            </div>
        </div>
    );
};

export default OpportunitiesPage;
