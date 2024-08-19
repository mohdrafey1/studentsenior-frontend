import React from 'react';

const CollegeHero = ({ tagline, children }) => {
    // Function to capitalize the first letter of each word
    const capitalizeWords = (str) => {
        return str.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    return (
        <section className="bg-gradient-to-t from-sky-200 to bg-white text-center p-8 rounded-b-3xl">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mt-5 mb-20">
                Welcome to {capitalizeWords(tagline)}
            </h2>
            {children}
        </section>
    );
};

export default CollegeHero;
