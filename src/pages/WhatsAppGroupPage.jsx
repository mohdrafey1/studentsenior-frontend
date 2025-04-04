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
import useRequireLogin from '../hooks/useRequireLogin.js';
import { api } from '../config/apiConfiguration.js';
import Seo from '../components/SEO/Seo.jsx';
import Button from '../ui/Button.jsx';

const WhatsAppGroupPage = () => {
    const { collegeName } = useParams();
    const requireLogin = useRequireLogin();
    const collegeId = useCollegeId(collegeName);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [text, setText] = useState('Submit');
    const [domainFilter, setDomainFilter] = useState('');
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
    }, [collegeId, dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGroupData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddGroup = (e) => {
        e.preventDefault();
        requireLogin(() => {
            handleSubmit(e);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setText('Submitting...');
        try {
            await apiRequest(`${api.group}`, 'POST', {
                ...groupData,
                college: collegeId,
            });
            toast.success(
                'Group submitted successfully! It will be available once approved.'
            );
            setIsModalOpen(false);
            setText('Submit');
        } catch (error) {
            console.error(error);
            toast.error('Failed to submit group. Please try again.');
            setText('Submit');
        }
    };

    // Extract unique domains for the filter
    const uniqueDomains = [...new Set(groups.map(group => group.domain))];

    const filteredGroups = groups.filter(
        (group) => {
            const matchesSearch = group.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                group.info.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDomain = domainFilter === '' || group.domain === domainFilter;
            return matchesSearch && matchesDomain;
        }
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-sky-100">
            <CollegeLinks />
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-3">
                        WhatsApp Groups - {capitalizeWords(collegeName)}
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
                        Connect with peers, share resources, and stay updated with the latest information through these WhatsApp groups.
                    </p>
                    <Seo
                        title={`WhatsApp Groups - ${capitalizeWords(collegeName)}`}
                        desc="Join WhatsApp groups to connect with like-minded people and stay updated with campus activities and resources."
                    />
                </div>

                {/* Search and Filter Section */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full sm:w-2/3">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                <i className="fas fa-search"></i>
                            </span>
                            <input
                                type="text"
                                placeholder="Search by title or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                            />
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <Button
                                onClick={openModal}
                                className="flex-1 sm:flex-none p-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all focus:ring-4 focus:ring-sky-300"
                            >
                                <i className="fas fa-plus mr-2"></i> Add Group
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Groups Grid */}
                {loadingGroups ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-500"></div>
                    </div>
                ) : groups.length > 0 ? (
                    <>
                        <p className="text-gray-600 mb-4 text-sm">
                            Showing {filteredGroups.length} of {groups.length} groups
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredGroups.map((group) => (
                                <div
                                    key={group._id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col h-full border border-gray-100"
                                >
                                    <div className="mb-2">
                                        <span className="inline-block px-3 py-1 text-xs font-semibold text-sky-700 bg-sky-100 rounded-full mb-3">
                                            {group.domain}
                                        </span>
                                        <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                                            {group.title}
                                        </h2>
                                        <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                                            {group.info}
                                        </p>
                                    </div>
                                    <div className="mt-auto">
                                        <a
                                            href={group.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg shadow transition-all"
                                        >
                                            <i className="fa-brands fa-whatsapp text-lg mr-2"></i>
                                            Join Group
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                        <i className="fas fa-users-slash text-5xl text-gray-400 mb-4"></i>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No Groups Found</h3>
                        <p className="text-gray-500 mb-6">Be the first to add a WhatsApp group for {capitalizeWords(collegeName)}</p>
                        <Button onClick={openModal} className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-md">
                            Add New Group
                        </Button>
                    </div>
                )}
            </div>

            {/* Add Group Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/2">
                        <h2 className="text-xl font-bold mb-4 text-center">Add WhatsApp Group</h2>
                        <form onSubmit={handleAddGroup} className="space-y-3">
                            <input
                                type="text"
                                name="title"
                                placeholder="Group Title"
                                value={groupData.title}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                            <input
                                type="text"
                                name="domain"
                                placeholder="Domain (e.g. CS, Mechanical, etc.)"
                                value={groupData.domain}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                            <textarea
                                name="info"
                                placeholder="Group Description"
                                value={groupData.info}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                            <input
                                type="url"
                                name="link"
                                placeholder="WhatsApp Group Link"
                                value={groupData.link}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-400 text-white rounded-md"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-md"
                                >
                                    {text}
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