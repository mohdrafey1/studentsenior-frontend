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
                alert('Your session has expired. Please Login Again.');
                handleLogout();
            } else {
                const errorData = await response.json();
                // alert(`Failed to delete senior: ${errorData.message}`);
            }
        } catch (err) {
            console.error('Error deleting senior:', err);
        }
    };

    useEffect(() => {
        fetchSeniors();
    }, []);

    return (
        <div className="bg-sky-100">
            <Header />
            <CollegeLinks />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-5 text-center">Seniors</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {seniors.map((senior) => (
                        <div key={senior._id} className="border p-4 rounded">
                            <img
                                src={senior.profilePicture}
                                alt={senior.name}
                                className="w-80 h-80 mt-2"
                            />
                            <h3 className="text-lg font-bold mb-2">
                                {senior.name}
                            </h3>
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
            <Footer />
        </div>
    );
};

export default SeniorPage;
