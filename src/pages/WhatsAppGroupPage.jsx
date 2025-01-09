import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CollegeLinks from '../components/Links/CollegeLinks';
import Collegelink2 from '../components/Links/CollegeLink2.jsx';
import { capitalizeWords } from '../utils/Capitalize.js';
import { toast } from 'react-toastify';
import useApiRequest from '../hooks/useApiRequest.js';
import { useCollegeId } from '../hooks/useCollegeId.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups } from '../redux/slices/groupSlice.js';

const WhatsAppGroupPage = () => {
    const { collegeName } = useParams();
    const collegeId = useCollegeId(collegeName);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [text, setText] = useState('Submit');
    const [groupData, setGroupData] = useState({
        college: '',
        title: '',
        info: '',
        domain: '',
        link: '',
    });

    const {
        groups = [],
        loading: loadingGroups,
        error,
    } = useSelector((state) => state.groups || {});

    const { apiRequest, loading } = useApiRequest();
    const dispatch = useDispatch();

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
        dispatch(fetchGroups(collegeId));
    }, [collegeId]);

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

    const filteredGroups = groups.filter(
        (group) =>
            group.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            group.domain.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container bg-gradient-to-t from-sky-200 to bg-white min-h-screen min-w-full">
            <CollegeLinks />
            <div className="max-w-7xl mx-auto p-5">
                <h1 className="text-lg sm:text-3xl font-bold mb-2 text-center">
                    WhatsApp Groups - {capitalizeWords(collegeName)}
                </h1>
                <p className="italic text-center text-xs sm:text-base">
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
                                className="bg-white p-5 shadow-md rounded-md flex flex-col"
                            >
                                <div className="sm:h-auto overflow-scroll flex-grow">
                                    <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-2 text-center">
                                        {group.title}
                                    </h2>
                                    <p className="mb-3 text-center text-sm lg:text-base">
                                        {group.info}
                                    </p>
                                </div>
                                <div className="flex justify-center mt-auto">
                                    <a
                                        href={group.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 px-2 py-2 bg-sky-500 hover:bg-sky-300 text-white rounded-md sm:px-4 sm:py-2"
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
                        {loadingGroups ? (
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
