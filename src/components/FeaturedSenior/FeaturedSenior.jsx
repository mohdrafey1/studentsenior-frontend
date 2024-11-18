import React, { useState, useEffect } from 'react';
import useApiFetch from '../../hooks/useApiFetch';
import { useCollegeId } from '../../hooks/useCollegeId';
import { api } from '../../config/apiConfiguration';
import SeniorCard from '../Cards/SeniorCard';
import { toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import SeniorDetailModal from '../SeniorModal/SeniorDetailModal';

const FeaturedSeniors = () => {
    const { collegeName } = useParams();
    const collegeId = useCollegeId(collegeName);
    const [seniors, setSeniors] = useState([]);
    const [selectedSenior, setSelectedSenior] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const { useFetch, loadingFetch } = useApiFetch();

    const handleDetail = (senior) => {
        setSelectedSenior(senior);
        setIsDetailModalOpen(true);
    };

    const fetchSeniors = async () => {
        try {
            const data = await useFetch(`${api.senior}/college/${collegeId}`);
            setSeniors(data);
        } catch (err) {
            console.error('Error fetching seniors:', err);
            toast.error('Error fetching seniors');
        }
    };

    useEffect(() => {
        fetchSeniors();
    }, []);

    return (
        <section className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-center items-center text-2xl text-center p-4">
                <h3 className="my-2 mx-4 md:text-3xl font-medium">
                    Guided by Experience, Trusted by Students
                </h3>
                <div className="text-sky-500 ml-2">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                </div>
            </div>
            <div className="container mx-auto px-5 xl:px-40">
                <div className="main-card">
                    <div className="mobile-card cards gap-2 flex md:gap-6 w-full lg:justify-center md:justify-center">
                        {seniors.length > 0 ? (
                            <SeniorCard
                                seniors={seniors.slice(0, 4)}
                                handleDetail={handleDetail}
                            />
                        ) : (
                            <div className="col-span-4 flex justify-center items-center py-10 w-full">
                                {loadingFetch ? (
                                    <i className="fas fa-spinner fa-pulse fa-2xl"></i>
                                ) : (
                                    <p className="text-center text-gray-500 mt-5">
                                        No Senior found in your college
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {loadingFetch ? (
                    <></>
                ) : (
                    <div className="text-center my-5">
                        <Link
                            to={`/college/${collegeName}/seniors`}
                            className="bg-sky-500 text-white py-2 px-4 rounded hover:bg-sky-600"
                        >
                            View All
                        </Link>
                    </div>
                )}
            </div>
            {isDetailModalOpen && (
                <SeniorDetailModal
                    senior={selectedSenior}
                    setIsDetailModalOpen={setIsDetailModalOpen}
                />
            )}
        </section>
    );
};

export default FeaturedSeniors;
