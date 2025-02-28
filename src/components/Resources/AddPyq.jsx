import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../config/apiConfiguration';

function AddPyq({
    subjectCode,
    branchCode,
    subjectName,
    collegeId,
    onSubmit,
    submitting,
}) {
    const [year, setYear] = useState('');
    const [examType, setExamType] = useState('');
    const [solved, setSolved] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [price, setPrice] = useState('');
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
                solved,
                isPaid,
                price: isPaid ? price : 0,
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
        <form onSubmit={handleSubmit} className="space-y-2 bg-white p-4">
            <div>
                <label className="block font-semibold text-sky-500 mb-1">
                    Subject
                </label>
                <input
                    type="text"
                    className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                    value={subjectName}
                    readOnly
                />
            </div>
            <div>
                <label className="block font-semibold text-sky-500 mb-1">
                    Year
                </label>
                <select
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
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
                <label className="block font-semibold text-sky-500 mb-1">
                    Exam Type
                </label>
                <select
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
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
                <label className="block font-semibold text-sky-500 mb-1">
                    Upload PDF (Max 10MB)
                </label>
                <input
                    id="file-upload"
                    type="file"
                    className="w-full border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-sky-500 file:text-white hover:file:bg-sky-600"
                    accept=".pdf"
                    onChange={handleFileChange}
                    required
                />
            </div>
            <div className="mt-4 flex gap-4">
                <p>Is This Solved</p>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={solved}
                        onChange={(e) => setSolved(e.target.checked)}
                        className="sr-only peer "
                    />
                    <div className="w-9 h-6 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 hover:peer-checked:bg-indigo-700"></div>
                </label>
            </div>

            {solved && (
                <div className="mt-4 space-y-2">
                    <div className="flex items-center">
                        <p>Is Paid </p>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                id="isPaid"
                                checked={isPaid}
                                onChange={(e) => setIsPaid(e.target.checked)}
                                className="sr-only peer "
                            />
                            <div className="w-9 h-6 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 hover:peer-checked:bg-indigo-700"></div>
                        </label>
                    </div>

                    {isPaid && (
                        <div>
                            <label className="block font-semibold text-sky-500 mb-1">
                                Price (in Points - 5 points = 1 INR)
                            </label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                                required
                            />
                        </div>
                    )}
                </div>
            )}

            <button
                type="submit"
                className={`w-full bg-sky-400 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-sky-500 transition-colors duration-200 ${
                    loading || submitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={loading || submitting}
            >
                {loading || submitting ? (
                    <span className="flex items-center justify-center">
                        <i className="fas fa-spinner fa-pulse mr-2"></i>
                        {loading ? 'Uploading...' : 'Submitting...'}
                    </span>
                ) : (
                    'Add Pyq'
                )}
            </button>
        </form>
    );
}

export default AddPyq;
