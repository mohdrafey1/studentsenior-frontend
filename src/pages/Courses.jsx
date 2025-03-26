import React, { useState } from 'react';

const courses = [
    {
        id: 1,
        title: "HTML, CSS, JS",
        price: 999,
        thumbnail: "/assets/course1.jpg",
        description: "Learn the fundamentals of web development with HTML, CSS, and JavaScript. Perfect for beginners!"
    },
    {
        id: 2,
        title: "MERN Stack",
        price: 4999,
        thumbnail: "/assets/course2.jpg",
        description: "Master full-stack development with MongoDB, Express, React, and Node.js. Ideal for aspiring developers."
    }
];

const Courses = () => {
    const [selectedCourse, setSelectedCourse] = useState(null);

    return (
        <div className="container mx-auto py-10 px-5">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Our Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course) => (
                    <div key={course.id} className="bg-white shadow-lg rounded-2xl p-5">
                        <img src={course.thumbnail} alt={course.title} className="w-full sm:h-40 lg:h-52 max-h-52 object-cover rounded-2xl" />
                        <h3 className="text-xl font-semibold mt-4">{course.title}</h3>
                        <p className="text-gray-600 mt-2">{course.description.substring(0, 50)}...</p>
                        <p className="font-bold text-lg text-green-600 mt-2">₹{course.price}</p>
                        <div className="mt-4 flex justify-between">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600">Buy Now</button>
                            <button onClick={() => setSelectedCourse(course)} className="text-blue-500">View Details</button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedCourse && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md lg:m-0 mx-4">
                        <h3 className="text-2xl font-bold">{selectedCourse.title}</h3>
                        <img src={selectedCourse.thumbnail} alt={selectedCourse.title} className="w-full sm:h-40 h-52 object-cover rounded-2xl my-3" />
                        <p className="text-gray-700">{selectedCourse.description}</p>
                        <p className="font-bold text-lg text-green-600 mt-3">₹{selectedCourse.price}</p>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-2xl mt-4 w-full hover:bg-red-600" onClick={() => setSelectedCourse(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Courses;
