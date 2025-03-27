import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from "../config/apiConfiguration";
import useApiRequest from "../hooks/useApiRequest";
import { originalHandleShare } from '../utils/handleShare';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';


const DetailPageNavbar = ({ path, handleShare = originalHandleShare }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const { apiRequest, apiloading, error } = useApiRequest();
    const url = api.contactus;
    const { currentUser } = useSelector((state) => state.user);

    const userDetail = `Name : ${currentUser?.username}
        Email : ${currentUser?.email}`;
    const [formData, setFormData] = useState({
        email: userDetail.length > 0 ? userDetail : "User Not Logged In",
        subject: "Reported URL: " + window.location.href,
        description: "",
    });

    const handleBackNavigation = () => {
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate(`/${path}`);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setShowReportModal(false);
            const response = await apiRequest(url, "POST", formData);
            toast.success(response.message)
            setFormData({ ...formData, description: "" });
        } catch (error) {
            console.error("Error:", error);
            toast.success('An error occurred while submitting the report.')
        }
    };

    return (
        <>
            <div className="fixed top-0 left-0 z-50 w-full bg-white shadow-md h-20 flex items-center justify-between px-5">
                <div className="text-gray-600 cursor-pointer" onClick={handleBackNavigation}>
                    <i className="fa-solid fa-arrow-left-long fa-2xl"></i>
                </div>
                <div className='flex gap-8'>
                    {/* Report Button */}
                    <div
                        className='text-center hover:text-blue-300 cursor-pointer'
                        onClick={() => setShowReportModal(true)}
                    >
                        <i className="fa-solid fa-flag"></i>
                        <p>Report</p>
                    </div>

                    {/* Share Button */}
                    <button
                        className="text-center hover:text-blue-300"
                        onClick={() => handleShare(setLoading)}
                        disabled={loading}
                    >
                        {loading ? (
                            <i className="fa fa-spinner fa-spin"></i>
                        ) : (
                            <div className='flex gap-8'>
                                <div>
                                    <i className="fa-regular fa-share-from-square fa-xl"></i>
                                    <p>Share</p>
                                </div>
                            </div>
                        )}
                    </button>
                </div>
            </div>

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold text-gray-700 mb-3">Report an Issue</h2>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                            rows="4"
                            placeholder="Describe the issue..."
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                                onClick={() => setShowReportModal(false)} // Fixed to close modal
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                onClick={handleSubmit} // Fixed to submit the report
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DetailPageNavbar;
