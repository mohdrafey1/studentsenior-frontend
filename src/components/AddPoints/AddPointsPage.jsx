import React, { useState, useEffect } from 'react';
import useApiRequest from '../../hooks/useApiRequest';
import Button from '../../ui/Button';
import { handleOnlinePaymentUtil } from '../../utils/purchaseUtils';

const AddPointsPage = () => {
    const [points, setPoints] = useState(500);
    const [rupees, setRupees] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Convert points to rupees (5 points = 1 INR)
    useEffect(() => {
        if (points) {
            setRupees((points / 5).toFixed(2));
        }
    }, [points]);

    const { apiRequest } = useApiRequest();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (points < 500) {
            setError('Minimum points to add is 500');
            return;
        }
        setError('');

        const pointsData = {
            price: points,
            _id: '1234f35415a434d034f01234',
        };

        handleOnlinePaymentUtil(
            pointsData,
            apiRequest,
            window.location.href,
            'add_points'
        );
    };

    const handlePointsChange = (e) => {
        const value = parseInt(e.target.value) || 0;
        setPoints(value);
        if (value < 500) {
            setError('Minimum points to add is 500');
        } else {
            setError('');
        }
    };

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4'>
            <div className='bg-white shadow-lg rounded-2xl p-6 w-full max-w-md'>
                <h2 className='text-2xl font-semibold text-center mb-4'>
                    Add Points
                </h2>
                <p className='text-center mb-2'>5 points = 1 rupee</p>
                <p className='text-center mb-4 text-sm text-gray-600'>
                    Minimum points to add: 500
                </p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor='points'>Points</label>
                    <input
                        name='points'
                        type='number'
                        placeholder='Enter points'
                        value={points}
                        onChange={handlePointsChange}
                        min='500'
                        required
                        className='w-full p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    {error && (
                        <p className='text-red-500 text-sm mb-2'>{error}</p>
                    )}

                    <label htmlFor='rupees'>Rupees</label>
                    <input
                        name='rupees'
                        type='number'
                        placeholder='Enter rupees'
                        value={rupees}
                        onChange={(e) => setRupees(e.target.value)}
                        readOnly
                        className='w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100'
                    />
                    <div className='flex justify-center'>
                        <Button
                            type='submit'
                            disabled={loading || points < 500}
                        >
                            {loading ? (
                                <i className='fas fa-spinner fa-pulse mr-2'></i>
                            ) : null}
                            {loading ? 'Processing...' : 'Submit'}
                        </Button>
                    </div>
                </form>

                <div className='mt-6 text-center'>
                    <p className='text-sm text-gray-500'>
                        By proceeding, you agree to our{' '}
                        <a
                            href='/terms-and-conditions'
                            className='text-blue-500 hover:underline'
                        >
                            Terms and Conditions
                        </a>{' '}
                        and{' '}
                        <a
                            href='/refund-policy'
                            className='text-blue-500 hover:underline'
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
