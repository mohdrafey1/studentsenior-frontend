import { React, useEffect, useState } from 'react';
import pyq from '../../icons/pyq.png';
import senior from '../../icons/senior.png';
import store from '../../icons/store.png';
import user from '../../icons/senior.png';

const OurFeatures = () => {
    const features = [
        {
            id: 1,
            title: 'PYQ',
            icon: pyq,
            description:
                'Access past year question papers, understand trends, improve strategies, and ace exams confidently with a well-organized, easy-to-use database for students.',
        },
        {
            id: 2,
            title: 'Senior',
            icon: senior,
            description:
                'Gain expert mentorship and support from seniors. Overcome challenges, plan careers, and excel academically with trusted guidance, experience, and wisdom from experts.',
        },
        {
            id: 3,
            title: 'Store',
            icon: store,
            description:
                'Discover and sell calculators, books, lab coats, aprons, and affordable stationery essentials in our store to boost your preparation and achieve your academic goals .',
        },
    ];
    const achievements = [
        {
            id: 1,
            title: 'PYQs Available',
            icon: pyq,
            count: 1000,
        },
        {
            id: 2,
            title: 'Senior Guides',
            icon: senior,
            count: 40,
        },
        {
            id: 3,
            title: 'Products Sold',
            icon: store,
            count: 15,
        },
        {
            id: 4,
            title: 'Active Users',
            icon: user,
            count: 3500,
        },
    ];

    const [currentCounts, setCurrentCounts] = useState(
        achievements.map(() => 0)
    );

    useEffect(() => {
        achievements.forEach((achievement, index) => {
            const increment = Math.ceil(achievement.count / 200); // Increment speed
            let currentValue = 0;
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= achievement.count) {
                    currentValue = achievement.count;
                    clearInterval(timer);
                }
                setCurrentCounts((prev) => {
                    const updatedCounts = [...prev];
                    updatedCounts[index] = currentValue;
                    return updatedCounts;
                });
            }, 20); // Interval speed
        });
    }, []);

    return (
        <div>
            {/* Achievements */}

            <div className="py-12 px-4">
                {/* Heading Section */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
                        A Platform Trusted by Students
                    </h2>
                    <p className="text-gray-600 text-base sm:text-lg mt-2">
                        Explore the impact we've made with our resources,
                        community, and products!
                    </p>
                </div>

                {/* Cards Section */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {achievements.map((item, index) => (
                        <div
                            key={item.id}
                            className={`${
                                index % 2 === 0 ? 'bg-sky-200' : 'bg-red-200'
                            }  lg:h-56 h-40 rounded-3xl shadow-xl p-4 sm:p-6 text-center relative overflow-hidden group  transition-transform transform hover:scale-105`}
                        >
                            {/* Icon */}
                            <div className="absolute bottom-[-100px] left-1/2 transform -translate-x-1/2 lg:group-hover:translate-y-[-100%] transition-all duration-200 ease-out">
                                <img
                                    src={item.icon}
                                    alt={item.title}
                                    className="h-20 w-20 sm:h-24 sm:w-24 object-contain"
                                />
                            </div>

                            {/* Text Content */}
                            <div className="relative z-10 lg:group-hover:-translate-y-8 transition-transform duration-200 ease-out flex flex-col justify-center h-full">
                                <h3 className="lg:text-4xl text-3xl font-extrabold text-gray-800">
                                    {currentCounts[index]}+
                                </h3>
                                <p className="text-base sm:text-lg font-semibold text-gray-600 mt-2">
                                    {item.title}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <h1 className="text-center text-3xl">
                <span className="text-3xl sm:text-4xl font-extrabold text-gray-800">
                    Our Features
                </span>
            </h1>
            <div>
                <div className="lg:flex md:block justify-center items-center p-8">
                    {features.map((feature, index) => (
                        <div key={index}>
                            <div className="py-10 px-5 ">
                                <div className="max-w-md mx-auto bg-white shadow-lg rounded-[35px] p-6 text-center h-full">
                                    <div className="w-16 h-16 mx-auto mb-4">
                                        <img
                                            src={feature.icon}
                                            alt="Icon"
                                            className="w-full bg-white rounded-full scale-150 shadow-xl -translate-y-10 h-full"
                                        />
                                    </div>
                                    <div className="transform -translate-y-5">
                                        <h2 className="text-red-600 text-2xl font-bold mb-2">
                                            {feature.title}
                                        </h2>
                                        <p className="text-gray-600 text-base sm:text-lg mt-2">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OurFeatures;
