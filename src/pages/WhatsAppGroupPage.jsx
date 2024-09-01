import React, { useState, useEffect } from 'react';
import CollegeLinks from '../components/Links/CollegeLinks';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const WhatsAppGroupPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [groups, setGroupLink] = useState([]);
    const [isLoading, setisLoading] = useState(true);
    const [collegeId, setcollegeId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAlert, setshowAlert] = useState(false);
    const [text, setText] = useState("Submit");
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
        const Fetchlink = async () => {
            try {
                const response = await fetch('https://panel.studentsenior.com/api/whatsappgroup');
                setisLoading(false);
                const data = await response.json();
                const collegeid = localStorage.getItem(getCollegeId());
                const selectedColleges = data.filter(item => item.college === collegeid);
                if (selectedColleges.length > 0) {
                    setGroupLink(selectedColleges);
                }
            } catch (error) {
                console.log("Error fetching whatsapp links : ", error);
            }
        }
        Fetchlink();
        saveToLocalStorage();
    }, []);

    const colleges = [
        {
            "id": "66cb9952a9c088fc11800714",
            "name": "Integral University",
        },
        {
            "id": "66cba84ce0e3a7e528642837",
            "name": "MPGI Kanpur",
        },
        {
            "id": "66d08aff784c9f07a53507b9",
            "name": "GCET Noida",
        },
        {
            "id": "66d40833ec7d66559acbf24c",
            "name": "KMC UNIVERSITY",
        }
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
        setText("Wait ...");
        try {
            const resp = await fetch('https://panel.studentsenior.com/api/whatsappgroup', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(groupData),
            });

            if (!resp.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await resp.json();
            setshowAlert(true);
            setIsModalOpen(false); 
            setText("Submit");

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
    }

    const getCollegeId = () => {
        const currentURL = window.location.href;
        const regex = /college\/([^\/]+)\//;
        const match = currentURL.match(regex);
        if (match) {
            setcollegeId(match[1]);
        }
        return match[1];
    }

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
                <h1 className="text-3xl font-bold mb-5 text-center">
                    WhatsApp Groups
                </h1>
                <div className="mb-5 flex w-full sm:w-1/2 mx-auto">
                    <input
                        type="text"
                        placeholder="Search by title or domain..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border rounded-md w-3/4 block"
                    />
                    <button 
                        className='px-2 py-1 mx-2 bg-blue-500 text-white rounded-md mb-2 sm:mb-0'
                        onClick={openModal}
                    >Add Group</button>
                </div>

                {groups.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredGroups.map((group) => (
                            <div key={group._id} className="bg-white p-5 shadow-md rounded-md">
                                <h2 className="text-xl font-bold mb-2 text-center">
                                    {group.title}
                                </h2>
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
                    <>
                        <div className={`${isLoading ? 'block' : 'hidden'} text-center w-full`}>
                            {/* Loading Spinner */}
                        </div>
                        {!isLoading && groups.length === 0 && (
                            <p className="text-center text-gray-500 mt-5 w-full">
                                No WhatsApp Group Found.
                            </p>
                        )}
                    </>
                )}
            </div>
            <Footer />

            {/* Success Alert */}
            {showAlert && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative m-4" role="alert">
                        <strong className="font-bold">Success!</strong>
                        <span className="block sm:inline">Group submitted successfully and is pending approval.</span><br />
                        <button className='bg-green-700 px-3 py-1 rounded-lg text-white' onClick={() => setshowAlert(false)}>Close</button>
                    </div>
                </div>
            )}

            {/* Add Group Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg m-4">
                        <h2 className="mb-6 text-2xl font-bold">Add New Group</h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="block text-lg">College Name:</label>
                                <select
                                    name="college"
                                    value={groupData.college}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                >
                                    <option value="">Select a College</option>
                                    {colleges.map((college, index) => (
                                        <option key={index} value={college.id}>
                                            {college.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-lg">Group Name:</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={groupData.title}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-lg">Group Info:</label>
                                <input
                                    type="text"
                                    name="info"
                                    value={groupData.info}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-lg">Domain:</label>
                                <input
                                    type="text"
                                    name="domain"
                                    value={groupData.domain}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-lg">Link:</label>
                                <input
                                    type="url"
                                    name="link"
                                    value={groupData.link}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                                >
                                    {text}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WhatsAppGroupPage;
