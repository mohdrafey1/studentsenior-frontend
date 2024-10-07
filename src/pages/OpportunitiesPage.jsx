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
                        {/* <div className="flex justify-between items-center mb-5">
                            <button
                                onClick={() => setShowGetForm(!showGetForm)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                            >
                                {showGetForm ? 'Close Form' : 'Get Opportunity'}
                            </button>
                        </div> */}

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
                            <p>Loading Get Opportunities...</p>
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
                        {/* <div className="flex justify-between items-center mb-5">
                            <button
                                onClick={() => setShowGiveForm(!showGiveForm)}
                                className="px-4 py-2 bg-green-500 text-white rounded-md"
                            >
                                {showGiveForm
                                    ? 'Close Form'
                                    : 'Give Opportunity'}
                            </button>
                        </div> */}

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
                            <p>Loading Give Opportunities...</p>
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
