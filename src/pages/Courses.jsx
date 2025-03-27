import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';

const courses = [
    {
        id: 1,
        title: "HTML, CSS, JS - Web Development for Beginners",
        price: 999,
        thumbnail: "/assets/course1.jpg",
        description: "Learn the fundamentals of web development with HTML, CSS, and JavaScript. Build real projects and master front-end development step by step.",
        details: {
            duration: "6 Weeks",
            classSchedule: "Live classes on Saturdays & Sundays",
            timings: "7 PM - 9 PM IST",
            mode: "Online - Zoom/Google Meet",
            prerequisites: "No prior experience needed",
            keyTopics: [
                "HTML: Structure & Semantic Elements",
                "CSS: Styling, Flexbox, Grid, Animations",
                "JavaScript: Fundamentals, DOM, ES6+ Features",
                "Project: Build a Responsive Website"
            ]
        }
    },
    {
        id: 2,
        title: "MERN Stack Mastery - Full-Stack Web Development",
        price: 4999,
        thumbnail: "/assets/course2.jpg",
        description: "Master full-stack development with MongoDB, Express, React, and Node.js. Learn to build and deploy full-stack applications with modern technologies.",
        details: {
            duration: "10 Weeks",
            classSchedule: "Live classes on Saturdays & Sundays",
            timings: "7 PM - 10 PM IST",
            mode: "Online - Zoom/Google Meet",
            prerequisites: "Basic knowledge of HTML, CSS, and JavaScript",
            keyTopics: [
                "MongoDB: Database Design & CRUD Operations",
                "Express.js: Backend API Development",
                "React.js: Components, Hooks & State Management",
                "Node.js: Server-Side Development & Authentication",
                "Project: Build & Deploy a Full-Stack App"
            ]
        }
    }
];

const Courses = () => {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const navigate = useNavigate();

    const handleBuy = (id) => {
        localStorage.setItem("course-id", id);
        navigate("/cart");
    }

    return (
        <div className="container mx-auto py-10 px-5">
            <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-8">Our Courses</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course, index) => (
                    <div key={course.id} className="bg-white shadow-xl rounded-2xl p-5 transition-transform transform hover:scale-105">
                        <img src={course.thumbnail} alt={course.title} className="w-full h-52 object-cover rounded-xl" />
                        <h3 className="text-xl font-semibold mt-4">{course.title}</h3>
                        <p className="text-gray-600 mt-2">{course.description.substring(0, 50)}...</p>
                        <p className="font-bold text-lg text-green-600 mt-2">₹{course.price}</p>
                        <div className="mt-4 flex justify-between">
                            <button className="bg-blue-500 text-white px-5 py-2 rounded-xl hover:bg-blue-600" onClick={() => handleBuy(index)}>Buy Now</button>
                            <button onClick={() => setSelectedCourse(course)} className="text-blue-500 font-semibold hover:underline">View Details</button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedCourse && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-lg max-h-[90vh] overflow-y-auto p-8 relative animate-fadeIn">

                        {/* Close Button - Better Positioned */}
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition text-2xl font-bold"
                            onClick={() => setSelectedCourse(null)}
                        >
                            ✖
                        </button>

                        <h3 className="text-2xl font-bold text-gray-900">{selectedCourse.title}</h3>
                        <img src={selectedCourse.thumbnail} alt={selectedCourse.title} className="w-full h-48 object-cover rounded-lg my-4" />

                        <p className="text-gray-700 leading-relaxed">{selectedCourse.description}</p>

                        <div className="mt-5 space-y-2 text-gray-800">
                            <p><strong>📅 Duration:</strong> {selectedCourse.details.duration}</p>
                            <p><strong>📆 Schedule:</strong> {selectedCourse.details.classSchedule}</p>
                            <p><strong>⏰ Timings:</strong> {selectedCourse.details.timings}</p>
                            <p><strong>💻 Mode:</strong> {selectedCourse.details.mode}</p>
                            <p><strong>⚡ Prerequisites:</strong> {selectedCourse.details.prerequisites}</p>
                        </div>

                        <div className="mt-5">
                            <h4 className="text-lg font-semibold">📌 Key Topics:</h4>
                            <ul className="list-disc list-inside text-gray-600">
                                {selectedCourse.details.keyTopics.map((topic, index) => (
                                    <li key={index}>{topic}</li>
                                ))}
                            </ul>
                        </div>

                        <p className="font-bold text-2xl text-green-600 mt-4">₹{selectedCourse.price}</p>

                        <button
                            className="bg-red-500 text-white px-5 py-2 rounded-lg mt-4 w-full hover:bg-red-600 transition"
                            onClick={() => setSelectedCourse(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Courses;
