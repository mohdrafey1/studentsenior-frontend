import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white px-4 pt-4 pb-20 lg:pb-4">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="text-center md:text-left  md:mb-0">
                    <h4 className="text-2xl font-bold mb-2">Connect with Us</h4>
                    <p className="text-gray-400">
                        Email: studentsenior12@gmail.com
                    </p>
                    <p className="text-gray-400">Phone: +91 9455346151</p>
                </div>
                <div className="text-center mt-4">
                    <div className="flex justify-evenly p-2">
                        <Link to="/contact-us">
                            <p>Contact Us</p>
                        </Link>
                        <Link to="./privacy-policy">
                            <p>Privacy Policy</p>
                        </Link>
                    </div>
                    <p className="text-gray-400">
                        &copy; 2024 Student Senior. All rights reserved.
                    </p>
                </div>
                <div className="flex items-center space-x-6">
                    <a
                        target="_blank"
                        href="https://studentsenior.com/install"
                        aria-label="install"
                        className="hover:text-gray-400"
                    >
                        <p className="bg-white text-black rounded-3xl px-1 font-bold">
                            Install
                        </p>
                    </a>
                    <a
                        target="_blank"
                        href="https://t.me/studentsenior12"
                        aria-label="Telegram"
                        className="hover:text-gray-400"
                    >
                        <i className="fa-brands fa-telegram text-2xl"></i>
                    </a>
                    <a
                        target="_blank"
                        href="https://www.linkedin.com/in/mohd-rafey/"
                        aria-label="LinkedIn"
                        className="hover:text-gray-400"
                    >
                        <i className="fa-brands fa-linkedin text-2xl"></i>
                    </a>
                    <a
                        target="_blank"
                        href="https://www.instagram.com/studentsenior12?igsh=c2NkZWRpNm9pdTVy"
                        aria-label="Instagram"
                        className="hover:text-gray-400"
                    >
                        <i className="fa-brands fa-instagram text-2xl"></i>
                    </a>
                    <a
                        target="_blank"
                        href="https://youtube.com/extraelements"
                        aria-label="YouTube"
                        className="hover:text-gray-400"
                    >
                        <i className="fa-brands fa-youtube text-2xl"></i>
                    </a>
                    <a
                        target="_blank"
                        href="https://api.whatsapp.com/send?phone=919455346151"
                        aria-label="WhatsApp"
                        className="hover:text-gray-400"
                    >
                        <i className="fa-brands fa-whatsapp text-2xl"></i>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
