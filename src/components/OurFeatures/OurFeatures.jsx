import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import pyq from '../../icons/pyq.png';
import senior from '../../icons/senior.png';
import store from '../../icons/store.png';
import user from '../../icons/senior.png';

const OurFeatures = () => {
<<<<<<< HEAD
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
=======
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
>>>>>>> 81caa9540474d85015bef0d185d0a79b7f7e7782

  const [currentCounts, setCurrentCounts] = useState(achievements.map(() => 0));

<<<<<<< HEAD
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
=======
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
>>>>>>> 81caa9540474d85015bef0d185d0a79b7f7e7782
        });
      }, 20); // Interval speed
    });
  }, []);

<<<<<<< HEAD
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
            Explore the impact we've made with our resources, community, and
            products!
          </p>
=======
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
>>>>>>> 81caa9540474d85015bef0d185d0a79b7f7e7782
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {achievements.map((item, index) => {
            // Color psychology-based selections
            const colorSchemes = [
              // PYQs - Blue (trust, knowledge, reliability)
              'bg-blue-100 border-blue-400',
              // Senior Guides - Purple (wisdom, creativity, inspiration)
              'bg-purple-100 border-purple-400',
              // Products Sold - Green (growth, success, prosperity)
              'bg-green-100 border-green-400',
              // Active Users - Orange (enthusiasm, social, friendly)
              'bg-orange-100 border-orange-400',
            ];

            const textColors = [
              'text-blue-700',
              'text-purple-700',
              'text-green-700',
              'text-orange-700',
            ];

            return (
              <div
                key={item.id}
                className={`${colorSchemes[index]} border-t-4 lg:h-56 h-40 rounded-2xl shadow-lg p-4 sm:p-6 text-center relative overflow-hidden group transition-transform transform hover:scale-105 hover:shadow-xl`}
              >
                {/* Icon */}
                <div className="absolute bottom-[-100px] left-1/2 transform -translate-x-1/2 lg:group-hover:translate-y-[-100%] transition-all duration-200 ease-out">
                  <div
                    className={`p-3 rounded-full ${colorSchemes[index].split(' ')[0].replace('100', '200')}`}
                  >
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div className="relative z-10 lg:group-hover:-translate-y-8 transition-transform duration-200 ease-out flex flex-col justify-center h-full">
                  <h3
                    className={`lg:text-4xl text-3xl font-extrabold text-gray-800`}
                  >
                    <span className={textColors[index]}>
                      {currentCounts[index]}+
                    </span>
                  </h3>
                  <p className="text-base sm:text-lg font-semibold text-gray-700 mt-2">
                    {item.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section header */}
      <div className="text-center mb-8 sm:mb-12 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
          Our Features
        </h2>
        <div className="w-16 sm:w-24 h-1 bg-blue-500 mx-auto mt-3 sm:mt-4 rounded-full"></div>
      </div>

      {/* Features cards */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white cursor-pointer rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full"
            >
              {/* Card header with icon */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 sm:p-6 flex justify-center">
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain bg-white p-2 rounded-full"
                />
              </div>

              {/* Card content */}
              <div className="p-4 sm:p-6 flex-grow">
                <h3 className="text-lg sm:text-xl font-semibold text-center text-gray-800 mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 text-center">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurFeatures;
