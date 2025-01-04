import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import useApiFetch from '../../hooks/useApiFetch.js';
import { api } from '../../config/apiConfiguration.js';

function Subjects() {
    const { branchCode } = useParams();
    const [subjects, setSubjects] = useState([]);
    const [groupedSubjects, setGroupedSubjects] = useState({});
    const [activeSemester, setActiveSemester] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation();
    const { branchId } = location.state || {};

    const { useFetch } = useApiFetch();

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const data = await useFetch(`${api.subjects}/${branchId}`);
                setSubjects(data);

                // Group subjects by semester
                const grouped = data.reduce((acc, subject) => {
                    const { semester } = subject;
                    if (!acc[semester]) {
                        acc[semester] = [];
                    }
                    acc[semester].push(subject);
                    return acc;
                }, {});
                setGroupedSubjects(grouped);

                // Set the first semester as the default active semester
                const semesters = Object.keys(grouped).sort((a, b) => a - b);
                if (semesters.length > 0) {
                    setActiveSemester(semesters[0]);
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch subjects');
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, [branchCode]);

    if (loading) {
        return <p className="text-center">Loading subjects...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">Error: {error}</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-4">
                Subjects for Branch: {branchCode}
            </h1>

            {/* Semester Tabs */}
            <div className="flex justify-center space-x-4 mb-6">
                {Object.keys(groupedSubjects)
                    .sort((a, b) => a - b)
                    .map((semester) => (
                        <button
                            key={semester}
                            className={`px-4 py-2 rounded ${
                                activeSemester === semester
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                            } hover:bg-blue-400 transition duration-200`}
                            onClick={() => setActiveSemester(semester)}
                        >
                            Semester {semester}
                        </button>
                    ))}
            </div>

            {/* Subjects for Active Semester */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeSemester &&
                groupedSubjects[activeSemester]?.length > 0 ? (
                    groupedSubjects[activeSemester].map((subject) => (
                        <div
                            key={subject._id}
                            className="border p-4 rounded-lg shadow hover:shadow-lg transition duration-200"
                        >
                            <h2 className="text-lg font-semibold">
                                {subject.subjectName}
                            </h2>
                            <p className="text-sm text-gray-600">
                                Code: {subject.subjectCode}
                            </p>
                            <p>Total notes: 100</p>
                            <Link
                                to={subject.subjectCode.toLowerCase()}
                                className="text-blue-500 hover:underline mt-2 inline-block"
                                state={{ subjectId: subject._id }}
                            >
                                View Details
                            </Link>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600">
                        No subjects available for Semester {activeSemester}.
                    </p>
                )}
            </div>
        </div>
    );
}

export default Subjects;
