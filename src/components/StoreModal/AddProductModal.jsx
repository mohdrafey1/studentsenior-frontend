import React from 'react';

const AddProductModal = ({
    newProduct,
    handleInputChange,
    handleFileChange,
    handleSubmit,
    setIsModalOpen,
    colleges,
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-lg font-bold mb-4">Add Product</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <input
                        type="text"
                        name="name"
                        value={newProduct.name}
                        onChange={handleInputChange}
                        placeholder="Product Name"
                        className="mb-4 p-2 border w-full"
                    />
                    <input
                        type="number"
                        name="price"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        placeholder="Price"
                        className="mb-4 p-2 border w-full"
                    />
                    <input
                        type="text"
                        name="description"
                        value={newProduct.description}
                        onChange={handleInputChange}
                        placeholder="Description"
                        className="mb-4 p-2 border w-full"
                    />
                    <input
                        type="text"
                        name="whatsapp"
                        value={newProduct.whatsapp}
                        onChange={handleInputChange}
                        placeholder="WhatsApp"
                        className="mb-4 p-2 border w-full"
                    />
                    <input
                        type="text"
                        name="telegram"
                        value={newProduct.telegram}
                        onChange={handleInputChange}
                        placeholder="Telegram"
                        className="mb-4 p-2 border w-full"
                    />
                    <select
                        name="college"
                        value={newProduct.college}
                        onChange={handleInputChange}
                        className="mb-4 p-2 border w-full"
                    >
                        <option>Select Your College</option>
                        {colleges.map((college) => (
                            <option key={college.id} value={college.id}>
                                {college.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        className="mb-4 p-2 border w-full"
                    />
                    <label>
                        <input
                            type="checkbox"
                            name="available"
                            checked={newProduct.available}
                            onChange={handleInputChange}
                        />
                        Available
                    </label>
                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Add Product
                    </button>
                </form>
                <button
                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => setIsModalOpen(false)}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AddProductModal;
