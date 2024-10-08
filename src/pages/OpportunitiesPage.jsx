import React, { useState, useEffect } from 'react';
import CollegeLinks from '../components/Links/CollegeLinks';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Collegelink2 from '../components/Links/CollegeLink2';
import { capitalizeWords } from '../utils/Capitalize.js';
import { useParams } from 'react-router-dom';
import { API_BASE_URL, API_KEY } from '../config/apiConfiguration.js';

const OpportunitiesPage = () => {
    const { collegeName } = useParams();
    const [getOpportunities, setGetOpportunities] = useState([]);
    const [giveOpportunities, setGiveOpportunities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showGetForm, setShowGetForm] = useState(false);
    const [showGiveForm, setShowGiveForm] = useState(false);
    const [newGetOpportunity, setNewGetOpportunity] = useState({
        name: '',
        expertise: '',
        description: '',
    });
    const [newGiveOpportunity, setNewGiveOpportunity] = useState({
        title: '',
        company: '',
        description: '',
    });

    // Fetch Get Opportunities
    useEffect(() => {
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
                setGetOpportunities(data);
            } catch (error) {
                console.log('Error Fetching Get Opportunities: ', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGetOpportunities();
    }, []);

    // Fetch Give Opportunities
    useEffect(() => {
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
                setGiveOpportunities(data);
            } catch (error) {
                console.log('Error Fetching Give Opportunities: ', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGiveOpportunities();
    }, []);

    // Handle Get Opportunity Form Submission
    const handleGetOpportunitySubmit = () => {
        setGetOpportunities([
            ...getOpportunities,
            { id: getOpportunities.length + 1, ...newGetOpportunity },
        ]);
        setNewGetOpportunity({
            name: '',
            expertise: '',
            description: '',
        });
        setShowGetForm(false);
    };

    // Handle Give Opportunity Form Submission
    const handleGiveOpportunitySubmit = () => {
        setGiveOpportunities([
            ...giveOpportunities,
            { id: giveOpportunities.length + 1, ...newGiveOpportunity },
        ]);
        setNewGiveOpportunity({
            title: '',
            company: '',
            description: '',
        });
        setShowGiveForm(false);
    };

    return (
        <div className="container bg-sky-100 min-h-screen min-w-full">
            <Header />
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
                    {/* Left Column: Get Opportunities */}
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
                            <div className="mb-5 p-5 bg-white shadow-md rounded-md">
                                <h3 className="text-xl font-bold mb-3">
                                    Fill Your Expertise
                                </h3>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={newGetOpportunity.name}
                                    onChange={(e) =>
                                        setNewGetOpportunity({
                                            ...newGetOpportunity,
                                            name: e.target.value,
                                        })
                                    }
                                    className="p-2 border rounded-md mb-3 w-full"
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
                                ></textarea>
                                <input
                                    type="Number"
                                    placeholder="Whatsapp Number (optional)"
                                    value={newGetOpportunity.expertise}
                                    onChange={(e) =>
                                        setNewGetOpportunity({
                                            ...newGetOpportunity,
                                            expertise: e.target.value,
                                        })
                                    }
                                    className="p-2 border rounded-md mb-3 w-full"
                                />
                                <input
                                    type="Email"
                                    placeholder="Email"
                                    value={newGetOpportunity.expertise}
                                    onChange={(e) =>
                                        setNewGetOpportunity({
                                            ...newGetOpportunity,
                                            expertise: e.target.value,
                                        })
                                    }
                                    className="p-2 border rounded-md mb-3 w-full"
                                />
                                <button
                                    onClick={handleGetOpportunitySubmit}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                >
                                    Submit
                                </button>
                            </div>
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
                                        key={opportunity.id}
                                        className="bg-white p-5 shadow-md rounded-md"
                                    >
                                        <h3 className="mb-2">
                                            <strong>Job Name :</strong>{' '}
                                            {opportunity.name}
                                        </h3>
                                        <div className="bg-gray-100 rounded-md">
                                            <p className="mb-2 h-1/2 overflow-scroll">
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
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

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
                            <div className="mb-5 p-5 bg-white shadow-md rounded-md">
                                <h3 className="text-xl font-bold mb-3">
                                    Register Your Opportunity
                                </h3>
                                <input
                                    type="text"
                                    placeholder="Opportunity Title"
                                    value={newGiveOpportunity.title}
                                    onChange={(e) =>
                                        setNewGiveOpportunity({
                                            ...newGiveOpportunity,
                                            title: e.target.value,
                                        })
                                    }
                                    className="p-2 border rounded-md mb-3 w-full"
                                />
                                <input
                                    type="text"
                                    placeholder="Company Name"
                                    value={newGiveOpportunity.company}
                                    onChange={(e) =>
                                        setNewGiveOpportunity({
                                            ...newGiveOpportunity,
                                            company: e.target.value,
                                        })
                                    }
                                    className="p-2 border rounded-md mb-3 w-full"
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
                                ></textarea>
                                <button
                                    onClick={handleGiveOpportunitySubmit}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                                >
                                    Submit
                                </button>
                            </div>
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
                                        key={opportunity.id}
                                        className="bg-white p-5 shadow-md rounded-md"
                                    >
                                        <h3 className="mb-2">
                                            <strong>Job Name :</strong>{' '}
                                            {opportunity.name}
                                        </h3>
                                        <div className="bg-gray-100 rounded-md">
                                            <p className="mb-2 h-1/2 overflow-scroll">
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
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
            <Collegelink2 />
        </div>
    );
};

export default OpportunitiesPage;
