import React, { useState } from 'react';

const FAQPage = () => {
    const faqs = [
        {
            question: 'What is Student Senior?',
            answer: 'Student Senior is a platform that connects college students with resources, seniors for guidance, and a marketplace for buying and selling items.',
        },
        {
            question: 'How do I register?',
            answer: "Click on the 'Sign Up' button on the homepage and fill out the registration form with your details.",
        },
        {
            question: 'Can anyone add a college?',
            answer: 'Only registered users can add colleges to ensure authenticity and maintain data quality.',
        },
        {
            question: 'Is there a fee to use Student Senior?',
            answer: 'No, the platform is completely free for students.',
        },
        {
            question: 'How do I contact support?',
            answer: "You can reach us through the 'Contact Us' page or email us at studentsenior12@gmail.com.",
        },
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                Frequently Asked Questions
            </h1>
            <div className="max-w-3xl mx-auto">
                {faqs.map((faq, index) => (
                    <div key={index} className="mb-4 border-b border-gray-300">
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full flex justify-between items-center py-4 px-6 text-left bg-white text-gray-700 hover:bg-gray-100 focus:outline-none"
                        >
                            <span className="text-lg font-medium">
                                {faq.question}
                            </span>
                            <span className="text-gray-500">
                                {openIndex === index ? '−' : '+'}
                            </span>
                        </button>
                        {openIndex === index && (
                            <div className="px-6 pb-4 text-gray-600">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQPage;
