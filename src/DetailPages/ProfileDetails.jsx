import { useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import useApiRequest from '../hooks/useApiRequest';
import { api } from '../config/apiConfiguration';
import pyq from '../icons/pyq.jpg';
import notes from '../icons/notes.jpg';
import redeem from '../icons/redeem.png';
import { fetchUserData } from '../redux/slices/userDataSlice';
import { useDispatch } from 'react-redux';

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
        const visibleItems = isExpanded ? items : items.slice(0, 3);

        return (
            <>
                {/* Adjusted space-y-6 to space-y-3 to reduce gaps */}
                <ul className="space-y-3">
                    {visibleItems.map((item, index) => (
                        <li
                            key={index}
                            className="px-4 py-3 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
                        >
                            {type === 'notes' && (
                                <div className="flex justify-between items-center">
                                    <a
                                        href={`${item.college?.slug
                                            }/resources/${item.subject?.branch?.course?.courseCode?.toLowerCase() ||
                                            ''
                                            }/${item.subject?.branch?.branchCode?.toLowerCase() ||
                                            ''
                                            }/notes/${item.subject?.subjectCode?.toLowerCase() ||
                                            ''
                                            }/${item.slug}`}
                                        rel="noopener noreferrer"
                                        className="text-blue-600 font-semibold hover:underline text-sm"
                                    >
                                        <p className="font-semibold text-base text-gray-800">
                                            {item.title}
                                        </p>
                                    </a>
                                    <p className="text-xs text-gray-500">
                                        {new Date(
                                            item.createdAt
                                        ).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                            )}

                            {type === 'products' && (
                                <div className="flex justify-between items-center">
                                    <div>
                                        <a
                                            href={`/college/${item.college?.slug}/store/${item.slug}`}
                                            rel="noopener noreferrer"
                                            className="text-blue-600 font-semibold hover:underline text-sm"
                                        >
                                            <p className="font-semibold text-base text-gray-800">
                                                {item.name}
                                            </p>
                                        </a>
                                        <p className="text-green-600 text-sm font-medium">
                                            Price: ₹{item.price}
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {new Date(
                                            item.createdAt
                                        ).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                            )}

                            {type === 'transactions' && (
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex-shrink-0">
                                        <img
                                            src={
                                                item.resourceType === 'notes'
                                                    ? notes
                                                    : item.resourceType ===
                                                        'pyq'
                                                        ? pyq
                                                        : item.type === 'redeem'
                                                            ? redeem
                                                            : item.type === 'bonus'
                                                                ? redeem
                                                                : redeem
                                            }
                                            alt={
                                                item.type
                                                    ? item.type
                                                    : item.resourceType
                                            }
                                            className="h-full w-full object-cover p-1 rounded-full"
                                        />
                                    </div>
                                    <div className="ml-4 flex justify-between w-full">
                                        <div>
                                            <p className="font-semibold text-base text-gray-800 capitalize">
                                                {item.type}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(
                                                    item.createdAt
                                                ).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-xl font-semibold">
                                            <p
                                                className={`p-2 ${item.type === 'earn'
                                                    ? 'text-green-600'
                                                    : item.type === 'redeem'
                                                        ? 'text-red-600'
                                                        : item.type === 'bonus'
                                                            ? 'text-green-600'
                                                            : null
                                                    }`}
                                            >
                                                {item.type === 'earn'
                                                    ? '+'
                                                    : item.type === 'redeem'
                                                        ? '-'
                                                        : item.type === 'bonus'
                                                            ? '-'
                                                            : item.type === 'add-point'
                                                                ? '+'
                                                                : item.type === 'pyq-sale'
                                                                    ? '+'
                                                                    : item.type === 'note-sale'
                                                                        ? '+'
                                                                        : '-'}
                                                {item.points}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {type === 'pyqs' && (
                                <div className="flex justify-between items-center">
                                    <a
                                        href={`${item.college?.slug
                                            }/resources/${item.subject?.branch?.course?.courseCode?.toLowerCase() ||
                                            ''
                                            }/${item.subject?.branch?.branchCode?.toLowerCase() ||
                                            ''
                                            }/pyqs/${item.subject?.subjectCode?.toLowerCase() ||
                                            ''
                                            }/${item.slug}`}
                                        rel="noopener noreferrer"
                                        className="text-blue-600 font-semibold hover:underline text-sm"
                                    >
                                        <p className="font-semibold text-base text-gray-800">
                                            {item.subject?.subjectName} -{' '}
                                            {item.examType.toUpperCase()}
                                        </p>
                                    </a>
                                    <p className="text-xs text-gray-500">
                                        {new Date(
                                            item.createdAt
                                        ).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

                {items.length > 5 && (
                    <button
                        onClick={() => toggleViewMore(type)}
                        className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium 
                            ${isExpanded
                                ? 'bg-sky-500 text-white'
                                : 'bg-white text-blue-500 border border-blue-500'
                            } 
                            hover:bg-sky-600 hover:text-white transition duration-300`}
                    >
                        {isExpanded ? 'View Less' : 'View More'}
                    </button>
                )}
                <br />
                <br />
            </>
        );
    };

    const [showRedeemModal, setShowRedeemModal] = useState(false);
    const [upiId, setUpiId] = useState('');
    const [amount, setAmount] = useState('');
    const [loadingRedeem, setLoadingRedeem] = useState(false);

    const dispatch = useDispatch();
    const { apiRequest, loading } = useApiRequest();
    const [showInfo, setShowInfo] = useState(false);


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

            if (!amount || isNaN(amount) || amount <= 0) {
                toast.error('Please enter valid points');
                return;
            }

            if (amount > data.rewardBalance) {
                toast.error('Insufficient points for this amount');
                return;
            }

            if (amount < 100) {
                toast.error('Minimum points is 100 for withdrawl');
                return;
            }

            const body = {
                upiId,
                rewardBalance: amount,
            };

            setLoadingRedeem(true);

            const response = await apiRequest(api.userRedumption, 'POST', body);

            if (response.success === false) {
                toast.error(response.message || 'Something went wrong');
                setShowRedeemModal(false);
                return;
            }
            setShowRedeemModal(false);
            toast.success(
                'Points Redemption Successful, Amount will be transferred soon'
            );
            dispatch(fetchUserData());
        } catch (error) {
            toast.error(error.message);
            setShowRedeemModal(false);
            console.log(error);
        } finally {
            setLoadingRedeem(false);
        }
    };

    return (
        <div className="py-6 max-w-4xl mx-auto h-[100%] overflow-scroll p-6">
            <h1 className="text-2xl font-bold text-center">
                Contributions Details
            </h1>

            <div className="rounded-lg space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Rewards</h2>

                <div className="lg:flex justify-between gap-3">
                    {/* Current Balance Card */}
                    <div className="bg-white text-gray-700 rounded-2xl w-full px-6 py-5 shadow-sm hover:shadow-lg transition-shadow duration-300 my-3">
                        <div className="flex items-center justify-between">
                            <strong className="text-xl text-gray-800">Current Balance:</strong>

                            {/* Click-to-Toggle Info */}
                            <button
                                onClick={() => setShowInfo(!showInfo)}
                                className="text-orange-500 hover:text-orange-600 focus:outline-none"
                            >
                                <i className="fa-solid fa-circle-info text-xl"></i>
                            </button>
                        </div>

                        {/* Conditional Info Box */}
                        {showInfo && (
                            <div className="bg-gray-100 text-sm text-gray-700 p-3 mt-3 rounded-lg border border-gray-200">
                                <p>You can redeem your points only after accumulating 100 points.</p>
                                <p className="mt-1 font-semibold">5 points = ₹1</p>
                            </div>
                        )}

                        <p className="text-4xl font-bold mt-4 text-gray-900">{data.rewardBalance}</p>

                        {/* Progress Bar */}
                        <div className="relative h-2 bg-gray-200 rounded-full mt-4 mb-6 w-full">
                            <div
                                className="absolute top-0 left-0 h-full bg-orange-500 rounded-full"
                                style={{
                                    width: `${Math.min((data.rewardBalance / 100) * 100, 100)}%`,
                                }}
                            ></div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setShowRedeemModal(true)}
                                className={`${data.rewardBalance >= 100
                                    ? 'bg-sky-500 hover:bg-sky-600'
                                    : 'bg-gray-400 cursor-not-allowed'
                                    } text-white font-semibold py-2 px-5 rounded-md transition-all duration-300`}
                                disabled={data.rewardBalance < 100}
                            >
                                Redeem Now
                            </button>

                            <Link
                                to="/add-points"
                                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-5 rounded-md transition-all duration-300"
                            >
                                Add Points
                            </Link>
                        </div>
                    </div>

                    {/* Total Points Earned */}
                    <div className="bg-white text-gray-600 h-40 rounded-2xl w-full pl-4 pt-4 shadow-sm hover:shadow-lg duration-300 my-2">
                        <strong className="text-gray-800">Total Points Earned:</strong>
                        <br /><br />
                        <p className="text-3xl font-bold text-gray-800">{data.rewardPoints}</p>
                    </div>

                    {/* Total Redeemed */}
                    <div className="bg-white text-gray-600 h-40 rounded-2xl w-full pl-4 pt-4 shadow-sm hover:shadow-lg duration-300 my-2">
                        <strong className="text-gray-800">Total Redeemed:</strong>
                        <br /><br />
                        <p className="text-3xl font-bold text-gray-800">{data.rewardRedeemed}</p>
                    </div>
                </div>
            </div>

            {/* Notes Section */}
            {data.notes && data.notes.length > 0 ? (
                <div className="rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">Notes Added</h2>
                    {data.notes && data.notes.length > 0
                        ? renderList(data.notes, 'notes', viewMoreNotes)
                        : null}
                </div>
            ) : null}

            {/* Products Section */}
            {data.products && data.products.length > 0 ? (
                <div className=" rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">
                        Products Added
                    </h2>
                    {data.products && data.products.length > 0 ? (
                        renderList(data.products, 'products', viewMoreProducts)
                    ) : (
                        <p className="text-gray-500">
                            No products added by you
                        </p>
                    )}
                </div>
            ) : null}

            {/* PYQs Section */}
            {data.pyqs && data.pyqs.length > 0 ? (
                <div className=" rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">PYQs Added</h2>
                    {data.pyqs && data.pyqs.length > 0 ? (
                        renderList(data.pyqs, 'pyqs', viewMorePyqs)
                    ) : (
                        <p className="text-gray-500">No Pyq Added by you</p>
                    )}
                </div>
            ) : null}

            {/* Transactions Section */}
            {data.transactions && data.transactions.length > 0 ? (
                <div className=" rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">Transactions</h2>
                    {data.transactions && data.transactions.length > 0 ? (
                        renderList(
                            data.transactions,
                            'transactions',
                            viewMoreTransactions
                        )
                    ) : (
                        <p className="text-gray-500">
                            No transactions available
                        </p>
                    )}
                </div>
            ) : null}

            {/* Redeem Modal */}
            {showRedeemModal && (
                <div className="fixed inset-0 !mt-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md mx-4">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                            Redeem Points
                        </h2>
                        <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="Enter UPI ID"
                            className="w-full p-4 rounded-lg mb-4 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-gray-700"
                        />
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter Points"
                            className="w-full p-4 rounded-lg mb-4 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-gray-700"
                        />
                        {amount && (
                            <p className="text-gray-600 mb-4">
                                You will receive ₹{(amount / 5).toFixed(2)}
                            </p>
                        )}
                        <button
                            onClick={handleRedeem}
                            className={`w-full p-4 rounded-lg text-white font-semibold ${loadingRedeem
                                ? 'bg-sky-400 cursor-not-allowed'
                                : 'bg-sky-500 hover:bg-sky-600'
                                }`}
                            disabled={loadingRedeem}
                        >
                            {loadingRedeem ? 'Processing...' : 'Redeem Points'}
                        </button>
                        <button
                            onClick={() => setShowRedeemModal(false)}
                            className="mt-4 w-full p-4 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
