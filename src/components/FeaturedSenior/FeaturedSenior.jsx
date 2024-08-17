import React from 'react';

const seniors = [
    {
        name: 'Mohd Rafey',
        job: 'Devops + Web Dev',
        image: 'https://media.licdn.com/dms/image/v2/D5603AQHkxOjh4TJwzA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1707034601913?e=1729123200&v=beta&t=7f0kL83DurSdKPGfMnXwixqxkywwjW7Qg0MYsZHDN_Y',
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
        image: 'https://media.licdn.com/dms/image/v2/D4D03AQHsGr8kzHfnAw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1721041561276?e=1729123200&v=beta&t=RopWIpm73YuuZsZ_eRL6tzuBKLtQdYtpfzA2SjlQ8uA',
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
        image: 'https://media.licdn.com/dms/image/v2/D4E03AQFuTaTBMWzUEQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1720321562388?e=1729123200&v=beta&t=Y-gGbgYgJwan__XQN828C0kAkAVMFegCzGLpEdLmX3o',
        socials: [
            { icon: 'facebook-f', link: '#' },
            { icon: 'twitter', link: '#' },
            { icon: 'instagram', link: '#' },
            { icon: 'youtube', link: '#' },
        ],
    },
    // Add more seniors as needed
];

const FeaturedSeniors = () => {
    return (
        <section className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row justify-center items-center text-2xl text-center">
                <h3>10 Thousands of Students Learned</h3>&nbsp;&nbsp;
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
                        {seniors.map((senior, index) => (
                            <div
                                key={index}
                                className="card w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-white rounded-lg p-8 shadow-lg transform transition-transform duration-400 hover:-translate-y-4"
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
