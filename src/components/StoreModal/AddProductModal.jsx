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
            <div className="bg-white p-6 m-4 rounded-lg shadow-lg w-full max-w-lg relative">
                {/* Dismiss button */}
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 h-10 w-10 mt-4 mr-3 text-2xl font-bold"
                    onClick={() => setIsModalOpen(false)}
                >
                    &#x2715;
                </button>
                
                <h2 className="text-2xl font-bold mb-6 text-center">Add Product</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <input
                        type="text"
                        name="name"
                        value={newProduct.name}
                        onChange={handleInputChange}
                        placeholder="Product Name"
                        className="mb-4 w-full p-2 border border-gray-300 rounded-lg"
                        required
                    />
                    <input
                        type="number"
                        name="price"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        placeholder="Price"
                        className="mb-4 w-full p-2 border border-gray-300 rounded-lg"
                        required
                    />
                    <input
                        type="text"
                        name="description"
                        value={newProduct.description}
                        onChange={handleInputChange}
                        placeholder="Description"
                        className="mb-4 w-full p-2 border border-gray-300 rounded-lg"
                        required
                    />
                    <input
                        type="Number"
                        name="whatsapp"
                        value={newProduct.whatsapp}
                        onChange={handleInputChange}
                        placeholder="WhatsApp"
                        className="mb-4 w-full p-2 border border-gray-300 rounded-lg"
                        required
                    />
                    <input
                        type="Number"
                        name="telegram"
                        value={newProduct.telegram}
                        onChange={handleInputChange}
                        placeholder="Telegram (Optional)"
                        className="mb-4 w-full p-2 border border-gray-300 rounded-lg"
                    />
                    <select
                        name="college"
                        value={newProduct.college}
                        onChange={handleInputChange}
                        className="mb-4 w-full p-2 border border-gray-300 rounded-lg"
                        required
                    >
                        <option>Select Your College</option>
                        {colleges.map((college) => (
                            <option key={college.id} value={college.id}>
                                {college.name}
                            </option>
                        ))}
                    </select>
                    
                    <div className="mb-2">
                        <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                            <div className="flex flex-col items-center justify-center ">
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Click to upload product image</span>
                                </p>
                                <p className="text-xs text-gray-500">
                                    SVG, PNG, JPG or GIF (MAX 2MB)
                                </p>
                            </div>
                            <input
                                type="file"
                                id="dropzone-file"
                                name="image"
                                onChange={handleFileChange}
                                className="hidden"
                                required
                            />
                        </label>
                    </div>

                    <label className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            name="available"
                            checked={newProduct.available}
                            onChange={handleInputChange}
                            className="mr-2"
                        />
                        Available
                    </label>
                    
                    <button
                        type="submit"
                        className=" bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600 transition"
                    >
                        Add Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;
