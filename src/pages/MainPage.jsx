import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import FeaturedSeniors from '../components/FeaturedSenior/FeaturedSenior';
import Testimonials from '../components/Testimonials/Testimonials';
import About from '../components/About/About';
import Footer from '../components/Footer/Footer';
import '../App.css';
import UnderConstructionBanner from '../others/UnderConstructionBanner';

const MainPage = () => {
    const [selectedCollege, setSelectedCollege] = useState('');
    const navigate = useNavigate();

    const colleges = [
        {
            "id": "66cb9952a9c088fc11800714",
            "name": "Integral University",
        },
        {
            "id": "66cba84ce0e3a7e528642837",
            "name": "MPGI Kanpur",
        },
        {
            "id": "66d08aff784c9f07a53507b9",
            "name": "GCET Noida",
        }
    ];
    useEffect(() => {
        saveToLocalStorage();
    }
        , [])
    const saveToLocalStorage = () => {
        colleges.forEach((data) => {
            const formattedCollegeName = data.name
                .replace(/\s+/g, '-')
                .toLowerCase();
            // Save to localStorage
            localStorage.setItem(formattedCollegeName, data.id);
        });
       
    }


    const handleCollegeChange = (event) => {
        setSelectedCollege(event.target.value);
        const selectedOption = event.target.options[event.target.selectedIndex]; // Get the selected option
        const dataKey = selectedOption.getAttribute('data'); // Get the data-key attribute

        localStorage.setItem("id", dataKey);
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
            <UnderConstructionBanner />
            <Header />
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
            <FeaturedSeniors />
            <Testimonials />
            <About />
            <Footer />
        </>
    );
};

export default MainPage;
