import React, { useState } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { API_BASE_URL, API_KEY } from '../config/apiConfiguration.js';

const AddSeniorPage = () => {
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
        { id: '66cba84ce0e3a7e528642837', name: 'MPGI Kanpur' },
        { id: '66d08aff784c9f07a53507b9', name: 'GCET Noida' },
        { id: '66d40833ec7d66559acbf24c', name: 'KMC UNIVERSITY' },
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSenior({ ...senior, [name]: type === 'checkbox' ? checked : value });
    };

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     setSenior({ ...senior, image: file });
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                    'Content-Type': 'application/json', // Send JSON data
                    'x-api-key': API_KEY,
                },
                credentials: 'include',
                body: JSON.stringify(newSenior), // Convert payload to JSON string
            });

            if (response.ok) {
                alert(
                    'Senior added successfully , it will be available once approved'
                );
            } else {
                const errorData = await response.json();
                alert(`Failed to add senior: ${errorData.message}`);
            }
        } catch (err) {
            console.error('Error adding senior:', err);
        }
    };

    return (
        <div>
            <Header />
            <div className="container mx-auto px-4 py-4 sm:block lg:flex ">
            <div className='illustration w-full'>
                        <iframe className='w-full h-full' controls src="https://lottie.host/embed/13b6a2bb-8ee5-485e-a88d-ed9c5b3f6977/b9HuPP23fO.json"></iframe>
                    </div>
            <div className="bg-white p-8 rounded-lg max-w-lg w-full shadow-lg ">

                <h1 className="text-2xl font-bold mb-4 text-center">Add Senior</h1>
                <form onSubmit={handleSubmit}>
                    <div className='lg:flex lg:flex-wrap justify-evenly'>
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
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">
                            Year
                        </label>
                        <input
                            type="text"
                            name="year"
                            value={senior.year}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-md"
                        />
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
                        >
                            <option>Select Your College</option>
                            {colleges.map((college) => (
                                <option key={college.id} value={college.id}>
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
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md md:w-1/3">
                        <a href="/">Back</a>
                    </button>
                </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md md:w-1/2 w-4/5"
                        >
                            Apply For Senior
                        </button>
                    </div>
                    </div>
                </form>
               
            </div>
           
            </div>
            {/* <Footer /> */}
            
        </div>
    );
};

export default AddSeniorPage;
