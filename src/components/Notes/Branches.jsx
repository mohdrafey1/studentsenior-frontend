import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import useApiFetch from '../../hooks/useApiFetch.js';
import { api } from '../../config/apiConfiguration.js';

const Branches = () => {
    const { collegeName } = useParams();
    const location = useLocation();
    const { courseId } = location.state || {};

    const { useFetch, loadingFetch } = useApiFetch();
    const [branches, setBranches] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!courseId) {
            setError('Course ID is missing.');
            return;
        }

        const fetchBranches = async () => {
            try {
                const data = await useFetch(`${api.branches}/${courseId}`);
                setBranches(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchBranches();
    }, [collegeName, courseId]);

    if (loadingFetch) {
        return <p className="text-center">Loading branches...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">Error: {error}</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-4">
                Branches - {collegeName}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {branches.map((branch) => (
                    <div
                        key={branch._id}
                        className="border p-4 rounded-lg shadow hover:shadow-lg transition duration-200"
                    >
                        <h2 className="text-lg font-semibold">{branch.name}</h2>
                        <p className="text-sm text-gray-600">
                            Name: {branch.branchName}
                        </p>
                        <p className="text-sm text-gray-600">
                            Code: {branch.branchCode}
                        </p>

                        <p>total subject : 100</p>
                        <p>total notes : 100</p>

                        <Link
                            to={branch.branchCode.toLowerCase()}
                            state={{ branchId: branch._id }}
                            className="text-blue-500 hover:underline"
                            aria-label={`View details for ${branch.courseName}`}
                        >
                            View
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Branches;
