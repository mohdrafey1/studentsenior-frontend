import React, { useEffect, useState } from 'react';
import useApiRequest from '../hooks/useApiRequest';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config/apiConfiguration';

const Cart = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { apiRequest, loading: apiRequestLoading } = useApiRequest();

    // Fetch course details from backend
    useEffect(() => {
        const fetchCourse = async () => {
            const slug = localStorage.getItem('course-slug');
            if (!slug) return;

            setLoading(true);
            try {
                const response = await fetch(
                    `${API_BASE_URL}/courseapi/course/${slug}`,
                    { credentials: 'include' }
                );
                if (!response.ok)
                    throw new Error('Failed to fetch course details');

                const data = await response.json();
                setSelectedProduct(data);
            } catch (err) {
                setError(err.message);
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, []);

    // Handle payment initiation with PhonePe
    const handlePaymentClick = async () => {
        if (!selectedProduct) {
            toast.error('No product selected.');
            return;
        }

        const body = {
            amount: selectedProduct.price, // Convert to paisa for PhonePe
            purchaseItemId: selectedProduct._id,
            typeOfPurchase: 'course purchase',
        };

        try {
            const response = await apiRequest(
                `${API_BASE_URL}/api/phonepe/pay`,
                'POST',
                body
            );

            if (response.success) {
                window.location.href = response.redirectUrl; // Redirect to PhonePe payment page
            } else {
                toast.error('Payment initiation failed. Please try again.');
            }
        } catch (err) {
            console.error('Payment Error:', err);
            toast.error('Something went wrong!');
        }
    };

    // Apply coupon discount
    const applyCoupon = () => {
        if (coupon === 'NEW500') {
            setDiscount(10);
        } else {
            setDiscount(0);
        }
    };

    if (loading)
        return <div className='text-center text-lg font-bold'>Loading...</div>;
    if (error) return <div className='text-center text-red-500'>{error}</div>;

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-t from-sky-500 to-white p-6'>
            <div className='bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl'>
                <h2 className='text-2xl font-bold text-gray-700 mb-6'>
                    Your Cart
                </h2>

                {selectedProduct ? (
                    <div className='bg-teal-100 rounded-xl p-6 mb-6'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center space-x-4'>
                                <img
                                    src={selectedProduct.thumbnail}
                                    alt={selectedProduct.title}
                                    className='w-20 h-20 object-cover rounded-lg'
                                />
                                <div>
                                    <h3 className='text-lg font-semibold'>
                                        {selectedProduct.title}
                                    </h3>
                                    <p className='text-sm text-gray-600'>
                                        {selectedProduct.courseDuration} |{' '}
                                        {selectedProduct.startDate
                                            ? new Date(
                                                  selectedProduct.startDate
                                              ).toLocaleDateString('en-IN')
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <p className='font-semibold text-lg text-gray-800'>
                                ₹{selectedProduct.price}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className='text-red-500'>
                        ⚠️ No product selected. Please choose a course.
                    </p>
                )}

                {/* Coupon Section */}
                <div className='flex items-center space-x-4 mb-6'>
                    <input
                        type='text'
                        placeholder='Enter coupon code'
                        className='border border-gray-300 rounded-lg px-4 py-2 w-2/3'
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                    />
                    <button
                        className='bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition'
                        onClick={applyCoupon}
                    >
                        Apply
                    </button>
                    {discount > 0 && (
                        <span className='text-green-600'>Coupon Applied!</span>
                    )}
                </div>

                {/* Total Amount Section */}
                {selectedProduct && (
                    <div className='bg-gray-100 rounded-xl p-6 mb-6'>
                        <div className='flex justify-between text-gray-700'>
                            <p>{selectedProduct.title}</p>
                            <p>₹{selectedProduct.price}</p>
                        </div>
                        <div className='border-t border-gray-300 my-3'></div>
                        {discount > 0 && (
                            <div className='flex justify-between text-green-600'>
                                <p>Coupon ({coupon})</p>
                                <p>- ₹{discount}</p>
                            </div>
                        )}
                        <div className='border-t border-gray-300 my-3'></div>
                        <div className='flex justify-between font-bold text-lg'>
                            <p>Total</p>
                            <p>₹{selectedProduct.price - discount}</p>
                        </div>
                    </div>
                )}

                <button
                    onClick={handlePaymentClick}
                    className='w-full bg-green-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition'
                >
                    Proceed to Pay
                </button>
            </div>
        </div>
    );
};

export default Cart;
