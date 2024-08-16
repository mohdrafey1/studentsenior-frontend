import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import FeaturedSeniors from '../components/FeaturedSenior/FeaturedSenior';
import Testimonials from '../components/Testimonials/Testimonials';
import About from '../components/About/About';
import Footer from '../components/Footer/Footer';
import '../app.css';

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
            <Header />
            <Hero>
                <div className="flex justify-center my-10">
                    <div className="flex justify-between items-center mt-10 bg-white text-black p-2 mr-4 rounded-3xl border-4 border-sky-300">
                        <div className="text-2xl ml-4">
                            <i className="fa-solid fa-building"></i>
                            <select
                                className="ml-2"
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
                            className="bg-sky-300 ml-2 px-4 py-2 rounded-xl hover:bg-blue-400"
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
