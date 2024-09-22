import React, { useState } from 'react';
import CollegeLinks from '../components/Links/CollegeLinks';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const initialGetOpportunities = [
    {
        id: 1,
        name: 'John Doe',
        expertise: 'Full Stack Development',
        description: 'Experienced in MERN stack development.',
        email: 'email',
    },
    {
        id: 2,
        name: 'Jane Smith',
        expertise: 'Data Analysis',
        description: 'Skilled in Python, R, and data visualization tools.',
        email: 'email',
    },
];

const initialGiveOpportunities = [
    {
        id: 1,
        title: 'Web Development Internship',
        company: 'TechCorp',
        description: 'Looking for a passionate web developer intern.',
        link: 'www.ex.com',
    },
    {
        id: 2,
        title: 'Data Science Project',
        company: 'DataSolutions',
        description: 'Seeking a data scientist for a 3-month project.',
        link: 'www.ex.com',
    },
];

const OpportunitiesPage = () => {
    const [getOpportunities, setGetOpportunities] = useState(
        initialGetOpportunities
    );
    const [giveOpportunities, setGiveOpportunities] = useState(
        initialGiveOpportunities
    );
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

    const handleGetOpportunitySubmit = () => {
        setGetOpportunities([
            ...getOpportunities,
            { id: getOpportunities.length + 1, ...newGetOpportunity },
        ]);
        setShowGetForm(false);
    };

    const handleGiveOpportunitySubmit = () => {
        setGiveOpportunities([
            ...giveOpportunities,
            { id: giveOpportunities.length + 1, ...newGiveOpportunity },
        ]);
        setShowGiveForm(false);
    };

    return (
        <div className="container bg-sky-100 min-h-screen min-w-full">
            <Header />
            <CollegeLinks />
            <div className="max-w-7xl mx-auto p-5">
                <h1 className="text-3xl font-bold mb-5 text-center">
                    Opportunities
                </h1>
                <p className="italic text-center">"Explore opportunities to work in various positions across different companies."</p><br/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Get Opportunities */}
                    <div>
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-2xl font-bold"></h2>
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
                                <input
                                    type="text"
                                    placeholder="Your Expertise"
                                    value={newGetOpportunity.expertise}
                                    onChange={(e) =>
                                        setNewGetOpportunity({
                                            ...newGetOpportunity,
                                            expertise: e.target.value,
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
                                <button
                                    onClick={handleGetOpportunitySubmit}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                >
                                    Submit
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-6">
                            {getOpportunities.map((opportunity) => (
                                <div
                                    key={opportunity.id}
                                    className="bg-white p-5 shadow-md rounded-md"
                                >
                                    <h3 className="text-xl font-bold mb-2">
                                        {opportunity.expertise}
                                    </h3>
                                    <p className="mb-2">
                                        <strong>Name:</strong>{' '}
                                        {opportunity.name}
                                    </p>
                                    <p className="mb-2">
                                        {opportunity.description}
                                    </p>
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                                        Hire Me
                                    </button>
                                </div>
                            ))}
                        </div>
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

                        <div className="grid grid-cols-1 gap-6">
                            {giveOpportunities.map((opportunity) => (
                                <div
                                    key={opportunity.id}
                                    className="bg-white p-5 shadow-md rounded-md"
                                >
                                    <h3 className="text-xl font-bold mb-2">
                                        {opportunity.title}
                                    </h3>
                                    <p className="mb-2">
                                        <strong>Company:</strong>{' '}
                                        {opportunity.company}
                                    </p>
                                    <p className="mb-2">
                                        {opportunity.description}
                                    </p>
                                    <button className="px-4 py-2 bg-green-500 text-white rounded-md">
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default OpportunitiesPage;
