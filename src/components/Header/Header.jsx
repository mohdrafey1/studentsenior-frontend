import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../app.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-3xl mx-5 font-bold">Student Senior</h1>
                <div className="lg:hidden">
                    <button
                        onClick={toggleMenu}
                        className="focus:outline-none relative z-20"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            ></path>
                        </svg>
                    </button>
                </div>
                <nav
                    className={`${
                        isMenuOpen ? 'block' : 'hidden'
                    } absolute top-0 left-0 w-full h-screen bg-white lg:bg-transparent lg:relative lg:top-auto lg:left-auto lg:w-auto lg:h-auto lg:flex lg:items-center`}
                >
                    <ul className="text-xl flex flex-col items-center lg:flex-row lg:space-x-4">
                        <li className="ihover">
                            <Link to="/" onClick={toggleMenu}>
                                Home
                            </Link>
                        </li>
                        <li className="ihover">
                            <Link to="/become-a-senior" onClick={toggleMenu}>
                                Add Senior Profile
                            </Link>
                        </li>
                        <li className="ihover">
                            <Link to="/add-college" onClick={toggleMenu}>
                                Add Your College
                            </Link>
                        </li>
                        <li className="ihover">
                            <Link to="/about" onClick={toggleMenu}>
                                About
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
