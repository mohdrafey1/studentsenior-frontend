import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CollegeLinks from '../components/Links/CollegeLinks';
import { api } from '../config/apiConfiguration.js';
import Collegelink2 from '../components/Links/CollegeLink2.jsx';
import { capitalizeWords } from '../utils/Capitalize.js';
import { toast } from 'react-toastify';
import useApiRequest from '../hooks/useApiRequest.js';
import useApiFetch from '../hooks/useApiFetch.js';

const WhatsAppGroupPage = () => {
    const { collegeName } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [groups, setGroupLink] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [text, setText] = useState('Submit');
    const [groupData, setGroupData] = useState({
        college: '',
        title: '',
        info: '',
        domain: '',
        link: '',
    });

    const { apiRequest, loading } = useApiRequest();
    const { useFetch, loadingFetch } = useApiFetch();
    const url = api.group;

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
                const data = await useFetch(api.group);
                const collegeid = localStorage.getItem(getCollegeId());
                const selectedColleges = data.filter(
                    (item) => item.college === collegeid
                );
                if (selectedColleges.length > 0) {
                    setGroupLink(LatestFirst(selectedColleges));
                }
            } catch (error) {
                console.error('Error fetching WhatsApp Groups: ', error);
                toast.error('Error fetching WhatsApp Groups ');
            }
        };
        fetchLink();
        saveToLocalStorage();
    }, []);

    const LatestFirst = (data) => {
        let reversedArray = [];
        for (let i = data.length - 1; i >= 0; i--) {
            reversedArray.push(data[i]);
        }
        return reversedArray;
    };

    const colleges = [
        { id: '66cb9952a9c088fc11800714', name: 'Integral University' },
        { id: '66cba84ce0e3a7e528642837', name: 'MPEC Kanpur' },
        { id: '66d08aff784c9f07a53507b9', name: 'GCET Noida' },
        { id: '66d40833ec7d66559acbf24c', name: 'KMC UNIVERSITY' },
    ];

    const selectedCollegeObject = colleges.find(
        (college) =>
            college.name.toLowerCase().replace(/\s+/g, '-') === collegeName
    );

    const collegeId = selectedCollegeObject.id;

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
            await apiRequest(url, 'POST', { ...groupData, college: collegeId });
            toast.success(
                'Group Submitted Successfully , Available Once Approved'
            );
            setIsModalOpen(false);
            setText('Submit');
        } catch (error) {
            console.error(error);
        }
    };

    const saveToLocalStorage = () => {
        colleges.forEach((data) => {
            const formattedCollegeName = data.name
                .replace(/\s+/g, '-')
                .toLowerCase();
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
        <div className="container bg-gradient-to-t from-sky-200 to bg-white min-h-screen min-w-full">
            <CollegeLinks />
            <div className="max-w-7xl mx-auto p-5">
                <h1 className="text-3xl font-bold mb-5 text-center">
                    WhatsApp Groups - {capitalizeWords(collegeName)}
                </h1>
                <p className="italic text-center">
                    "Join WhatsApp groups to connect with like-minded people and
                    stay updated."
                </p>
                <br />
                <div className="mb-5 flex w-full sm:w-1/2 mx-auto">
                    <input
                        type="text"
                        placeholder="Search by title or domain..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border rounded-md w-3/4 block"
                    />
                    <button
                        className="px-2 py-1 m-1.5 text-xs bg-blue-500 text-white rounded-md mb-2 sm:mb-0"
                        onClick={openModal}
                    >
                        Add Group
                    </button>
                </div>

                {groups.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 lg:gap-6">
                        {filteredGroups.map((group) => (
                            <div
                                key={group._id}
                                className="bg-white p-5 shadow-md rounded-md"
                            >
                                <div className="h-3/4">
                                    <h2 className="text-lg lg:text-xl font-bold mb-2 text-center">
                                        {group.title}
                                    </h2>
                                    <p className="mb-3 text-center text-sm lg:text-base">
                                        {group.info}
                                    </p>
                                </div>
                                <div className="flex justify-center">
                                    <a
                                        href={group.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-sky-500 hover:bg-green-600 text-white rounded-md"
                                    >
                                        Join Group &nbsp;
                                        <i className="fa-brands fa-whatsapp"></i>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="col-span-4 flex justify-center items-center w-full">
                        {loadingFetch ? (
                            <i className="fas fa-spinner fa-pulse fa-5x"></i>
                        ) : (
                            <p>No Notes Found</p>
                        )}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-5 w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">
                            Add WhatsApp Group
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2" htmlFor="title">
                                    Title
                                </label>
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
                                <label className="block mb-2" htmlFor="info">
                                    Info
                                </label>
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
                                <label className="block mb-2" htmlFor="domain">
                                    Domain
                                </label>
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
                                <label className="block mb-2" htmlFor="link">
                                    Link
                                </label>
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
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <i className="fas fa-spinner fa-pulse"></i>
                                    ) : (
                                        <p>{text}</p>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <Collegelink2 />
        </div>
    );
};

export default WhatsAppGroupPage;
