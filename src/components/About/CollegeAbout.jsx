import React, { useEffect, useState } from 'react';
import { api } from '../../config/apiConfiguration';
import { capitalizeWords } from '../../utils/Capitalize.js';
import { useParams } from 'react-router-dom';
import useApiFetch from '../../hooks/useApiFetch.js';
import { useCollegeId } from '../../hooks/useCollegeId.js';

const CollegeAbout = () => {
    const [collegeData, setCollegeData] = useState({});
    const { collegeName } = useParams();
    const collegeId = useCollegeId(collegeName);

    const { useFetch, loadingFetch } = useApiFetch();
    const url = api.college;

    const fetchCollege = async () => {
        try {
            const Collegedata = await useFetch(`${url}/${collegeId}`);
            setCollegeData(Collegedata);
        } catch (error) {
            console.error('Error fetching college data:', error);
        }
    };

    useEffect(() => {
        fetchCollege();
    }, []);

    return (
        <section className="flex justify-center ">
            <div className="text-center mx-4/5 max-w-7xl p-8">
                <h3 className="text-3xl sm:font-medium mb-6">
                    {loadingFetch ? (
                        <i className="fas fa-spinner fa-pulse"></i>
                    ) : (
                        <> About {capitalizeWords(collegeName)}</>
                    )}
                </h3>
                <p className="text-gray-500 text-xl">
                    {collegeData?.description || 'no description provided'}
                </p>
            </div>
        </section>
    );
};

export default CollegeAbout;
