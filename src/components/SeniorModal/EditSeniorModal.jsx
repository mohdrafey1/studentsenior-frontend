import React from 'react';

const EditSeniorModal = ({
    editingSenior,
    handleInputChange,
    handleFileChange,
    handleUpdate,
    setIsModalOpen,
    colleges,
}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Edit Senior</h2>
                <form onSubmit={handleUpdate}>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={editingSenior.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-1">
                            Course/Branch
                        </label>
                        <input
                            type="text"
                            name="branch"
                            value={editingSenior.branch}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-1">
                            Year
                        </label>
                        <input
                            type="text"
                            name="year"
                            value={editingSenior.year}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-1">
                            Domain
                        </label>
                        <input
                            type="text"
                            name="domain"
                            value={editingSenior.domain}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-1">
                            Whatsapp
                        </label>
                        <input
                            type="Number"
                            name="whatsapp"
                            value={editingSenior.whatsapp}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-1">
                            Telegram
                        </label>
                        <input
                            type="Number"
                            name="telegram"
                            value={editingSenior.telegram}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-1">
                            College
                        </label>
                        <select
                            name="college"
                            value={editingSenior.college}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded"
                        >
                            {colleges.map((college) => (
                                <option key={college.id} value={college.id}>
                                    {college.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* <div className="mb-4">
                        <label className="block text-sm font-bold mb-1">
                            Image
                        </label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleFileChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div> */}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSeniorModal;
