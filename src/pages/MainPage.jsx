import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import FeaturedSeniors from '../components/FeaturedSenior/FeaturedSenior';
import Testimonials from '../components/Testimonials/Testimonials';
import About from '../components/About/About';
import Footer from '../components/Footer/Footer';
import popup from '../others/UnderConstructionBanner';
import '../app.css';
import UnderConstructionBanner from '../others/UnderConstructionBanner';

const MainPage = () => {
    const [selectedCollege, setSelectedCollege] = useState('');
    const navigate = useNavigate();

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

    const seniors = [
        {
            name: 'Mohd Rafey',
            role: 'Web Designer',
            image: '../assets/womenn.jpg',
        },
        {
            name: 'Najmus Sahar',
            role: 'UI Designer',
            image: '/assets/womenn.jpg',
        },
        {
            name: 'Muskan Khatoon',
            role: 'Web Developer',
            image: '/assets/womenn.jpg',
        },
    ];

    const testimonials = [
        { name: 'John Doe', quote: 'Great experience, highly recommend!' },
        { name: 'Jane Smith', quote: 'My senior helped me a lot!' },
        { name: 'Alex Johnson', quote: 'The guidance was perfect!' },
    ];

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
                                <option value="Integral University">
                                    Integral University
                                </option>
                                <option value="Lucknow University">
                                    Lucknow University
                                </option>
                                <option value="Kmc University">
                                    Kmc University
                                </option>
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
            <FeaturedSeniors seniors={seniors} />
            <Testimonials testimonials={testimonials} />
            <About />
            <Footer />
        </>
    );
};

export default MainPage;
