import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { api } from '../../config/apiConfiguration';
import useApiRequest from '../../hooks/useApiRequest';

const AddPointsPage = () => {
    const [points, setPoints] = useState('');
    const [rupees, setRupees] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const currentUser = useSelector((state) => state.user.currentUser);

    // Convert points to rupees (5 points = 1 INR)
    useEffect(() => {
        if (points) {
            setRupees((points / 5).toFixed(2));
        }
    }, [points]);

    // Generate QR Code when rupees is updated
    useEffect(() => {
        if (rupees > 0) {
            const upiLink = `upi://pay?pa=7233990060@pthdfc&pn=StudentSenior&tn=Adding%20Point%20to%20${currentUser.email}&cu=INR&am=${rupees}`;
            setQrCodeUrl(
                `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                    upiLink
                )}`
            );
        } else {
            setQrCodeUrl('');
        }
    }, [rupees]);

    const handleCopy = () => {
        navigator.clipboard.writeText('7233990060@pthdfc');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const { apiRequest } = useApiRequest();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            points,
            rupees,
        };

        setLoading(true);

        try {
            const response = await apiRequest(`${api.addPoints}`, 'POST', data);

            toast.success(
                response.message ||
                    'Points added and will be reflected within 4 hours'
            );
            setPoints('');
            setRupees('');
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-4">
                    Add Points
                </h2>
                <p className="text-center mb-2">5 points = 1 rupee</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="number"
                        placeholder="Enter points"
                        value={points}
                        onChange={(e) => setPoints(e.target.value)}
                        required
                        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="number"
                        placeholder="Enter rupees"
                        value={rupees}
                        onChange={(e) => setRupees(e.target.value)}
                        readOnly
                        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                    />

                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg font-semibold text-white bg-green-500 hover:bg-green-600 transition-all flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <i className="fas fa-spinner fa-pulse mr-2"></i>
                        ) : null}
                        {loading ? 'Processing...' : 'Submit'}
                    </button>
                </form>

                {qrCodeUrl && (
                    <div className="text-center mt-6">
                        <p className="text-gray-600 mb-2">
                            Scan this QR code to pay:
                        </p>
                        <img
                            src={qrCodeUrl}
                            alt="UPI QR Code"
                            className="mx-auto my-4 w-48 h-48"
                        />
                        <p className="text-sm text-gray-500">
                            Use any UPI app to scan and pay.
                        </p>
                    </div>
                )}

                <div className="text-center mt-4">
                    <p className="text-gray-500 text-sm mb-2">
                        Scan QR or copy this UPI ID:
                    </p>
                    <div className="flex items-center justify-between bg-gray-200 p-2 rounded text-sm w-full">
                        <span className="font-mono break-all">
                            7233990060@pthdfc
                        </span>
                        <button
                            onClick={handleCopy}
                            className="text-gray-600 hover:text-gray-800 transition-colors ml-2"
                        >
                            <i className="fas fa-copy"></i>
                        </button>
                    </div>
                    {copySuccess && (
                        <p className="text-green-500 text-sm mt-1">Copied!</p>
                    )}
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        By proceeding, you agree to our{' '}
                        <a
                            href="/terms-and-conditions"
                            className="text-blue-500 hover:underline"
                        >
                            Terms and Conditions
                        </a>{' '}
                        and{' '}
                        <a
                            href="/refund-policy"
                            className="text-blue-500 hover:underline"
                        >
                            Refund Policy
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AddPointsPage;
