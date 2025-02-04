import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PyqCard({ Pyqs }) {
    const { collegeName } = useParams();
    const location = useLocation();
    const { isAuthenticated } = useSelector((state) => state.user);

    return (
        <>
            {Pyqs.map((pyq) => (
                <Link
                to={`/${collegeName}/resources/${pyq.subject?.branch?.course?.courseCode.toLowerCase()}/${pyq.subject?.branch?.branchCode.toLowerCase()}/pyqs/${pyq.subject?.subjectCode.toLowerCase()}/${
                    pyq.slug
                }`}>
                <div
                    key={pyq._id}
                    className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col mb-4"
                >
                    <div className="flex-grow">
                        <h2 className="text-sm lg:text-xl font-bold mb-2">
                            {pyq.subject?.subjectName}
                        </h2>
                        <p className="mb-2 text-xs lg:text-base">
                            Subject Code:{' '}
                            <span className="font-normal">
                                {pyq.subject?.subjectCode}
                            </span>
                        </p>
                        <p className="mb-2 text-xs lg:text-base">
                            Exam Type:{' '}
                            <span className="font-normal">{pyq.examType}</span>
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
                                to={`/${collegeName}/resources/${pyq.subject?.branch?.course?.courseCode.toLowerCase()}/${pyq.subject?.branch?.branchCode.toLowerCase()}/pyqs/${pyq.subject?.subjectCode.toLowerCase()}/${
                                    pyq.slug
                                }`}
                                className="bg-sky-500 text-white px-4 py-2 rounded-3xl text-center hover:bg-red-300 transition-colors text-xs lg:text-base"
                            >
                                View PDF
                            </Link>
                        ) : (
                            <p className="text-red-500">
                                <Link
                                    to="/sign-in"
                                    state={{ from: location }}
                                    replace
                                    className="inline-block bg-red-500 text-white px-2 py-1 sm:px-4 sm:py-2 mb-2 rounded-md text-center hover:bg-red-600 transition-colors text-xs lg:text-base"
                                >
                                    Please log in to view the PDF.
                                </Link>
                            </p>
                        )}
                    </div>
                </div>
                </Link>
            ))}
        </>
    );
}

export default PyqCard;
