import React from 'react';
import pyq from "../../icons/pyq.jpg";
import senior from "../../icons/senior.jpg";
import store from "../../icons/store.jpg";

const OurFeatures = () => {

    const features = [
        {
            id: 1,
            title: 'PYQ',
            icon: pyq,
            description: 'Access past year question papers, understand trends, improve strategies, and ace exams confidently with a well-organized, easy-to-use database for students.'
        }, {
            id: 2,
            title: 'Senior',
            icon: senior,
            description: 'Gain expert mentorship and support from seniors. Overcome challenges, plan careers, and excel academically with trusted guidance, experience, and wisdom from experts.'
        }, {
            id: 3,
            title: 'Store',
            icon: store,
            description: 'Discover calculators, books, lab coats, aprons, and affordable stationery essentials in our store to boost your preparation and achieve your academic goals.'
        },
    ]

    return (
        <div>
            <h1 className="text-center text-3xl">
                <span className="font-bold">Our Features</span>
            </h1>
            <div>
                <div className='lg:flex md:block justify-center items-center p-8'>
                    {
                        features.map((feature) => (
                            <div>
                                <div class="py-10 px-5 ">
                                    <div class="max-w-md mx-auto bg-white shadow-lg rounded-[35px] p-6 text-center max-h-64">
                                        <div class="w-16 h-16 mx-auto mb-4">
                                            <img src={feature.icon} alt="Icon" class="w-full rounded-full scale-150 shadow-xl -translate-y-10 h-full" />
                                        </div>
                                        <div className='transform -translate-y-5'>
                                            <h2 class="text-red-600 text-2xl font-bold mb-2">{feature.title}</h2>
                                            <p class="text-gray-700 text-base">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default OurFeatures;