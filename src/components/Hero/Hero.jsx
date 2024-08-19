import React from 'react';

const Hero = ({ children }) => {
    return (
        <section className="bg-gradient-to-t from-sky-200 to bg-white text-center p-8 rounded-b-3xl">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold my-6 sm:my-8 md:my-10">
                Expert Guidance at Your Fingertips
            </h2>
            {children}
        </section>
    );
};

export default Hero;
