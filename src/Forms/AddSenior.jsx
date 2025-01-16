import React, { useState } from 'react';
import useApiRequest from '../hooks/useApiRequest';
import { api } from '../config/apiConfiguration.js';
import { colleges } from '../hooks/useCollegeId.js';
import useRequireLogin from '../hooks/useRequireLogin.js';

const AddSeniorPage = () => {
    const requireLogin = useRequireLogin();
    const [isSuccess, setIsSuccess] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [senior, setSenior] = useState({
        name: '',
        branch: '',
        year: '',
        domain: '',
        whatsapp: '',
        telegram: '',
        college: '',
    });

    const { apiRequest, loading, error } = useApiRequest();
    const url = api.senior;

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSenior({ ...senior, [name]: type === 'checkbox' ? checked : value });
    };

    const closeDialog = () => {
        setIsSuccess(false);
        window.location.href = '../';
    };

    const handleAddSenior = (e) => {
        e.preventDefault();
        requireLogin(() => {
            handleSubmit(e);
        });
    };

    const handleSubmit = async (e) => {
        const newSenior = {
            name: senior.name,
            branch: senior.branch,
            year: senior.year,
            domain: senior.domain,
            whatsapp: senior.whatsapp,
            telegram: senior.telegram,
            college: senior.college,
        };

        try {
            await apiRequest(url, 'POST', newSenior);
            setResponseMessage(
                "🎉 Your request for becoming a senior has been successfully submitted! 👍 It'll be available once approved. Thanks for your patience!"
            );
            setIsSuccess(true);
        } catch (err) {
            setResponseMessage(err.message || 'Failed to submit your request.');
        }
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
                    <div
                        role="alert"
                        className="mt-3 relative flex flex-col max-w-sm p-3 text-sm text-white bg-black rounded-md"
                    >
                        <p className="flex justify-center text-2xl">
                            Attention
                        </p>
                        <p className="ml-4 p-3">{responseMessage}</p>
                        <button
                            className="absolute top-2.5 right-3"
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
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-4 sm:block lg:flex">
                <div className="big-screen w-full min-h-screen lg:min-h-full lg:flex self-center rounded-lg mt-3 mb-3 ">
                    <div className="illustration w-full">
                        <iframe
                            className="w-full h-full"
                            controls
                            src="https://lottie.host/embed/13b6a2bb-8ee5-485e-a88d-ed9c5b3f6977/b9HuPP23fO.json"
                        ></iframe>
                    </div>
                    <div className="bg-white p-8 rounded-lg max-w-lg w-full  ">
                        <h1 className="text-3xl font-bold mb-6 text-center">
                            <span className="heading-class">
                                Join As a Senior
                            </span>
                        </h1>
                        <form onSubmit={handleAddSenior}>
                            <div className="lg:flex lg:flex-wrap justify-evenly">
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={senior.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2">
                                        Course/Branch
                                    </label>
                                    <input
                                        type="text"
                                        name="branch"
                                        value={senior.branch}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2">
                                        Expertise:
                                    </label>
                                    <input
                                        type="text"
                                        name="domain"
                                        value={senior.domain}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2">
                                        Year
                                    </label>
                                    <select
                                        name="year"
                                        value={senior.year}
                                        onChange={handleInputChange}
                                        className="w-full px-4 lg:px-10 py-2 border rounded-md"
                                        required
                                    >
                                        <option value="">
                                            Select Your Year
                                        </option>
                                        <option value="1st Year">
                                            1st Year
                                        </option>
                                        <option value="2nd Year">
                                            2nd Year
                                        </option>
                                        <option value="3rd Year">
                                            3rd Year
                                        </option>
                                        <option value="4th Year">
                                            4th Year
                                        </option>
                                        <option value="5th Year">
                                            5th Year
                                        </option>
                                        <option value="Alumni">Alumni</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2">
                                        Whatsapp
                                    </label>
                                    <input
                                        type="Number"
                                        name="whatsapp"
                                        value={senior.whatsapp}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2">
                                        Telegram ( Optional )
                                    </label>
                                    <input
                                        type="Number"
                                        name="telegram"
                                        value={senior.telegram}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2">
                                        College
                                    </label>
                                    <select
                                        name="college"
                                        value={senior.college}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md"
                                        required
                                    >
                                        <option value="">
                                            Select Your College
                                        </option>
                                        {colleges.map((college) => (
                                            <option
                                                key={college.id}
                                                value={college.id}
                                            >
                                                {college.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/* <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">
                            Image
                        </label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleFileChange}
                            className="w-full px-4 py-2 border rounded-md"
                        />
                    </div> */}

                                <div className="flex justify-end w-full">
                                    <div className="flex justify-start w-full">
                                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md md:w-1/3 ">
                                            <a href="/">Back</a>
                                        </button>
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md min-w-max"
                                    >
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
