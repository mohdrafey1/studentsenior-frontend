import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../config/apiConfiguration';
import { useParams } from 'react-router-dom';
import { useCollegeId } from '../../hooks/useCollegeId';

const LostFoundModal = ({ isOpen, onClose, onSubmit }) => {
    const { collegeName } = useParams();
    const collegeId = useCollegeId(collegeName);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'lost',
        location: '',
        imageUrl: '',
        whatsapp: '',
        college: collegeId,
    });

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = useCallback((e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (!selectedFile.type.startsWith('image/')) {
            toast.error('Only image files are allowed.');
            return;
        }
        if (selectedFile.size > 5 * 1024 * 1024) {
            toast.error('File size exceeds 5MB.');
            return;
        }
        setImage(selectedFile);
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            let imageUrl = '';

            if (image) {
                const fileName = `ss-lostfound/${Date.now()}-${image.name}`;
                const fileType = image.type;

                // Step 1: Get pre-signed URL
                const response = await fetch(api.presignedUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ fileName, fileType }),
                });

                if (!response.ok)
                    throw new Error('Failed to get presigned URL');

                const { uploadUrl, key } = await response.json();

                toast.warning('Uploading image, please wait...');

                // Step 2: Upload file directly to S3
                await fetch(uploadUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': fileType },
                    body: image,
                });

                imageUrl = `https://studentsenior.s3.ap-south-1.amazonaws.com/${key}`;
            }

            // Step 3: Submit metadata
            onSubmit({ ...formData, imageUrl });

            setLoading(false);
            setFormData({
                name: '',
                description: '',
                type: 'lost',
                location: '',
                imageUrl: '',
                whatsapp: '',
                college: collegeId,
            });
            setImage(null);
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload image.');
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-sky-800 mb-6">
                    Add Lost/Found Item
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter item name"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <textarea
                            name="description"
                            placeholder="Enter description"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <select
                            name="type"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            value={formData.type}
                            onChange={handleChange}
                        >
                            <option value="lost">Lost</option>
                            <option value="found">Found</option>
                        </select>
                    </div>

                    <div>
                        <input
                            type="text"
                            name="location"
                            placeholder="Enter location"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="text"
                            name="whatsapp"
                            placeholder="Enter WhatsApp number to contact"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            value={formData.whatsapp}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">
                            Upload Image (Max 5MB, Optional)
                        </label>
                        <input
                            type="file"
                            id="image"
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition duration-300"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition duration-300 flex items-center justify-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                </>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LostFoundModal;
