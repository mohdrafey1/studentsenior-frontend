import React from 'react';
import { Link } from 'react-router-dom';
import Modal from '../../utils/Dialog.jsx';

const ConfirmPurchaseModal = ({
    isOpen,
    onClose,
    selectedResource,
    rewardBalance,
    handleOnlinePayment,
    handleConfirmPurchase,
    viewDemoPath,
    title,
}) => {
    if (!selectedResource) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className='space-y-4 p-4 text-center'>
                <h2 className='text-xl font-semibold text-gray-800'>
                    Available Points: {rewardBalance}
                </h2>
                <p className='text-gray-700'>
                    Price for this Resource:{' '}
                    <span className='font-medium'>
                        {selectedResource.price}
                    </span>{' '}
                    Points =
                    <span className='font-medium'>
                        {' '}
                        {selectedResource.price / 5}₹
                    </span>
                </p>

                <div className='flex flex-wrap justify-center items-center gap-3 mt-4'>
                    {/* Pay Online Button */}
                    <button
                        onClick={handleOnlinePayment}
                        className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition'
                    >
                        Pay Online {selectedResource.price / 5}₹
                    </button>

                    {/* Confirm by Points Button */}
                    <button
                        onClick={handleConfirmPurchase}
                        disabled={rewardBalance < selectedResource.price}
                        className={`px-4 py-2 rounded-lg text-white transition ${
                            rewardBalance >= selectedResource.price
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        Confirm by Points {selectedResource.price}p
                    </button>

                    {/* Show Insufficient Points Message if Needed */}
                    {rewardBalance < selectedResource.price && (
                        <p className='text-red-500 w-full'>
                            Insufficient points. You need{' '}
                            <b>{selectedResource.price - rewardBalance}</b> more
                            points.
                        </p>
                    )}

                    {/* Add Points Button */}
                    <Link
                        to='/add-points'
                        className='bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition'
                    >
                        Add Points
                    </Link>

                    {/* View Demo Button */}
                    {viewDemoPath && (
                        <Link
                            to={viewDemoPath}
                            rel='noopener noreferrer'
                            className='bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition'
                        >
                            View Demo
                        </Link>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmPurchaseModal;
