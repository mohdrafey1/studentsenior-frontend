import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import OurFeatures from '../components/OurFeatures/OurFeatures';
import About from '../components/About/About';
import '../App.css';
import { colleges } from '../hooks/useCollegeId';
import QuickLinks from '../components/Links/QuickLinks';
import { toast } from 'react-toastify';
import Seo from '../components/SEO/Seo';


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
        } else {
            toast.error('Please Select a College!');
        }
    };

    return (
        <div className='bg-gray-100'>
            <Hero>
           <Seo title="Student Senior" desc={'A platform offering mentorship, past year papers, and a student marketplace to support learning, career growth, and community engagement in college life.'} />
                <div className="flex flex-col items-center my-10">
                    <div className="text-black bg-white px-4 py-2 border-radius-38 border-4 border-sky-300 flex flex-col sm:flex-row items-center my-10">
                        <div className="text-xl sm:text-2xl flex items-center mb-4 sm:mb-0">
                        <i className="fas fa-building text-sky-500 text-xl mr-3"></i>
                                                    <select
                                className="p-2 rounded-md outline-none"
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
                            className="bg-gradient-to-br from-sky-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        >                            Submit
                        </button>
                    </div>
                </div>
            </Hero>
            <QuickLinks />
            <OurFeatures />
            {/* <Testimonials /> */}
            <About />
        </div>
    );
};

export default MainPage;
