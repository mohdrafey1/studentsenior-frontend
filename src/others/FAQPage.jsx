import React, { useState } from 'react';
import Seo from '../components/SEO/Seo';

const FAQPage = () => {
    const faqs = [
        {
            question: 'What is Student Senior?',
            answer: 'Student Senior is a website which connects college students for mentorship, guidance, and community building. Students can askquestions, share knowledge, and trade items in a dedicated store. Senior students can register to mentor juniors,creating a dynamic ecosystem of knowledge sharing. The                   platform also offers a repository of academic resources,including notes and past exam papers, tailored to eachcolleges needs. Our goal is to foster interaction, support,and academic success among students, promotingsustainability and resourcefulness within the collegecommunity. By joining, students can tap into valuable insights, advice, and resources to enhance their college experience...',
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
            answer: "You can reach us through the 'Contact Us' page or email us at  studentsenior.help@gmail.com.",
        },
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                Frequently Asked Questions
            </h1>
            <div className="max-w-3xl mx-auto">
                {faqs.map((faq, index) => (
                    <div key={index} className="mb-4 border-b border-gray-300">
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full flex justify-between items-center py-4 px-6 text-left bg-white text-gray-900 hover:bg-gray-200 focus:outline-none"
                        >
                            <span className="text-lg font-semibold">
                                {faq.question}
                            </span>
                            <span className="text-gray-700">
                                {openIndex === index ? '−' : '+'}
                            </span>
                        </button>
                        {openIndex === index && (
                            <div className="px-6 py-4 text-gray-800 bg-gray-100 rounded-b-lg">
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
