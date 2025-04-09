import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dialog from '../../utils/Dialog';

function SeniorCard({
    seniors = [],
    loadingStates,
    handleDelete,
    handleEdit,
    handleDetail,
}) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [seniorIdtoDelete, setSeniorIdtoDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);
    const { collegeName } = useParams();
    const currentUser = useSelector((state) => state.user.currentUser);
    const ownerId = currentUser?._id;

    const handleDeleteClick = (id) => {
        setSeniorIdtoDelete(id);
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            if (seniorIdtoDelete) {
                setDeleteLoading(true);
                await handleDelete(seniorIdtoDelete);
                setShowDeleteDialog(false);
                setSeniorIdtoDelete(null);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleCloseDialog = () => setShowDeleteDialog(false);

    if (seniors.length === 0) {
        return (
            <div className="text-center py-16 bg-gradient-to-b from-sky-50 to-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="bg-sky-100 rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center">
                    <svg className="w-12 h-12 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">No seniors available</h3>
                <p className="mt-2 text-gray-500 max-w-md mx-auto">
                    Check back later for updates or try adjusting your search criteria.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {seniors.map((senior) => {
                const isHovered = hoveredCard === senior._id;
                const isOwner = senior.owner._id === ownerId;

                return (
                    <div
                        key={senior._id}
                        className={`bg-white rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 ${isHovered ? 'shadow-lg transform -translate-y-1' : 'shadow-sm sm:shadow-md'} border border-gray-100`}
                        onMouseEnter={() => setHoveredCard(senior._id)}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        <Link to={`./${senior.slug}`} className="block">
                            {/* Profile Image with Gradient Overlay */}
                            <div className="relative h-36 sm:h-48 w-full overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-blue-900/30 z-10"></div>
                                <img
                                    src={senior.owner.profilePicture?.replace('=s96-c', '') || senior.profilePicture}
                                    alt={senior.name}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                    loading="lazy"
                                />

                                {/* Owner Badge - Only show on hover for small screens */}
                                {isOwner && (
                                    <div className={`absolute top-2 right-2 sm:top-3 sm:right-3 bg-blue-600 text-white text-xs px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md z-20 ${isHovered ? 'opacity-100' : 'opacity-0 sm:opacity-100'} transition-opacity duration-200`}>
                                        Your Profile
                                    </div>
                                )}
                            </div>

                            {/* Card Content */}
                            <div className="p-3 sm:p-4">
                                {/* Name with Highlight Bar */}
                                <div className="flex items-start mb-2 sm:mb-3">
                                    <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-sky-400 to-indigo-500 rounded-full mr-2 sm:mr-3"></div>
                                    <h3 className="text-sm sm:text-base font-semibold sm:font-bold text-gray-800 line-clamp-1">
                                        {senior.name}
                                    </h3>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3">
                                    <div className="bg-sky-50 rounded sm:rounded-lg p-1 sm:p-2">
                                        <p className="text-xs text-sky-600 font-medium mb-0.5 sm:mb-1">Course</p>
                                        <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                                            {senior.branch || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="bg-indigo-50 rounded sm:rounded-lg p-1 sm:p-2">
                                        <p className="text-xs text-indigo-600 font-medium mb-0.5 sm:mb-1">Year</p>
                                        <p className="text-xs sm:text-sm font-medium text-gray-800">
                                            {senior.year || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {/* Domain */}
                                <div className="bg-purple-50 rounded sm:rounded-lg p-1 sm:p-2 mb-3 sm:mb-4">
                                    <p className="text-xs text-purple-600 font-medium mb-0.5 sm:mb-1">Domain</p>
                                    <p className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2">
                                        {senior.domain || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </Link>

                        {/* Action Buttons */}
                        <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                            <div className="flex justify-between items-center">
                                <button
                                    className="flex items-center justify-center py-1.5 px-3 sm:py-2 sm:px-4 rounded sm:rounded-lg text-xs sm:text-sm font-medium bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:from-sky-600 hover:to-indigo-700 transition-all duration-300 shadow-sm"
                                    onClick={() => handleDetail(senior)}
                                >
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                    View
                                </button>

                                {isOwner && handleDelete && handleEdit && (
                                    <div className="flex space-x-1 sm:space-x-2">
                                        <button
                                            className="p-1.5 sm:p-2 rounded sm:rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-colors shadow-sm"
                                            onClick={() => handleEdit(senior)}
                                            aria-label="Edit senior profile"
                                        >
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                            </svg>
                                        </button>
                                        <button
                                            className="p-1.5 sm:p-2 rounded sm:rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow-sm"
                                            onClick={() => handleDeleteClick(senior._id)}
                                            aria-label="Delete senior profile"
                                        >
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Delete Confirmation Dialog */}
            <Dialog
                isOpen={showDeleteDialog}
                onClose={handleCloseDialog}
                title="Delete Senior Profile"
                footer={
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            onClick={handleCloseDialog}
                            disabled={deleteLoading}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-70 flex items-center"
                            onClick={handleConfirmDelete}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Deleting...
                                </>
                            ) : (
                                'Confirm Delete'
                            )}
                        </button>
                    </div>
                }
            >
                <div className="space-y-3">
                    <p className="text-gray-800">Are you sure you want to delete this senior profile?</p>
                    <p className="text-sm text-gray-500">This action cannot be undone. All associated data will be permanently removed.</p>
                </div>
            </Dialog>
        </div>
    );
}

export default SeniorCard;