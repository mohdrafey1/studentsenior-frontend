import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSavedCollection } from '../redux/slices/savedCollectionSlice';

const SavedCollection = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('savedPYQs');

    useEffect(() => {
        dispatch(fetchSavedCollection());
    }, [dispatch]);

    const { savedPYQs, savedNotes, purchasedPYQs, purchasedNotes } = useSelector((state) => state.savedCollection);

    // const courseCode = pyq.subject?.branch?.course?.courseCode.toLowerCase();
    // const branchCode = pyq.subject?.branch?.branchCode.toLowerCase();
    // const subjectCode = pyq.subject?.subjectCode.toLowerCase();
    // const pyqUrl = `/${collegeName}/resources/${courseCode}/${branchCode}/pyqs/${subjectCode}/${pyq.slug}`;


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const renderEmptyState = () => (
        <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="text-gray-400 text-5xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No items found</h3>
            <p className="text-gray-500">You don't have any items in this collection yet.</p>
        </div>
    );

    const renderPYQCard = (item) => {
        const pyq = item.pyqId;
        return (
            <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-4 border-b">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-lg text-gray-800 mb-1">
                                {pyq.slug.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase())}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                    {pyq.examType.toUpperCase()}
                                </span>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                    {pyq.year}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-sm text-gray-500">Saved {formatDate(item.savedAt)}</span>
                            {pyq.isPaid && (
                                <div className="mt-1">
                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                                        ₹{pyq.price}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            {pyq.clickCounts}
                        </span>

                    </div>
                    <a href={pyq.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View PDF
                    </a>
                </div>
            </div>
        );
    };

    const renderNoteCard = (item) => {
        const note = item.noteId;
        return (
            <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-4 border-b">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-lg text-gray-800 mb-1">
                                {note?.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                                {note?.description.length > 80 ? note?.description.substring(0, 80) + '...' : note?.description}
                            </p>
                            <div className="text-xs text-gray-500">
                                {note?.slug.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase())}
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-sm text-gray-500">Saved {formatDate(item.savedAt)}</span>
                            {note?.isPaid && (
                                <div className="mt-1">
                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                                        ₹{note?.price}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            {note?.clickCounts}
                        </span>

                        <span className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            {note?.likes.length}
                        </span>
                    </div>
                    <a href={note?.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View PDF
                    </a>
                </div>
            </div>
        );
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'savedPYQs':
                return savedPYQs?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {savedPYQs.map(item => renderPYQCard(item))}
                    </div>
                ) : renderEmptyState();
            case 'savedNotes':
                return savedNotes?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {savedNotes.map(item => renderNoteCard(item))}
                    </div>
                ) : renderEmptyState();
            case 'purchasedPYQs':
                return purchasedPYQs?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {purchasedPYQs.map(item => renderPYQCard(item))}
                    </div>
                ) : renderEmptyState();
            case 'purchasedNotes':
                return purchasedNotes?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {purchasedNotes.map(item => renderNoteCard(item))}
                    </div>
                ) : renderEmptyState();
            default:
                return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">My Collection</h1>

            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('savedPYQs')}
                            className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'savedPYQs'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Saved PYQs
                            {savedPYQs?.length > 0 && (
                                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                                    {savedPYQs.length}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('savedNotes')}
                            className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'savedNotes'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Saved Notes
                            {savedNotes?.length > 0 && (
                                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                                    {savedNotes.length}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('purchasedPYQs')}
                            className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'purchasedPYQs'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Purchased PYQs
                            {purchasedPYQs?.length > 0 && (
                                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                                    {purchasedPYQs.length}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('purchasedNotes')}
                            className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'purchasedNotes'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Purchased Notes
                            {purchasedNotes?.length > 0 && (
                                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                                    {purchasedNotes.length}
                                </span>
                            )}
                        </button>
                    </nav>
                </div>
            </div>

            <div className="mt-6">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default SavedCollection;