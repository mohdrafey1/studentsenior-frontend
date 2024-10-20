import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signOut } from '../redux/user/userSlice.js';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import EditSeniorModal from '../components/SeniorModal/EditSeniorModal';
import SeniorDetailModal from '../components/SeniorModal/SeniorDetailModal';
import CollegeLinks from '../components/Links/CollegeLinks';
import { API_BASE_URL, API_KEY } from '../config/apiConfiguration.js';
import Collegelink2 from '../components/Links/CollegeLink2.jsx';
import { capitalizeWords } from '../utils/Capitalize.js';

const SeniorPage = () => {
    const { collegeName } = useParams();
    const [seniors, setSeniors] = useState([]);
    const [editingSenior, setEditingSenior] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedSenior, setSelectedSenior] = useState(null);
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [selectedYear, setSelectedYear] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const colleges = [
        { id: '66cb9952a9c088fc11800714', name: 'Integral University' },
        { id: '66cba84ce0e3a7e528642837', name: 'MPEC Kanpur' },
        { id: '66d08aff784c9f07a53507b9', name: 'GCET Noida' },
        { id: '66d40833ec7d66559acbf24c', name: 'KMC UNIVERSITY' },
    ];

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);
    const ownerId = currentUser?._id;

    const fetchSeniors = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/seniors`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
            });
            const data = await response.json();
            setSeniors(collegeBased(data));
            setIsLoading(false);
        } catch (err) {
            console.error('Error fetching seniors:', err);
        }
    };

    const collegeBased = (data) => {
        let returnArray = [];
        const collegeId = localStorage.getItem('id');
        for (let i = 0; i <= data.length - 1; i++) {
            if (data[i].college === collegeId) {
                returnArray.push(data[i]);
            }
        }

        return returnArray;
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
    const filteredSeniors = seniors.filter((senior) =>
        selectedYear ? senior.year === selectedYear : true
    );

    return (
        <div className="bg-sky-100">
            <div
                className={`${
                    isLoggedOut ? 'block' : 'hidden'
                } text-center fixed bg-opacity-80 bg-gray-300 flex justify-center h-full  w-full z-50 items-center`}
            >
                <div
                    role="alert"
                    className="mt-3 relative flex flex-col max-w-sm p-4 text-sm text-white bg-black rounded-md"
                >
                    <p className="flex justify-center text-2xl">Logged Out</p>
                    <p className="ml-4 p-3">
                        You have been signed out, Login Again
                    </p>

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
                    <h1 className="text-3xl font-bold mb-5 text-center">
                        Seniors - {capitalizeWords(collegeName)}
                    </h1>
                    <p className="italic text-center">
                        Reach out to seniors for mentorship and expert guidance
                        on your journey
                    </p>
                    <br />
                    <div className="flex flex-wrap justify-center text-center space-x-4 mb-5">
                        <select
                            className="p-2 border rounded-md mb-2 lg:mb-0"
                            onChange={(e) => {
                                setSelectedYear(e.target.value);
                            }}
                            value={selectedYear}
                        >
                            <option value="">All Years</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                            <option value="5th Year">5th Year</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-center items-center py-10">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6 w-full max-w-7xl">
                        {filteredSeniors.length > 0 ? (
                            filteredSeniors.map((senior) => (
                                <div
                                    key={senior._id}
                                    className="bg-white shadow-md rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl dark:bg-gray-800  w-full  h-full"
                                >
                                    <img
                                        src={senior.profilePicture}
                                        alt={senior.name}
                                        className="w-full h-40 lg:h-60 transition-transform duration-300 hover:scale-110"
                                    />
                                    <div className="px-3 lg:px-6 py-2 lg:py-4">
                                        <h3 className="text-sm lg:text-xl font-bold text-gray-900 dark:text-white mb-2">
                                            {senior.name}
                                        </h3>
                                        <p className="text-red-500 font-medium mb-1 text-xs lg:text-sm">
                                            Course: {senior.branch}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm mb-1">
                                            Year: {senior.year}
                                        </p>
                                        <p className="text-gray-500 dark:text-gray-300 text-xs lg:text-sm mb-4">
                                            Domain: {senior.domain}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <button
                                                className="bg-blue-600 text-white px-2 lg:px-3 py-1 lg:py-1 rounded-lg text-xs lg:text-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                                                onClick={() =>
                                                    handleDetail(senior)
                                                }
                                            >
                                                View
                                            </button>
                                            {senior.owner === ownerId && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="bg-yellow-500 text-white px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm hover:bg-yellow-600"
                                                        onClick={() =>
                                                            handleEdit(senior)
                                                        }
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="bg-red-500 text-white px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm hover:bg-red-600"
                                                        onClick={() =>
                                                            handleDelete(
                                                                senior._id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-4 flex justify-center items-center py-10 w-full">
                                {isLoading ? (
                                    <div className="text-center">
                                        <svg
                                            aria-hidden="true"
                                            className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                            viewBox="0 0 100 101"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                fill="currentFill"
                                            />
                                        </svg>
                                        <p className="text-gray-200  dark:text-gray-600 mt-3">
                                            Loading...
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-gray-200  dark:text-gray-600 text-center">
                                        No Seniors Found.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

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
            <Collegelink2 />
        </div>
    );
};

export default SeniorPage;
