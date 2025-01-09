import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../config/apiConfiguration';

function AddNotes({ subjectCode, branchCode, college, collegeId, onSubmit }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size <= 50 * 1024 * 1024) {
            setFile(selectedFile);
        } else {
            toast.error('File size exceeds 50MB.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error('Please select a file to upload.');
            return;
        }

        const fileName = `${title}-${Date.now()}.pdf`;
        const fileType = file.type;

        try {
            setLoading(true);
            // Step 1: Get pre-signed URL
            const response = await fetch(`${api.presignedUrl}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    fileName: `ss-notes/${fileName}`,
                    fileType,
                }),
            });

            const { uploadUrl, key } = await response.json();

            toast.warning('uploading notes');

            // Step 2: Upload file directly to S3
            await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': fileType,
                },
                body: file,
            });

            // Step 3: Submit metadata to the server
            const formData = {
                title,
                description,
                subjectCode,
                branchCode,
                college: collegeId,
                fileUrl: `https://studentsenior.s3.ap-south-1.amazonaws.com/${key}`,
            };

            onSubmit(formData);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error('Failed to upload file.');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block font-semibold mb-1">Title</label>
                <input
                    type="text"
                    className="w-full border p-2 rounded"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className="block font-semibold mb-1">
                    Description (optional)
                </label>
                <textarea
                    className="w-full border p-2 rounded"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
            </div>
            <div>
                <label className="block font-semibold mb-1">Upload PDF</label>
                <input
                    type="file"
                    className="w-full"
                    accept=".pdf"
                    onChange={handleFileChange}
                    required
                />
            </div>
            <div className="flex gap-2">
                <div>
                    <label className="block font-semibold mb-1">Subject</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded bg-gray-100"
                        value={subjectCode.toUpperCase()}
                        disabled
                    />
                </div>
                <div>
                    <label className="block font-semibold mb-1">College</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded bg-gray-100"
                        value={college.toUpperCase()}
                        disabled
                    />
                </div>
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={loading}
            >
                {loading ? (
                    <span>
                        <i className="fas fa-spinner fa-pulse "></i>Uploading...
                    </span>
                ) : (
                    <> Add Note</>
                )}
            </button>
        </form>
    );
}

export default AddNotes;
