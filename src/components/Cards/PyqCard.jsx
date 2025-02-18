import React from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PyqCard({ Pyqs = [] }) {
    const { collegeName } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.user);

    const handleCardClick = (pyqUrl, e) => {
        if (!isAuthenticated) {
            e.preventDefault();
            navigate('/sign-in', { state: { from: location }, replace: true });
        } else {
            navigate(pyqUrl);
        }
    };

    return (
        <>
            {Pyqs.map((pyq) => {
                const courseCode =
                    pyq.subject?.branch?.course?.courseCode.toLowerCase();
                const branchCode =
                    pyq.subject?.branch?.branchCode.toLowerCase();
                const subjectCode = pyq.subject?.subjectCode.toLowerCase();
                const pyqUrl = `/${collegeName}/resources/${courseCode}/${branchCode}/pyqs/${subjectCode}/${pyq.slug}`;

                return (
                    <div
                        key={pyq._id}
                        className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col mb-6 cursor-pointer"
                        onClick={(e) => handleCardClick(pyqUrl, e)}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {pyq.subject?.subjectName}
                            </h2>
                            <div className="flex space-x-2">
                                {pyq.solved && (
                                    <span className="bg-green-200 text-green-800 rounded-full px-3 py-1 text-xs font-semibold">
                                        Solved
                                    </span>
                                )}
                                {pyq.isPaid && (
                                    <span className="bg-red-200 text-red-800 rounded-full px-3 py-1 text-xs font-semibold">
                                        Paid
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="text-sm text-gray-600 mb-4 space-y-1">
                            <p>
                                <strong>Subject Code:</strong>{' '}
                                {pyq.subject?.subjectCode}
                            </p>
                            <p>
                                <strong>Exam Type:</strong> {pyq.examType}
                            </p>
                            <p>
                                <strong>Year:</strong> {pyq.year}
                            </p>
                            <p>
                                <strong>Semester:</strong>{' '}
                                {pyq.subject?.semester}
                            </p>
                            <p>
                                <strong>Branch:</strong>{' '}
                                {pyq.subject?.branch?.branchName}
                            </p>
                        </div>

                        <div className="flex justify-center">
                            {isAuthenticated ? (
                                <Link
                                    to={pyqUrl}
                                    className="bg-sky-500 text-white px-6 py-2 rounded-3xl text-center hover:bg-sky-600 transition-colors text-sm lg:text-base flex items-center justify-center space-x-2"
                                >
                                    {pyq.isPaid ? (
                                        <>
                                            <i className="fa-solid fa-cart-shopping text-sm" />
                                            <span>Buy Now {pyq.price}P</span>
                                        </>
                                    ) : (
                                        <>View</>
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

export default PyqCard;
