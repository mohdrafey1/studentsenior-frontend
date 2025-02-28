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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-5 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Add Lost/Found Item</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="text"
                        name="name"
                        placeholder="Item Name"
                        className="w-full p-2 border rounded"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        className="w-full p-2 border rounded"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="type"
                        className="w-full p-2 border rounded"
                        value={formData.type}
                        onChange={handleChange}
                    >
                        <option value="lost">Lost</option>
                        <option value="found">Found</option>
                    </select>
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        className="w-full p-2 border rounded"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="whatsapp"
                        placeholder="WhatsApp Number"
                        className="w-full p-2 border rounded"
                        value={formData.whatsapp}
                        onChange={handleChange}
                    />
                    <div>
                        <label htmlFor="image">
                            Upload Image (Max 5MB) (Optional)
                        </label>
                        <input
                            type="file"
                            id="image"
                            className="w-full p-2 border rounded"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-500 text-white rounded"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                            aria-disabled={loading}
                        >
                            {loading ? 'Uploading...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LostFoundModal;
