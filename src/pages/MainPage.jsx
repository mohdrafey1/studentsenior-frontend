import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import Testimonials from '../components/Testimonials/Testimonials';
import About from '../components/About/About';
import '../App.css';
import { colleges } from '../hooks/useCollegeId';
import QuickLinks from '../components/Links/QuickLinks';

const MainPage = () => {
    const [selectedCollege, setSelectedCollege] = useState('');
    const navigate = useNavigate();

    //it was with the api but working slow so feed it , if will no of colleges will be more will do with api again

    const handleCollegeChange = (event) => {
        setSelectedCollege(event.target.value);
    };

    const handleCollegeSelect = () => {
        if (selectedCollege) {
            const formattedCollegeName = selectedCollege
                .replace(/\s+/g, '')
                .toLowerCase();
            navigate(`/college/${formattedCollegeName}`);
        }
    };

    return (
        <>
            <Hero>
                <div className="flex flex-col items-center my-10">
                    <div className="text-black bg-white px-4 py-2 border-radius-38 border-4 border-sky-300 flex flex-col sm:flex-row items-center my-10">
                        <div className="text-xl sm:text-2xl flex items-center mb-4 sm:mb-0">
                            <i className="fa-solid fa-building mr-2"></i>
                            <select
                                className="p-2 rounded-md"
                                value={selectedCollege}
                                onChange={handleCollegeChange}
                            >
                                <option value="">Select Your College</option>
                                {colleges.map((college) => (
                                    <option
                                        key={college.id}
                                        value={college.name.replace(
                                            /\s+/g,
                                            '-'
                                        )}
                                        data={college.id}
                                    >
                                        {college.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleCollegeSelect}
                            className="bg-sky-300 mt-4 sm:mt-0 sm:ml-4 px-4 py-2 border-radius-38 hover:bg-blue-400"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </Hero>
            <QuickLinks />
            <Testimonials />
            <About />
        </>
    );
};

export default MainPage;
