import React from 'react';

const EditProductModal = ({
    editingProduct,
    handleInputChange,
    handleFileChange,
    handleUpdate,
    setIsModalOpen,
    colleges,
}) => {
    const previousImageUrl = editingProduct.image.url.replace(
        '/upload',
        '/upload/h_150,w_200'
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-4 md:mx-0 md:w-3/4 lg:w-1/2 overflow-y-auto max-h-screen">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Edit Product
                </h2>
                <form
                    onSubmit={handleUpdate}
                    encType="multipart/form-data"
                    className="space-y-4"
                >
                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            Product Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={editingProduct.name}
                            onChange={handleInputChange}
                            placeholder="Product Name"
                            className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            Price
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={editingProduct.price}
                            onChange={handleInputChange}
                            placeholder="Price"
                            className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            Description
                        </label>
                        <input
                            type="text"
                            name="description"
                            value={editingProduct.description}
                            onChange={handleInputChange}
                            placeholder="Description"
                            className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            WhatsApp
                        </label>
                        <input
                            type="text"
                            name="whatsapp"
                            value={editingProduct.whatsapp}
                            onChange={handleInputChange}
                            placeholder="WhatsApp"
                            className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            Telegram
                        </label>
                        <input
                            type="text"
                            name="telegram"
                            value={editingProduct.telegram}
                            onChange={handleInputChange}
                            placeholder="Telegram"
                            className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            Select Your College
                        </label>
                        <select
                            name="college"
                            value={editingProduct.college}
                            onChange={handleInputChange}
                            className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option>Select Your College</option>
                            {colleges.map((college) => (
                                <option key={college.id} value={college.id}>
                                    {college.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-4">
                        <img
                            src={previousImageUrl}
                            alt={editingProduct.name}
                            className="w-40 h-40 object-cover rounded-md"
                        />
                        <input
                            type="file"
                            name="image"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="available"
                            checked={editingProduct.available}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                        />
                        <label className="text-sm font-medium text-gray-700">
                            Available
                        </label>
                    </div>

                    <div className="flex justify-between mt-6">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition-all duration-200 ease-in-out"
                        >
                            Update Product
                        </button>
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-600 transition-all duration-200 ease-in-out"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;
