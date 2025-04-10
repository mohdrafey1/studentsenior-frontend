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
        seniors = [],
        loading: loadingSeniors,
        error: seniorError,
    } = useSelector((state) => state.seniors || {});

    const fake = [{ no: 1 }, { no: 2 }, { no: 3 }, { no: 4 }];

    useEffect(() => {
        dispatch(fetchSeniors(collegeId));
    }, []);

    return (
        <section className="bg-white py-6 sm:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="flex flex-col items-center justify-center text-center mb-6">
                    <h3 className="text-lg sm:text-xl md:text-3xl font-semibold mb-2">
                        Guided by Experience, Trusted by Students
                    </h3>
                    <div className="text-sky-500 space-x-1">
                        {[...Array(5)].map((_, i) => (
                            <i key={i} className="fa-solid fa-star text-sm sm:text-base"></i>
                        ))}
                    </div>
                </div>

                {/* Senior Cards */}
                <div className="w-full">
                    {seniors.length > 0 ? (
                        <SeniorCard
                            seniors={seniors.slice(0, 4)}
                            handleDetail={handleDetail}
                        />
                    ) : (
                        <div className="flex justify-center items-center py-10">
                            {loadingSeniors ? (
                                <div className="flex flex-wrap justify-center gap-4 w-full">
                                    {fake.map((_, index) => (
                                        <div
                                            key={index}
                                            className="bg-white shadow rounded-xl w-24 h-32 sm:w-28 sm:h-36 md:w-32 md:h-40 flex justify-center items-center animate-pulse"
                                        >
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-300 rounded-full"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500">
                                    No Senior found in your college
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* View All Button */}
                {!loadingSeniors && (
                    <div className="text-center mt-6">
                        <Link
                            to={`/college/${collegeName}/seniors`}
                            className="bg-sky-500 text-white text-sm sm:text-base px-5 py-2 rounded-xl hover:bg-sky-600 transition-all"
                        >
                            View All
                        </Link>
                    </div>
                )}
            </div>

            {/* Senior Detail Modal */}
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
