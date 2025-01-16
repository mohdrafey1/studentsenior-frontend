import React, { useState } from 'react';
import useApiRequest from '../hooks/useApiRequest';
import { api } from '../config/apiConfiguration.js';
import useRequireLogin from '../hooks/useRequireLogin.js';

function AddCollege() {
    const requireLogin = useRequireLogin();
    const [isSuccess, setIsSuccess] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [pushData, setPushData] = useState({
        name: '',
        location: '',
        description: '',
    });

    const { apiRequest, loading } = useApiRequest();
    const url = api.college;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPushData({ ...pushData, [name]: value });
    };

    const handleAddCollege = (e) => {
        e.preventDefault();
        requireLogin(() => {
            handleSubmit(e);
        });
    };

    const handleSubmit = async (e) => {
        try {
            await apiRequest(url, 'POST', pushData);
            setResponseMessage(
                'Your college has been submitted and will be added once approved.'
            );
            setIsSuccess(true);
        } catch (error) {
            const errorData = error.response
                ? await error.response.json()
                : { message: error.message };
            setResponseMessage(`Failed to add college: ${errorData.message}`);
            setIsSuccess(true);
        }
    };

    const closeDialog = () => {
        setIsSuccess(false);
        window.location.href = '../';
    };

    return (
        <>
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50 bg-opacity-75">
                    <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500"></div>
                </div>
            )}

            <div
                className={`${
                    isSuccess ? 'block' : 'hidden'
                } text-center absolute bg-opacity-80 bg-gray-300 flex justify-center h-full w-full z-50 items-center`}
            >
                <div
                    role="alert"
                    className="mt-3 relative flex flex-col max-w-sm p-3 text-sm text-white bg-black rounded-md"
                >
                    <p className="flex justify-center text-2xl">Attention</p>
                    <p className="ml-4 p-3">{responseMessage}</p>

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

            <div className="container mx-auto p-4 bg-gradient-to-t from-sky-200 to bg-white min-h-max lg:min-h-full min-w-full">
                {/* <Header /> */}
                <div className="big-screen w-full  lg:flex self-center rounded-lg mt-4 mb-4 ">
                    <div className="illustration w-full">
                        <iframe
                            className="w-full h-full"
                            controls
                            src="https://lottie.host/embed/13b6a2bb-8ee5-485e-a88d-ed9c5b3f6977/b9HuPP23fO.json"
                        ></iframe>
                    </div>
                    <div className="formData w-full pl-8 pr-8">
                        <form
                            onSubmit={handleAddCollege}
                            className="max-w-lg mx-auto bg-white p-6 rounded-lg "
                        >
                            <h1 className="text-3xl font-bold mb-6 text-center">
                                <span className="heading-class">
                                    Add New College
                                </span>
                            </h1>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="name"
                                >
                                    College Name
                                </label>
                                <input
                                    name="name"
                                    type="text"
                                    id="name"
                                    value={pushData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="location"
                                >
                                    Location
                                </label>
                                <input
                                    name="location"
                                    type="text"
                                    id="location"
                                    value={pushData.location}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="description"
                                >
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    value={pushData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    rows="4"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition-colors duration-200"
                            >
                                Submit College
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            {/* <Footer /> */}
        </>
    );
}

export default AddCollege;
