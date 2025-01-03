import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import useApiFetch from '../../hooks/useApiFetch.js';
import { useCollegeId } from '../../hooks/useCollegeId.js';
import { api } from '../../config/apiConfiguration.js';

function SubjectNotes() {
    const { collegeName } = useParams();
    const { subjectCode } = useParams();
    const collegeId = useCollegeId(collegeName);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation();
    const { subjectId } = location.state || {};

    const { useFetch } = useApiFetch();

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const data = await useFetch(
                    `${api.subjectNotes}/${subjectId}/${collegeId}`
                );
                setNotes(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch notes');
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, [subjectId]);

    if (loading) {
        return <p className="text-center">Loading notes...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">Error: {error}</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-4">
                Notes for Subject: {subjectCode}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.length > 0 ? (
                    notes.map((note) => (
                        <div
                            key={note._id}
                            className="border p-4 rounded-lg shadow hover:shadow-lg transition duration-200"
                        >
                            <h2 className="text-lg font-semibold">
                                {note.title}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {note.description}
                            </p>
                            <a
                                href={note.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline mt-2 inline-block"
                            >
                                view Notes
                            </a>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600">
                        No notes available for this subject.
                    </p>
                )}
            </div>
        </div>
    );
}

export default SubjectNotes;
