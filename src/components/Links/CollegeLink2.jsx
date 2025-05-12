import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import '../../App.css';

const Collegelink2 = () => {
    const { collegeName } = useParams();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const handleMore = () => {
        setIsOpen(!isOpen);
    };

    const mainLinks = [
        {
            to: `/college/${collegeName}`,
            icon: 'fa-solid fa-building',
            text: 'College',
        },
        {
            to: `/college/${collegeName}/resources`,
            icon: 'fa-solid fa-bolt',
            text: 'Resources',
        },
        {
            to: `/college/${collegeName}/store`,
            icon: 'fa-solid fa-store',
            text: 'Store',
        },
        {
            to: `/college/${collegeName}/pyq`,
            icon: 'fa-solid fa-note-sticky',
            text: 'PYQs',
        },
    ];

    const moreLinks = [
        {
            to: `/college/${collegeName}/seniors`,
            icon: 'fa-solid fa-user-tie',
            text: 'Seniors',
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
            text: 'Lost Found',
        },
        {
            to: `/college/${collegeName}/community`,
            icon: 'fa-solid fa-users',
            text: 'Community',
        },

        {
            to: `/college/${collegeName}/notes`,
            icon: 'fa-solid fa-note-sticky',
            text: 'Notes',
        },
    ];

    return (
        <section className='lg:hidden min-w-full flex justify-center items-center text-center my-7'>
            {/* Fixed Bottom Navigation Bar */}
            <div className='fixed z-30 bottom-0 rounded-t-2xl bg-sky-300 inline-flex justify-around items-center text-center w-full py-2'>
                {mainLinks.map((link, index) => (
                    <Link
                        key={index}
                        to={link.to}
                        className={`rounded-xl hover:bg-sky-100 px-3 py-2 ${
                            location.pathname === link.to ? 'bg-sky-100' : ''
                        }`}
                    >
                        <div className='flex flex-col items-center min-w-full text-sm'>
                            <i className={link.icon}></i>
                            <p>{link.text}</p>
                        </div>
                    </Link>
                ))}
                {/* More Button */}
                <div
                    onClick={handleMore}
                    className='rounded-xl hover:bg-sky-100 px-3 py-2 cursor-pointer'
                >
                    <div className='flex flex-col items-center text-sm'>
                        <i
                            className={`fa-solid ${
                                isOpen ? 'fa-window-close' : 'fa-bars'
                            }`}
                        ></i>
                        <p>{isOpen ? 'Close' : 'More'}</p>
                    </div>
                </div>
            </div>

            {/* More Menu (Overlay) */}
            {isOpen && (
                <div className='fixed inset-0 flex items-center justify-center bg-white z-20 bg-opacity-75'>
                    <ul
                        className={`bg-sky-300 rounded-b-2xl absolute right-0.5 top-0 z-20 py-3 w-full transition-all duration-700 ease-in-out transform ${
                            isOpen
                                ? 'opacity-100 translate-y-0'
                                : 'max-h-0 opacity-0 -translate-y-10'
                        }`}
                    >
                        {moreLinks.map((link, index) => (
                            <li
                                key={index}
                                className='flex justify-center mb-2'
                            >
                                <Link
                                    to={link.to}
                                    className={`rounded-lg hover:bg-sky-100 px-4 py-2 text-center w-11/12 ${
                                        location.pathname === link.to
                                            ? 'bg-sky-100'
                                            : ''
                                    }`}
                                >
                                    <div className='flex items-center justify-center space-x-2 text-base font-medium'>
                                        <i className={link.icon}></i>
                                        <p>{link.text}</p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
};

export default Collegelink2;
