import React, { useState } from 'react';
import Header from '../components/Header/Header';

function AddCollege() {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/colleges', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    location,
                    description,
                }),
            });

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
            <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Add New College
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md"
                >
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
        </>
    );
}

export default AddCollege;
