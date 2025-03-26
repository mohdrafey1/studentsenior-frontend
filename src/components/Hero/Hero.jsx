import React from 'react';
import { motion } from "framer-motion";

const Hero = ({ children }) => {
    return (
        <section className="p-8 rounded-b-3xl w-full flex flex-col">
            <motion.div 
                className="max-w-2xl"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <motion.h1 
                    className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight"
                >
                    Discover Your 
                    <motion.span 
                        className="text-blue-600"
                        transition={{ type: "spring", stiffness: 100 }}
                    >
                        {" "}College Journey
                    </motion.span>
                </motion.h1>

                <motion.p 
                    className="text-lg md:text-xl text-gray-600 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                >
                    Find resources, connect with seniors, and unlock your academic potential.
                </motion.p>
            </motion.div>

            {children}
        </section>
    );
};

export default Hero;
