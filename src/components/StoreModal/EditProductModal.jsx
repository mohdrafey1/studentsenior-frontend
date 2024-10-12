import React, { useState, useEffect } from 'react';

const EditProductModal = ({
    editingProduct,
    handleInputChange,
    handleFileChange,
    handleUpdate,
    setIsModalOpen,
    colleges,
}) => {
    const [imagePreview, setImagePreview] = useState(
        editingProduct.image.url || ''
    );

    useEffect(() => {
        setImagePreview(editingProduct.image.url || '');
    }, [editingProduct.image.url]);

    const onFileChange = (e) => {
        handleFileChange;
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setImagePreview(event.target.result);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(editingProduct.image.url);
        }
    };

    const previousImageUrl = editingProduct.image?.url
        ? editingProduct.image.url.replace('/upload', '/upload/h_150,w_200')
        : '';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 overflow-y-auto mb-8">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-0 md:mx-0 md:w-3/4 lg:w-1/2 overflow-y-auto max-h-screen">
                <h4 className="text-2xl font-bold text-center">Edit Product</h4>
                <form
                    onSubmit={handleUpdate}
                    encType="multipart/form-data"
                    className="space-y-4"
                >
                    {[
                        'name',
                        'price',
                        'description',
                        'whatsapp',
                        'telegram',
                    ].map((field) => (
                        <div key={field}>
                            <label className="block text-sm font-semibold mb-0 capitalize">
                                {field}
                            </label>
                            <input
                                type={field === 'price' ? 'number' : 'text'}
                                name={field}
                                value={editingProduct[field]}
                                onChange={handleInputChange}
                                placeholder={
                                    field.charAt(0).toUpperCase() +
                                    field.slice(1)
                                }
                                className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    ))}

                    {/* <div>
                        <label className="block text-sm font-semibold mb-0">
                            Select Your College
                        </label>
                        <select
                            name="college"
                            value={editingProduct.college}
                            onChange={handleInputChange}
                            className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option>Select Your College</option>
                            {colleges.map((college) => (
                                <option key={college.id} value={college.id}>
                                    {college.name}
                                </option>
                            ))}
                        </select>
                    </div> */}

                    <div className="flex items-center justify-center space-y-4">
                        <input
                            type="file"
                            name="image"
                            onChange={(e) => {
                                handleFileChange(e);
                                if (onFileChange) {
                                    onFileChange(e);
                                }
                            }}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <img
                            src={imagePreview || previousImageUrl}
                            alt={editingProduct.name}
                            className="object-cover rounded-md w-48 h-24" // Fixed size for preview
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

                    <div className="flex justify-between mt-2">
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
