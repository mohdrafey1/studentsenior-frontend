import React from 'react';

const seniors = [
    {
        name: 'Mohd Rafey',
        job: 'Devops + Web Dev',
        image: 'https://res.cloudinary.com/dqlugeoxg/image/upload/v1725214937/student_senior/u3tqpo9vbzq8wlrnfoab.jpg',
        socials: [
            { icon: 'facebook-f', link: '#' },
            { icon: 'twitter', link: '#' },
            { icon: 'instagram', link: '#' },
            { icon: 'youtube', link: '#' },
        ],
    },
    {
        name: 'Najmus Sahar',
        job: 'Frontend Developer',
        image: 'https://res.cloudinary.com/dqlugeoxg/image/upload/v1725214975/student_senior/zbiisemkblddgqjfcjwz.jpg',
        socials: [
            { icon: 'facebook-f', link: '#' },
            { icon: 'twitter', link: '#' },
            { icon: 'instagram', link: '#' },
            { icon: 'youtube', link: '#' },
        ],
    },
    {
        name: 'Muskan Khatoon',
        job: 'Web Developer',
        image: 'https://res.cloudinary.com/dqlugeoxg/image/upload/v1725429901/student_senior/qehp7dr9wnfthnwphqke.jpg',
        socials: [
            { icon: 'facebook-f', link: '#' },
            { icon: 'twitter', link: '#' },
            { icon: 'instagram', link: '#' },
            { icon: 'youtube', link: '#' },
        ],
    },
];

const FeaturedSeniors = () => {
    return (
        <section className="container mx-auto ">
            <div className="flex flex-col md:flex-row justify-center items-center text-2xl text-center p-4">
                <h3>10 Thousands of Students Learned</h3>
                <div className="text-sky-500 ml-2">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                </div>
            </div>
            <div className="container mt-4">
                <div className="main-card">
                    <div className="mobile-card cards flex gap-6 w-full lg:justify-center md:justify-center">
                        {seniors.map((senior, index) => (
                            <div
                                key={index}
                                className="card w-full sm:w-full lg:w-1/4 bg-white rounded-lg p-8 shadow-lg transform transition-transform duration-400 hover:-translate-y-4"
                            >
                                <div className="content flex flex-col justify-center items-center text-center">
                                    <div className="img h-32 w-32 rounded-full p-1 bg-sky-300 mb-4">
                                        <img
                                            src={senior.image}
                                            alt={senior.name}
                                            className="h-full w-full rounded-full border-4 border-white object-cover"
                                        />
                                    </div>
                                    <div className="name text-xl font-medium">
                                        {senior.name}
                                    </div>
                                    <div className="job text-xl text-sky-500">
                                        {senior.job}
                                    </div>
                                    <div className="media-icons flex gap-2 mt-2">
                                        {senior.socials.map((social, i) => (
                                            <a
                                                key={i}
                                                href={social.link}
                                                className="flex items-center justify-center h-9 w-9 text-white bg-sky-300 rounded-full border-2 border-transparent transition-all duration-300 hover:text-red-500 hover:bg-white hover:border-red-500"
                                            >
                                                <i
                                                    className={`fab fa-${social.icon}`}
                                                ></i>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedSeniors;
