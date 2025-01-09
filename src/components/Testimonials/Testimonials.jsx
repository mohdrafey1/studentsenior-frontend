import React, { useRef } from 'react';

const Testimonials = () => {
    const carouselRef = useRef(null);

    const scrollLeft = () => {
        const carousel = carouselRef.current;
        const cardWidth = carousel.querySelector('.card').offsetWidth + 5;
        carousel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    };

    const scrollRight = () => {
        const carousel = carouselRef.current;
        const cardWidth = carousel.querySelector('.card').offsetWidth + 5;
        carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
    };

    return (
        <div className="w-full flex flex-col justify-center">
            <div className="text-center mt-6">
                <h3 className="text-3xl sm:text-4xl mt-1 font-bold">
                    What Students Say About Us
                </h3>
            </div>
            <div className="flex justify-center items-center py-8">
                <div className="wrapper relative w-full sm:w-4/5 overflow-hidden px-16">
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
                                name: 'Amir Khan',
                                text: 'I extend my heartfelt gratitude to my senior for their invaluable guidance and unwavering support. Thank you!',
                                image: 'https://res.cloudinary.com/dqlugeoxg/image/upload/v1/student_senior/o75dfiierdwluartngkm',
                            },
                            {
                                name: 'Iqra Khan',
                                text: "I'm deeply grateful to my senior for their exceptional guidance and unwavering support, which have been pivotal in my growth. Thank you!",
                                image: 'https://res.cloudinary.com/dqlugeoxg/image/upload/v1/student_senior/j5rfnsnq570tjzz0snto',
                            },
                            {
                                name: 'Rohit Sharma',
                                text: "Grateful for my senior's exceptional guidance and support. Their mentorship has been a catalyst for my growth. Thank you sincerely!",
                                image: 'https://res.cloudinary.com/dqlugeoxg/image/upload/v1724859258/student_senior/o8wuwteyunixuecsrccc.jpg',
                            },
                            {
                                name: 'Rishabh',
                                text: 'Thank you to my senior for their invaluable guidance and unwavering support, shaping my growth and instilling confidence. A mentor par excellence!',
                                image: 'https://res.cloudinary.com/dqlugeoxg/image/upload/v1/student_senior/o75dfiierdwluartngkm',
                            },
                            {
                                name: 'Smriti Mandhana',
                                text: 'I am deeply grateful to my senior for their guidance and support, which have been instrumental in my professional development. Thank you sincerely!',
                                image: 'https://res.cloudinary.com/dqlugeoxg/image/upload/v1/student_senior/j5rfnsnq570tjzz0snto',
                            },
                            {
                                name: 'Mohd Rafey',
                                text: "Grateful for my senior's exceptional guidance and support, shaping my growth. Their wisdom, patience, and encouragement have been invaluable. Thank you!",
                                image: 'https://res.cloudinary.com/dqlugeoxg/image/upload/v1724859258/student_senior/o8wuwteyunixuecsrccc.jpg',
                            },
                        ].map((review, index) => (
                            <li
                                key={index}
                                className="card card-testimonial box-border w-full p-6 sm:p-8 m-0.5 bg-white rounded-[35px] flex-shrink-0"
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
