import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import OurFeatures from '../components/OurFeatures/OurFeatures';
import About from '../components/About/About';
import '../App.css';
import QuickLinks from '../components/Links/QuickLinks';
import { toast } from 'react-toastify';
import Seo from '../components/SEO/Seo';
import FAQPage from '../others/FAQPage';
import { fetchColleges } from '../redux/slices/collegeSlice';
import { useDispatch, useSelector } from 'react-redux';

const MainPage = () => {
    const [selectedCollege, setSelectedCollege] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { colleges } = useSelector((state) => state.colleges || {});

    useEffect(() => {
        dispatch(fetchColleges());
    }, []);

    const handleCollegeChange = (event) => {
        setSelectedCollege(event.target.value);
    };

    const handleCollegeSelect = () => {
        if (selectedCollege) {
            navigate(`/college/${selectedCollege}`);
        } else {
            toast.error('Please Select a College!');
        }
    };

    return (
        <div className="bg-gray-100">
            <Hero>
                <Seo
                    title="Student Senior: Your Academic Companion"
                    desc={
                        'A platform offering mentorship, past year papers, and a student marketplace to support learning, career growth, and community engagement in college life.'
                    }
                />
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
                                {colleges.map((college) => {
                                    const truncatedName =
                                        college.name.length > 20
                                            ? college.name.substring(0, 17) +
                                              '...'
                                            : college.name;
                                    return (
                                        <option
                                            key={college.slug}
                                            value={college.slug}
                                            data={college.slug}
                                        >
                                            {truncatedName}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <button
                            onClick={handleCollegeSelect}
                            className="bg-gradient-to-br from-sky-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        >
                            {' '}
                            Submit
                        </button>
                    </div>
                </div>
            </Hero>
            <QuickLinks />
            <OurFeatures />
            {/* <Testimonials /> */}
            <About />
            <FAQPage />
        </div>
    );
};

export default MainPage;
