import React, { useState } from 'react';
import Header from '../components/Header/Header';
import { API_BASE_URL, API_KEY } from '../config/apiConfiguration';

function AddCollege() {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/colleges`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY,
                    },
                    body: JSON.stringify({
                        name,
                        location,
                        description,
                    }),
                }
            );

            if (response.ok) {
                setMessage(
                    'Your college has been submitted and will be added once approved.'
                );
                setName('');
                setLocation('');
                setDescription('');
            } else {
                setMessage('Failed to submit college. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred while submitting the college.');
        }
    };

    return (
        <>
            <Header />
            <div className="container mx-auto p-4 bg-white min-h-full ">
                <div className='big-screen w-full h-full lg:flex bg-white shadow-md rounded-lg mt-3 mb-3 '>
                    <div className='illustration w-full'>
                        <iframe className='w-full h-full' controls src="https://lottie.host/embed/13b6a2bb-8ee5-485e-a88d-ed9c5b3f6977/b9HuPP23fO.json"></iframe>
                    </div>
                    <div className='formData w-full pl-8 pr-8'>
                        <form
                            onSubmit={handleSubmit}
                            className="max-w-lg mx-auto bg-white p-6 rounded-lg "
                        >
                            <h1 className="text-3xl font-bold mb-6 text-center">
                                <span className='heading-class'>Add New College</span>
                            </h1>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="name"
                                >
                                    College Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
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
                                    type="text"
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
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
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
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
                            {message && (
                                <div className="mt-4 text-center text-green-600 font-semibold">
                                    {message}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddCollege;
