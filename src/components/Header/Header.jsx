import React from 'react';
import { Link } from 'react-router-dom';
import '../../app.css';

const Header = () => {
    return (
        <header className="p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-3xl mx-5 font-bold">Student Senior</h1>
                <nav>
                    <ul className="text-xl flex space-x-4">
                        <li className="ihover">
                            <Link to="/">Home</Link>
                        </li>
                        <li className="ihover">
                            <Link to="/become-a-senior">Become a Senior</Link>
                        </li>
                        <li className="ihover">
                            <Link to="/add-college">Add Your College</Link>
                        </li>
                        <li className="ihover">
                            <Link to="/about">About</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
