import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import pyq from '../../icons/pyq.png';
import senior from '../../icons/senior.png';
import store from '../../icons/store.png';
import user from '../../icons/senior.png';

const OurFeatures = () => {
    const features = [
        {
            id: 1,
            title: 'PYQ Access',
            icon: pyq,
            description:
                'Access past year question papers, understand trends, and improve strategies.',
        },
        {
            id: 2,
            title: 'Senior Mentorship',
            icon: senior,
            description:
                'Gain expert mentorship and support from seniors for academic and career guidance.',
        },
        {
            id: 3,
            title: 'Student Store',
            icon: store,
            description:
                'Discover and sell essential academic supplies to help you support your preparation.',
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
            const increment = Math.ceil(achievement.count / 100);
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
            }, 15);
        });
    }, []);

    const featureVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.2,
                duration: 0.5,
                ease: 'easeInOut',
            },
        }),
    };

    return (
        <div>
            {/* Achievements */}
            <div className="py-12 px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                        A Platform Trusted by Students
                    </h2>
                    <p className="text-gray-600 text-base sm:text-lg mt-3 max-w-2xl mx-auto">
                        Explore the impact we&apos;ve made with our resources,
                        community, and products!
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {achievements.map((item, index) => (
                        <motion.div
                            key={item.id}
                            className={`bg-white rounded-2xl shadow-md p-6 text-center
                                        transition-all duration-300 transform hover:scale-103
                                        border border-gray-100`}
                            whileHover={{ scale: 1.05, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}
                        >
                            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-100">
                                <img
                                    src={item.icon}
                                    alt={item.title}
                                    className="w-8 h-8 object-contain"
                                />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-3xl sm:text-4xl font-extrabold text-blue-700">
                                    {currentCounts[index]}+
                                </h3>
                                <p className="text-base sm:text-lg font-semibold text-gray-700">
                                    {item.title}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <section className="py-16 ">
                <div className="container mx-auto px-4">
                    <h1 className="text-center text-3xl sm:text-4xl font-extrabold text-gray-800 mb-12 relative">
                        <span className="text-blue-600">Our Features</span>
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-8px] h-[3px] w-20 bg-blue-500 rounded-full"></div>
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={featureVariants}
                                initial="hidden"
                                animate="visible"
                                custom={index}
                            >
                                <div className="bg-white rounded-xl shadow-lg p-6 text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl border border-gray-100">
                                    <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-blue-100">
                                        <img
                                            src={feature.icon}
                                            alt={feature.title}
                                            className="w-8 h-8 object-contain"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {feature.title}
                                        </h2>
                                        <p className="text-gray-600 text-base leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OurFeatures;
