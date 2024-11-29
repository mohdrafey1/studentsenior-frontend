import React from 'react';

const EditSeniorModal = ({
    editingSenior,
    handleInputChange,
    handleFileChange,
    handleUpdate,
    setIsModalOpen,
    loading,
}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg m-4 dark:bg-gray-800">
                <h2 className="text-xl font-bold mb-4 text-center  text-gray-900 dark:text-white">
                    Edit Senior
                </h2>
                <form onSubmit={handleUpdate}>
                    <div className="mb-4 text-xs">
                        <label className="block text-sm font-bold mb-1 text-gray-900 dark:text-white">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={editingSenior.name}
                            onChange={handleInputChange}
                            className="w-full px-2 py-1.5 border rounded"
                        />
                    </div>
                    <div className="mb-4 text-xs">
                        <label className="block text-sm font-bold mb-1 text-gray-900 dark:text-white">
                            Course/Branch
                        </label>
                        <input
                            type="text"
                            name="branch"
                            value={editingSenior.branch}
                            onChange={handleInputChange}
                            className="w-full px-4 py-1.5 border rounded"
                        />
                    </div>
                    <div className="mb-4 text-xs">
                        <label className="block text-sm font-bold mb-1 text-gray-900 dark:text-white">
                            Year
                        </label>
                        <select
                            name="year"
                            value={editingSenior.year}
                            onChange={handleInputChange}
                            className="w-full px-4 py-1.5 border rounded"
                        >
                            <option>Select Your Year</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                            <option value="5th Year">5th Year</option>
                        </select>
                    </div>
                    <div className="mb-4 text-xs">
                        <label className="block text-sm font-bold mb-1 text-gray-900 dark:text-white">
                            Domain
                        </label>
                        <input
                            type="text"
                            name="domain"
                            value={editingSenior.domain}
                            onChange={handleInputChange}
                            className="w-full px-4 py-1.5 border rounded"
                        />
                    </div>
                    <div className="mb-4 text-xs">
                        <label className="block text-sm font-bold mb-1 text-gray-900 dark:text-white">
                            Whatsapp
                        </label>
                        <input
                            type="Number"
                            name="whatsapp"
                            value={editingSenior.whatsapp}
                            onChange={handleInputChange}
                            className="w-full px-4 py-1.5 border rounded"
                        />
                    </div>
                    <div className="mb-4 text-xs">
                        <label className="block text-sm font-bold mb-1 text-gray-900 dark:text-white">
                            Telegram
                        </label>
                        <input
                            type="Number"
                            name="telegram"
                            value={editingSenior.telegram}
                            onChange={handleInputChange}
                            className="w-full px-4 py-1.5 border rounded"
                        />
                    </div>
                    <div className="mb-2">
                        <span className="text-xs text-gray-400">
                            ( you can edit your photo in profile page )
                        </span>
                    </div>
                    {/* <div className="mb-4 text-xs">
                        <label className="block text-sm font-bold mb-1 text-gray-900 dark:text-white">
                            College
                        </label>
                        <select
                            name="college"
                            value={editingSenior.college}
                            onChange={handleInputChange}
                            className="w-full px-4 py-1.5 border rounded"
                        >
                            {colleges.map((college) => (
                                <option key={college.id} value={college.id}>
                                    {college.name}
                                </option>
                            ))}
                        </select>
                    </div> */}
                    {/* <div className="mb-4 text-xs">
                        <label className="block text-sm font-bold mb-1 text-gray-900 dark:text-white">
                            Image
                        </label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleFileChange}
                            className="w-full px-4 py-1.5 border rounded"
                        />
                    </div> */}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-4 py-1.5 rounded mr-2"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-1.5 rounded"
                            disabled={loading}
                        >
                            {loading ? (
                                <i className="fa fa-spinner fa-spin"></i>
                            ) : (
                                <p>Update</p>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSeniorModal;
