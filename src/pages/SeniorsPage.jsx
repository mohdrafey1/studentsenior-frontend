import React, { useState } from 'react';
import SeniorModal from '../components/SeniorModal/SeniorModal';
import girlimg from '../assets/womenn.jpg';
import CollegeLinks from '../components/Links/CollegeLinks';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const SeniorsPage = () => {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedSenior, setSelectedSenior] = useState(null);

    const seniors = [
        {
            id: 1,
            name: 'Mohd Rafey',
            course: 'B.Tech',
            branch: 'CSE',
            year: 'Third Year',
            image: 'https://media.licdn.com/dms/image/v2/D5603AQHkxOjh4TJwzA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1707034601913?e=1729123200&v=beta&t=7f0kL83DurSdKPGfMnXwixqxkywwjW7Qg0MYsZHDN_Y',
            domain: 'Devops + Web Dev',
            hobbies: 'Coding, Reading',
            whatsapp: 'https://wa.me/123456789',
            telegram: 'https://t.me/username',
            instagram: 'https://instagram.com/username',
        },
        {
            id: 2,
            name: 'Najmus Sahar',
            course: 'B.Tech',
            branch: 'CSE',
            year: 'Third Year',
            image: 'https://media.licdn.com/dms/image/v2/D4D03AQHsGr8kzHfnAw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1721041561276?e=1729123200&v=beta&t=RopWIpm73YuuZsZ_eRL6tzuBKLtQdYtpfzA2SjlQ8uA',
            domain: 'UI/UX Design',
            hobbies: 'Designing, Traveling',
            whatsapp: 'https://wa.me/987654321',
            telegram: 'https://t.me/username2',
            instagram: 'https://instagram.com/username2',
        },
        {
            id: 3,
            name: 'Muskan Khatoon',
            course: 'B.Tech',
            branch: 'CSE',
            year: 'Third Year',
            image: 'https://media.licdn.com/dms/image/v2/D4E03AQFuTaTBMWzUEQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1720321562388?e=1729123200&v=beta&t=Y-gGbgYgJwan__XQN828C0kAkAVMFegCzGLpEdLmX3o',
            domain: 'Web Development',
            hobbies: 'Coding, Reading',
            whatsapp: 'https://wa.me/123456789',
            telegram: 'https://t.me/username',
            instagram: 'https://instagram.com/username',
        },
        {
            id: 4,
            name: 'Najmus Sahar',
            course: 'B.Tech',
            branch: 'CSE',
            year: 'Third Year',
            image: girlimg,
            domain: 'UI/UX Design',
            hobbies: 'Designing, Traveling',
            whatsapp: 'https://wa.me/987654321',
            telegram: 'https://t.me/username2',
            instagram: 'https://instagram.com/username2',
        },
        {
            id: 5,
            name: 'Mohd Rafey',
            course: 'B.Tech',
            branch: 'CSE',
            year: 'Final Year',
            image: girlimg,
            domain: 'Web Development',
            hobbies: 'Coding, Reading',
            whatsapp: 'https://wa.me/123456789',
            telegram: 'https://t.me/username',
            instagram: 'https://instagram.com/username',
        },
        {
            id: 6,
            name: 'Muskan Khatoon',
            course: 'B.Tech',
            branch: 'CSE',
            year: 'Third Year',
            image: girlimg,
            domain: 'UI/UX Design',
            hobbies: 'Designing, Traveling',
            whatsapp: 'https://wa.me/987654321',
            telegram: 'https://t.me/username2',
            instagram: 'https://instagram.com/username2',
        },
    ];

    const filteredSeniors = seniors.filter(
        (senior) =>
            (selectedCourse ? senior.course === selectedCourse : true) &&
            (selectedBranch ? senior.branch === selectedBranch : true)
    );

    return (
        <div className="bg-sky-100">
            <Header />
            <CollegeLinks />
            <div className="container mx-auto p-5">
                <div className="flex flex-col justify-center items-center">
                    <h1 className="text-3xl font-bold mb-5">Seniors</h1>
                    <div className="flex flex-wrap justify-center text-center space-x-4 mb-5">
                        <select
                            className="p-2 border rounded-md mb-2 lg:mb-0"
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            value={selectedCourse}
                        >
                            <option value="">All Courses</option>
                            <option value="B.Tech">B.Tech</option>
                            <option value="BBA">BBA</option>
                            <option value="MBA">MBA</option>
                        </select>
                        <select
                            className="p-2 border rounded-md"
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            value={selectedBranch}
                        >
                            <option value="">All Branches</option>
                            <option value="CSE">CSE</option>
                            <option value="ECE">ECE</option>
                            <option value="Mechanical">Mechanical</option>
                        </select>
                    </div>
                </div>
                <div className="grid w-full sm:w-4/5 mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredSeniors.map((senior) => (
                        <div
                            key={senior.id}
                            className="p-5 bg-white shadow-md rounded-lg text-center"
                        >
                            <img
                                src={senior.image}
                                alt={senior.name}
                                className="w-full h-48 rounded-lg mb-4"
                            />
                            <h2 className="text-xl font-bold mb-2">
                                {senior.name}
                            </h2>
                            <p>
                                {senior.course} - {senior.branch}
                            </p>
                            <p>{senior.year}</p>
                            <button
                                onClick={() => setSelectedSenior(senior)}
                                className="mt-4 p-2 bg-blue-500 text-white rounded-md"
                            >
                                View Detail
                            </button>
                        </div>
                    ))}
                </div>
                {selectedSenior && (
                    <SeniorModal
                        senior={selectedSenior}
                        onClose={() => setSelectedSenior(null)}
                    />
                )}
            </div>
            <Footer />
        </div>
    );
};

export default SeniorsPage;
