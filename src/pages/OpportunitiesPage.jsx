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
import Button from '../ui/Button';

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
          toast.success('Opportunity added successfully. Pending approval.');
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
            { ...newGiveOpportunity, college: collegeId },
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
    <div className="min-h-screen min-w-full bg-gradient-to-b from-white to-sky-100">
      <CollegeLinks />
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-2">
            Opportunities
          </h1>
          <h2 className="text-xl font-semibold text-sky-600 mb-4">
            {capitalizeWords(collegeName)}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover job and internship opportunities available at your college.
          </p>
          <Seo
            title={`Opportunities - ${capitalizeWords(collegeName)}`}
            desc="Get job and internship opportunities in your college."
          />
        </div>

        <div className="flex justify-center mb-10">
          <Button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i>
            Add New Opportunity
          </Button>
        </div>

        {/* Add Opportunity Modal */}
        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <OpportunityForm
              opportunity={newGiveOpportunity}
              onChange={setNewGiveOpportunity}
              onSubmit={handleGiveOpportunitySubmit}
              buttonText="Submit Opportunity"
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
              buttonText="Update Opportunity"
            />
          </Modal>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && (
          <Modal onClose={handleCloseDialog}>
            <div className="p-6 bg-white rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                Delete Confirmation
              </h3>
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete this opportunity?
              </p>
              <p className="text-sm text-gray-500 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCloseDialog}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 font-medium flex items-center gap-2"
                  disabled={loadingStates[opportunityIdDelete]}
                >
                  {loadingStates[opportunityIdDelete] ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <>
                      <i className="fa-solid fa-trash"></i>
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Opportunities List */}
        <div className="mt-6">
          {giveOpportunitiesError && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-center mb-6">
              <i className="fa-solid fa-circle-exclamation mr-2"></i>
              Failed to load opportunities: {giveOpportunitiesError}
            </div>
          )}

          {giveOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {giveOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity._id}
                  opportunity={opportunity}
                  ownerId={ownerId}
                  onDeleteClick={() => handleDeleteClick(opportunity._id)}
                  onEditClick={() => handleEditClick(opportunity)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center min-h-[300px] bg-white/50 rounded-xl p-8 border border-gray-200">
              {giveOpportunitiesLoading ? (
                <div className="text-center">
                  <i className="fas fa-spinner fa-pulse fa-3x text-sky-500 mb-4"></i>
                  <p className="text-gray-600">Loading opportunities...</p>
                </div>
              ) : (
                <div className="text-center">
                  <i className="fa-solid fa-briefcase text-4xl text-gray-400 mb-4"></i>
                  <p className="text-gray-600 text-lg font-medium mb-2">
                    No opportunities available
                  </p>
                  <p className="text-gray-500">
                    Be the first to add a job or internship opportunity!
                  </p>
                </div>
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
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 backdrop-blur-sm transition-all duration-300">
    <div className="bg-white p-4 rounded-xl shadow-xl w-full max-w-lg mx-4 transform transition-all duration-300">
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>
      </div>
      {children}
    </div>
  </div>
);

// OpportunityForm Component
const OpportunityForm = ({ opportunity, onChange, onSubmit, buttonText }) => (
  <form onSubmit={onSubmit} className="p-4">
    <h3 className="text-2xl font-bold mb-6 text-gray-800">
      {buttonText === 'Update Opportunity'
        ? 'Edit Opportunity'
        : 'Add New Opportunity'}
    </h3>

    <div className="space-y-5">
      <div>
        <label
          htmlFor="jobName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Job Title
        </label>
        <input
          id="jobName"
          type="text"
          placeholder="E.g. Frontend Developer, Marketing Intern"
          value={opportunity.name}
          onChange={(e) => onChange({ ...opportunity, name: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
          required
        />
      </div>

      <div>
        <label
          htmlFor="jobDescription"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Job Description
        </label>
        <textarea
          id="jobDescription"
          placeholder="Provide details about the role, requirements, and how to apply"
          value={opportunity.description}
          onChange={(e) =>
            onChange({ ...opportunity, description: e.target.value })
          }
          rows="4"
          className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
          required
        />
      </div>

      <div>
        <label
          htmlFor="whatsapp"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          WhatsApp Number (Optional)
        </label>
        <input
          id="whatsapp"
          type="number"
          placeholder="E.g. 9123456789"
          value={opportunity.whatsapp}
          onChange={(e) =>
            onChange({ ...opportunity, whatsapp: e.target.value })
          }
          className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Contact Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="E.g. jobs@company.com"
          value={opportunity.email}
          onChange={(e) => onChange({ ...opportunity, email: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
          required
        />
      </div>
    </div>

    <button
      type="submit"
      className="mt-6 px-5 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-md w-full transition-colors duration-200 font-medium flex items-center justify-center gap-2"
    >
      <i
        className={`fa-solid ${buttonText.includes('Update') ? 'fa-pen' : 'fa-paper-plane'}`}
      ></i>
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
  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-100 flex flex-col h-full">
    <div className="p-5 pb-3 flex-grow">
      <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2">
        {opportunity.name}
      </h3>
      <div className="bg-gray-50 p-4 rounded-lg mb-4 h-32 overflow-y-auto">
        <p className="text-gray-600 text-sm">
          {opportunity.description.length > 150
            ? `${opportunity.description.substring(0, 150)}...`
            : opportunity.description}
        </p>
      </div>
    </div>

    <div className="px-5 pb-5 flex flex-col">
      <Link
        to={`./${opportunity.slug}`}
        className="bg-sky-500 hover:bg-sky-600 py-2 px-4 rounded-lg text-white font-medium text-center transition-colors duration-200 flex items-center justify-center gap-2 mb-3"
      >
        <i className="fa-solid fa-eye"></i>
        View Details
      </Link>

      {opportunity.owner._id === ownerId && (
        <div className="flex justify-between items-center mt-1">
          <button
            onClick={onDeleteClick}
            className="text-red-500 hover:text-red-600 px-3 py-1 rounded-lg transition-colors duration-200 flex items-center gap-1"
            title="Delete Opportunity"
          >
            <i className="fa-solid fa-trash"></i>
            <span className="text-sm">Delete</span>
          </button>
          <button
            onClick={onEditClick}
            className="text-blue-500 hover:text-blue-600 px-3 py-1 rounded-lg transition-colors duration-200 flex items-center gap-1"
            title="Edit Opportunity"
          >
            <i className="fa-solid fa-pen"></i>
            <span className="text-sm">Edit</span>
          </button>
        </div>
      )}
    </div>
  </div>
);

export default OpportunitiesPage;
