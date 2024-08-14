import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import FeaturedSeniors from '../components/FeaturedSenior/FeaturedSenior';
import Testimonials from '../components/Testimonials/Testimonials';
import About from '../components/About/About';
import Footer from '../components/Footer/Footer';

const CollegePage = () => {
    const { collegeName } = useParams();

    const seniors = [
        {
            name: 'Mohd Rafey',
            role: 'Web Designer',
            image: '/assets/womenn.jpg',
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
            <Hero tagline={`Welcome to ${collegeName}`} />
            <section className="container mx-auto p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-10">
                    <Link
                        to="seniors"
                        className="p-5 bg-blue-500 text-white text-center rounded-lg shadow-md"
                    >
                        Seniors
                    </Link>
                    <Link
                        to="pyq"
                        className="p-5 bg-blue-500 text-white text-center rounded-lg shadow-md"
                    >
                        Past Year Questions (PYQ)
                    </Link>
                    <Link
                        to="store"
                        className="p-5 bg-blue-500 text-white text-center rounded-lg shadow-md"
                    >
                        Store
                    </Link>
                    <Link
                        to="community"
                        className="p-5 bg-blue-500 text-white text-center rounded-lg shadow-md"
                    >
                        Community
                    </Link>
                    <Link
                        to="whatsapp-group"
                        className="p-5 bg-blue-500 text-white text-center rounded-lg shadow-md"
                    >
                        WhatsApp Group
                    </Link>
                    <Link
                        to="opportunities"
                        className="p-5 bg-blue-500 text-white text-center rounded-lg shadow-md"
                    >
                        Opportunities
                    </Link>
                </div>
            </section>
            <FeaturedSeniors seniors={seniors} />
            <Testimonials testimonials={testimonials} />
            <About />
            <Footer />
        </>
    );
};

export default CollegePage;
