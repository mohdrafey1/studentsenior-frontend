import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCollegeId } from '../hooks/useCollegeId.js';
import { api, API_KEY } from '../config/apiConfiguration.js';
import DetailPageNavbar from '../DetailPages/DetailPageNavbar.jsx';

const OpportunityDetails = () => {
    const { collegeName, slug } = useParams();
    const collegeId = useCollegeId(collegeName);
    const [opportunity, setOpportunity] = useState();
    const [similarOpportunity, setSimilarOpportunity] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getDetails = async () => {
            try {
                const response = await fetch(
                    `${api.giveOpportunity}/college/${collegeId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': API_KEY,
                        },
                    }
                );
                const data = await response.json();
                if (data.success === false) {
                    throw new Error(data.message);
                }
                return data;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchData = async () => {
            setLoading(true);
            const data = await getDetails();
            const filter = data.filter((item) => item.slug === slug);
            setOpportunity(filter);
            setSimilarOpportunity(data);
            setLoading(false);
        };

        if (collegeId) {
            fetchData();
        }
    }, [collegeId, slug]);

    if (loading) {
        return (
            <div className="bg-gray-100 py-16 px-8 md:px-">
                <div className="flex flex-col md:flex-row gap-16">
                    <div id="forDetails" className="space-y-8 w-full md:w-3/4 animate-pulse">
                        <div className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-100 p-8 rounded-2xl shadow-lg space-y-6 h-40" />
                        <div className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-100 p-8 rounded-2xl shadow-lg space-y-6 h-40" />
                    </div>
                    <div id="forSimilar" className="w-full md:w-1/3 space-y-6">
                        <div className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-100 p-6 rounded-lg shadow-md h-24" />
                        <div className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-100 p-6 rounded-lg shadow-md h-24" />
                    </div>
                </div>
            </div>

        );
    }
    return (<div>
        <DetailPageNavbar />
        <div className="bg-gray-100 py-16 px-8 md:px-32 min-h-screen">
            <div className="flex flex-col md:flex-row gap-16">
                <div id="forDetails" className="space-y-8 w-full md:w-3/4">
                    {opportunity && opportunity.length > 0 ? (
                        opportunity.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white p-8 rounded-2xl shadow-lg space-y-6"
                            >
                                <h1 className="font-semibold text-3xl text-blue-600">
                                    {item.name}
                                </h1>

                                <p className="text-gray-600 text-sm">Posted by: {item.owner.username}</p>

                                <hr className="my-4 border-t border-gray-300" />

                                <div className="space-y-4">
                                    <p className="font-semibold text-xl text-gray-700">Job Description</p>
                                    <p className="text-gray-600">{item.description}</p>
                                </div>
                                <div className='flex gap-3'>
                                <a href={`https://api.whatsapp.com/send?phone=${item.whatsapp}`} target="_blank" rel="noreferrer">
                                    <button className="px-4 py-2 bg-sky-500 hover:bg-blue-500 transition text-white rounded-lg">
                                        Contact Us
                                    </button>
                                </a>

                                <a href={`mailto:${item.email}`} target="_blank" rel="noreferrer">
                                    <button className="px-4 py-2 bg-sky-500 hover:bg-blue-500 transition text-white rounded-lg">
                                        Email Us
                                    </button>
                                </a>
                                    </div>
                            </div>
                        ))
                    ) : (
                        null)}
                </div>

                <div id="forSimilar" className="w-full md:w-1/3 space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Similar Opportunities</h2>

                    {similarOpportunity && similarOpportunity.length > 0 ? (
                        similarOpportunity.map((item) => (
                            <Link to={`../college/${collegeName}/opportunities/${item.slug}`}
                                className='p-6'
                            >
                                <div
                                    key={item.id}
                                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
                                >
                                    <h3 className="font-medium text-lg text-gray-800 line-clamp-2">{item.name}</h3>
                                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.description}</p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        null)}
                </div>
            </div>
        </div>
    </div>
    );
};

export default OpportunityDetails;