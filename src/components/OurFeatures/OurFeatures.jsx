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

  const [currentCounts, setCurrentCounts] = useState(achievements.map(() => 0));

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
            Explore the impact we've made with our resources, community, and
            products!
          </p>
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
