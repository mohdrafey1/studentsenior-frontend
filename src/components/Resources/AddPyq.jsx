import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../config/apiConfiguration';

function AddPyq({ subjectCode, branchCode, college, collegeId, onSubmit }) {
    const [year, setYear] = useState('');
    const [examType, setExamType] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                toast.error('Only PDF files are allowed.');
                return;
            }
            if (selectedFile.size > 10 * 1024 * 1024) {
                toast.error('File size exceeds 10MB.');
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error('Please select a file to upload.');
            return;
        }

        const fileName = `${subjectCode}-${Date.now()}.pdf`;
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
                    fileName: `ss-pyq/${fileName}`,
                    fileType,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get presigned URL');
            }

            const { uploadUrl, key } = await response.json();

            toast.warning('Uploading Pyq, Please Wait');

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
                year,
                examType,
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
                <label className="block font-semibold mb-1">Year</label>
                <select
                    className="w-full border p-2 rounded"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                >
                    <option value="" disabled>
                        Select Year
                    </option>
                    <option value="2020-21">2020-21</option>
                    <option value="2022-23">2022-23</option>
                    <option value="2023-24">2023-24</option>
                    <option value="2024-25">2024-25</option>
                </select>
            </div>
            <div>
                <label className="block font-semibold mb-1">Exam Type</label>
                <select
                    className="w-full border p-2 rounded"
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                    required
                >
                    <option value="" disabled>
                        Select Exam Type
                    </option>
                    <option value="midsem1">Midsem 1</option>
                    <option value="midsem2">Midsem 2</option>
                    <option value="improvement">Improvement</option>
                    <option value="endsem">Endsem</option>
                </select>
            </div>
            <div>
                <label className="block font-semibold mb-1">
                    Upload PDF (Max 50MB)
                </label>
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
                        <i className="fas fa-spinner fa-pulse"></i> Uploading...
                    </span>
                ) : (
                    <> Add Pyq</>
                )}
            </button>
        </form>
    );
}

export default AddPyq;
