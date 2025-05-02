import React, { useState, useEffect } from 'react';
import { X, Save, Image, AlertCircle } from 'lucide-react';

const EditProductModal = ({
    editingProduct,
    handleInputChange,
    handleFileChange,
    handleUpdate,
    setIsModalOpen,
    loading,
}) => {
    const [imagePreview, setImagePreview] = useState(
        editingProduct.image?.url || ''
    );
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        setImagePreview(editingProduct.image?.url || '');
    }, [editingProduct.image?.url]);

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileChange(e);
            const reader = new FileReader();
            reader.onload = (event) => setImagePreview(event.target.result);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(editingProduct.image?.url || '');
        }
    };

    // Handle drag events
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    // Handle drop event
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const fileInputEvent = {
                target: {
                    files: e.dataTransfer.files,
                },
            };
            handleFileChange(fileInputEvent);

            const reader = new FileReader();
            reader.onload = (event) => setImagePreview(event.target.result);
            reader.readAsDataURL(e.dataTransfer.files[0]);
        }
    };

    const previousImageUrl = editingProduct.image?.url
        ? editingProduct.image.url.replace('/upload', '/upload/h_200,w_300')
        : '';

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 overflow-y-auto p-4'>
            <div className='bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden max-h-screen overflow-y-auto scrollbar-hide'>
                {/* Header */}
                <div className='bg-sky-500 text-white px-6 py-4 flex justify-between items-center'>
                    <h4 className='text-xl font-semibold'>Edit Product</h4>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className='p-1 rounded-full hover:bg-sky-600 transition-colors'
                    >
                        <X size={20} />
                    </button>
                </div>

                <form
                    onSubmit={handleUpdate}
                    encType='multipart/form-data'
                    className='p-6'
                >
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {/* Left column - Form fields */}
                        <div className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                    Product Name*
                                </label>
                                <input
                                    type='text'
                                    name='name'
                                    value={editingProduct.name || ''}
                                    onChange={handleInputChange}
                                    placeholder='Enter product name'
                                    required
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                    Price*
                                </label>
                                <div className='relative'>
                                    <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500'>
                                        ₹
                                    </span>
                                    <input
                                        type='number'
                                        name='price'
                                        value={editingProduct.price || ''}
                                        onChange={handleInputChange}
                                        placeholder='0.00'
                                        required
                                        className='w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                    Description*
                                </label>
                                <textarea
                                    name='description'
                                    value={editingProduct.description || ''}
                                    onChange={handleInputChange}
                                    placeholder='Enter product description'
                                    required
                                    rows='3'
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                                />
                            </div>

                            <div className='flex flex-col sm:flex-row sm:gap-4'>
                                <div className='w-full sm:w-1/2 mb-4 sm:mb-0'>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        WhatsApp*
                                    </label>
                                    <input
                                        type='tel'
                                        name='whatsapp'
                                        value={editingProduct.whatsapp || ''}
                                        onChange={handleInputChange}
                                        placeholder='Enter WhatsApp number'
                                        required
                                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                                    />
                                </div>
                                <div className='w-full sm:w-1/2'>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Telegram
                                    </label>
                                    <input
                                        type='tel'
                                        name='telegram'
                                        value={editingProduct.telegram || ''}
                                        onChange={handleInputChange}
                                        placeholder='Enter Telegram number (optional)'
                                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                                    />
                                </div>
                            </div>

                            <div className='flex items-center'>
                                <input
                                    type='checkbox'
                                    id='available'
                                    name='available'
                                    checked={editingProduct.available || false}
                                    onChange={handleInputChange}
                                    className='h-4 w-4 text-sky-500 focus:ring-sky-400 border-gray-300 rounded'
                                />
                                <label
                                    htmlFor='available'
                                    className='ml-2 text-sm font-medium text-gray-700'
                                >
                                    Product Available for Sale
                                </label>
                            </div>
                        </div>

                        {/* Right column - Image upload */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Product Image
                            </label>

                            {/* Image drag & drop area */}
                            <div
                                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer h-64 flex flex-col items-center justify-center
                                    ${
                                        dragActive
                                            ? 'border-sky-500 bg-sky-50'
                                            : 'border-gray-300 hover:border-sky-400 hover:bg-gray-50'
                                    }
                                    transition-all duration-200`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() =>
                                    document.getElementById('fileInput').click()
                                }
                            >
                                {imagePreview || previousImageUrl ? (
                                    <div className='relative w-full h-full'>
                                        <img
                                            src={
                                                imagePreview || previousImageUrl
                                            }
                                            alt={
                                                editingProduct.name || 'Product'
                                            }
                                            className='object-contain w-full h-full rounded'
                                        />
                                        <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded'>
                                            <p className='text-white text-sm font-medium'>
                                                Click or drag to replace
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <Image
                                            size={48}
                                            className='text-gray-400 mb-2'
                                        />
                                        <p className='text-sm text-gray-500 mb-1'>
                                            Drag & drop image here or click to
                                            browse
                                        </p>
                                        <p className='text-xs text-gray-400'>
                                            PNG, JPG or JPEG up to 5MB
                                        </p>
                                    </>
                                )}
                                <input
                                    id='fileInput'
                                    type='file'
                                    name='image'
                                    onChange={onFileChange}
                                    accept='image/png, image/jpeg, image/jpg'
                                    className='hidden'
                                />
                            </div>

                            <p className='mt-2 text-xs text-gray-500 flex items-center'>
                                <AlertCircle size={12} className='mr-1' />
                                Recommended size: 800 x 600 pixels
                            </p>
                        </div>
                    </div>

                    {/* Footer actions */}
                    <div className='mt-8 pt-4 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-end gap-3'>
                        <button
                            type='button'
                            className='w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='w-full sm:w-auto px-6 py-2 bg-sky-500 text-white rounded-lg shadow-sm hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed'
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className='animate-spin h-4 w-4 text-white'
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                    >
                                        <circle
                                            className='opacity-25'
                                            cx='12'
                                            cy='12'
                                            r='10'
                                            stroke='currentColor'
                                            strokeWidth='4'
                                        ></circle>
                                        <path
                                            className='opacity-75'
                                            fill='currentColor'
                                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                        ></path>
                                    </svg>
                                    <span>Updating...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;
