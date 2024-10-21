import React from 'react';
import { useParams } from 'react-router-dom';
import CollegeHero from '../components/Hero/CollegeHero';
import FeaturedSeniors from '../components/FeaturedSenior/FeaturedSenior';
import Testimonials from '../components/Testimonials/Testimonials';
import CollegeAbout from '../components/About/CollegeAbout';
import Collegelinks from '../components/Links/CollegeLinks';
import Collegelink2 from '../components/Links/CollegeLink2';

const CollegePage = () => {
    const { collegeName } = useParams();

    return (
        <div style={{ scrollBehavior: 'smooth' }}>
            {/* <Header /> */}
            <CollegeHero tagline={`${collegeName}`}>
                <Collegelinks />
            </CollegeHero>
            <FeaturedSeniors />
            <Testimonials />
            <CollegeAbout />
            {/* <Footer /> */}
            <Collegelink2 />
        </div>
    );
};

export default CollegePage;
