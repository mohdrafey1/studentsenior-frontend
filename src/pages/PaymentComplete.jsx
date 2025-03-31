import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api, API_BASE_URL } from '../config/apiConfiguration';
import { handleConfirmPurchaseUtil } from '../utils/purchaseUtils';

// Status constants for better maintainability
const PAYMENT_STATUS = {
    PAID: 'paid',
    FAILED: 'failed',
    PENDING: 'pending',
};

const PURCHASE_TYPES = {
    NOTE: 'note_purchase',
    PYQ: 'pyq_purchase',
};

const PaymentComplete = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [redirectTimer, setRedirectTimer] = useState(null);

    const transactionId = searchParams.get('transactionId');
    const status = searchParams.get('status');

    // Clear any existing timers on unmount
    useEffect(() => {
        return () => {
            if (redirectTimer) clearTimeout(redirectTimer);
        };
    }, [redirectTimer]);

    const verifyPayment = async () => {
        try {
            if (
                !transactionId ||
                !Object.values(PAYMENT_STATUS).includes(status)
            ) {
                throw new Error('Invalid payment parameters');
            }

            const res = await fetch(
                `${API_BASE_URL}/api/phonepe/${transactionId}`,
                {
                    credentials: 'include',
                }
            );

            // if (!res.ok) {
            //     throw new Error(
            //         res.status === 404
            //             ? 'Payment verification failed - transaction not found'
            //             : 'Payment verification failed'
            //     );
            // }

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || 'Payment verification failed');
            }

            setPaymentDetails(data.data);
            setPaymentStatus(data.data.status);

            // Handle successful payment
            if (data.data.status === PAYMENT_STATUS.PAID) {
                await handleSuccessfulPayment(data.data);
            }
        } catch (error) {
            console.error('Payment verification error:', error);
            setError(error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessfulPayment = async (paymentData) => {
        try {
            // For note/pyq purchases, confirm the purchase
            if (
                [PURCHASE_TYPES.NOTE, PURCHASE_TYPES.PYQ].includes(
                    paymentData.typeOfPurchase
                )
            ) {
                const apiEndpoint =
                    paymentData.typeOfPurchase === PURCHASE_TYPES.NOTE
                        ? api.subjectNotes
                        : api.newPyqs;

                await handleConfirmPurchaseUtil(
                    paymentData.purchaseItemId,
                    apiEndpoint,
                    navigate,
                    () => {}
                );
            }

            // Setup redirect if applicable
            if (paymentData.redirectBackUrl) {
                const timer = setTimeout(() => {
                    window.location.href = paymentData.redirectBackUrl;
                }, 5000);
                setRedirectTimer(timer);
            }
        } catch (error) {
            console.error('Post-purchase processing error:', error);
            toast.error(
                'Payment successful but could not complete purchase processing'
            );
        }
    };

    useEffect(() => {
        verifyPayment();
    }, [transactionId, status]);

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin text-4xl text-teal-600 mb-4'>
                        <i className='fa-solid fa-spinner'></i>
                    </div>
                    <p className='text-gray-600'>Verifying your payment...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <div className='text-6xl text-red-500 mb-4'>
                        <i className='fa-solid fa-circle-exclamation'></i>
                    </div>
                    <h1 className='text-2xl font-bold text-gray-800 mb-2'>
                        Payment Error
                    </h1>
                    <p className='text-gray-600 mb-6'>{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
                    >
                        Return Home
                    </button>
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
                                {[
                                    'note_purchase',
                                    'pyq_purchase',
                                    'add_points',
                                ].includes(paymentDetails?.typeOfPurchase) &&
                                paymentDetails?.redirectBackUrl ? (
                                    <>
                                        Thank you for your purchase. You'll be
                                        redirected back shortly.
                                        <p className='text-sm text-gray-500 mt-2'>
                                            Not redirecting?{' '}
                                            <a
                                                href={
                                                    paymentDetails.redirectBackUrl
                                                }
                                                className='text-blue-500'
                                            >
                                                Click here
                                            </a>
                                        </p>
                                    </>
                                ) : (
                                    'Thank you for your registration. Your payment has been processed successfully.'
                                )}
                            </p>
                        </>
                    )}

                    {/* Rest of your payment status UI remains the same */}
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
                            <p className='text-gray-600 text-xs dark:text-gray-300'>
                                If your payment is deducted and does not return
                                within 2 days please contact us
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
                            <p className='text-gray-600 text-xs dark:text-gray-300'>
                                If your payment is deducted and does not return
                                within 2 days please contact us
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
                                    {paymentDetails?.merchantOrderId}
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
                    {paymentStatus === 'paid' &&
                        ![
                            'note_purchase',
                            'pyq_purchase',
                            'add_points',
                        ].includes(paymentDetails?.typeOfPurchase) && (
                            <button
                                onClick={() => navigate(`/courses`)}
                                className='flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700'
                            >
                                <i className='fa-solid fa-calendar'></i> View
                                Course
                            </button>
                        )}

                    {paymentStatus === 'failed' &&
                        ![
                            'note_purchase',
                            'pyq_purchase',
                            'add_points',
                        ].includes(paymentDetails?.typeOfPurchase) && (
                            <button
                                onClick={() => navigate(`/cart`)}
                                className='flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700'
                            >
                                <i className='fa-solid fa-rotate-right'></i>{' '}
                                Retry Payment
                            </button>
                        )}

                    {paymentStatus === 'pending' &&
                        ![
                            'note_purchase',
                            'pyq_purchase',
                            'add_points',
                        ].includes(paymentDetails?.typeOfPurchase) && (
                            <button
                                onClick={() => navigate(`/cart`)}
                                className='flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-black bg-yellow-500 hover:bg-yellow-600'
                            >
                                <i className='fa-solid fa-hourglass-half'></i>{' '}
                                Retry Payment
                            </button>
                        )}

                    {paymentStatus === 'pending' &&
                        [
                            'note_purchase',
                            'pyq_purchase',
                            'add_points',
                        ].includes(paymentDetails?.typeOfPurchase) &&
                        paymentDetails?.redirectBackUrl && (
                            <button
                                onClick={() => {
                                    window.location.href =
                                        paymentDetails.redirectBackUrl;
                                }}
                                className='flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-black bg-yellow-500 hover:bg-yellow-600'
                            >
                                <i className='fa-solid fa-hourglass-half'></i>{' '}
                                Try Again
                            </button>
                        )}
                    {paymentStatus === 'failed' &&
                        [
                            'note_purchase',
                            'pyq_purchase',
                            'add_points',
                        ].includes(paymentDetails?.typeOfPurchase) &&
                        paymentDetails?.redirectBackUrl && (
                            <button
                                onClick={() => {
                                    window.location.href =
                                        paymentDetails.redirectBackUrl;
                                }}
                                className='flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700'
                            >
                                <i className='fa-solid fa-rotate-right'></i> Try
                                Again
                            </button>
                        )}
                </div>
            </div>
        </div>
    );
};

export default PaymentComplete;
