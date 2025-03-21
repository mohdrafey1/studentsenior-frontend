import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { colleges } from '../../hooks/useCollegeId';
import { toast } from 'react-toastify';

// Reusable Quick Access Button Component
const QuickAccessButton = ({ icon, label, onClick }) => {
    return (
    <div className="container mx-auto my-4 p-4">
        <h2 className="text-center text-2xl font-bold text-gray-700 mb-2">
            Courses starting from 999 to 4999
        </h2>
        <h1 className="text-center text-3xl p-4">
            <span className="text-3xl sm:text-4xl font-extrabold text-gray-800">
                Quick Access
            </span>
        </h1>
        <div className="flex justify-center items-center">
            <div className="p-5 flex flex-wrap gap-8 w-full justify-center">
                {quickAccessItems.map((item, index) => (
                    <QuickAccessButton
                        key={index}
                        icon={item.icon}
                        label={item.label}
                        onClick={() => handleOpenModal(item.path)}
                    />
                ))}
            </div>
        </div>

        {/* College Selection Modal */}
        <CollegeSelectionModal
            visible={visible}
            onClose={handleCloseModal}
            onConfirm={handleNavigate}
            selectedCollege={selectedCollege}
            setSelectedCollege={setSelectedCollege}
        />
    </div>
);

// Reusable College Selection Modal Component
const CollegeSelectionModal = ({
    visible,
    onClose,
    onConfirm,
    selectedCollege,
    setSelectedCollege,
}) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-sky-100 bg-opacity-100 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl border-2 border-sky-500 sm:border-4 sm:border-sky-300 p-5 shadow-2xl w-64 sm:w-96">
                <h3 className="text-lg font-bold mb-4">Select Your College</h3>
                <select
                    className="w-full p-2 border rounded mb-4"
                    onChange={(e) => setSelectedCollege(e.target.value)}
                    value={selectedCollege}
                    required
                    aria-label="Select College"
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
                        onClick={onClose}
                        aria-label="Cancel"
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600"
                        onClick={onConfirm}
                        aria-label="Confirm"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main QuickLinks Component
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

    const quickAccessItems = [
        { icon: 'fa-solid fa-user-tie', label: 'Seniors', path: 'seniors' },
        {
            icon: 'fa-solid fa-magnifying-glass',
            label: 'Resources',
            path: 'resources',
        },
        { icon: 'fa-solid fa-bolt', label: 'PYQs', path: 'pyq' },
        { icon: 'fa-solid fa-store', label: 'Store', path: 'store' },
        { icon: 'fa-solid fa-users', label: 'Community', path: 'community' },
        {
            icon: 'fa-brands fa-whatsapp',
            label: 'Groups',
            path: 'whatsapp-group',
        },
    ];

    return (
        <div className="container mx-auto my-4 p-4">
            <h1 className="text-center text-3xl p-4">
                <span className="text-3xl sm:text-4xl font-extrabold text-gray-800">
                    Quick Access
                </span>
            </h1>
            <div className="flex justify-center items-center">
                <div className="p-5 flex flex-wrap gap-8 w-full justify-center">
                    {quickAccessItems.map((item, index) => (
                        <QuickAccessButton
                            key={index}
                            icon={item.icon}
                            label={item.label}
                            onClick={() => handleOpenModal(item.path)}
                        />
                    ))}
                </div>
            </div>

            {/* College Selection Modal */}
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
