import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signOut } from '../redux/user/userSlice.js';
import { API_BASE_URL, API_KEY } from '../config/apiConfiguration.js';

const AddSeniorPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSucsess] = useState(false);
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let [responseMesaage, setResponseMessage] = useState('');
    const [senior, setSenior] = useState({
        name: '',
        branch: '',
        year: '',
        domain: '',
        whatsapp: '',
        telegram: '',
        // instagram: '',
        college: '',
        // image: null,
    });

    const colleges = [
        { id: '66cb9952a9c088fc11800714', name: 'Integral University' },
        { id: '66cba84ce0e3a7e528642837', name: 'MPEC Kanpur' },
        { id: '66d08aff784c9f07a53507b9', name: 'GCET Noida' },
        { id: '66d40833ec7d66559acbf24c', name: 'KMC UNIVERSITY' },
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSenior({ ...senior, [name]: type === 'checkbox' ? checked : value });
    };

    const handleLogout = () => {
        dispatch(signOut());
        navigate('/sign-in');
    };

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     setSenior({ ...senior, image: file });
    // };
    const closeDialog = () => {
        setIsSucsess(false);
        window.location.href = '../';
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Create a JSON object to send as the payload
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
            const response = await fetch(`${API_BASE_URL}/api/seniors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
                credentials: 'include',
                body: JSON.stringify(newSenior),
            });

            if (response.ok) {
                setIsLoading(false);
                setResponseMessage(
                    "🎉 Your request for becoming a senior has been successfully submitted! 👍 It'll be available once approved. Thanks for your patience!"
                );
                setIsSucsess(true);
            } else if (response.status === 401) {
                setIsLoading(false);
                setIsLoggedOut(true);
                dispatch(signOut());
            } else {
                setIsLoading(false);
                const errorData = await response.json();
                setResponseMessage(
                    `Failed to add senior : ${errorData.message}`
                );
                setIsSucsess(true);
            }
        } catch (err) {
            console.error('Error adding senior:', err);
        }
    };

    return (
        <div className="bg-gradient-to-t from-sky-200 to bg-white">
            <div className={`${isLoading ? 'block' : 'hidden'} text-center `}>
                <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50 bg-opacity-75">
                    <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500"></div>
                </div>
            </div>

            <div
                className={`${
                    isSuccess ? 'block' : 'hidden'
                } text-center absolute bg-opacity-80 bg-gray-300 flex justify-center h-full  w-full z-50 items-center`}
            >
                <div
                    role="alert"
                    className="mt-3 relative flex flex-col max-w-sm p-3 text-sm text-white bg-black rounded-md"
                >
                    <p className="flex justify-center text-2xl">Attention</p>
                    <p className="ml-4 p-3">{responseMesaage}</p>

                    <button
                        className="flex items-center justify-center transition-all w-8 h-8 rounded-md text-white hover:bg-white/10 active:bg-white/10 absolute top-1.5 right-1.5"
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
                </div>
            </div>
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
                        You have been signed out , Login Again
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
            <div>
                {/* <Header /> */}

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
                                    Add Yourself As a Senior
                                </span>
                            </h1>
                            <form onSubmit={handleSubmit}>
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
        </div>
    );
};

export default AddSeniorPage;
