import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchCourses } from '../redux/slices/courseSlice.js';
import CollegeHero from '../components/Hero/CollegeHero';
import FeaturedSeniors from '../components/FeaturedSenior/FeaturedSenior';
import FeaturedProduct from '../components/FeaturedProduct/FeaturedProduct';
import CollegeAbout from '../components/About/CollegeAbout';
import Collegelinks from '../components/Links/CollegeLinks';
import Collegelink2 from '../components/Links/CollegeLink2';
import { fetchSeniors } from '../redux/slices/seniorSlice.js';
import { useCollegeId } from '../hooks/useCollegeId.js';
import { fetchProducts } from '../redux/slices/productSlice.js';

const CollegePage = () => {
    const { collegeName } = useParams();
    const collegeId = useCollegeId(collegeName);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCourses());
        dispatch(fetchSeniors(collegeId));
        dispatch(fetchProducts(collegeId));
    }, [collegeName]);

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
