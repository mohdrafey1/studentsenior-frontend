import React, { useState, useEffect } from 'react';
import CollegeLinks from '../components/Links/CollegeLinks';
import Collegelink2 from '../components/Links/CollegeLink2';
import { capitalizeWords } from '../utils/Capitalize.js';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL, API_KEY } from '../config/apiConfiguration.js';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '../redux/user/userSlice.js';

const OpportunitiesPage = () => {
    const { collegeName } = useParams();
    const [getOpportunities, setGetOpportunities] = useState([]);
    const [giveOpportunities, setGiveOpportunities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showGetForm, setShowGetForm] = useState(false);
    const [showGiveForm, setShowGiveForm] = useState(false);
    const [newGetOpportunity, setNewGetOpportunity] = useState({
        name: '',
        description: '',
        whatsapp: '',
        email: '',
    });
    const [newGiveOpportunity, setNewGiveOpportunity] = useState({
        name: '',
        description: '',
        whatsapp: '',
        email: '',
    });
    const [editingOpportunity, setEditingOpportunity] = useState(null);
    const [editedOpportunity, setEditedOpportunity] = useState({
        name: '',
        description: '',
        whatsapp: '',
        email: '',
    });
    const [isEditing, setIsEditing] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const handleLogout = () => {
        dispatch(signOut());
        navigate('/sign-in');
    };

    // Fetch Get Opportunities
    const fetchGetOpportunities = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/opportunity/getopportunities`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY,
                    },
                }
            );
            const data = await response.json();
            setGetOpportunities(collegeBased(data));
        } catch (error) {
            console.log('Error Fetching Get Opportunities: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGetOpportunities();
    }, []);

    const collegeBased = (data) => {
        let returnArray = [];
        for (let i = data.length - 1; i >= 0; i--) {
            const collegeId = localStorage.getItem('id');
            if (data[i].college._id === collegeId) {
                returnArray.push(data[i]);
            }
        }
        return returnArray;
    };

    const handleGetOpportunitySubmit = async (e) => {
        e.preventDefault();

        const selectedCollegeObject = colleges.find((college) => {
            return (
                college.name.toLowerCase().replace(/\s+/g, '-') === collegeName
            );
        });

        const college = selectedCollegeObject ? selectedCollegeObject.id : null;

        if (college) {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/opportunity/getopportunities`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': API_KEY,
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            ...newGetOpportunity,
                            college: college,
                        }),
                    }
                );
                if (response.ok) {
                    setNewGetOpportunity({
                        name: '',
                        description: '',
                        whatsapp: '',
                        email: '',
                    });
                    setShowGetForm(false);
                    alert(
                        'Get Opportunity Added SuccessFully , Available Once Approved'
                    );
                } else if (response.status === 401) {
                    alert('Your session has expired. Please log in again.');
                    handleLogout();
                } else {
                    const errorData = await response.json();
                    alert(`${errorData.message}`);
                }
            } catch (err) {
                console.error(err);
            }
        } else {
            alert('College not found.');
        }
    };

    const handleEditClick = (opportunity) => {
        setEditingOpportunity(opportunity._id);
        setEditedOpportunity({
            name: opportunity.name,
            description: opportunity.description,
            whatsapp: opportunity.whatsapp,
            email: opportunity.email,
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleEditOpportunitySubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/opportunity/getopportunities/${editingOpportunity}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY,
                    },
                    credentials: 'include',
                    body: JSON.stringify(editedOpportunity),
                }
            );

            if (response.ok) {
                setEditingOpportunity(null);
                fetchGetOpportunities();
                setIsModalOpen(false);
            } else {
                const errorData = await response.json();
                alert(`Failed to update opportunity: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error updating opportunity:', error);
        }
    };

    const DeleteGetOpportunity = async (getOpportunitiesId) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/opportunity/getopportunities/${getOpportunitiesId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'x-api-key': API_KEY,
                    },
                    credentials: 'include',
                }
            );
            if (response.ok) {
                fetchGetOpportunities();
            } else {
                console.error('Failed to delete opportunity');
            }
        } catch (error) {
            console.error('Error deleting Get Opportunity:', error);
        }
    };
    // Fetch Give Opportunities
    const fetchGiveOpportunities = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/opportunity/giveopportunities`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY,
                    },
                }
            );
            const data = await response.json();
            setGiveOpportunities(collegeBased(data));
        } catch (error) {
            console.log('Error Fetching give Opportunities: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGiveOpportunities();
    }, []);

    const handleGiveOpportunitySubmit = async (e) => {
        e.preventDefault();

        const selectedCollegeObject = colleges.find((college) => {
            return (
                college.name.toLowerCase().replace(/\s+/g, '-') === collegeName
            );
        });

        const college = selectedCollegeObject ? selectedCollegeObject.id : null;

        if (college) {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/opportunity/giveopportunities`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': API_KEY,
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            ...newGiveOpportunity,
                            college: college,
                        }),
                    }
                );
                if (response.ok) {
                    setNewGiveOpportunity({
                        name: '',
                        description: '',
                        whatsapp: '',
                        email: '',
                    });
                    setShowGiveForm(false);
                    alert(
                        'Give Opportunity Added SuccessFully , Available Once Approved'
                    );
                } else if (response.status === 401) {
                    alert('Your session has expired. Please log in again.');
                    handleLogout();
                } else {
                    const errorData = await response.json();
                    alert(`${errorData.message}`);
                }
            } catch (err) {
                console.error(err);
            }
        } else {
            alert('College not found.');
        }
    };

    const handleGiveOpportunityClick = (opportunity) => {
        setEditingOpportunity(opportunity._id);
        setEditedOpportunity({
            name: opportunity.name,
            description: opportunity.description,
            whatsapp: opportunity.whatsapp,
            email: opportunity.email,
        });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleEditGiveOpportunitySubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/opportunity/giveopportunities/${editingOpportunity}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY,
                    },
                    credentials: 'include',
                    body: JSON.stringify(editedOpportunity),
                }
            );

            if (response.ok) {
                setEditingOpportunity(null);
                fetchGiveOpportunities();
                setIsModalOpen(false);
            } else {
                const errorData = await response.json();
                alert(`Failed to update opportunity: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error updating opportunity:', error);
        }
    };

    const DeleteGiveOpportunity = async (giveOpportunitiesId) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/opportunity/giveopportunities/${giveOpportunitiesId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'x-api-key': API_KEY,
                    },
                    credentials: 'include',
                }
            );
            if (response.ok) {
                fetchGiveOpportunities();
            } else {
                console.error('Failed to delete opportunity');
            }
        } catch (error) {
            console.error('Error deleting Give Opportunity:', error);
        }
    };

    return (
        <div className="container bg-gradient-to-t from-sky-200 to bg-white min-h-screen min-w-full">
            {/* <Header /> */}
            <CollegeLinks />
            <div className="max-w-7xl mx-auto p-5">
                <h1 className="text-3xl font-bold mb-5 text-center">
                    Opportunities - {capitalizeWords(collegeName)}
                </h1>
                <p className="italic text-center">
                    "Explore opportunities to work in various positions across
                    different companies."
                </p>
                <br />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Get Opportunities */}
                    <div>
                        <div className="flex justify-between items-center mb-5">
                            <button
                                onClick={() => setShowGetForm(!showGetForm)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                            >
                                {showGetForm ? 'Close Form' : 'Get Opportunity'}
                            </button>
                        </div>

                        {showGetForm && (
                            <form
                                onSubmit={handleGetOpportunitySubmit}
                                className="mb-5 p-5 bg-white shadow-md rounded-md"
                            >
                                <h3 className="text-xl font-bold mb-3">
                                    Fill Your Expertise
                                </h3>

                                <input
                                    type="text"
                                    placeholder="Job Name You Needed"
                                    value={newGetOpportunity.name}
                                    onChange={(e) =>
                                        setNewGetOpportunity({
                                            ...newGetOpportunity,
                                            name: e.target.value,
                                        })
                                    }
                                    className="p-2 border rounded-md mb-3 w-full"
                                    required
                                />

                                <textarea
                                    placeholder="Description"
                                    value={newGetOpportunity.description}
                                    onChange={(e) =>
                                        setNewGetOpportunity({
                                            ...newGetOpportunity,
                                            description: e.target.value,
                                        })
                                    }
                                    className="p-2 border rounded-md mb-3 w-full"
                                    required
                                ></textarea>

                                <input
                                    type="number"
                                    placeholder="Whatsapp Number (optional)"
                                    value={newGetOpportunity.whatsapp}
                                    onChange={(e) =>
                                        setNewGetOpportunity({
                                            ...newGetOpportunity,
                                            whatsapp: e.target.value,
                                        })
                                    }
                                    className="p-2 border rounded-md mb-3 w-full"
                                />

                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={newGetOpportunity.email}
                                    onChange={(e) =>
                                        setNewGetOpportunity({
                                            ...newGetOpportunity,
                                            email: e.target.value,
                                        })
                                    }
                                    className="p-2 border rounded-md mb-3 w-full"
                                    required
                                />

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                >
                                    Submit
                                </button>
                            </form>
                        )}

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
                            <div className="grid grid-cols-1 gap-6">
                                {getOpportunities.map((opportunity) => (
                                    <div
                                        key={opportunity._id}
                                        className="bg-white p-5 shadow-md rounded-md"
                                    >
                                        <h3 className="mb-2">
                                            <strong>Job Name :</strong>{' '}
                                            {opportunity.name}
                                        </h3>
                                        <div className="bg-gray-100 mb-2 rounded-md max-h-40 sm:h-40">
                                            <p className="p-2 h-full overflow-scroll">
                                                {opportunity.description}
                                            </p>
                                        </div>
                                        <div className="flex gap-4">
                                            <a
                                                href={`https://api.whatsapp.com/send?phone=${opportunity.whatsapp}`}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                                                    Hire Me{' '}
                                                </button>
                                            </a>
                                            <a
                                                href={`mailto:${opportunity.email}`}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                                                    Email Me
                                                </button>
                                            </a>
                                            {opportunity.owner._id ===
                                                ownerId && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            handleEditClick(
                                                                opportunity
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-yellow-500 text-white rounded-md ml-2"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            DeleteGetOpportunity(
                                                                opportunity._id
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-red-500 text-white rounded-md"
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={
                            isEditing
                                ? handleEditOpportunitySubmit
                                : handleEditGiveOpportunitySubmit
                        } // Dynamic submission
                    >
                        <h3 className="text-xl font-bold mb-3">
                            {isEditing
                                ? 'Edit Opportunity'
                                : 'Give Opportunity'}
                        </h3>
                        <input
                            type="text"
                            placeholder="Job Name"
                            value={editedOpportunity.name}
                            onChange={(e) =>
                                setEditedOpportunity({
                                    ...editedOpportunity,
                                    name: e.target.value,
                                })
                            }
                            className="p-2 border rounded-md mb-3 w-full"
                            required
                        />
                        <textarea
                            placeholder="Description"
                            value={editedOpportunity.description}
                            onChange={(e) =>
                                setEditedOpportunity({
                                    ...editedOpportunity,
                                    description: e.target.value,
                                })
                            }
                            className="p-2 border rounded-md mb-3 w-full"
                            required
                        ></textarea>
                        <input
                            type="number"
                            placeholder="Whatsapp Number (optional)"
                            value={editedOpportunity.whatsapp}
                            onChange={(e) =>
                                setEditedOpportunity({
                                    ...editedOpportunity,
                                    whatsapp: e.target.value,
                                })
                            }
                            className="p-2 border rounded-md mb-3 w-full"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={editedOpportunity.email}
                            onChange={(e) =>
                                setEditedOpportunity({
                                    ...editedOpportunity,
                                    email: e.target.value,
                                })
                            }
                            className="p-2 border rounded-md mb-3 w-full"
                            required
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            {isEditing ? 'Update' : 'Submit'}
                        </button>
                    </Modal>

                    {/* Right Column: Give Opportunities */}
                    <div>
                        <div className="flex justify-between items-center mb-5">
                            <button
                                onClick={() => setShowGiveForm(!showGiveForm)}
                                className="px-4 py-2 bg-green-500 text-white rounded-md"
                            >
                                {showGiveForm
                                    ? 'Close Form'
                                    : 'Give Opportunity'}
                            </button>
                        </div>

                        {showGiveForm && (
                            <form
                                onSubmit={handleGiveOpportunitySubmit}
                                className="mb-5 p-5 bg-white shadow-md rounded-md"
                            >
                                <h3 className="text-xl font-bold mb-3">
                                    Fill the Job You Provide
                                </h3>

                                <input
                                    type="text"
                                    placeholder="Job Name You Provide"
                                    value={newGiveOpportunity.name}
                                    onChange={(e) =>
                                        setNewGiveOpportunity({
                                            ...newGiveOpportunity,
                                            name: e.target.value,
                                        })
                                    }
                                    className="p-2 border rounded-md mb-3 w-full"
                                    required
                                />

                                <textarea
                                    placeholder="Description"
                                    value={newGiveOpportunity.description}
                                    onChange={(e) =>
                                        setNewGiveOpportunity({
                                            ...newGiveOpportunity,
                                            description: e.target.value,
                                        })
                                    }
                                    className="p-2 border rounded-md mb-3 w-full"
                                    required
                                ></textarea>

                                <input
                                    type="number"
                                    placeholder="Whatsapp Number (optional)"
                                    value={newGiveOpportunity.whatsapp}
                                    onChange={(e) =>
                                        setNewGiveOpportunity({
                                            ...newGiveOpportunity,
                                            whatsapp: e.target.value,
                                        })
                                    }
                                    className="p-2 border rounded-md mb-3 w-full"
                                />

                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={newGiveOpportunity.email}
                                    onChange={(e) =>
                                        setNewGiveOpportunity({
                                            ...newGiveOpportunity,
                                            email: e.target.value,
                                        })
                                    }
                                    className="p-2 border rounded-md mb-3 w-full"
                                    required
                                />

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                >
                                    Submit
                                </button>
                            </form>
                        )}

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
                            <div className="grid grid-cols-1 gap-6">
                                {giveOpportunities.map((opportunity) => (
                                    <div
                                        key={opportunity._id}
                                        className="bg-white p-5 shadow-md rounded-md"
                                    >
                                        <h3 className="mb-2">
                                            <strong>Job Name :</strong>{' '}
                                            {opportunity.name}
                                        </h3>
                                        <div className="bg-gray-100 mb-2 rounded-md max-h-40 sm:h-40">
                                            <p className="p-2 h-full overflow-scroll">
                                                {opportunity.description}
                                            </p>
                                        </div>
                                        <div className="flex gap-4">
                                            <a
                                                href={`https://api.whatsapp.com/send?phone=${opportunity.whatsapp}`}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                                                    Contact Us{' '}
                                                </button>
                                            </a>
                                            <a
                                                href={`mailto:${opportunity.email}`}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                                                    Email Us
                                                </button>
                                            </a>
                                            {opportunity.owner._id ===
                                                ownerId && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            handleGiveOpportunityClick(
                                                                opportunity
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-yellow-500 text-white rounded-md ml-2"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            DeleteGiveOpportunity(
                                                                opportunity._id
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-red-500 text-white rounded-md"
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* <Footer /> */}
            <Collegelink2 />
        </div>
    );
};

const Modal = ({ isOpen, onClose, onSubmit, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 float-right"
                >
                    &times;
                </button>
                <form onSubmit={onSubmit} className="p-5">
                    {children}
                </form>
            </div>
        </div>
    );
};

export default OpportunitiesPage;
