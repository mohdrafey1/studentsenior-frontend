import React, { useRef } from 'react';

const Testimonials = () => {
    const carouselRef = useRef(null);

    const scrollLeft = () => {
        const carousel = carouselRef.current;
        const cardWidth = carousel.querySelector('.card').offsetWidth;
        carousel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    };

    const scrollRight = () => {
        const carousel = carouselRef.current;
        const cardWidth = carousel.querySelector('.card').offsetWidth;
        carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
    };

    return (
        <div className="w-full flex flex-col justify-center">
            <div className="text-center mt-6">
                <div className="text-sky-400 text-3xl sm:text-4xl">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                </div>
                <h3 className="text-3xl sm:text-4xl mt-1 font-bold">
                    Perfect Match
                </h3>
                <p className="text-xl sm:text-2xl mt-1">
                    Over hundreds of students gave a <br />
                    review of 5 stars to our website!
                </p>
            </div>
            <div className="flex justify-center items-center py-8">
                <div className="wrapper relative w-full sm:w-4/5 overflow-hidden">
                    <i
                        id="left"
                        className="fa-solid fa-angle-left absolute top-1/2 transform -translate-y-1/2 left-2 cursor-pointer text-2xl sm:text-3xl z-10"
                        onClick={scrollLeft}
                    ></i>
                    <ul
                        ref={carouselRef}
                        className="carousel flex overflow-x-hidden scroll-smooth no-scrollbar"
                    >
                        {[
                            {
                                name: 'Mohd Rafey',
                                text: 'I extend my heartfelt gratitude to my senior for their invaluable guidance and unwavering support. Thank you!',
                                image: 'https://res.cloudinary.com/dqlugeoxg/image/upload/v1/student_senior/o75dfiierdwluartngkm',
                            },
                            {
                                name: 'Joenas Brauers',
                                text: "I'm deeply grateful to my senior for their exceptional guidance and unwavering support, which have been pivotal in my growth. Thank you!",
                                image: 'https://res.cloudinary.com/dqlugeoxg/image/upload/v1/student_senior/j5rfnsnq570tjzz0snto',
                            },
                            {
                                name: 'Lariach French',
                                text: "Grateful for my senior's exceptional guidance and support. Their mentorship has been a catalyst for my growth. Thank you sincerely!",
                                image: 'https://res.cloudinary.com/dqlugeoxg/image/upload/v1724859258/student_senior/o8wuwteyunixuecsrccc.jpg',
                            },
                            {
                                name: 'James Khosravi',
                                text: 'Thank you to my senior for their invaluable guidance and unwavering support, shaping my growth and instilling confidence. A mentor par excellence!',
                                image: 'https://res.cloudinary.com/dqlugeoxg/image/upload/v1/student_senior/o75dfiierdwluartngkm',
                            },
                            {
                                name: 'Kristina Zasiadko',
                                text: 'I am deeply grateful to my senior for their guidance and support, which have been instrumental in my professional development. Thank you sincerely!',
                                image: 'https://res.cloudinary.com/dqlugeoxg/image/upload/v1/student_senior/j5rfnsnq570tjzz0snto',
                            },
                            {
                                name: 'Donald Horton',
                                text: "Grateful for my senior's exceptional guidance and support, shaping my growth. Their wisdom, patience, and encouragement have been invaluable. Thank you!",
                                image: 'https://res.cloudinary.com/dqlugeoxg/image/upload/v1724859258/student_senior/o8wuwteyunixuecsrccc.jpg',
                            },
                        ].map((review, index) => (
                            <li
                                key={index}
                                className="card w-[100%] sm:w-[45%] md:w-[31%] p-6 sm:p-8 mx-2 bg-white rounded-lg flex-shrink-0"
                            >
                                <div className="img mb-4">
                                    <img
                                        src={review.image}
                                        alt="img"
                                        className="rounded-full h-24 w-24 sm:h-32 sm:w-32 object-cover mx-auto"
                                        draggable="false"
                                    />
                                </div>
                                <h2 className="text-lg sm:text-xl font-semibold text-center">
                                    {review.name}
                                </h2>
                                <p className="text-center text-base sm:text-lg text-gray-400 mt-2">
                                    {review.text}
                                </p>
                            </li>
                        ))}
                    </ul>
                    <i
                        id="right"
                        className="fa-solid fa-angle-right absolute top-1/2 transform -translate-y-1/2 right-2 cursor-pointer text-2xl sm:text-3xl z-10"
                        onClick={scrollRight}
                    ></i>
                </div>
            </div>
        </div>
    );
};

export default Testimonials;
