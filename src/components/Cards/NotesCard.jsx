import React from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function NotesCard({ notes = [] }) {
    const { collegeName } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.user);

    const handleCardClick = (noteUrl, e) => {
        if (!isAuthenticated) {
            e.preventDefault();
            navigate('/sign-in', { state: { from: location }, replace: true });
        } else {
            navigate(noteUrl);
        }
    };

    return (
        <>
            {notes.map((note) => {
                const courseCode =
                    note.subject?.branch?.course?.courseCode.toLowerCase();
                const branchCode =
                    note.subject?.branch?.branchCode.toLowerCase();
                const subjectCode = note.subject?.subjectCode.toLowerCase();
                const noteUrl = `/${collegeName}/resources/${courseCode}/${branchCode}/notes/${subjectCode}/${note.slug}`;

                return (
                    <div
                        key={note._id}
                        className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col mb-6 cursor-pointer"
                        onClick={(e) => handleCardClick(noteUrl, e)}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {note.subject?.subjectName}
                            </h2>
                            <div className="flex space-x-2">
                                {note.solved && (
                                    <span className="bg-green-200 text-green-800 rounded-full px-3 py-1 text-xs font-semibold">
                                        Solved
                                    </span>
                                )}
                                {note.isPaid && (
                                    <span className="bg-red-200 text-red-800 rounded-full px-3 py-1 text-xs font-semibold">
                                        Paid
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="text-sm text-gray-600 mb-4 space-y-1">
                            <p>
                                <strong>Subject Code:</strong>{' '}
                                {note.subject?.subjectCode}
                            </p>

                            <p>
                                <strong>Semester:</strong>{' '}
                                {note.subject?.semester}
                            </p>
                            <p>
                                <strong>Branch:</strong>{' '}
                                {note.subject?.branch?.branchCode}
                            </p>
                        </div>

                        <div className="flex justify-center">
                            {isAuthenticated ? (
                                <Link
                                    to={noteUrl}
                                    className="bg-sky-500 text-white px-6 py-2 rounded-3xl text-center hover:bg-sky-600 transition-colors text-sm lg:text-base flex items-center justify-center space-x-2"
                                >
                                    {note.isPaid ? (
                                        <>
                                            <i className="fa-solid fa-cart-shopping text-sm" />
                                            <span>Buy Now {note.price}P</span>
                                        </>
                                    ) : (
                                        <>
                                            {' '}
                                            <i className="fa-solid fa-eye text-sm"></i>
                                            <span>View</span>
                                        </>
                                    )}
                                </Link>
                            ) : (
                                <p className="text-red-500 text-center">
                                    Please log in to view the PDF.
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </>
    );
}

export default NotesCard;
