import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const socialLinks = [
        {
            href: 'https://t.me/studentsenior12',
            ariaLabel: 'Telegram',
            icon: 'fa-brands fa-telegram',
        },
        {
            href: 'https://www.linkedin.com/in/mohd-rafey/',
            ariaLabel: 'LinkedIn',
            icon: 'fa-brands fa-linkedin',
        },
        {
            href: 'https://www.instagram.com/studentsenior12?igsh=c2NkZWRpNm9pdTVy',
            ariaLabel: 'Instagram',
            icon: 'fa-brands fa-instagram',
        },
        {
            href: 'https://youtube.com/extraelements',
            ariaLabel: 'YouTube',
            icon: 'fa-brands fa-youtube',
        },
        {
            href: 'https://api.whatsapp.com/send?phone=919455346151',
            ariaLabel: 'WhatsApp',
            icon: 'fa-brands fa-whatsapp',
        },
    ];

    const footerLinks = [
        // { to: '/donation', text: 'Donate' },
        { to: '/contact-us', text: 'Contact Us' },
        { to: '/privacy-policy', text: 'Privacy Policy' },
        { to: '/terms-and-conditions', text: 'T&C' },
        { to: '/refund-policy', text: 'Refund Policy' }, 
        { to: '/shipping-policy', text: 'Shipping Policy' },
    ];

    return (
        <footer className="bg-gray-800 text-white px-4 pt-4 pb-20 lg:pb-4">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                {/* Contact Information */}
                <div className="text-center md:text-left mb-6 md:mb-0">
                    <h4 className="text-2xl font-bold mb-2">Connect with Us</h4>
                    <p className="text-gray-400">
                        Email: studentsenior.help@gmail.com
                    </p>
                    <p className="text-gray-400">Phone: +91 9455346151</p>
                </div>

                {/* Footer Links */}
                <div className="text-center mb-6 md:mb-0">
                    <div className="flex justify-center flex-wrap space-x-4 p-2">
                        {footerLinks.map((link, index) => (
                            <Link
                                key={index}
                                to={link.to}
                                className="hover:text-gray-400"
                            >
                                {link.text}
                            </Link>
                        ))}
                    </div>
                    <p className="text-gray-400 mt-2">Courses starting from 999 to 4999</p>
                    <p className="text-gray-400 mt-2">
                        &copy; 2024 Student Senior. All rights reserved.
                    </p>
                </div>

                {/* Social Media Links */}
                <div className="flex items-center space-x-6">
                    <a
                        target="_blank"
                        href="https://studentsenior.com/install"
                        aria-label="Install"
                        className="hover:text-gray-400"
                    >
                        <p className="bg-white text-black rounded-3xl px-3 py-1 font-bold">
                            Install
                        </p>
                    </a>
                    {socialLinks.map((link, index) => (
                        <a
                            key={index}
                            target="_blank"
                            href={link.href}
                            aria-label={link.ariaLabel}
                            className="hover:text-gray-400"
                        >
                            <i className={`${link.icon} text-2xl`}></i>
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;