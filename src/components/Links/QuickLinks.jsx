import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { colleges } from '../../hooks/useCollegeId';
import { toast } from 'react-toastify';

const QuickAccessButton = ({ icon, label, onClick }) => {
    return (
        <div
            className="px-4 py-2 rounded-full shadow-lg border-8 border-blue-200 w-28 h-28 sm:h-36 sm:w-36 flex justify-center items-center cursor-pointer 
                      bg-gradient-to-t from-blue-500 to-white hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-200
                      transition-all duration-700 ease-in-out"
            onClick={onClick}
            role="button"
            aria-label={`Open ${label}`}
        >
            <div className="flex flex-col items-center sm:text-xl font-medium text-blue-900">
                <i className={icon}></i>
                <p>{label}</p>
            </div>
        </div>
    );
};

const CollegeSelectionModal = ({ visible, onClose, onConfirm, selectedCollege, setSelectedCollege }) => {
    useEffect(() => {
        if (selectedCollege) {
            onConfirm();
        }
    }, [selectedCollege]); // Runs on state update

    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-blue-100 bg-opacity-90 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl border-4 border-blue-400 p-6 shadow-2xl w-64 sm:w-96">
                <div className='flex justify-between text-xl'>
                    <h3 className="text-lg font-bold mb-4 text-blue-900">Select Your College</h3>
                    <p onClick={onClose}><i className='fa-solid fa-remove cursor-pointer'></i></p>
                </div>
                <select
                    className="w-full p-2 border rounded mb-4 focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setSelectedCollege(e.target.value)}
                    value={selectedCollege}
                    required
                    aria-label="Select College"
                >
                    <option value="">Select Your College</option>
                    {colleges.map((college) => (
                        <option key={college.id} value={college.name.replace(/\s+/g, '-')}>
                            {college.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

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
            const formattedCollegeName = selectedCollege.replace(/\s+/g, '').toLowerCase();
            navigate(`/college/${formattedCollegeName}/${navigatePath}`);
            setVisible(false);
        } else {
            toast.warning('Please select a college first!');
        }
    };

    const quickAccessItems = [
        { icon: 'fa-solid fa-user-tie', label: 'Seniors', path: 'seniors' },
        { icon: 'fa-solid fa-magnifying-glass', label: 'Resources', path: 'resources' },
        { icon: 'fa-solid fa-bolt', label: 'PYQs', path: 'pyq' },
        { icon: 'fa-solid fa-store', label: 'Store', path: 'store' },
        { icon: 'fa-solid fa-users', label: 'Community', path: 'community' },
        { icon: 'fa-brands fa-whatsapp', label: 'Groups', path: 'whatsapp-group' },
    ];

    return (
        <div className="container mx-auto my-4 p-4">
            <h1 className="text-center text-3xl p-4">
                <span className="text-3xl sm:text-4xl font-extrabold text-blue-900">Quick Access</span>
            </h1>
            <div className="flex justify-center items-center">
                <div className="p-5 flex flex-wrap gap-8 w-full justify-center">
                    {quickAccessItems.map((item, index) => (
                        <QuickAccessButton key={index} icon={item.icon} label={item.label} onClick={() => handleOpenModal(item.path)} />
                    ))}
                </div>
            </div>
            <div className="mt-10 px-4">
                <div className="bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 text-blue-900 rounded-xl shadow-md p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between max-w-4xl mx-auto relative overflow-hidden">
                    {/* Floating bubbles background for mobile */}
                    <div className="sm:hidden absolute inset-0 overflow-hidden">
                        <div className="absolute -top-2 -left-2 w-16 h-16 rounded-full bg-blue-300/30"></div>
                        <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-blue-400/30"></div>
                        <div className="absolute top-1/4 right-1/3 w-12 h-12 rounded-full bg-blue-200/40"></div>
                    </div>

                    <div className="relative flex items-center gap-3 sm:gap-4 text-center sm:text-left">
                        {/* Animated phone icon for mobile */}
                        <span className="text-2xl sm:text-3xl animate-bounce sm:animate-none">📲</span>
                        <p className="text-sm sm:text-lg font-semibold z-10">
                            Install the app for quicker access!
                            <span className="block sm:inline text-xs sm:text-base font-normal mt-1 sm:mt-0 sm:ml-2">Better experience on mobile!</span>
                        </p>
                    </div>

                    <a
                        target='_blank'
                        href='https://studentsenior.com/install'
                        aria-label='Install'
                        className="relative z-10 w-full sm:w-auto mt-4 sm:mt-0">
                        <button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 sm:py-2 sm:px-5 rounded-md transition-all duration-300 active:scale-95 shadow-sm hover:shadow-md">
                            Install Now
                            <span className="sm:hidden ml-2">→</span>
                        </button>
                    </a>

                    {/* Pulse animation for mobile */}
                    <div className="sm:hidden absolute inset-0 rounded-xl border-2 border-blue-300/50 animate-ping opacity-0 pointer-events-none"></div>
                </div>
            </div>

            <CollegeSelectionModal
                visible={visible}
                onClose={handleCloseModal}
                onConfirm={handleNavigate}
                selectedCollege={selectedCollege}
                setSelectedCollege={setSelectedCollege}
            />
        </div>
    );
}

export default QuickLinks;
