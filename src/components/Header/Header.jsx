import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from '/assets/logo.png'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const { currentUser } = useSelector((state) => state.user);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const menuItems = [
        { name: 'Home', path: '/' },
        // { name: 'Course', path: '/courses' },
        // { name: 'Join as a Senior', path: '/becomesenior' },
        { name: 'Add Your College', path: '/add-college' },
        { name: 'Leaderboard', path: '/leaderboard' }
    ];
    return (
        <header className="top-0 py-1 left-0 w-full bg-transparent rounded-full z-40">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <span className="text-3xl font-bold text-blue-600 inline-flex items-center">
                        <img src={logo}
                            alt="logo"
                            className='h-12 lg:h-16 text-xs text-transparent'
                            loading="eager"
                            key={Date.now()} />
                        <span className="text-4xl">S</span>tudent
                        <span className="text-blue-400"> Senior</span>
                    </span>
                </Link>
                <button
                    onClick={toggleMenu}
                    className="lg:hidden focus:outline-none z-50"
                >
                    <svg
                        className={`w-6 h-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-90 fixed right-6 top-6' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
                <nav className={`fixed inset-0 transition-transform duration-300 
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            lg:static lg:transform-none lg:flex lg:items-center lg:space-x-6
            pt-20 lg:pt-0 bg-blue-300 z-40 lg:bg-transparent
        `}>
                    <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={toggleMenu}
                                className="text-lg text-gray-700 hover:text-blue-600 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-blue-50"
                            >
                                {item.name}
                            </Link>
                        ))}
                        {currentUser ? (
                            <Link
                                to="/profile"
                                onClick={toggleMenu}
                                className="flex items-center space-x-2 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                            >
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <img
                                        src={currentUser.profilePicture || "/default-avatar.png"}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 transition-transform duration-200 hover:scale-105"
                                    />
                                    <p className="text-lg text-gray-700 md:block lg:hidden">{currentUser.username}</p>
                                </div>
                            </Link>
                        ) : (
                            <Link
                                to="/sign-in"
                                state={{ from: location }}
                                replace
                                onClick={toggleMenu}
                                className="text-lg text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;