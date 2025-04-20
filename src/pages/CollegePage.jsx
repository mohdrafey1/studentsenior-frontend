import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import CollegeHero from '../components/Hero/CollegeHero';
import FeaturedSeniors from '../components/FeaturedSenior/FeaturedSenior';
import FeaturedProduct from '../components/FeaturedProduct/FeaturedProduct';
import CollegeAbout from '../components/About/CollegeAbout';
import Collegelinks from '../components/Links/CollegeLinks';
import Collegelink2 from '../components/Links/CollegeLink2';
import { fetchSeniors } from '../redux/slices/seniorSlice.js';
import { useCollegeId } from '../hooks/useCollegeId.js';
import { fetchProducts } from '../redux/slices/productSlice.js';
import Seo from '../components/SEO/Seo.jsx';
import { api } from '../config/apiConfiguration.js';
import useApiFetch from '../hooks/useApiFetch.js';
import { capitalizeWords } from '../utils/Capitalize.js';
import Popup from '../components/Popup/Popup.jsx';

const CollegePage = () => {
    const { collegeName } = useParams();
    const collegeId = useCollegeId(collegeName);
    const dispatch = useDispatch();
    const [collegeData, setCollegeData] = useState({});
    const { useFetch, loadingFetch } = useApiFetch();
    const url = api.college;

    useEffect(() => {
        fetchCollege();
        dispatch(fetchSeniors(collegeId));
        dispatch(fetchProducts(collegeId));
    }, [collegeName]);

    const fetchCollege = async () => {
        try {
            const Collegedata = await useFetch(`${url}/${collegeId}`);
            setCollegeData(Collegedata);
        } catch (error) {
            console.error('Error fetching college data:', error);
        }
    };

    return (
        <div style={{ scrollBehavior: 'smooth' }}>
            <CollegeHero tagline={`${collegeName}`}>
                <Seo
                    title={capitalizeWords(collegeName)}
                    desc={collegeData?.description || ' '}
                />
                <Collegelinks />
                <Popup />
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
