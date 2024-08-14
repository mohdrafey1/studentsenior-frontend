import React from 'react';
import girlimg from '../../assets/womenn.jpg';

const FeaturedSeniors = ({ seniors }) => {
    return (
        <section className="container mx-auto p-4">
            <div className="flex justify-center text-2xl">
                <h3>10 Thousands of Student Learned</h3>&nbsp;&nbsp;
                <div className="text-sky-500">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                </div>
            </div>
            <div className="container mt-4">
                <div className="main-card">
                    <div className="cards flex flex-wrap gap-6 w-full justify-center">
                        <div className="card w-1/4 bg-white rounded-lg p-8 shadow-lg transform transition-transform duration-400 hover:-translate-y-4">
                            <div className="content flex flex-col justify-center items-center text-center">
                                <div className="img h-32 w-32 rounded-full p-1 bg-sky-300 mb-4">
                                    <img
                                        src="https://media.licdn.com/dms/image/v2/D5603AQHkxOjh4TJwzA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1707034601913?e=1729123200&v=beta&t=7f0kL83DurSdKPGfMnXwixqxkywwjW7Qg0MYsZHDN_Y"
                                        alt="rafey"
                                        className="h-full w-full rounded-full border-4 border-white object-cover"
                                    />
                                </div>
                                <div className="name text-xl font-medium">
                                    Mohd Rafey
                                </div>
                                <div className="job text-xl text-sky-500">
                                    Web Designer
                                </div>
                                <div className="media-icons flex gap-2 mt-2">
                                    <a
                                        href="#"
                                        className="flex items-center justify-center h-9 w-9 text-white bg-sky-300 rounded-full border-2 border-transparent transition-all duration-300 hover:text-red-500 hover:bg-white hover:border-red-500"
                                    >
                                        <i className="fab fa-facebook-f"></i>
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center justify-center h-9 w-9 text-white bg-sky-300 rounded-full border-2 border-transparent transition-all duration-300 hover:text-red-500 hover:bg-white hover:border-red-500"
                                    >
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center justify-center h-9 w-9 text-white bg-sky-300 rounded-full border-2 border-transparent transition-all duration-300 hover:text-red-500 hover:bg-white hover:border-red-500"
                                    >
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center justify-center h-9 w-9 text-white bg-sky-300 rounded-full border-2 border-transparent transition-all duration-300 hover:text-red-500 hover:bg-white hover:border-red-500"
                                    >
                                        <i className="fab fa-youtube"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="card w-1/4 bg-white rounded-lg p-8 shadow-lg transform transition-transform duration-400 hover:-translate-y-4">
                            <div className="content flex flex-col justify-center items-center text-center">
                                <div className="img h-32 w-32 rounded-full p-1 bg-sky-300 mb-4">
                                    <img
                                        src={girlimg}
                                        alt=""
                                        className="h-full w-full rounded-full border-4 border-white object-cover"
                                    />
                                </div>
                                <div className="name text-xl font-medium">
                                    Najmus Sahar
                                </div>
                                <div className="job text-xl text-sky-500">
                                    Frontend Developer
                                </div>
                                <div className="media-icons gap-2 flex mt-2">
                                    <a
                                        href="#"
                                        className="flex items-center justify-center h-9 w-9 text-white bg-sky-300 rounded-full border-2 border-transparent transition-all duration-300 hover:text-red-500 hover:bg-white hover:border-red-500"
                                    >
                                        <i className="fab fa-facebook-f"></i>
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center justify-center h-9 w-9 text-white bg-sky-300 rounded-full border-2 border-transparent transition-all duration-300 hover:text-red-500 hover:bg-white hover:border-red-500"
                                    >
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center justify-center h-9 w-9 text-white bg-sky-300 rounded-full border-2 border-transparent transition-all duration-300 hover:text-red-500 hover:bg-white hover:border-red-500"
                                    >
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center justify-center h-9 w-9 text-white bg-sky-300 rounded-full border-2 border-transparent transition-all duration-300 hover:text-red-500 hover:bg-white hover:border-red-500"
                                    >
                                        <i className="fab fa-youtube"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="card w-1/4 bg-white rounded-lg p-8 shadow-lg transform transition-transform duration-400 hover:-translate-y-4">
                            <div className="content flex flex-col justify-center items-center text-center">
                                <div className="img h-32 w-32 rounded-full p-1 bg-sky-300 mb-4">
                                    <img
                                        src={girlimg}
                                        alt=""
                                        className="h-full w-full rounded-full border-4 border-white object-cover"
                                    />
                                </div>
                                <div className="name text-xl font-medium">
                                    Muskan Khatoon
                                </div>
                                <div className="job text-xl text-sky-500">
                                    Web Designer
                                </div>
                                <div className="media-icons gap-2 flex mt-2">
                                    <a
                                        href="#"
                                        className="flex items-center justify-center h-9 w-9 text-white bg-sky-300 rounded-full border-2 border-transparent transition-all duration-300 hover:text-red-500 hover:bg-white hover:border-red-500"
                                    >
                                        <i className="fab fa-facebook-f"></i>
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center justify-center h-9 w-9 text-white bg-sky-300 rounded-full border-2 border-transparent transition-all duration-300 hover:text-red-500 hover:bg-white hover:border-red-500"
                                    >
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center justify-center h-9 w-9 text-white bg-sky-300 rounded-full border-2 border-transparent transition-all duration-300 hover:text-red-500 hover:bg-white hover:border-red-500"
                                    >
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center justify-center h-9 w-9 text-white bg-sky-300 rounded-full border-2 border-transparent transition-all duration-300 hover:text-red-500 hover:bg-white hover:border-red-500"
                                    >
                                        <i className="fab fa-youtube"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedSeniors;
