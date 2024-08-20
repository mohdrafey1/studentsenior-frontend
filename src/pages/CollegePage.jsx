import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header/Header';
import CollegeHero from '../components/Hero/CollegeHero';
import FeaturedSeniors from '../components/FeaturedSenior/FeaturedSenior';
import Testimonials from '../components/Testimonials/Testimonials';
import CollegeAbout from '../components/About/CollegeAbout';
import Footer from '../components/Footer/Footer';
import Collegelinks from '../components/Links/CollegeLinks';

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
        <div style={{scrollBehavior:'smooth'}}>
            <Header />
            <CollegeHero tagline={`${collegeName}`}>
                <Collegelinks />
            </CollegeHero>
            <FeaturedSeniors seniors={seniors} />
            <Testimonials testimonials={testimonials} />
            <CollegeAbout />
            <Footer />
        </div>
    );
};

export default CollegePage;
