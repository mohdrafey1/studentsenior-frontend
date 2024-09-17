import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const SeniorModal = ({ senior, onClose, onEdit, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedSenior, setEditedSenior] = useState({ ...senior });
    const { currentUser } = useSelector((state) => state.user);

    // Handle form input changes for editing
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedSenior({ ...editedSenior, [name]: value });
    };

    // Handle the edit action
    const handleEdit = () => {
        setIsEditing(true);
    };

    // Submit the edited senior data
    const submitEdit = () => {
        onEdit(editedSenior);
        setIsEditing(false);
    };

    // Handle the delete action
    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this senior?')) {
            onDelete(senior._id);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-white p-8 rounded-lg max-w-lg w-full shadow-lg">
                {/* Profile Photo */}
                {senior.profilePicture && (
                    <div className="flex justify-center mb-4">
                        <img
                            src={senior.profilePicture}
                            alt={`${senior.name}'s Profile`}
                            className="w-32 h-32 rounded-full object-cover"
                        />
                    </div>
                )}

                {/* Senior Info */}
                {isEditing ? (
                    <>
                        <input
                            name="name"
                            value={editedSenior.name}
                            onChange={handleInputChange}
                            className="w-full mb-2 p-2 border rounded"
                        />
                        <input
                            name="branch"
                            value={editedSenior.branch}
                            onChange={handleInputChange}
                            className="w-full mb-2 p-2 border rounded"
                        />
                        <input
                            name="year"
                            value={editedSenior.year}
                            onChange={handleInputChange}
                            className="w-full mb-2 p-2 border rounded"
                        />
                        <input
                            name="domain"
                            value={editedSenior.domain}
                            onChange={handleInputChange}
                            className="w-full mb-2 p-2 border rounded"
                        />
                        {/* Add similar inputs for other fields */}
                        <button
                            onClick={submitEdit}
                            className="w-full mt-4 p-2 bg-green-500 text-white rounded-md"
                        >
                            Save
                        </button>
                    </>
                ) : (
                    <>
                        <h2
                            id="modal-title"
                            className="text-2xl font-bold mb-4 text-center"
                        >
                            {senior.name}
                        </h2>
                        <p className="mb-2">
                            <strong>Branch:</strong> {senior.branch}
                        </p>
                        <p className="mb-2">
                            <strong>Year:</strong> {senior.year}
                        </p>
                        <p className="mb-2">
                            <strong>Expertise:</strong> {senior.domain}
                        </p>
                    </>
                )}

                {/* Social Media Links */}
                <div className="flex justify-center space-x-4 mb-4">
                    {senior.whatsapp && (
                        <a
                            href={senior.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-500 hover:text-green-700 transition"
                            aria-label="WhatsApp"
                        >
                            <i className="fab fa-whatsapp"></i> WhatsApp
                        </a>
                    )}
                    {senior.telegram && (
                        <a
                            href={senior.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 transition"
                            aria-label="Telegram"
                        >
                            <i className="fab fa-telegram"></i> Telegram
                        </a>
                    )}
                </div>

                {/* Edit and Delete Buttons */}
                {senior.owner === currentUser && (
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={handleEdit}
                            className="p-2 bg-yellow-500 text-white rounded-md"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="p-2 bg-red-500 text-white rounded-md"
                        >
                            Delete
                        </button>
                    </div>
                )}

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="mt-5 w-full p-2 bg-gray-500 text-white rounded-md"
                    aria-label="Close Modal"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default SeniorModal;
