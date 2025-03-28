import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config/apiConfiguration';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const currentUser = useSelector((state) => state.user.currentUser);
    const ownerId = currentUser?._id;

    // Fetch all courses
    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${API_BASE_URL}/courseapi/course`
                );
                if (!response.ok) throw new Error('Failed to fetch courses');
                const data = await response.json();
                setCourses(data);
                console.log(data);
            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // Fetch course details
    const fetchCourseDetails = async (slug) => {
        setLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/courseapi/course/${slug}`,
                {
                    credentials: 'include',
                }
            );
            if (!response.ok) throw new Error('Failed to fetch course details');
            const data = await response.json();
            setSelectedCourse(data);
            console.log(data);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = (slug) => {
        localStorage.setItem('course-slug', slug);
        navigate('/cart');
    };

    return (
        <div className='container max-w-[900px] mx-auto py-10 px-5'>
            <h2 className='text-4xl font-extrabold text-center text-gray-900 mb-8'>
                Our Courses
            </h2>

            {loading ? (
                <div className='flex justify-center items-center min-h-[200px]'>
                    <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500'></div>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {courses.map((course) => (
                        <div
                            key={course._id}
                            className='bg-white shadow-xl rounded-2xl p-5 transition-transform transform hover:scale-105'
                        >
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className='w-full h-52 object-cover rounded-xl'
                            />
                            <h3 className='text-xl font-semibold mt-4'>
                                {course.title}
                            </h3>
                            <p className='text-gray-600 mt-2'>
                                {course.description.substring(0, 50)}...
                            </p>
                            <p className='font-bold text-lg text-green-600 mt-2'>
                                ₹{course.price}
                            </p>
                            <div className='mt-4 flex justify-between'>
                                {course.enrolledStudents.some(
                                    (student) => student.userId === ownerId
                                ) ? (
                                    <button className='bg-green-500 text-white px-5 py-2 rounded-xl cursor-default'>
                                        Purchased
                                    </button>
                                ) : (
                                    <button
                                        className='bg-blue-500 text-white px-5 py-2 rounded-xl hover:bg-blue-600'
                                        onClick={() => handleBuy(course.slug)}
                                    >
                                        Buy Now
                                    </button>
                                )}

                                <button
                                    onClick={() =>
                                        fetchCourseDetails(course.slug)
                                    }
                                    className='text-blue-500 font-semibold hover:underline'
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Course Details Modal */}
            {selectedCourse && (
                <div className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-xl shadow-xl w-[90%] max-w-lg max-h-[90vh] overflow-y-auto p-8 relative animate-fadeIn'>
                        <button
                            className='absolute top-3 right-3 text-gray-500 hover:text-red-500 transition text-2xl font-bold'
                            onClick={() => setSelectedCourse(null)}
                        >
                            ✖
                        </button>
                        <h3 className='text-2xl font-bold text-gray-900'>
                            {selectedCourse.title}
                        </h3>
                        <img
                            src={selectedCourse.thumbnail}
                            alt={selectedCourse.title}
                            className='w-full h-48 object-cover rounded-lg my-4'
                        />
                        {selectedCourse.isEnrolled && (
                            <p className='text-green-400 text-2xl text-center'>
                                You Have Enrolled in this course
                            </p>
                        )}
                        <p className='text-gray-700 leading-relaxed'>
                            {selectedCourse.description}
                        </p>
                        <div className='mt-5 space-y-2 text-gray-800'>
                            <p>
                                <strong>📅 Duration:</strong>{' '}
                                {selectedCourse.courseDuration || 'N/A'}
                            </p>
                            <p>
                                <strong>📆 Start Date:</strong>{' '}
                                {selectedCourse.startDate
                                    ? new Date(
                                          selectedCourse.startDate
                                      ).toLocaleDateString('en-IN')
                                    : 'N/A'}
                            </p>

                            <p>
                                <strong>⏰ Timings:</strong>{' '}
                                {selectedCourse.timings ||
                                    'Saturday Sunday - 8 to 10 pm'}
                            </p>
                            <p>
                                <strong>💻 Mode:</strong>{' '}
                                {selectedCourse.mode || 'Zoom / Google Meet'}
                            </p>
                            <p>
                                <strong>⚡ Prerequisites:</strong>{' '}
                                {selectedCourse.prerequisites ||
                                    'No Prerequisites'}
                            </p>
                            <p>
                                <strong>👨‍🏫 Instructor:</strong>{' '}
                                {selectedCourse.instructor || 'N/A'}
                            </p>
                        </div>
                        <p className='font-bold text-2xl text-green-600 mt-4'>
                            ₹{selectedCourse.price}
                        </p>
                        <button
                            className='bg-red-500 text-white px-5 py-2 rounded-lg mt-4 w-full hover:bg-red-600 transition'
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
