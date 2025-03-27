import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import OurFeatures from '../components/OurFeatures/OurFeatures';
import '../App.css';
import QuickLinks from '../components/Links/QuickLinks';
import { toast } from 'react-toastify';
import Seo from '../components/SEO/Seo';
import FAQPage from '../others/FAQPage';
import { fetchColleges } from '../redux/slices/collegeSlice';
import { useDispatch, useSelector } from 'react-redux';
import illustration from '/assets/illustration.jpg';
import { motion } from "framer-motion";

const MainPage = () => {
    const [selectedCollege, setSelectedCollege] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { colleges } = useSelector((state) => state.colleges || {});
    const [position, setPosition] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 });

    const handleMouseMove = (e) => {
        const { clientX, clientY, currentTarget } = e;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();

        const x = ((clientX - left) / width - 0.5) * 20; // Moves within ±10px
        const y = ((clientY - top) / height - 0.5) * 20;

        const rotateX = ((clientY - top) / height - 0.5) * 30; // Tilts ±15deg
        const rotateY = ((clientX - left) / width - 0.5) * -30; // Tilts ±15deg

        setPosition({ x, y, rotateX, rotateY });
    };

    useEffect(() => {
        dispatch(fetchColleges());
    }, []);

    const handleCollegeChange = (event) => {
        setSelectedCollege(event.target.value);
        if (event.target.value) {
            navigate(`/college/${event.target.value}`);
        } else {
            toast.error('Please Select a College!');
        }
    };

    const handleCollegeSelect = () => {
        if (selectedCollege) {
            navigate(`/college/${selectedCollege}`);
        } else {
            toast.error('Please Select a College!');
        }
    };

    return (
        <div onMouseMove={handleMouseMove}
            onMouseLeave={() => setPosition({ x: 0, y: 0, rotateX: 0, rotateY: 0 })}
            className="bg-no-repeat bg-cover"
            style={{ backgroundImage: `url('/assets/bg.svg')` }}
        >
            <Seo
                title="Student Senior: Your Academic Companion"
                desc={
                    'A platform offering mentorship, past year papers, and a student marketplace to support learning, career growth, and community engagement in college life.'
                }
            />
            <div className='lg:flex sm:block container mx-auto'>
                <div className='lg:w-4/5 w-full lg:pt-32 pt-10 px-8'>
                    <Hero>
                        <div className="flex flex-col lg:items-start items-center lg:my-10 my-0">
                            <div className="text-black bg-white px-4 py-2 rounded-[38px] lg:rounded-r-full border-4 border-sky-300 shadow-2xl shadow-sky-200 flex flex-col sm:flex-row items-center my-10">
                                <div className="text-xl sm:text-2xl flex items-center mb-0 sm:mb-0">
                                    <i className="fas fa-building text-sky-500 text-xl mr-3"></i>
                                    <select
                                        className="p-2 rounded-md outline-none text-lg"
                                        value={selectedCollege}
                                        onChange={handleCollegeChange}
                                    >
                                        <option value="">Select Your College</option>
                                        {colleges.map((college) => {
                                            const truncatedName =
                                                college.name.length > 20
                                                    ? college.name.substring(0, 17) + '...'
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
                                {/* <button
                                    onClick={handleCollegeSelect}
                                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                >
                                    Submit
                                </button> */}
                            </div>
                        </div>
                    </Hero>
                </div>
                <div className="hidden md:w-full sm:w-full sm:flex  items-center justify-center"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}

                >
                    <motion.img
                        src={illustration}
                        alt="student"
                        className="w-2/3 max-w-sm object-contain rounded-3xl shadow-lg"
                        animate={{
                            x: position.x,
                            y: position.y,
                            rotateX: position.rotateX,
                            rotateY: position.rotateY
                        }}
                        transition={{ type: "spring", stiffness: 100, damping: 10 }}

                    />
                </div>
            </div>

            <QuickLinks />
            <OurFeatures />
            <FAQPage />
        </div>
    );
};

export default MainPage;
