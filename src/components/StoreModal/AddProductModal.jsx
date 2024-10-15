import React from 'react';
import { useState } from 'react';

const AddProductModal = ({
    newProduct,
    handleInputChange,
    handleFileChange,
    handleSubmit,
    setIsModalOpen,
    colleges,
}) => {
    const [imagePreview, setImagePreview] = useState('');

    const onFileChange = (e) => {
        handleFileChange;
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setImagePreview(event.target.result);
            reader.readAsDataURL(file);
        } else {
            // setImagePreview('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 m-4 rounded-lg shadow-lg w-full max-w-lg relative x-scroll">
                {/* Dismiss button */}
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 h-10 w-10 mt-4 mr-3 text-2xl font-bold"
                    onClick={() => setIsModalOpen(false)}
                >
                    &#x2715;
                </button>

                <h2 className="text-2xl font-bold mb-6 text-center">
                    Add Product
                </h2>
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
                    {/* <select
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
                    </select> */}
                    <div className="flex">
                        <div className=" m-3">
                            <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                            >
                                <div className="flex flex-col items-center justify-center p-3 text-center">
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">
                                            Click to upload
                                        </span>
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        (MAX 2MB)
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    id="dropzone-file"
                                    name="image"
                                    onChange={(e) => {
                                        handleFileChange(e);
                                        if (onFileChange) {
                                            onFileChange(e);
                                        }
                                    }}
                                    className="hidden"
                                    required
                                />
                            </label>
                        </div>
                        <div className="flex flex-col items-center justify-center bg-red-100 rounded-md ">
                            <img
                                src={imagePreview}
                                alt="Select Image"
                                className="object-cover rounded-md w-full sm:w-64 h-24 sm:h-32 md:w-80 lg:w-80"
                            />
                        </div>
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
