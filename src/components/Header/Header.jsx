import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../../App.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [pathData, setPathData] = useState('M4 6h16M4 12h16M4 18h16');

    const location = useLocation();
    const { currentUser } = useSelector((state) => state.user);
    const toggleMenu = () => {
        if (!isMenuOpen) {
            setPathData('M4 4 L20 20 M4 20 L20 4');
            document.getElementById('rr').style.visibility = 'visible';
            document.getElementById('menu').classList.add('active');
        } else {
            document.getElementById('menu').classList.remove('active');
            document.getElementById('rr').style.visibility = 'hidden';
            setPathData('M4 6h16M4 12h16M4 18h16');
        }

        setIsMenuOpen(!isMenuOpen);
    };
    return (
        <header className="p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/">
                    <h1 className="text-3xl mx-5 font-bold">
                        <span className="heading-m pt-1">
                            <span style={{ fontSize: '40px' }}>S</span>
                            tudent{' '}
                        </span>{' '}
                        <span className="heading-m">Senior</span>
                    </h1>
                </Link>
                <div className="lg:hidden">
                    <button
                        onClick={toggleMenu}
                        className={`focus:outline-none relative z-20 rounded-lg p-2 ${
                            isMenuOpen ? 'bg-sky-400' : 'transparent'
                        }`}
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
                                d={pathData}
                            ></path>
                        </svg>
                    </button>
                </div>
                <div className="root" onClick={toggleMenu} id="rr">
                    <div className="menu" id="menu" onTouchStart={null}>
                        <nav
                            className={`${
                                isMenuOpen ? 'menu-m.active mt-4' : 'menu-m'
                            } absolute rounded-tr-3xl  top-0 left-0 w-4/5 h-screen bg-white lg:bg-transparent lg:relative lg:top-auto lg:left-auto lg:w-auto lg:h-auto lg:flex lg:items-center `}
                            id="toggle"
                        >
                            <div className="myclass">
                                <h1 className="text-3xl mx-5 font-bold p-4">
                                    <span
                                        style={{
                                            color: 'red',
                                            fontSize: '40px',
                                        }}
                                    >
                                        S
                                    </span>
                                    tudent{' '}
                                    <span style={{ color: 'red' }}>S</span>enior
                                </h1>
                            </div>
                            <ul className="laptop-scr text-xl flex flex-col items-center lg:flex-row lg:space-x-4">
                                <Link to="/" onClick={toggleMenu}>
                                    <li className="ihover rounded-3xl">Home</li>
                                </Link>

                                <Link
                                    to="/become-a-senior"
                                    onClick={toggleMenu}
                                >
                                    <li className="ihover rounded-3xl">
                                        Add Senior Profile
                                    </li>
                                </Link>

                                <Link to="/add-college" onClick={toggleMenu}>
                                    <li className="ihover rounded-3xl">
                                        Add Your College
                                    </li>
                                </Link>

                                <Link to="/about-us" onClick={toggleMenu}>
                                    <li className="ihover rounded-3xl">
                                        About Us
                                    </li>
                                </Link>
                                {currentUser ? (
                                    <>
                                        <Link
                                            to="/profile"
                                            onClick={toggleMenu}
                                        >
                                            <li className="ihover rounded-3xl">
                                                <center>
                                                    <img
                                                        src={
                                                            currentUser.profilePicture
                                                        }
                                                        alt="profile"
                                                        className="h-7 w-7 rounded-full object-cover"
                                                    />
                                                </center>
                                            </li>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/sign-in"
                                            onClick={toggleMenu}
                                            state={{ from: location }}
                                            replace
                                        >
                                            <li className="ihover rounded-3xl">
                                                Login
                                            </li>
                                        </Link>
                                    </>
                                )}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
