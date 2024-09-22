import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signOut } from '../redux/user/userSlice.js';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import EditSeniorModal from '../components/SeniorModal/EditSeniorModal';
import SeniorDetailModal from '../components/SeniorModal/SeniorDetailModal';
import CollegeLinks from '../components/Links/CollegeLinks';
import { API_BASE_URL, API_KEY } from '../config/apiConfiguration.js';

const SeniorPage = () => {
    const [seniors, setSeniors] = useState([]);
    const [editingSenior, setEditingSenior] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedSenior, setSelectedSenior] = useState(null);
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const colleges = [
        { id: '66cb9952a9c088fc11800714', name: 'Integral University' },
        { id: '66cba84ce0e3a7e528642837', name: 'MPGI Kanpur' },
        { id: '66d08aff784c9f07a53507b9', name: 'GCET Noida' },
        { id: '66d40833ec7d66559acbf24c', name: 'KMC UNIVERSITY' },
    ];

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);
    const ownerId = currentUser?._id;

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
            setSeniors(data);
        } catch (err) {
            console.error('Error fetching seniors:', err);
        }
    };

    const handleEdit = (senior) => {
        setEditingSenior(senior);
        setIsEditModalOpen(true);
    };

    const handleDetail = (senior) => {
        setSelectedSenior(senior);
        setIsDetailModalOpen(true);
    };

    const handleLogout = () => {
        dispatch(signOut());
        navigate('/sign-in');
    };
    const closeDialog = () => {
        setIsSucsess(false);
        window.location.href = '../';
    };

    const handleDelete = async (seniorId) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/seniors/${seniorId}`,
                {
                    method: 'DELETE',
                    headers: { 'x-api-key': API_KEY },
                    credentials: 'include',
                }
            );
            if (response.ok) {
                fetchSeniors();
            } else if (response.status === 401) {
                setIsLoggedOut(true);
                dispatch(signOut());
            } else {
                const errorData = await response.json();
                alert(`Failed to delete senior: ${errorData.message}`);
            }
        } catch (err) {
            console.error('Error deleting senior:', err);
        }
    };

    useEffect(() => {
        fetchSeniors();
    }, []);

    // Filter seniors based on selected course and branch
    const filteredSeniors = seniors.filter(
        (senior) =>
            (selectedYear ? senior.year === selectedYear : true)
    );


    return (
        <div className="bg-sky-100">
            <div
                className={`${isLoggedOut ? 'block' : 'hidden'} text-center fixed bg-opacity-80 bg-gray-300 flex justify-center h-full  w-full z-50 items-center`}
            >
                <div
                    role="alert"
                    className="mt-3 relative flex flex-col max-w-sm p-4 text-sm text-white bg-black rounded-md"
                >
                    <p className="flex justify-center text-2xl">Logged Out</p>
                    <p className="ml-4 p-3">You have been signed out, Login Again</p>

                    <button
                        className="flex items-center justify-center transition-all w-8 h-8 rounded-md text-white hover:bg-white/20 active:bg-white/10 absolute top-1.5 right-1.5"
                        type="button"
                        onClick={closeDialog}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-5 w-5"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                    <button
                        className="bg-white text-black p-2 rounded-md w-full"
                        onClick={handleLogout}
                    >
                        Log In
                    </button>
                </div>
            </div>

            <Header />
            <CollegeLinks />
            <div className="container mx-auto p-5">
                <div className="flex flex-col justify-center items-center">
                    <h1 className="text-3xl font-bold mb-5">Seniors</h1>
                    <div className="flex flex-wrap justify-center text-center space-x-4 mb-5">
                        <select
                            className="p-2 border rounded-md mb-2 lg:mb-0"
                            onChange={(e) => {
                                setSelectedYear(e.target.value);
                                setSelectedBranch(''); // Reset branch when course changes
                            }}
                            value={selectedYear}
                        >
                            <option value="">All Years</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                        </select>

                    </div>
                </div>
                {filteredSeniors.length > 0 ? (
                    <div className="grid w-full sm:w-4/5 mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredSeniors.map((senior) => (
                            <div key={senior._id} className=" p-3 bg-white shadow-md rounded-lg text-center">
                                <img
                                    src={senior.profilePicture}
                                    alt={senior.name}
                                    className="w-48 h-48 rounded-lg mx-auto my-2"
                                />
                                <h3 className="text-lg font-bold mb-2">{senior.name}</h3>
                                <p>Course: {senior.branch}</p>
                                <p>Year: {senior.year}</p>
                                <p>Domain: {senior.domain}</p>
                                <div className="flex justify-center mt-4">
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                        onClick={() => handleDetail(senior)}
                                    >
                                        View Details
                                    </button>
                                    {senior.owner === ownerId && (
                                        <>
                                            <button
                                                className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                                                onClick={() => handleEdit(senior)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded"
                                                onClick={() =>
                                                    handleDelete(senior._id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    null
                )}
                {isEditModalOpen && (
                    <EditSeniorModal
                        editingSenior={editingSenior}
                        colleges={colleges}
                        handleInputChange={(e) => {
                            const { name, value, type, checked } = e.target;
                            setEditingSenior({
                                ...editingSenior,
                                [name]: type === 'checkbox' ? checked : value,
                            });
                        }}
                        handleUpdate={async (e) => {
                            e.preventDefault();

                            // Create a JSON object to send as the payload
                            const payload = {
                                name: editingSenior.name,
                                branch: editingSenior.branch,
                                year: editingSenior.year,
                                domain: editingSenior.domain,
                                whatsapp: editingSenior.whatsapp,
                                telegram: editingSenior.telegram,
                                college: editingSenior.college,
                            };

                            try {
                                const response = await fetch(
                                    `${API_BASE_URL}/api/seniors/${editingSenior._id}`,
                                    {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json', // Send JSON data
                                            'x-api-key': API_KEY,
                                        },
                                        credentials: 'include',
                                        body: JSON.stringify(payload), // Convert payload to JSON string
                                    }
                                );

                                if (response.ok) {
                                    alert('Senior updated successfully');
                                    setIsEditModalOpen(false);
                                    fetchSeniors(); // Refresh the seniors list after the update
                                } else if (response.status === 401) {
                                    alert(
                                        'Your session has expired. Please Login Again.'
                                    );
                                    handleLogout();
                                } else {
                                    const errorData = await response.json();
                                    alert(
                                        `Failed to update senior: ${errorData.message}`
                                    );
                                }
                            } catch (err) {
                                console.error('Error updating senior:', err);
                            }
                        }}
                        setIsModalOpen={setIsEditModalOpen}
                    />
                )}

                {isDetailModalOpen && (
                    <SeniorDetailModal
                        senior={selectedSenior}
                        setIsDetailModalOpen={setIsDetailModalOpen}
                    />
                )}

            </div>
            <Footer />
        </div>
    );
};

export default SeniorPage;
