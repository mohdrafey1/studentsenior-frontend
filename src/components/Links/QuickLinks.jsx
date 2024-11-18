import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { colleges } from '../../hooks/useCollegeId';
import '../../app.css';
import { toast } from 'react-toastify';

function QuickLinks() {
    const [visible, setVisible] = useState(false);
    const [selectedCollege, setSelectedCollege] = useState('');
    const [navigatePath, setNavigatePath] = useState('');
    const navigate = useNavigate();

    const handleOpenModal = (path) => {
        setNavigatePath(path);
        setVisible(true);
    };

    const handleCloseModal = () => {
        setVisible(false);
    };

    const handleNavigate = () => {
        if (selectedCollege) {
            const formattedCollegeName = selectedCollege
                .replace(/\s+/g, '')
                .toLowerCase();
            navigate(`/college/${formattedCollegeName}/${navigatePath}`);
            setVisible(false);
        } else {
            toast.warning('Please select a college first!');
        }
    };

    console.log(selectedCollege);

    return (
        <div className="container mx-auto my-4 p-4 ">
            <h1 className="text-center text-3xl">
                <span className="heading-class font-bold">Quick Access</span>
            </h1>
            <div className="flex justify-center items-center">
                <div className="p-5 flex flex-wrap gap-8 w-full justify-center">
                    <div
                        className="px-4 py-2 rounded-full shadow-lg border-8 border-sky-100 w-28 h-28 sm:h-36 sm:w-36 flex justify-center items-center cursor-pointer 
                      bg-gradient-to-t from-sky-300 to-white
                        hover:bg-gradient-to-r hover:from-blue-300 hover:to-white
                        transition-all duration-700 ease-in-out"
                        onClick={() => handleOpenModal('seniors')}
                    >
                        <div className="flex flex-col items-center sm:text-xl font-medium">
                            <i className="fa-solid fa-user-tie"></i>
                            <p>Seniors</p>
                        </div>
                    </div>
                    <div
                        className="px-4 py-2 rounded-full shadow-lg border-8 border-sky-100 w-28 h-28 sm:h-36 sm:w-36 flex justify-center items-center cursor-pointer 
                          bg-gradient-to-t from-sky-300 to-white
                            hover:bg-gradient-to-r hover:from-blue-300 hover:to-white
                            transition-all duration-700 ease-in-out"
                        onClick={() => handleOpenModal('pyq')}
                    >
                        <div className="flex flex-col items-center sm:text-xl font-medium">
                            <i className="fa-solid fa-bolt"></i>
                            <p>PYQs</p>
                        </div>
                    </div>
                    <div
                        className="px-4 py-2 rounded-full shadow-lg border-8 border-sky-100 w-28 h-28 sm:h-36 sm:w-36 flex justify-center items-center cursor-pointer 
                          bg-gradient-to-t from-sky-300 to-white
                            hover:bg-gradient-to-r hover:from-blue-300 hover:to-white
                            transition-all duration-700 ease-in-out"
                        onClick={() => handleOpenModal('store')}
                    >
                        <div className="flex flex-col items-center sm:text-xl font-medium">
                            <i className="fa-solid fa-store"></i>
                            <p>Store</p>
                        </div>
                    </div>
                    <div
                        className="px-4 py-2 rounded-full shadow-lg border-8 border-sky-100 w-28 h-28 sm:h-36 sm:w-36 flex justify-center items-center cursor-pointer 
                        bg-gradient-to-t from-sky-300 to-white
                          hover:bg-gradient-to-r hover:from-blue-300 hover:to-white
                          transition-all duration-700 ease-in-out"
                        onClick={() => handleOpenModal('community')}
                    >
                        <div className="flex flex-col items-center sm:text-xl font-medium">
                            <i className="fa-solid fa-users"></i>
                            <p>Community</p>
                        </div>
                    </div>
                    <div
                        className="px-4 py-2 rounded-full shadow-lg border-8 border-sky-100 w-28 h-28 sm:h-36 sm:w-36 flex justify-center items-center cursor-pointer 
                          bg-gradient-to-t from-sky-300 to-white
                            hover:bg-gradient-to-r hover:from-blue-300 hover:to-white
                            transition-all duration-700 ease-in-out"
                        onClick={() => handleOpenModal('whatsapp-group')}
                    >
                        <div className="flex flex-col items-center sm:text-xl font-medium">
                            <i className="fa-brands fa-square-whatsapp"></i>
                            <p>Groups</p>
                        </div>
                    </div>
                    <div
                        className="px-4 py-2 rounded-full shadow-lg border-8 border-sky-100 w-28 h-28 sm:h-36 sm:w-36 flex justify-center items-center cursor-pointer 
                        bg-gradient-to-t from-sky-300 to-white
                          hover:bg-gradient-to-r hover:from-blue-300 hover:to-white
                          transition-all duration-700 ease-in-out"
                        onClick={() => handleOpenModal('opportunities')}
                    >
                        <div className="flex flex-col items-center sm:text-xl font-medium">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <p>Opportunity</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {visible && (
                <div className="fixed inset-0 bg-sky-100 bg-opacity-100 flex justify-center items-center z-50">
                    <div className="bg-white rounded-2xl border-2 border-sky-500 sm:border-4 sm:border-sky-300 p-5 shadow-2xl w-64 sm:w-96">
                        <h3 className="text-lg font-bold mb-4">
                            Select Your College
                        </h3>
                        <select
                            className="w-full p-2 border rounded mb-4"
                            onChange={(e) => setSelectedCollege(e.target.value)}
                            value={selectedCollege}
                            required
                        >
                            <option value="">Select Your College</option>
                            {colleges.map((college) => (
                                <option
                                    key={college.id}
                                    value={college.name.replace(/\s+/g, '-')}
                                    data={college.id}
                                >
                                    {college.name}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={handleCloseModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-blue-600"
                                onClick={handleNavigate}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuickLinks;
