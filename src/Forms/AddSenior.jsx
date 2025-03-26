import React, { useReducer, useState, useCallback } from 'react';
import useApiRequest from '../hooks/useApiRequest';
import { api } from '../config/apiConfiguration.js';
import { colleges } from '../hooks/useCollegeId.js';
import useRequireLogin from '../hooks/useRequireLogin.js';
import Seo from '../components/SEO/Seo.jsx';

const initialState = {
    name: '',
    branch: '',
    year: '',
    domain: '',
    whatsapp: '',
    telegram: '',
    college: '',
};

const reducer = (state, action) => ({
    ...state,
    [action.name]: action.value,
});

const AddSeniorPage = () => {
    const requireLogin = useRequireLogin();
    const [isSuccess, setIsSuccess] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [senior, dispatch] = useReducer(reducer, initialState);
    const { apiRequest, loading } = useApiRequest();
    const url = api.senior;

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        dispatch({ name, value: type === 'checkbox' ? checked : value });
    };

    const closeDialog = () => {
        setIsSuccess(false);
        window.location.href = '../';
    };

    const handleSubmit = useCallback(async () => {
        try {
            const response = await apiRequest(url, 'POST', senior);
            setResponseMessage(response.message);
            setIsSuccess(true);
        } catch (err) {
            setResponseMessage(err.message || 'Failed to submit your request.');
        }
    }, [senior, apiRequest]);

    const handleAddSenior = (e) => {
        e.preventDefault();
        requireLogin(handleSubmit);
    };

    return (
        <div className="bg-gradient-to-t from-sky-200 to bg-white">
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50 bg-opacity-75">
                    <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500"></div>
                </div>
            )}

            {isSuccess && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50 bg-opacity-75">
                    <div className="mt-3 relative flex flex-col max-w-sm p-3 text-sm text-white bg-black rounded-md">
                        <p className="flex justify-center text-2xl">Attention</p>
                        <p className="ml-4 p-3">{responseMessage}</p>
                        <button className="absolute top-2.5 right-3" onClick={closeDialog}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-4 sm:block lg:flex">
                <div className="big-screen w-full min-h-screen lg:min-h-full lg:flex self-center rounded-lg mt-3 mb-3">
                    <div className="illustration w-full">
                        <iframe className="w-full h-full" controls src="https://lottie.host/embed/13b6a2bb-8ee5-485e-a88d-ed9c5b3f6977/b9HuPP23fO.json"></iframe>
                    </div>
                    <div className="bg-white p-8 rounded-lg max-w-xl w-full">
                        <h1 className="text-3xl font-bold mb-6 text-center">
                            <span className="heading-class">Join As a Senior</span>
                            <Seo title=" Join As a Senior" desc="Apply for Senior and help students in their academic journey" />
                        </h1>
                        <form onSubmit={handleAddSenior}>
                            <div className="lg:flex lg:flex-wrap justify-evenly">
                                {[
                                    { label: 'Name', name: 'name', type: 'text', required: true },
                                    { label: 'Course/Branch', name: 'branch', type: 'text', required: true },
                                    { label: 'Expertise', name: 'domain', type: 'text', required: true },
                                    { label: 'Whatsapp', name: 'whatsapp', type: 'number', required: true },
                                    { label: 'Telegram (Optional)', name: 'telegram', type: 'number' },
                                ].map(({ label, name, type, required }) => (
                                    <div key={name} className="mb-4">
                                        <label className="block text-gray-700 font-bold mb-2">{label}</label>
                                        <input type={type} name={name} value={senior[name]} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md" required={required} />
                                    </div>
                                ))}

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2">Year</label>
                                    <select name="year" value={senior.year} onChange={handleInputChange} className="w-full px-4 lg:px-10 py-2 border rounded-md" required>
                                        <option value="">Select Your Year</option>
                                        {['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Alumni'].map((year) => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2">College</label>
                                    <select name="college" value={senior.college} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md" required>
                                        <option value="">Select Your College</option>
                                        {colleges.map(({ id, name }) => (
                                            <option key={id} value={id}>{name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex justify-end w-full">
                                    <div className="flex justify-start w-full">
                                        <button className="bg-sky-500 text-white px-4 py-2 rounded-md md:w-1/3">
                                            <a href="/">Back</a>
                                        </button>
                                    </div>
                                    <button type="submit" className="bg-sky-500 text-white px-4 py-2 rounded-md min-w-max">
                                        Apply For Senior
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSeniorPage;
