import React, { useState, useEffect } from 'react';

const DonationPage = () => {
    const [amount, setAmount] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        if (amount > 0) {
            const upiLink = `upi://pay?pa=7233990060@pthdfc&pn=StudentSenior&tn=Donation%20to%20Student%20Senior&cu=INR&am=${amount}`;
            setQrCodeUrl(
                `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                    upiLink
                )}`
            );
        } else {
            setQrCodeUrl('');
        }
    }, [amount]);

    const handleCopy = () => {
        navigator.clipboard.writeText('7233990060@pthdfc');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
                <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">
                    Support Student Senior
                </h1>
                <p className="text-gray-600 mb-6 text-center">
                    We strive to provide free resources to students by hosting
                    PDFs on AWS. This involves ongoing costs. Your donation
                    helps us sustain and grow this platform.
                </p>
                <p className="text-gray-600 mb-4 text-center font-semibold">
                    Even a small contribution makes a big impact. ❤️
                </p>

                <input
                    type="number"
                    placeholder="Enter amount (₹)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* <button
                    onClick={() => amount > 0 && setQrCodeUrl(qrCodeUrl)}
                    className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                        amount > 0
                            ? 'bg-sky-500 hover:bg-sky-600'
                            : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                    Generate QR Code
                </button> */}

                {qrCodeUrl && (
                    <div className="text-center mt-6">
                        <p className="text-gray-600 mb-2">
                            Scan this QR code to donate:
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
                        Scan Qr or copy this UPI ID:
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

                <p className="text-xs text-gray-400 mt-6 text-center">
                    Thank you for supporting Student Senior! 🌟
                </p>
            </div>
        </div>
    );
};

export default DonationPage;
