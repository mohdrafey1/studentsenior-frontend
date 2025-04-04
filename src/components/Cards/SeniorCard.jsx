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
                        className={`bg-white rounded-xl border ${isHovered ? 'border-blue-200 shadow-lg' : 'border-gray-100 shadow-sm'} overflow-hidden transition-all duration-300 flex flex-col h-full dark:bg-gray-800 dark:border-gray-700`}
                        onMouseEnter={() => setHoveredCard(senior._id)}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        {/* Profile Image */}
                        <div className="overflow-hidden h-48 lg:h-56">
                            <img
                                src={senior.owner.profilePicture.replace('=s96-c', '') || senior.profilePicture}
                                alt={senior.name}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                        </div>

                        {/* Card Content */}
                        <div className="p-4 flex-grow">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-1">
                                {senior.name}
                            </h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex flex-col">
                                    <span className="text-gray-500 dark:text-gray-400 mb-1">Course</span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{senior.branch || 'N/A'}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-500 dark:text-gray-400 mb-1">Year</span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{senior.year || 'N/A'}</span>
                                </div>
                                <div className="flex flex-col col-span-2">
                                    <span className="text-gray-500 dark:text-gray-400 mb-1">Domain</span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2">{senior.domain || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Card Footer */}
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600">
                            <div className="flex justify-between items-center">
                                <Link
                                    to={`/college/${collegeName}/seniors/${senior.slug}`}
                                    className="flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDetail(senior);
                                    }}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                    View
                                </Link>

                                {isOwner && handleDelete && handleEdit && (
                                    <div className="flex space-x-2">
                                        <button
                                            className="p-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleEdit(senior);
                                            }}
                                            aria-label="Edit senior"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                            </svg>
                                        </button>
                                        <button
                                            className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleDeleteClick(senior._id);
                                            }}
                                            aria-label="Delete senior"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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