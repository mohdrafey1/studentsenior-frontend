import React from 'react';
import { capitalizeWords } from '../../utils/Capitalize.js';

const CollegeHero = ({ tagline, children }) => {
    return (
        <section className="bg-gradient-to-t from-sky-200 to bg-white text-center p-8 rounded-b-3xl">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mt-5 mb-20">
                Welcome to{' '}
                <span style={{ color: '#2196f3' }}>
                    {capitalizeWords(tagline)}
                </span>
            </h2>
            {children}
        </section>
    );
};

export default CollegeHero;
