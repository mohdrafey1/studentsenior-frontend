import React, { useState } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { API_BASE_URL, API_KEY } from '../config/apiConfiguration.js';

const AddSeniorPage = () => {
    const [isLoading, setIsLoading] = useState(false);
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
                    'Content-Type': 'application/json', // Send JSON data
                    'x-api-key': API_KEY,
                },
                credentials: 'include',
                body: JSON.stringify(newSenior), // Convert payload to JSON string
            });
           
            if (response.ok) {
                setIsLoading(false);
               
            } else {
                setIsLoading(false);
                const errorData = await response.json();
                // alert(`Failed to add senior: ${errorData.message}`);
            }
        } catch (err) {
            console.error('Error adding senior:', err);
        }
    };

    return (
        <div className='bg-sky-100'>
        <div className={`${
                                isLoading ? 'block' : 'hidden'
                            } text-center absolute bg-opacity-80 bg-gray-300 flex justify-center h-full  w-full z-50 items-center`}
                        >
                            <div role="status">
                                <svg
                                    aria-hidden="true"
                                    className="inline w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                    />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
        <div>
             
            <Header />
           
            <div className="container mx-auto px-4 py-4 sm:block lg:flex ">
            <div className='big-screen w-full min-h-screen lg:min-h-full lg:flex self-center bg-white shadow-md rounded-lg mt-3 mb-3 '>
            <div className='illustration w-full'>
                        <iframe className='w-full h-full' controls src="https://lottie.host/embed/13b6a2bb-8ee5-485e-a88d-ed9c5b3f6977/b9HuPP23fO.json"></iframe>
                    </div>
            <div className="bg-white p-8 rounded-lg max-w-lg w-full  ">

            <h1 className="text-3xl font-bold mb-6 text-center">
            <span className='heading-class'>Add Senior</span></h1>
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
            </div>
            {/* <Footer /> */}
            
        </div>
        </div>
    );
};

export default AddSeniorPage;
