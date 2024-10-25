import React, { useEffect, useState } from 'react';
import { api, API_KEY } from '../../config/apiConfiguration';
import { capitalizeWords } from '../../utils/Capitalize.js';
import { useParams } from 'react-router-dom';

const CollegeAbout = () => {
    const [collegeData, setCollegeData] = useState([]);
    const [des, setDes] = useState('');
    const { collegeName } = useParams();

    const url = api.college;

    const fetchCollege = async () => {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
                method: 'GET',
            });
            const Collegedata = await response.json();
            setCollegeData(Collegedata);
            setDes(collegeBased(Collegedata));
        } catch (error) {
            console.error('Error fetching college data:', error);
        }
    };

    const collegeBased = (data) => {
        let description = '';
        for (let i = 0; i < data.length; i++) {
            const collegeId = localStorage.getItem('id');
            if (data[i]._id === collegeId) {
                description = data[i].description;
            }
        }
        return description;
    };

    useEffect(() => {
        fetchCollege();
    }, []);
    return (
        <section className="flex justify-center ">
            <div className="text-center mx-4/5 max-w-7xl p-8">
                <h3 className="text-3xl font-bold mb-6">
                    About {capitalizeWords(collegeName)}
                </h3>
                <p className="text-gray-500 text-xl">{des}</p>
            </div>
        </section>
    );
};

export default CollegeAbout;
