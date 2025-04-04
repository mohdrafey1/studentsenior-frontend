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
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900 dark:text-white">No seniors available</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    Check back later for updates or try adjusting your search criteria.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {seniors.map((senior) => {
                const isHovered = hoveredCard === senior._id;
                const isOwner = senior.owner._id === ownerId;

                return (
                    <div
                        key={senior._id}
                        className={`bg-white rounded-lg md:rounded-xl border-2 ${isHovered ? 'border-blue-100 shadow-md md:shadow-xl' : 'border-blue-50 shadow-sm md:shadow-md'} overflow-hidden transition-all duration-300 flex flex-col h-full dark:bg-gray-800 dark:border-gray-700 group`}
                        onMouseEnter={() => setHoveredCard(senior._id)}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        {/* Profile Image with Blue Overlay - Adjusted for mobile */}
                        <div className="relative overflow-hidden h-40 sm:h-48 md:h-56">
                            <img
                                src={senior.owner.profilePicture.replace('=s96-c', '') || senior.profilePicture}
                                alt={senior.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"  // Added lazy loading for better performance
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {/* Card Content - Adjusted padding and text sizes for mobile */}
                        <div className="p-3 sm:p-4 md:p-5 flex-grow">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3 line-clamp-1">
                                {senior.name}
                            </h3>
                            <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                                <div className="flex flex-col">
                                    <span className="text-blue-600 dark:text-blue-400 mb-0.5 sm:mb-1 font-medium">Course</span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200 truncate">{senior.branch || 'N/A'}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-blue-600 dark:text-blue-400 mb-0.5 sm:mb-1 font-medium">Year</span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{senior.year || 'N/A'}</span>
                                </div>
                                <div className="flex flex-col col-span-2">
                                    <span className="text-blue-600 dark:text-blue-400 mb-0.5 sm:mb-1 font-medium">Domain</span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2">{senior.domain || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Card Footer - Larger touch targets for mobile */}
                        <div className="px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 bg-blue-50 dark:bg-blue-900/20 border-t-2 border-blue-100 dark:border-blue-900/30">
                            <div className="flex justify-between items-center">
                                <Link
                                    to={`/college/${collegeName}/seniors/${senior.slug}`}
                                    className="flex items-center justify-center py-2 px-3 sm:py-2.5 sm:px-5 rounded-md md:rounded-lg text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-sm sm:shadow-md hover:shadow-lg transition-all active:scale-95"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDetail(senior);
                                    }}
                                >
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                    View
                                </Link>

                                {isOwner && handleDelete && handleEdit && (
                                    <div className="flex space-x-1 sm:space-x-2">
                                        <button
                                            className="p-2 sm:p-2.5 rounded-md md:rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors hover:text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900/70 active:scale-95"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleEdit(senior);
                                            }}
                                            aria-label="Edit senior"
                                        >
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                            </svg>
                                        </button>
                                        <button
                                            className="p-2 sm:p-2.5 rounded-md md:rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors hover:text-red-700 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/70 active:scale-95"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleDeleteClick(senior._id);
                                            }}
                                            aria-label="Delete senior"
                                        >
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

            <Dialog
                isOpen={showDeleteDialog}
                onClose={handleCloseDialog}
                title="Delete Senior Profile"
                footer={
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={handleCloseDialog}
                            disabled={deleteLoading}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            onClick={handleConfirmDelete}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Deleting...
                                </span>
                            ) : (
                                'Confirm Delete'
                            )}
                        </button>
                    </div>
                }
            >
                <div className="space-y-2">
                    <p className="text-gray-800 dark:text-gray-200">Are you sure you want to delete this senior profile?</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone. All associated data will be permanently removed.</p>
                </div>
            </Dialog>
        </div>
    );
}

export default SeniorCard;