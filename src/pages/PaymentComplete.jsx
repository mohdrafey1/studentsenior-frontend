import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;

const PaymentComplete = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState(null);

    const transactionId = searchParams.get('transactionId');
    const status = searchParams.get('status');

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const res = await fetch(
                    `${BASE_URL}/api/phonepe/${transactionId}`,
                    {
                        credentials: 'include',
                    }
                );

                if (!res.ok) throw new Error('Failed to verify payment');

                const data = await res.json();
                setPaymentDetails(data.data);
                console.log(data);

                setPaymentStatus(data.data.status);
            } catch (error) {
                toast.error(error.message);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        if (transactionId && ['paid', 'failed', 'pending'].includes(status)) {
            verifyPayment();
        } else {
            navigate('/cart');
        }
    }, [transactionId, status, navigate]);

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='animate-spin text-4xl text-teal-600'>
                    <i className='fa-solid fa-spinner'></i>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8'>
                <div className='text-center mb-8'>
                    {/* Payment Status Icons & Messages */}
                    {paymentStatus === 'paid' && (
                        <>
                            <div className='flex justify-center text-6xl text-green-500 mb-4'>
                                <i className='fa-solid fa-circle-check'></i>
                            </div>
                            <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                                Payment Successful!
                            </h1>
                            <p className='text-gray-600 dark:text-gray-300'>
                                Thank you for your registration. Your payment
                                has been processed successfully.
                            </p>
                        </>
                    )}

                    {paymentStatus === 'failed' && (
                        <>
                            <div className='flex justify-center text-6xl text-red-500 mb-4'>
                                <i className='fa-solid fa-circle-xmark'></i>
                            </div>
                            <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                                Payment Failed!
                            </h1>
                            <p className='text-gray-600 dark:text-gray-300'>
                                Unfortunately, your payment could not be
                                processed. Please try again.
                            </p>
                        </>
                    )}

                    {paymentStatus === 'pending' && (
                        <>
                            <div className='flex justify-center text-6xl text-yellow-500 mb-4'>
                                <i className='fa-solid fa-hourglass-half'></i>
                            </div>
                            <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                                Payment Pending!
                            </h1>
                            <p className='text-gray-600 dark:text-gray-300'>
                                Your payment is still being processed. Please
                                wait or retry later.
                            </p>
                        </>
                    )}
                </div>

                {/* Payment Details (Only if payment was made) */}
                {paymentDetails && (
                    <div className='border-t border-b border-gray-200 dark:border-gray-700 py-8'>
                        <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-6'>
                            Payment Details
                        </h2>

                        <div className='space-y-4'>
                            <div className='flex items-center justify-between'>
                                <span className='text-gray-600 dark:text-gray-400'>
                                    Type:
                                </span>
                                <span className='text-gray-900 dark:text-white font-medium'>
                                    {paymentDetails?.typeOfPurchase}
                                </span>
                            </div>

                            <div className='flex items-center justify-between'>
                                <span className='text-gray-600 dark:text-gray-400'>
                                    Amount Paid:
                                </span>
                                <span className='text-gray-900 dark:text-white font-medium'>
                                    ₹{paymentDetails?.amount}
                                </span>
                            </div>

                            <div className='flex items-center justify-between'>
                                <span className='text-gray-600 dark:text-gray-400'>
                                    Transaction ID:
                                </span>
                                <span className='text-gray-900 dark:text-white font-mono'>
                                    {paymentDetails?.paymentId}
                                </span>
                            </div>

                            <div className='flex items-center justify-between'>
                                <span className='text-gray-600 dark:text-gray-400'>
                                    Payment Date:
                                </span>
                                <span className='text-gray-900 dark:text-white'>
                                    {paymentDetails?.createdAt
                                        ? new Date(
                                              paymentDetails.createdAt
                                          ).toLocaleDateString('en-IN', {
                                              day: 'numeric',
                                              month: 'long',
                                              year: 'numeric',
                                          })
                                        : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className='mt-8 flex flex-col sm:flex-row justify-between gap-4'>
                    {paymentStatus === 'paid' && (
                        <button
                            onClick={() => navigate(`/courses`)}
                            className='flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700'
                        >
                            <i className='fa-solid fa-calendar'></i> View Course
                        </button>
                    )}

                    {paymentStatus === 'failed' && (
                        <button
                            onClick={() => navigate(`/cart`)}
                            className='flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700'
                        >
                            <i className='fa-solid fa-rotate-right'></i> Retry
                            Payment
                        </button>
                    )}

                    {paymentStatus === 'pending' && (
                        <button
                            onClick={() =>
                                navigate(
                                    `/check-status?transactionId=${transactionId}`
                                )
                            }
                            className='flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-black bg-yellow-500 hover:bg-yellow-600'
                        >
                            <i className='fa-solid fa-hourglass-half'></i> Check
                            Status
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentComplete;
