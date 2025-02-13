import React, { useState, useEffect } from 'react';

const DonationPage = () => {
    const [amount, setAmount] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        // Check if the device is mobile
        const checkMobile = () => {
            const userAgent =
                navigator.userAgent || navigator.vendor || window.opera;
            if (/android|iPad|iPhone|iPod/i.test(userAgent)) {
                setIsMobile(true);
            }
        };
        checkMobile();
    }, []);

    useEffect(() => {
        if (showQRCode && amount > 0) {
            const upiLink = `upi://pay?pa=7233990060@pthdfc&pn=StudentSenior&tn=Donation%20to%20Student%20Senior&cu=INR&am=${amount}`;
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                upiLink
            )}`;
            setQrCodeUrl(qrUrl);
            console.log('QR Code URL:', qrUrl); // Debugging
        }
    }, [showQRCode, amount]);

    const handleDonate = () => {
        if (amount > 0) {
            const upiLink = `upi://pay?pa=7233990060@pthdfc&pn=StudentSenior&tn=Donation%20to%20Student%20Senior&cu=INR&am=${amount}`;

            if (isMobile) {
                window.location.href = upiLink;
                setTimeout(() => {
                    setShowQRCode(true);
                }, 3000);
            } else {
                setShowQRCode(true);
            }
        } else {
            alert('Please enter a valid amount.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
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

                <button
                    onClick={handleDonate}
                    className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                        amount > 0
                            ? 'bg-blue-500 hover:bg-blue-600'
                            : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                    Donate ₹{amount || '0'}
                </button>

                {showQRCode && qrCodeUrl && (
                    <div className="text-center mt-6">
                        <p className="text-gray-600 mb-2">
                            Scan this QR code to donate:
                        </p>
                        <img
                            src={qrCodeUrl}
                            alt="UPI QR Code"
                            className="mx-auto my-4"
                        />
                        <p className="text-sm text-gray-500">
                            Use any UPI app to scan and pay.
                        </p>
                    </div>
                )}

                <p className="text-xs text-gray-400 mt-6 text-center">
                    Thank you for supporting Student Senior! 🌟
                </p>
            </div>
        </div>
    );
};

export default DonationPage;
