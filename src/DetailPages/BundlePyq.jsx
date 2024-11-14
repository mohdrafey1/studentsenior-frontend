import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { api } from '../config/apiConfiguration';
import useApiFetch from '../hooks/useApiFetch';
import DetailPageNavbar from './DetailPageNavbar';
import { shortnerHandleShare } from '../utils/handleShare';
import PyqCard from '../components/Cards/PyqCard';

function BundlePyq() {
    const { collegeName } = useParams();
    const location = useLocation();
    const { useFetch, loadingFetch } = useApiFetch();
    const [bundlePyqs, setBundlePyqs] = useState([]);
    const [error, setError] = useState(null);

    const colleges = [
        { id: '66cb9952a9c088fc11800714', name: 'Integral University' },
        { id: '66cba84ce0e3a7e528642837', name: 'MPEC Kanpur' },
        { id: '66d08aff784c9f07a53507b9', name: 'GCET Noida' },
        { id: '66d40833ec7d66559acbf24c', name: 'KMC UNIVERSITY' },
    ];

    const selectedCollegeObject = colleges.find(
        (college) =>
            college.name.toLowerCase().replace(/\s+/g, '-') === collegeName
    );

    const collegeId = selectedCollegeObject.id;

    const getQueryParams = () => {
        const params = new URLSearchParams(location.search);
        return {
            year: params.get('year'),
            semester: params.get('semester'),
            course: params.get('course'),
            branch: params.get('branch'),
            examType: params.get('examType'),
        };
    };

    useEffect(() => {
        const fetchPyqBundle = async () => {
            if (!collegeId) return;
            const { year, semester, course, branch, examType } =
                getQueryParams();
            try {
                const url = `${api.pyq}/${collegeId}/bundle?year=${year}&semester=${semester}&course=${course}&branch=${branch}&examType=${examType}`;
                const data = await useFetch(url);
                setBundlePyqs(data);
            } catch (err) {
                setError('Error fetching bundle');
                console.log(err);
            }
        };
        fetchPyqBundle();
    }, [location.search, collegeId]);

    if (loadingFetch) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <i className="fas fa-spinner fa-pulse fa-5x"></i>
            </div>
        );
    }

    return (
        <div className="container bg-gradient-to-t from-sky-200 to bg-white min-h-screen min-w-full relative">
            <DetailPageNavbar path={'pyq'} handleShare={shortnerHandleShare} />
            <div className="main lg:m-auto lg:w-4/5">
                <div className="mt-4">
                    <h2 className="text-center text-2xl font-bold my-4">
                        All PYQ of Your Class
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mx-4">
                        {bundlePyqs.length > 0 ? (
                            <PyqCard Pyqs={bundlePyqs} />
                        ) : (
                            <p className="text-center text-gray-600 mt-5">
                                {error || 'No PYQ bundles available'}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BundlePyq;
