import { useState } from 'react';
import { toast } from 'react-toastify';
import useApiRequest from '../hooks/useApiRequest';
import { api } from '../config/apiConfiguration';

export default function ProfileDetails({ data }) {
    const [viewMoreNotes, setViewMoreNotes] = useState(false);
    const [viewMoreProducts, setViewMoreProducts] = useState(false);
    const [viewMoreTransactions, setViewMoreTransactions] = useState(false);
    const [viewMorePyqs, setViewMorePyqs] = useState(false);

    const toggleViewMore = (type) => {
        switch (type) {
            case 'notes':
                setViewMoreNotes(!viewMoreNotes);
                break;
            case 'products':
                setViewMoreProducts(!viewMoreProducts);
                break;
            case 'transactions':
                setViewMoreTransactions(!viewMoreTransactions);
                break;
            case 'pyqs':
                setViewMorePyqs(!viewMorePyqs);
                break;
            default:
                break;
        }
    };

    const renderList = (items, type, isExpanded) => {
        const visibleItems = isExpanded ? items : items.slice(0, 5);
        return (
            <>
                <ul className="space-y-4">
                    {visibleItems.map((item, index) => (
                        <li key={index} className="p-4 bg-gray-100 rounded-lg">
                            {type === 'notes' && (
                                <>
                                    <p className="font-bold">{item.title}</p>
                                    <p>{item.description}</p>
                                    <a
                                        href={item.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                    >
                                        View Notes
                                    </a>
                                    <p>
                                        <strong>Created At:</strong>{' '}
                                        {new Date(
                                            item.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </>
                            )}
                            {type === 'products' && (
                                <>
                                    <p className="font-bold">{item.name}</p>
                                    <p>{item.description}</p>
                                    <p className="text-green-600">
                                        Price: ₹{item.price}
                                    </p>

                                    <p>
                                        <strong>Created At:</strong>{' '}
                                        {new Date(
                                            item.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </>
                            )}
                            {type === 'transactions' && (
                                <>
                                    <p>
                                        <strong>Type:</strong> {item.type}
                                    </p>
                                    <p>
                                        <strong>Points:</strong> {item.points}
                                    </p>
                                    <p>
                                        <strong>Resource Type:</strong>{' '}
                                        {item.resourceType || 'redemption'}
                                    </p>
                                    <p>
                                        <strong>Created At:</strong>{' '}
                                        {new Date(
                                            item.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </>
                            )}
                            {type === 'pyqs' && (
                                <>
                                    <p className="font-bold">
                                        {item.subject?.subjectName} -{' '}
                                        {item.examType.toUpperCase()}
                                    </p>
                                    <p>
                                        <strong>Year:</strong> {item.year}
                                    </p>
                                    <a
                                        href={item.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                    >
                                        View PYQ
                                    </a>
                                    <p>
                                        <strong>Created At:</strong>{' '}
                                        {new Date(
                                            item.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
                {items.length > 5 && (
                    <button
                        onClick={() => toggleViewMore(type)}
                        className="mt-4 text-blue-500 underline"
                    >
                        {isExpanded ? 'View Less' : 'View More'}
                    </button>
                )}
            </>
        );
    };

    const [showRedeemModal, setShowRedeemModal] = useState(false);
    const [upiId, setUpiId] = useState('');
    const [loadingRedeem, setLoadingRedeem] = useState(false);

    const { apiRequest, loading } = useApiRequest();

    const handleRedeem = async () => {
        try {
            if (data.rewardBalance < 100) {
                toast.error('Minimum eligibility for redeeming points is 100');
                setShowRedeemModal(false);
                return;
            }

            if (!upiId || !/^[a-zA-Z0-9]+@[a-zA-Z0-9.-]+$/.test(upiId)) {
                toast.error('Please enter a valid UPI ID');
                return;
            }

            const body = {
                upiId,
                rewardBalance: data.rewardBalance,
            };

            setLoadingRedeem(true);

            const response = await apiRequest(api.userRedumption, 'POST', body);

            const responseData = await response.json();

            if (responseData.success === false) {
                toast.error(responseData.message || 'Something went wrong');
                setShowRedeemModal(false);
            }
            toast.success(
                'Points Redemption Successful, Amount will be transferred soon'
            );
        } catch (error) {
            toast.error(error.message);
            setShowRedeemModal(false);
            console.log(error);
        } finally {
            setLoadingRedeem(false);
        }
    };

    return (
        <div className="p-6 space-y-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-center">
                Contributions Details
            </h1>

            {/* Reward Section */}
            <div className="bg-white flex gap-6 shadow-md rounded-lg p-6 space-y-4">
                <div>
                    <h2 className="text-xl font-semibold">Rewards</h2>
                    <p>
                        <strong>Current Balance:</strong> {data.rewardBalance}
                    </p>
                    <p>
                        <strong>Total Points Earned:</strong>{' '}
                        {data.rewardPoints}
                    </p>
                    <p>
                        <strong>Total Redeemed:</strong> {data.rewardRedeemed}
                    </p>
                </div>
                <div>
                    <button
                        onClick={() => setShowRedeemModal(true)}
                        className="bg-yellow-300 rounded-md p-1 border-2 border-sky-500"
                    >
                        Redeem Now
                    </button>
                </div>
            </div>

            {/* Notes Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold">Notes Added</h2>
                {data.notes && data.notes.length > 0 ? (
                    renderList(data.notes, 'notes', viewMoreNotes)
                ) : (
                    <p className="text-gray-500">No notes added by you</p>
                )}
            </div>

            {/* Products Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold">Products Added</h2>
                {data.products && data.products.length > 0 ? (
                    renderList(data.products, 'products', viewMoreProducts)
                ) : (
                    <p className="text-gray-500">No products added by you</p>
                )}
            </div>

            {/* PYQs Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold">PYQs Added</h2>
                {data.pyqs && data.pyqs.length > 0 ? (
                    renderList(data.pyqs, 'pyqs', viewMorePyqs)
                ) : (
                    <p className="text-gray-500">No Pyq Added by you</p>
                )}
            </div>

            {/* Transactions Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold">Transactions</h2>
                {data.transactions && data.transactions.length > 0 ? (
                    renderList(
                        data.transactions,
                        'transactions',
                        viewMoreTransactions
                    )
                ) : (
                    <p className="text-gray-500">No transactions available</p>
                )}
            </div>

            {/* Redeem Modal */}
            {showRedeemModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-2xl font-semibold text-center mb-4">
                            Redeem Points
                        </h2>
                        <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="Enter UPI ID"
                            className="w-full p-3 rounded-md mb-4 border border-gray-300"
                        />
                        <button
                            onClick={handleRedeem}
                            className="w-full p-3 bg-blue-500 text-white rounded-md"
                            disabled={loadingRedeem}
                        >
                            {loadingRedeem ? 'Processing...' : 'Redeem Points'}
                        </button>
                        <button
                            onClick={() => setShowRedeemModal(false)}
                            className="mt-3 w-full p-3 bg-gray-300 text-gray-800 rounded-md"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
