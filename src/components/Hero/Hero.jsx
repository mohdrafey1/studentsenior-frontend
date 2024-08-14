import React from 'react';

const Hero = ({ tagline, children }) => {
    return (
        <section className="bg-gradient-to-t from-sky-200 to bg-white text-center h-80 p-8 rounded-b-3xl">
            <h2 className="text-6xl font-bold mb-4">{tagline}</h2>
            {children}
        </section>
    );
};

export default Hero;
