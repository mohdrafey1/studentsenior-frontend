import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dialog from '../../utils/Dialog';

function SeniorCard({
    seniors,
    loadingStates,
    handleDelete,
    handleEdit,
    handleDetail,
}) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [seniorIdtoDelete, setSeniorIdtoDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
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

    return (
        <>
            {seniors.map((senior) => (
                <Link
                    to={`/college/${collegeName}/seniors/${senior.slug}`}
                    key={senior._id}
                    className="min-w-40 my-4 w-full"
                >
                    <div
                        key={senior._id}
                        className="bg-white shadow-md rounded-3xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl dark:bg-gray-800 w-full h-full flex flex-col"
                    >
                        <img
                            src={
                                senior.owner.profilePicture.replace(
                                    '=s96-c',
                                    ''
                                ) || senior.profilePicture
                            }
                            alt={senior.name}
                            className="w-full h-40 lg:h-60 transition-transform duration-300 hover:scale-110"
                        />
                        <div className="px-3 lg:px-6 py-2 flex-grow">
                            <h3 className="text-sm lg:text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {senior.name}
                            </h3>
                            <p className="text-red-500 font-medium mb-1 text-xs lg:text-sm">
                                Course: {senior.branch}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm mb-1">
                                Year: {senior.year}
                            </p>
                            <p className="text-gray-500 dark:text-gray-300 text-xs lg:text-sm w-full overflow-y-scroll ">
                                Domain: {senior.domain}
                            </p>
                        </div>
                        <div className="px-3 py-2 m-auto flex gap-2 justify-between items-center">
                            <button
                                className="bg-sky-500 text-white px-2 lg:px-3 py-1 lg:py-1 rounded-lg text-xs lg:text-sm hover:bg-sky-700 focus:ring-2 focus:ring-blue-500"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDetail(senior);
                                }}
                            >
                                View
                            </button>
                            {handleDelete &&
                                handleEdit &&
                                senior.owner._id === ownerId && (
                                    <div className="flex space-x-2">
                                        <button
                                            className="bg-yellow-500 text-white px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm hover:bg-yellow-600"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleEdit(senior);
                                            }}
                                        >
                                            <i className="fa-regular fa-pen-to-square"></i>
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm hover:bg-red-600"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleDeleteClick(senior._id);
                                            }}
                                            title="Delete Post"
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                )}
                        </div>
                    </div>
                </Link>
            ))}
            <Dialog
                isOpen={showDeleteDialog}
                onClose={handleCloseDialog}
                title="Senior Delete Confirmation"
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
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? (
                                <i className="fa fa-spinner fa-spin"></i>
                            ) : (
                                <>
                                    <span>Confirm</span>
                                    &nbsp;
                                    <i className="fa-solid fa-trash fa-xl"></i>
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
        </>
    );
}

export default SeniorCard;
