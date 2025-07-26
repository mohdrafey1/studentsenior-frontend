import { useEffect, useState } from 'react';
import useApiRequest from '../hooks/useApiRequest';
import { toast } from 'react-toastify';
import { API_BASE_URL, isDevelopment } from '../config/apiConfiguration';
import { useLocation } from 'react-router-dom';

const Cart = () => {
    const query = new URLSearchParams(useLocation().search);
    const courseSlug = query.get('courseSlug');

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [coupon, setCoupon] = useState('');
    const [couponDetails, setCouponDetails] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [couponLoading, setCouponLoading] = useState(false);
    const [error, setError] = useState(null);

    const { apiRequest } = useApiRequest();

    // Fetch course details from backend
    useEffect(() => {
        const fetchCourse = async () => {
            const slug = courseSlug;
            if (!slug) return;

            setLoading(true);
            try {
                const response = await fetch(
                    `${API_BASE_URL}/courseapi/course/cart/${slug}`,
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
    }, [courseSlug]);

    // Handle payment initiation with PhonePe
    const handlePaymentClick = async () => {
        if (!selectedProduct) {
            toast.error('No product selected.');
            return;
        }

        // If there's a valid coupon, apply it before payment
        if (couponDetails) {
            try {
                await apiRequest(
                    `${API_BASE_URL}/courseapi/coupon/apply`,
                    'POST',
                    { code: coupon }
                );
            } catch (err) {
                console.error('Failed to apply coupon:', err);
                toast.error('Failed to apply coupon. Please try again.');
                return;
            }
        }

        const finalAmount = selectedProduct.price - discount;
        const body = {
            amount: finalAmount,
            purchaseItemId: selectedProduct._id,
            typeOfPurchase: 'course_purchase',
            redirectUrl: isDevelopment
                ? `http://localhost:3009/course/${courseSlug}`
                : `https://course.studentsenior.com/course/${courseSlug}`,
        };

        try {
            const response = await apiRequest(
                `${API_BASE_URL}/courseapi/phonepe/initiate`,
                'POST',
                body
            );

            if (response.success) {
                window.location.href = response.redirectUrl;
            } else {
                toast.error('Payment initiation failed. Please try again.');
            }
        } catch (err) {
            console.error('Payment Error:', err);
            toast.error('Something went wrong!');
        }
    };

    // Validate and apply coupon
    const applyCoupon = async () => {
        if (!coupon.trim()) {
            toast.error('Please enter a coupon code');
            return;
        }

        if (!selectedProduct) {
            toast.error('No product selected');
            return;
        }

        setCouponLoading(true);
        try {
            const response = await apiRequest(
                `${API_BASE_URL}/courseapi/coupon/validate`,
                'POST',
                {
                    code: coupon,
                    amount: selectedProduct.price,
                }
            );

            if (response.success) {
                setCouponDetails(response.couponDetails);
                setDiscount(response.discount);
                toast.success('Coupon applied successfully!');
            } else {
                toast.error(response.message);
            }
        } catch (err) {
            console.error('Coupon Error:', err);
            toast.error(err.response?.data?.message || 'Invalid coupon code');
            setCouponDetails(null);
            setDiscount(0);
        } finally {
            setCouponLoading(false);
        }
    };

    // Remove applied coupon
    const removeCoupon = () => {
        setCoupon('');
        setCouponDetails(null);
        setDiscount(0);
    };

    if (loading)
        return (
            <div className='flex justify-center items-center h-screen'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500'></div>
            </div>
        );
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
                            {/* <p className='font-semibold text-lg text-gray-800'>
                                ₹{selectedProduct.price}
                            </p> */}
                        </div>
                    </div>
                ) : (
                    <p className='text-red-500'>
                        ⚠️ No product selected. Please choose a course.
                    </p>
                )}

                {/* Coupon Section */}
                <div className='mb-6'>
                    <div className='flex items-center space-x-4'>
                        <input
                            type='text'
                            placeholder='Enter coupon code'
                            className='border border-gray-300 rounded-lg px-4 py-2 w-2/3'
                            value={coupon}
                            onChange={(e) =>
                                setCoupon(e.target.value.toUpperCase())
                            }
                            disabled={couponDetails !== null}
                        />
                        {!couponDetails ? (
                            <button
                                className='bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50'
                                onClick={applyCoupon}
                                disabled={couponLoading || !coupon.trim()}
                            >
                                {couponLoading ? 'Applying...' : 'Apply'}
                            </button>
                        ) : (
                            <button
                                className='bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition'
                                onClick={removeCoupon}
                            >
                                Remove
                            </button>
                        )}
                    </div>
                    {couponDetails && (
                        <div className='mt-2 text-sm text-green-600'>
                            {couponDetails.discountType === 'percentage'
                                ? `${couponDetails.discountValue}% off`
                                : `₹${couponDetails.discountValue} off`}
                        </div>
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
                                <p>Discount ({couponDetails.code})</p>
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
                    disabled={loading || couponLoading}
                    className='w-full bg-green-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition disabled:opacity-50'
                >
                    {loading ? 'Processing...' : 'Proceed to Pay'}
                </button>
            </div>
        </div>
    );
};

export default Cart;
