import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSavedCollection } from '../redux/slices/savedCollectionSlice';

const SavedCollection = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('savedPYQs');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await dispatch(fetchSavedCollection());
            setIsLoading(false);
        };
        loadData();
    }, [dispatch]);

    const { savedPYQs, savedNotes, purchasedPYQs, purchasedNotes } =
        useSelector((state) => state.savedCollection);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const renderLoadingState = () => (
        <div className='flex flex-col items-center justify-center p-12 text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4'></div>
            <p className='text-gray-600'>Loading your collection...</p>
        </div>
    );

    const renderEmptyState = () => (
        <div className='flex flex-col items-center justify-center p-8 md:p-12 text-center'>
            <div className='text-gray-400 text-4xl md:text-5xl mb-4'>📄</div>
            <h3 className='text-lg md:text-xl font-semibold text-gray-700 mb-2'>
                No items found
            </h3>
            <p className='text-gray-500 max-w-md'>
                You don't have any items in this collection yet.
            </p>
        </div>
    );

    const renderPYQCard = (item, isPurchased = false) => {
        // Handle both structures from the data
        const pyq = isPurchased ? item : item.pyqId;
        if (!pyq) return null;

        // Constructing the PYQ URL
        const courseCode =
            pyq.subject?.branch?.course?.courseCode?.toLowerCase();
        const branchCode = pyq.subject?.branch?.branchCode?.toLowerCase();
        const subjectCode = pyq.subject?.subjectCode?.toLowerCase();
        const collegeName = pyq.college?.slug;
        const pyqUrl = `/${collegeName}/resources/${courseCode}/${branchCode}/pyqs/${subjectCode}/${pyq.slug}`;

        return (
            <div
                key={item._id}
                className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
            >
                <div className='p-4 border-b'>
                    <div className='flex flex-col sm:flex-row justify-between sm:items-start gap-2'>
                        <div className='flex-1'>
                            <h3 className='font-semibold text-lg text-gray-800 mb-1 line-clamp-2'>
                                {pyq.subject?.subjectName ||
                                    pyq.subject?.subjectCode ||
                                    'Unknown Subject'}
                            </h3>
                            <div className='flex flex-wrap items-center gap-2 mb-2'>
                                <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded'>
                                    {pyq.examType?.toUpperCase() || 'EXAM'}
                                </span>
                                <span className='bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded'>
                                    {pyq.year || 'Unknown Year'}
                                </span>
                                {pyq.solved && (
                                    <span className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded'>
                                        SOLVED
                                    </span>
                                )}
                            </div>
                            <div className='text-xs text-gray-500'>
                                {pyq.slug
                                    ?.replace(/-/g, ' ')
                                    .replace(/(^\w|\s\w)/g, (m) =>
                                        m.toUpperCase()
                                    )}
                            </div>
                        </div>
                        <div className='text-right'>
                            <span className='text-sm text-gray-500'>
                                {isPurchased ? 'Purchased' : 'Saved'}{' '}
                                {formatDate(item.savedAt || pyq.createdAt)}
                            </span>
                            {pyq.isPaid && (
                                <div className='mt-1'>
                                    <span className='bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded'>
                                        ₹{pyq.price}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='bg-gray-50 px-4 py-3 flex justify-between items-center'>
                    <div className='flex items-center gap-3'>
                        <span className='flex items-center text-sm text-gray-600'>
                            <svg
                                className='w-4 h-4 mr-1'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                            >
                                <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
                                <path
                                    fillRule='evenodd'
                                    d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
                                    clipRule='evenodd'
                                />
                            </svg>
                            {pyq.clickCounts || 0}
                        </span>
                        <span className='hidden md:flex items-center text-sm text-gray-600'>
                            <svg
                                className='w-4 h-4 mr-1'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                            >
                                <path d='M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z' />
                            </svg>
                            {pyq.purchasedBy?.length || 0}
                        </span>
                    </div>
                    <a
                        href={pyqUrl}
                        rel='noopener noreferrer'
                        className='text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center'
                    >
                        View PDF
                        <svg
                            className='w-4 h-4 ml-1'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                        >
                            <path
                                fillRule='evenodd'
                                d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z'
                                clipRule='evenodd'
                            />
                        </svg>
                    </a>
                </div>
            </div>
        );
    };

    const renderNoteCard = (item, isPurchased = false) => {
        // Handle both structures from the data
        const note = isPurchased ? item : item.noteId;
        if (!note) return null;

        const courseCode =
            note.subject?.branch?.course?.courseCode?.toLowerCase();
        const branchCode = note.subject?.branch?.branchCode?.toLowerCase();
        const subjectCode = note.subject?.subjectCode?.toLowerCase();
        const collegeName = note.college?.slug;
        const noteUrl = `/${collegeName}/resources/${courseCode}/${branchCode}/notes/${subjectCode}/${note.slug}`;

        return (
            <div
                key={item._id}
                className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
            >
                <div className='p-4 border-b'>
                    <div className='flex flex-col sm:flex-row justify-between sm:items-start gap-2'>
                        <div className='flex-1'>
                            <h3 className='font-semibold text-lg text-gray-800 mb-1 line-clamp-2'>
                                {note?.title || 'Untitled Note'}
                            </h3>
                            <p className='text-sm text-gray-600 mb-2 line-clamp-2'>
                                {note?.description ||
                                    'No description available'}
                            </p>
                            <div className='flex flex-wrap gap-2 mb-2'>
                                {note.subject?.subjectName && (
                                    <span className='bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded'>
                                        {note.subject.subjectName}
                                    </span>
                                )}
                                {note.subject?.subjectCode && (
                                    <span className='bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded'>
                                        {note.subject.subjectCode}
                                    </span>
                                )}
                            </div>
                            <div className='text-xs text-gray-500 line-clamp-1'>
                                {note?.slug
                                    ?.replace(/-/g, ' ')
                                    .replace(/(^\w|\s\w)/g, (m) =>
                                        m.toUpperCase()
                                    )}
                            </div>
                        </div>
                        <div className='text-right'>
                            <span className='text-sm text-gray-500'>
                                {isPurchased ? 'Purchased' : 'Saved'}{' '}
                                {formatDate(item.savedAt || note.createdAt)}
                            </span>
                            {note?.isPaid && (
                                <div className='mt-1'>
                                    <span className='bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded'>
                                        ₹{note?.price}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='bg-gray-50 px-4 py-3 flex justify-between items-center'>
                    <div className='flex items-center gap-3'>
                        <span className='flex items-center text-sm text-gray-600'>
                            <svg
                                className='w-4 h-4 mr-1'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                            >
                                <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
                                <path
                                    fillRule='evenodd'
                                    d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
                                    clipRule='evenodd'
                                />
                            </svg>
                            {note?.clickCounts || 0}
                        </span>

                        <span className='flex items-center text-sm text-gray-600'>
                            <svg
                                className='w-4 h-4 mr-1'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                            >
                                <path
                                    fillRule='evenodd'
                                    d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
                                    clipRule='evenodd'
                                />
                            </svg>
                            {note?.likes?.length || 0}
                        </span>
                    </div>
                    <a
                        href={noteUrl}
                        rel='noopener noreferrer'
                        className='text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center'
                    >
                        View PDF
                        <svg
                            className='w-4 h-4 ml-1'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                        >
                            <path
                                fillRule='evenodd'
                                d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z'
                                clipRule='evenodd'
                            />
                        </svg>
                    </a>
                </div>
            </div>
        );
    };

    const renderTabContent = () => {
        if (isLoading) return renderLoadingState();

        switch (activeTab) {
            case 'savedPYQs':
                return savedPYQs?.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {savedPYQs.map((item) => renderPYQCard(item))}
                    </div>
                ) : (
                    renderEmptyState()
                );
            case 'savedNotes':
                return savedNotes?.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {savedNotes.map((item) => renderNoteCard(item))}
                    </div>
                ) : (
                    renderEmptyState()
                );
            case 'purchasedPYQs':
                return purchasedPYQs?.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {purchasedPYQs.map((item) => renderPYQCard(item, true))}
                    </div>
                ) : (
                    renderEmptyState()
                );
            case 'purchasedNotes':
                return purchasedNotes?.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {purchasedNotes.map((item) =>
                            renderNoteCard(item, true)
                        )}
                    </div>
                ) : (
                    renderEmptyState()
                );
            default:
                return null;
        }
    };

    const tabs = [
        { id: 'savedPYQs', label: 'Saved PYQs', count: savedPYQs?.length || 0 },
        {
            id: 'savedNotes',
            label: 'Saved Notes',
            count: savedNotes?.length || 0,
        },
        {
            id: 'purchasedPYQs',
            label: 'Purchased PYQs',
            count: purchasedPYQs?.length || 0,
        },
        {
            id: 'purchasedNotes',
            label: 'Purchased Notes',
            count: purchasedNotes?.length || 0,
        },
    ];

    return (
        <div className='max-w-7xl mx-auto px-4 py-6'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6'>
                <h1 className='text-2xl font-bold text-gray-800 mb-3 sm:mb-0'>
                    My Collection
                </h1>
                <div className='flex items-center'>
                    <span className='text-sm text-gray-500 mr-2'>
                        Last updated:
                    </span>
                    <span className='text-sm font-medium'>
                        {formatDate(new Date())}
                    </span>
                </div>
            </div>

            <div className='mb-6 overflow-x-auto'>
                <div className='border-b border-gray-200 min-w-max'>
                    <nav
                        className='flex space-x-0 sm:space-x-8'
                        aria-label='Tabs'
                    >
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-3 px-3 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab.label}
                                {tab.count > 0 && (
                                    <span className='ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs'>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            <div className='mt-6'>{renderTabContent()}</div>
        </div>
    );
};

export default SavedCollection;
