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
                <div className="bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 text-blue-900 rounded-xl shadow-md p-6 flex flex-col sm:flex-row items-center justify-between max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 text-center sm:text-left">
                        <span className="text-3xl">📲</span>
                        <p className="text-lg font-semibold">
                            Install the app now for quicker access and a better experience!
                        </p>
                    </div>
                    <Link to='/install'><button
                        className="mt-4 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-md transition-all duration-300"
                    >
                        Install Now
                    </button></Link>
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
