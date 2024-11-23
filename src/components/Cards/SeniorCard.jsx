import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function SeniorCard({
    seniors,
    loadingStates,
    handleDelete,
    handleEdit,
    handleDetail,
}) {
    const { collegeName } = useParams();
    const currentUser = useSelector((state) => state.user.currentUser);
    const ownerId = currentUser?._id;

    return (
        <>
            {seniors.map((senior) => (
                <Link
                    to={`/college/${collegeName}/seniors/${senior._id}`}
                    key={senior._id}
                    className="min-w-40 my-4 w-full"
                >
                    <div
                        key={senior._id}
                        className="bg-white shadow-md rounded-3xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl dark:bg-gray-800 w-full h-full flex flex-col"
                    >
                        <img
                            src={senior.profilePicture}
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
                                className="bg-blue-600 text-white px-2 lg:px-3 py-1 lg:py-1 rounded-lg text-xs lg:text-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDetail(senior);
                                }}
                            >
                                View
                            </button>
                            {handleDelete &&
                                handleEdit &&
                                senior.owner === ownerId && (
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
                                                handleDelete(senior._id);
                                            }}
                                            disabled={
                                                loadingStates.deleteSenior[
                                                    senior._id
                                                ]
                                            }
                                        >
                                            {loadingStates.deleteSenior[
                                                senior._id
                                            ] ? (
                                                <i className="fa fa-spinner fa-spin"></i>
                                            ) : (
                                                <i className="fa-solid fa-trash"></i>
                                            )}
                                        </button>
                                    </div>
                                )}
                        </div>
                    </div>
                </Link>
            ))}
        </>
    );
}

export default SeniorCard;
