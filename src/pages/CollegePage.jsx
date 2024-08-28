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

    return (
        <div style={{ scrollBehavior: 'smooth' }}>
            <Header />
            <CollegeHero tagline={`${collegeName}`}>
                <Collegelinks />
            </CollegeHero>
            <FeaturedSeniors />
            <Testimonials />
            <CollegeAbout />
            <Footer />
        </div>
    );
};

export default CollegePage;
