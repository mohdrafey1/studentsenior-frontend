import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <h4 className="text-2xl font-bold mb-2">Contact Us</h4>
                    <p className="text-gray-400">
                        Email: studentsenior12@gmail.com
                    </p>
                    <p className="text-gray-400">Phone: +91 9455346151</p>
                </div>
                <div className="text-center mt-4">
                    <p className="text-gray-400">
                        &copy; 2024 Student Senior. All rights reserved.
                    </p>
                </div>
                <div className="flex space-x-6">
                    <a
                        href="https://twitter.com"
                        aria-label="Twitter"
                        className="hover:text-gray-400"
                    >
                        <i className="fa-brands fa-twitter text-2xl"></i>
                    </a>
                    <a
                        href="https://linkedin.com"
                        aria-label="LinkedIn"
                        className="hover:text-gray-400"
                    >
                        <i className="fa-brands fa-linkedin text-2xl"></i>
                    </a>
                    <a
                        href="https://instagram.com"
                        aria-label="Instagram"
                        className="hover:text-gray-400"
                    >
                        <i className="fa-brands fa-instagram text-2xl"></i>
                    </a>
                    <a
                        href="https://youtube.com"
                        aria-label="YouTube"
                        className="hover:text-gray-400"
                    >
                        <i className="fa-brands fa-youtube text-2xl"></i>
                    </a>
                    <a
                        href="https://whatsapp.com"
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
