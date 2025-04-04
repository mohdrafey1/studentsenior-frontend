import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCollegeId } from '../hooks/useCollegeId.js';
import { api, API_KEY } from '../config/apiConfiguration.js';
import DetailPageNavbar from '../DetailPages/DetailPageNavbar.jsx';
import Seo from '../components/SEO/Seo.jsx';

const OpportunityDetails = () => {
    const { collegeName, slug } = useParams();
    const collegeId = useCollegeId(collegeName);
    const [opportunity, setOpportunity] = useState(null);
    const [similarOpportunities, setSimilarOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOpportunityDetails = async () => {
            if (!collegeId) return;

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

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                if (data.success === false) {
                    throw new Error(data.message);
                }

                const filteredOpportunity = data.filter(
                    (item) => item.slug === slug
                );
                setOpportunity(filteredOpportunity[0]);
                setSimilarOpportunities(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOpportunityDetails();
    }, [collegeId, slug]);

    if (loading) {
        return (
            <div className="bg-gray-100 py-16 px-8 md:px-32 min-h-screen">
                <DetailPageNavbar />
                <div className="flex flex-col md:flex-row gap-16">
                    {/* Skeleton Loader for Details */}
                    <div className="space-y-8 w-full md:w-3/4">
                        <div className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-100 p-8 rounded-2xl shadow-lg space-y-6 h-40" />
                        <div className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-100 p-8 rounded-2xl shadow-lg space-y-6 h-40" />
                    </div>
                    {/* Skeleton Loader for Similar Opportunities */}
                    <div className="w-full md:w-1/3 space-y-6">
                        <div className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-100 p-6 rounded-lg shadow-md h-24" />
                        <div className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-100 p-6 rounded-lg shadow-md h-24" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-100 py-16 px-8 md:px-32 min-h-screen">
                <DetailPageNavbar />
                <div className="text-center text-red-500">
                    <p>Error: {error}</p>
                </div>
            </div>
        );
    }

    if (!opportunity) {
        return (
            <div className="bg-gray-100 py-16 px-8 md:px-32 min-h-screen">
                <div className="text-center text-gray-600">
                    <p>No opportunity found.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <DetailPageNavbar />
            <Seo
                title={opportunity.name}
                description={opportunity.description.slice(0, 100)}
            />
            <div className="bg-gray-100 py-16 px-8 md:px-32 min-h-screen">
                <div className="flex flex-col md:flex-row gap-16">
                    {/* Opportunity Details */}
                    <div className="space-y-8 w-full md:w-3/4">
                        <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
                            <h1 className="font-semibold text-3xl text-blue-600">
                                {opportunity.name}
                            </h1>
                            <p className="text-gray-600 text-sm">
                                Posted by: {opportunity.owner.username}
                            </p>
                            <hr className="my-4 border-t border-gray-300" />
                            <div className="space-y-4">
                                <p className="font-semibold text-xl text-gray-700">
                                    Job Description
                                </p>
                                <p className="text-gray-600">
                                    {opportunity.description}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <a
                                    href={`https://api.whatsapp.com/send?phone=${encodeURIComponent(
                                        opportunity.whatsapp.startsWith('+')
                                            ? opportunity.whatsapp
                                            : `+91${opportunity.whatsapp}`
                                    )}&text=${encodeURIComponent(
                                        `Hey , I came from Student senior about this opportunity ${opportunity.name}. Can I talk with you ?`
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 bg-sky-500 hover:bg-sky-500 transition text-white rounded-lg"
                                >
                                    Contact Us
                                </a>
                                <a
                                    href={`mailto:${opportunity.email}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 bg-sky-500 hover:bg-sky-500 transition text-white rounded-lg"
                                >
                                    Email Us
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Similar Opportunities */}
                    <div className="w-full md:w-1/3 space-y-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                            Similar Opportunities
                        </h2>
                        {similarOpportunities.slice(0, 3).map((item) => (
                            <Link
                                key={item._id}
                                to={`../college/${collegeName}/opportunities/${item.slug}`}
                                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow"
                            >
                                <h3 className="font-medium text-lg text-gray-800 line-clamp-2">
                                    {item.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                    {item.description}
                                </p>
                                <div className="mt-4 text-sky-500">
                                    View Details
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpportunityDetails;
