import React, { useState, useEffect } from 'react';
import SeniorModal from '../components/SeniorModal/SeniorModal';
import CollegeLinks from '../components/Links/CollegeLinks';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { API_BASE_URL, API_KEY } from '../config/apiConfiguration';

const SeniorsPage = () => {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedSenior, setSelectedSenior] = useState(null);
    const [seniors, setSeniors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const courseBranches = {
        'B.Tech': ['CSE', 'ECE', 'Mechanical'],
        'BBA': ['Marketing', 'Finance', 'HR'],
        'MBA': ['Operations', 'Finance', 'Marketing'],
    };

    // Fetch seniors from the backend
    useEffect(() => {
        const fetchSeniors = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/seniors`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY,
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    setSeniors(data);
                } else {
                    setError(data.description || 'Error fetching seniors');
                }
            } catch (err) {
                setError('Error fetching seniors');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSeniors();
    }, []);

    // Filter seniors based on selected course and branch
    const filteredSeniors = seniors.filter(
        (senior) =>
            (selectedCourse ? senior.course === selectedCourse : true) &&
            (selectedBranch ? senior.branch === selectedBranch : true)
    );

    // Get branches for the selected course
    const branches = selectedCourse ? courseBranches[selectedCourse] || [] : [];

    return (
        <div className="bg-sky-100">
            <Header />
            <CollegeLinks />
            <div className="container mx-auto p-5">
                <div className="flex flex-col justify-center items-center">
                    <h1 className="text-3xl font-bold mb-5">Seniors</h1>
                    <div className="flex flex-wrap justify-center text-center space-x-4 mb-5">
                        <select
                            className="p-2 border rounded-md mb-2 lg:mb-0"
                            onChange={(e) => {
                                setSelectedCourse(e.target.value);
                                setSelectedBranch(''); // Reset branch when course changes
                            }}
                            value={selectedCourse}
                        >
                            <option value="">All Courses</option>
                            <option value="B.Tech">B.Tech</option>
                            <option value="BBA">BBA</option>
                            <option value="MBA">MBA</option>
                        </select>
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="p-2 border rounded-md"
                            disabled={!selectedCourse} // Disable if no course selected
                        >
                            <option value="">All Branches</option>
                            {branches.map((branch) => (
                                <option key={branch} value={branch}>
                                    {branch}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : filteredSeniors.length > 0 ? (
                    <div className="grid w-full sm:w-4/5 mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredSeniors.map((senior) => (
                            <div
                                key={senior._id}
                                className="p-3 bg-white shadow-md rounded-lg text-center"
                            >
                                <img
                                    src={senior.profilePicture}
                                    alt={senior.name}
                                    className="w-48 h-48 rounded-lg mx-auto my-2"
                                />
                                <h2 className="text-xl font-bold mb-2">
                                    {senior.name}
                                </h2>
                                <p>
                                    {senior.course} - {senior.branch}
                                </p>
                                <p>{senior.year}</p>
                                <button
                                    onClick={() => setSelectedSenior(senior)}
                                    className="mt-4 p-2 bg-blue-500 text-white rounded-md"
                                >
                                    View Detail
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-red-500 mt-10">
                        No seniors found matching the selected filters.
                    </div>
                )}

                {selectedSenior && (
                    <SeniorModal
                        senior={selectedSenior}
                        onClose={() => setSelectedSenior(null)}
                    />
                )}
            </div>
            <Footer />
        </div>
    );
};

export default SeniorsPage;
