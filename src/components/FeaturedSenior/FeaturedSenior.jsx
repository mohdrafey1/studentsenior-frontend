import React, { useState, useEffect } from 'react';
import { useCollegeId } from '../../hooks/useCollegeId';
import SeniorCard from '../Cards/SeniorCard';
import { useParams, Link } from 'react-router-dom';
import SeniorDetailModal from '../SeniorModal/SeniorDetailModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSeniors } from '../../redux/slices/seniorSlice';

const FeaturedSeniors = () => {
    const { collegeName } = useParams();
    const collegeId = useCollegeId(collegeName);
    const [selectedSenior, setSelectedSenior] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const handleDetail = (senior) => {
        setSelectedSenior(senior);
        setIsDetailModalOpen(true);
    };

    const dispatch = useDispatch();
    const {
        seniors,
        loading: loadingSeniors,
        error: seniorError,
    } = useSelector((state) => state.seniors || {});

    const fake = [{ no: 1 }, { no: 2 }, { no: 3 }, { no: 4 }];

    useEffect(() => {
        dispatch(fetchSeniors(collegeId));
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
                        {seniorError && (
                            <div className="text-red-500 text-center">
                                Failed to load Seniors: {seniorError}
                            </div>
                        )}
                        {seniors.length > 0 ? (
                            <SeniorCard
                                seniors={seniors.slice(0, 4)}
                                handleDetail={handleDetail}
                            />
                        ) : (
                            <div className="col-span-4 flex justify-center items-center py-10 w-full">
                                {loadingSeniors ? (
                                    <div className="w-full flex gap-5">
                                        {fake.map((item, index) => {
                                            return (
                                                <div className="bg-white shadow-md rounded-3xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl dark:bg-slate-300 w-full lg:h-56 flex flex-col">
                                                    <div className="h-20 w-20 rounded-full bg-gray-400 m-auto animate-ping"></div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 mt-5">
                                        No Senior found in your college
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {loadingSeniors ? (
                    <></>
                ) : (
                    <div className="text-center my-5">
                        <Link
                            to={`/college/${collegeName}/seniors`}
                            className="bg-sky-500 text-white py-2 px-4 rounded-xl hover:bg-sky-600"
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
