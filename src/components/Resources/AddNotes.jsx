import React, { useState } from 'react';
import { toast } from 'react-toastify';

function AddNotes({
    subjectCode,
    branchCode,
    college,
    collegeId,
    onSubmit,
    loading,
}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size <= 50 * 1024 * 1024) {
            setFile(selectedFile);
        } else {
            toast.error('File size exceeds 50MB.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) {
            toast.error('Please upload a PDF file.');
            return;
        }
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('file', file);
        formData.append('subjectCode', subjectCode);
        formData.append('branchCode', branchCode);
        formData.append('college', collegeId);

        onSubmit(formData);
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
                    <i className="fas fa-spinner fa-pulse "></i>
                ) : (
                    <> Add Note</>
                )}
            </button>
        </form>
    );
}

export default AddNotes;
