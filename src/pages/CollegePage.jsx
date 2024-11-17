import React from 'react';
import { useParams } from 'react-router-dom';
import CollegeHero from '../components/Hero/CollegeHero';
import FeaturedSeniors from '../components/FeaturedSenior/FeaturedSenior';
import FeaturedProduct from '../components/FeaturedProduct/FeaturedProduct';
import CollegeAbout from '../components/About/CollegeAbout';
import Collegelinks from '../components/Links/CollegeLinks';
import Collegelink2 from '../components/Links/CollegeLink2';

const CollegePage = () => {
    const { collegeName } = useParams();

    return (
        <div style={{ scrollBehavior: 'smooth' }}>
            <CollegeHero tagline={`${collegeName}`}>
                <Collegelinks />
            </CollegeHero>
            <FeaturedSeniors />
            <hr />
            <FeaturedProduct />
            <hr />
            <CollegeAbout />
            <Collegelink2 />
        </div>
    );
};

export default CollegePage;
