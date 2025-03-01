import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import '../../App.css';

const Collegelinks = () => {
    const { collegeName } = useParams();
    const location = useLocation();

    const links = [
        {
            to: `/college/${collegeName}`,
            icon: 'fa-solid fa-building',
            text: 'College',
        },
        {
            to: `/college/${collegeName}/resources`,
            icon: 'fa-solid fa-note-sticky',
            text: 'Resources',
        },
        {
            to: `/college/${collegeName}/pyq`,
            icon: 'fa-solid fa-bolt',
            text: 'PYQs',
        },
        {
            to: `/college/${collegeName}/notes`,
            icon: 'fa-solid fa-note-sticky',
            text: 'Notes',
        },
        {
            to: `/college/${collegeName}/seniors`,
            icon: 'fa-solid fa-user-tie',
            text: 'Seniors',
        },
        {
            to: `/college/${collegeName}/store`,
            icon: 'fa-solid fa-store',
            text: 'Store',
        },
        {
            to: `/college/${collegeName}/community`,
            icon: 'fa-solid fa-users',
            text: 'Community',
        },
        {
            to: `/college/${collegeName}/whatsapp-group`,
            icon: 'fa-brands fa-square-whatsapp',
            text: 'Groups',
        },
        {
            to: `/college/${collegeName}/opportunities`,
            icon: 'fa-solid fa-magnifying-glass',
            text: 'Opportunity',
        },
        {
            to: `/college/${collegeName}/lost-found`,
            icon: 'fa-solid fa-compass',
            text: 'Lost_Found',
        },
    ];

    return (
        <section className="hidden lg:flex justify-center items-center text-center my-10 px-4">
            <div className="bg-white border-radius-38 border-2 border-sky-500 grid grid-cols-5 xl:grid-cols-10 text-center px-2 sm:px-10 py-6 gap-10 text-base sm:gap-4 sm:text-lg md:gap-6 md:text-xl lg:gap-7 xl:gap-9">
                {links.map((link, index) => (
                    <Link
                        key={index}
                        to={link.to}
                        className={`rounded-xl hover:bg-sky-100 w-28 px-4 py-2 transition-colors duration-300 ${
                            location.pathname === link.to ? 'bg-sky-100' : ''
                        }`}
                    >
                        <div className="flex flex-col items-center">
                            <i className={link.icon}></i>
                            <p>{link.text}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default Collegelinks;
