import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSavedCollection } from '../../redux/slices/savedCollectionSlice';
import { useSaveResource } from '../../hooks/useSaveResource';
import useRequireLogin from '../../hooks/useRequireLogin.js';

function NotesCard({ notes = [] }) {
    const { collegeName } = useParams();
    const requireLogin = useRequireLogin();
    const { saveResource, unsaveResource } = useSaveResource(null, null, null);

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.user);
    const [hoveredCard, setHoveredCard] = useState(null);

    const { savedNotes } = useSelector((state) => state.savedCollection);

    // Fetch data on component mount
    useEffect(() => {
        dispatch(fetchSavedCollection());
    }, [dispatch]);

    const handleCardClick = (noteUrl, e) => {
        if (!isAuthenticated) {
            e.preventDefault();
            navigate('/sign-in', { state: { from: location }, replace: true });
        } else {
            navigate(noteUrl);
        }
    };

    if (notes.length === 0) {
        return (
            <div className='text-center py-16 bg-gray-50 rounded-xl border border-gray-100'>
                <div className='bg-gray-100 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center'>
                    <svg
                        className='w-10 h-10 text-gray-500'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                        ></path>
                    </svg>
                </div>
                <h3 className='mt-6 text-xl font-medium text-gray-900'>
                    No notes available
                </h3>
                <p className='mt-2 text-sm text-gray-500 max-w-md mx-auto'>
                    Check back later for updates or try adjusting your search
                    criteria.
                </p>
            </div>
        );
    }

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6'>
            {notes.map((note) => {
                const isSaved = savedNotes.some(
                    (savedNote) => savedNote.noteId._id === note._id
                );

                const courseCode =
                    note.subject?.branch?.course?.courseCode.toLowerCase();
                const branchCode =
                    note.subject?.branch?.branchCode.toLowerCase();
                const subjectCode = note.subject?.subjectCode.toLowerCase();
                const noteUrl = `/${collegeName}/resources/${courseCode}/${branchCode}/notes/${subjectCode}/${note.slug}`;
                const isHovered = hoveredCard === note._id;

                return (
                    <div
                        key={note._id}
                        className={`bg-white rounded-xl border ${
                            isHovered
                                ? 'border-blue-200 shadow-lg'
                                : 'border-gray-100 shadow-sm'
                        } overflow-hidden transition-all duration-300 flex flex-col h-full group relative`}
                        onClick={(e) => handleCardClick(noteUrl, e)}
                        onMouseEnter={() => setHoveredCard(note._id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        tabIndex='0'
                        role='button'
                        aria-label={`View notes for ${note.subject?.subjectName}`}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCardClick(noteUrl, e);
                        }}
                    >
                        {/* Highlight Accent */}
                        <div
                            className={`h-1 w-full ${
                                note.isPaid
                                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                                    : 'bg-blue-500'
                            }`}
                        ></div>

                        {/* Card Header */}
                        <div className='p-4 border-b border-gray-100'>
                            <div className='flex justify-between items-start'>
                                <h2 className='text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-700 transition-colors'>
                                    {note.subject?.subjectName}
                                </h2>
                                <div className='flex space-x-2'>
                                    {note.isPaid && (
                                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 flex-shrink-0'>
                                            <svg
                                                className='w-3 h-3 mr-1'
                                                fill='currentColor'
                                                viewBox='0 0 20 20'
                                                xmlns='http://www.w3.org/2000/svg'
                                            >
                                                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                                            </svg>
                                            Premium
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className='p-4 flex-grow'>
                            <div className='grid grid-cols-2 gap-3 text-sm'>
                                <div className='flex flex-col'>
                                    <span className='text-gray-500 mb-1'>
                                        Subject Code
                                    </span>
                                    <span className='font-medium text-gray-800'>
                                        {note.subject?.subjectCode || 'N/A'}
                                    </span>
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-gray-500 mb-1'>
                                        Semester
                                    </span>
                                    <span className='font-medium text-gray-800'>
                                        {note.subject?.semester || 'N/A'}
                                    </span>
                                </div>
                                <div className='flex flex-col col-span-2'>
                                    <span className='text-gray-500 mb-1'>
                                        Branch
                                    </span>
                                    <span className='font-medium text-gray-800'>
                                        {note.subject?.branch?.branchCode ||
                                            'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Card Footer */}
                        <div className='px-4 py-3 bg-gray-50 border-t border-gray-100'>
                            <div className='flex items-center justify-between'>
                                {isAuthenticated ? (
                                    <Link
                                        to={noteUrl}
                                        className={`w-4/5 flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                                            note.isPaid
                                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg'
                                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        {note.isPaid ? (
                                            <>
                                                <svg
                                                    className='w-4 h-4 mr-2 flex-shrink-0'
                                                    fill='none'
                                                    stroke='currentColor'
                                                    viewBox='0 0 24 24'
                                                    xmlns='http://www.w3.org/2000/svg'
                                                >
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        strokeWidth='2'
                                                        d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                                                    ></path>
                                                </svg>
                                                <span className='whitespace-nowrap'>
                                                    View Premium Note
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <svg
                                                    className='w-4 h-4 mr-2 flex-shrink-0'
                                                    fill='none'
                                                    stroke='currentColor'
                                                    viewBox='0 0 24 24'
                                                    xmlns='http://www.w3.org/2000/svg'
                                                >
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        strokeWidth='2'
                                                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                                    ></path>
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        strokeWidth='2'
                                                        d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                                                    ></path>
                                                </svg>
                                                <span className='whitespace-nowrap'>
                                                    View Note
                                                </span>
                                            </>
                                        )}
                                    </Link>
                                ) : (
                                    <button
                                        className='w-4/5 flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors shadow-sm hover:shadow'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCardClick(noteUrl, e);
                                        }}
                                    >
                                        <svg
                                            className='w-4 h-4 mr-2 flex-shrink-0'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'
                                            xmlns='http://www.w3.org/2000/svg'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                                            ></path>
                                        </svg>
                                        <span className='whitespace-nowrap'>
                                            Sign in to view
                                        </span>
                                    </button>
                                )}
                                <button
                                    className='w-1/6 h-10 flex items-center justify-center py-2 px-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors shadow-sm hover:shadow'
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        requireLogin(() => {
                                            if (isSaved) {
                                                unsaveResource(
                                                    'note',
                                                    note._id
                                                );
                                            } else {
                                                saveResource('note', note._id);
                                            }
                                        });
                                    }}
                                    title={
                                        isSaved
                                            ? 'Unsave this Note'
                                            : 'Save this Note'
                                    }
                                    aria-label={
                                        isSaved
                                            ? 'Unsave this Note'
                                            : 'Save this Note'
                                    }
                                >
                                    <svg
                                        className='w-5 h-5'
                                        fill={isSaved ? 'currentColor' : 'none'}
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'
                                        xmlns='http://www.w3.org/2000/svg'
                                        style={{
                                            color: isSaved
                                                ? '#3B82F6'
                                                : '#9CA3AF',
                                        }}
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth='2'
                                            d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
                                        ></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default NotesCard;
