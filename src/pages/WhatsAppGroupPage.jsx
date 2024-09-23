import React, { useState, useEffect } from 'react';
import CollegeLinks from '../components/Links/CollegeLinks';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { API_BASE_URL, API_KEY } from '../config/apiConfiguration.js';

const WhatsAppGroupPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [groups, setGroupLink] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [text, setText] = useState('Submit');
    const [groupData, setGroupData] = useState({
        college: '',
        title: '',
        info: '',
        domain: '',
        link: '',
    });

    const openModal = () => {
        setIsModalOpen(true);
        setGroupData({
            college: '',
            title: '',
            info: '',
            domain: '',
            link: '',
        });
    };

    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        const fetchLink = async () => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/whatsappgroup`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': API_KEY,
                        },
                    }
                );
                setIsLoading(false);
                const data = await response.json();
                const collegeid = localStorage.getItem(getCollegeId());
                const selectedColleges = data.filter(
                    (item) => item.college === collegeid
                );
                if (selectedColleges.length > 0) {
                    setGroupLink(selectedColleges);
                }
            } catch (error) {
                console.log('Error fetching WhatsApp links: ', error);
            }
        };
        fetchLink();
        saveToLocalStorage();
    }, []);

    const colleges = [
        { id: '66cb9952a9c088fc11800714', name: 'Integral University' },
        { id: '66cba84ce0e3a7e528642837', name: 'MPGI Kanpur' },
        { id: '66d08aff784c9f07a53507b9', name: 'GCET Noida' },
        { id: '66d40833ec7d66559acbf24c', name: 'KMC UNIVERSITY' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGroupData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setText('Wait ...');
        try {
            const resp = await fetch(
                `${API_BASE_URL}/api/whatsappgroup`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(groupData),
                }
            );

            if (!resp.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await resp.json();
            setShowAlert(true);
            setIsModalOpen(false);
            setText('Submit');

            // Reset the groupData state
            setGroupData({
                college: '',
                title: '',
                info: '',
                domain: '',
                link: '',
            });
        } catch (error) {
            console.error(error);
        }
    };

    const saveToLocalStorage = () => {
        colleges.forEach((data) => {
            const formattedCollegeName = data.name.replace(/\s+/g, '-').toLowerCase();
            localStorage.setItem(formattedCollegeName, data.id);
        });
    };

    const getCollegeId = () => {
        const currentURL = window.location.href;
        const regex = /college\/([^\/]+)\//;
        const match = currentURL.match(regex);
        if (match) {
            return match[1];
        }
    };

    const filteredGroups = groups.filter(
        (group) =>
            group.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            group.domain.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container bg-sky-100 min-h-screen min-w-full">
            <Header />
            <CollegeLinks />
            <div className="max-w-7xl mx-auto p-5">
                <h1 className="text-3xl font-bold mb-5 text-center">WhatsApp Groups</h1>
                <p className='italic text-center'>"Join WhatsApp groups to connect with like-minded people and stay updated."</p><br />
                <div className="mb-5 flex w-full sm:w-1/2 mx-auto">
                    <input
                        type="text"
                        placeholder="Search by title or domain..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border rounded-md w-3/4 block"
                    />
                    <button
                        className="px-2 py-1 mx-2 bg-blue-500 text-white rounded-md mb-2 sm:mb-0"
                        onClick={openModal}
                    >
                        Add Group
                    </button>
                </div>

                {groups.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredGroups.map((group) => (
                            <div key={group._id} className="bg-white p-5 shadow-md rounded-md">
                                <h2 className="text-xl font-bold mb-2 text-center">{group.title}</h2>
                                <p className="mb-3 text-center">{group.info}</p>
                                <div className="flex justify-center">
                                    <a
                                        href={group.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
                                    >
                                        Join Group &nbsp;
                                        <i className="fa-brands fa-whatsapp"></i>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={`${isLoading ? 'block' : 'hidden'} text-center w-full`}>
                        <div role="status">
                            <svg
                                aria-hidden="true"
                                className="inline w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 66.0814 12.1905 70.7824 14.1209C75.4835 16.0514 79.4052 18.4618 82.9602 21.2794C85.969 23.7307 88.6364 26.7018 90.9726 30.1997C92.0551 32.5764 93.4383 36.4742 93.9676 39.0409Z"
                                    fill="currentFill"
                                />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                )}
            </div>
            <Footer />

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-5 w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">Add WhatsApp Group</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2" htmlFor="college">College</label>
                                <select
                                    name="college"
                                    id="college"
                                    value={groupData.college}
                                    onChange={handleChange}
                                    className="p-2 border rounded-md w-full"
                                    required
                                >
                                    <option value="">Select College</option>
                                    {colleges.map((college) => (
                                        <option key={college.id} value={college.name}>
                                            {college.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2" htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={groupData.title}
                                    onChange={handleChange}
                                    className="p-2 border rounded-md w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2" htmlFor="info">Info</label>
                                <textarea
                                    name="info"
                                    id="info"
                                    value={groupData.info}
                                    onChange={handleChange}
                                    className="p-2 border rounded-md w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2" htmlFor="domain">Domain</label>
                                <input
                                    type="text"
                                    name="domain"
                                    id="domain"
                                    value={groupData.domain}
                                    onChange={handleChange}
                                    className="p-2 border rounded-md w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2" htmlFor="link">Link</label>
                                <input
                                    type="url"
                                    name="link"
                                    id="link"
                                    value={groupData.link}
                                    onChange={handleChange}
                                    className="p-2 border rounded-md w-full"
                                    required
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-300 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                >
                                    {text}
                                </button>
                            </div>
                        </form>
                        {showAlert && (
                            <div className="mt-4 p-2 bg-green-200 text-green-800 rounded-md">
                                Group added successfully!
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WhatsAppGroupPage;
