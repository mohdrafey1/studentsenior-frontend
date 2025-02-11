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
                        className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col mb-4 cursor-pointer"
                        onClick={(e) => handleCardClick(pyqUrl, e)}
                    >
                        <div className="flex-grow">
                            <h2 className="text-sm lg:text-xl font-bold mb-2">
                                {pyq.subject?.subjectName}{' '}
                                {pyq.solved && (
                                    <span className="bg-green-200 rounded-md px-2 py-1 font-bold">
                                        Solved
                                    </span>
                                )}
                            </h2>
                            <p className="mb-2 text-xs lg:text-base">
                                Subject Code:{' '}
                                <span className="font-normal">
                                    {pyq.subject?.subjectCode}
                                </span>
                            </p>
                            <p className="mb-2 text-xs lg:text-base">
                                Exam Type:{' '}
                                <span className="font-normal">
                                    {pyq.examType}
                                </span>
                            </p>
                            <p className="mb-2 text-xs lg:text-base">
                                Year:{' '}
                                <span className="font-normal">{pyq.year}</span>
                            </p>
                            <p className="mb-2 text-xs lg:text-base">
                                Semester:{' '}
                                <span className="font-normal">
                                    {pyq.subject?.semester}
                                </span>
                            </p>
                            <p className="mb-2 text-xs lg:text-base">
                                Branch:{' '}
                                <span className="font-normal">
                                    {pyq.subject?.branch?.branchName}
                                </span>
                            </p>
                        </div>
                        <div className="mt-4 flex justify-center">
                            {isAuthenticated ? (
                                <Link
                                    to={pyqUrl}
                                    className="bg-sky-500 text-white px-4 py-2 rounded-3xl text-center hover:bg-red-300 transition-colors text-xs lg:text-base"
                                >
                                    View
                                </Link>
                            ) : (
                                <p className="text-red-500">
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
