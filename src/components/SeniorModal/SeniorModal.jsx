import React, { useState,useEffect } from 'react';
import { useSelector } from 'react-redux';
import { API_BASE_URL,API_KEY } from '../../config/apiConfiguration';
import { Link } from 'react-router-dom';

const SeniorModal = ({ senior, onClose, onEdit, onDelete }) => {
    const object = JSON.parse(senior);
    const [isEditing, setIsEditing] = useState(onEdit);
    const [currentSenior, setCurrentSenior] = useState(object.currentUser);
    const { currentUser } = useSelector((state) => state.user);
    const [editData, setEditData] = useState({});
    const [colleges, setColleges] = useState([]);
    const [exit, setExit] = useState(false);
    const [currentSeniorData, setCurrentSeniorData] = useState(false);
    // Handle form input changes for editing
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // setEditData({ ...editData, [name]: value ,"user_id":currentSenior._id});
        setEditData({ ...editData, [name]: value });
        console.log(editData);
    };

    // Handle the edit action
    const handleEdit = () => {
        setIsEditing(true);
    };

    const fetchCurrentSenior = async () =>{
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/seniors`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY,
                    },
                }
            );
            const data = await response.json();
            if (response.ok) {
                showData();
            } else {
                alert(data.description || 'Error showing data');
            }
            
            console.log(data);
        } catch (error) {
            console.log('Error loading data : ', error);
        }
    }
    // Submit the edited senior data
    const submitEdit = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/seniors`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY,
                    },
                    body:JSON.stringify(editData)
                }
            );
            const data = await response.json();
            if (response.ok) {
                exitOpen();
            } else {
                alert(data.description || 'Error adding seniors');
            }
            
            console.log(data);
        } catch (error) {
            console.log('Error posting senior data : ', error);
        }
        
    };

    // Handle the delete action
    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this senior?')) {
            onDelete(senior._id);
        }
    };

    useEffect(() => {
        const Fetchlink = async () => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/colleges`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': API_KEY,
                        },
                    }
                );
                const data = await response.json();
                    setColleges(data);
            } catch (error) {
                console.log('Error fetching college data : ', error);
            }
        };
        Fetchlink();

    }, []);

   
    const exitOpen = () =>{
        setExit(true);
    }
    const exitClose = () =>{
        setExit(false);
    }
    const showData = () =>{
setCurrentSeniorData(true);
    }
    const hideData = () =>{
setCurrentSeniorData(false);
    }
    return (
        <>
        {!exit ? (<div
            className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-white p-8 m-4 rounded-lg max-w-lg w-full shadow-lg">
                {/* Profile Photo */}
                {senior.profilePicture && (
                    <div className="flex justify-center mb-4">
                        <img
                            src={senior.profilePicture}
                            alt={`${senior.name}'s Profile`}
                            className="w-32 h-32 rounded-full object-cover"
                        />
                    </div>
                )}

                {/* Senior Info */}
                {isEditing ? (
                    <>
                        <input
                            name="name"
                            value={editData.username}
                            onChange={handleInputChange}
                            className="w-full mb-2 p-2 border rounded"
                            placeholder='Username'
                        />
                        <input
                            name="branch"
                            value={editData.branch}
                            onChange={handleInputChange}
                            className="w-full mb-2 p-2 border rounded"
                            placeholder='Branch'

                        />
                        <input
                            name="year"
                            value={editData.year}
                            onChange={handleInputChange}
                            className="w-full mb-2 p-2 border rounded"
                            placeholder='Year'

                        />
                        <input
                            name="domain"
                            value={editData.domain}
                            onChange={handleInputChange}
                            className="w-full mb-2 p-2 border rounded"
                            placeholder='Domain'

                        />
                        <input
                            name="whatsapp"
                            value={editData.whatsapp}
                            onChange={handleInputChange}
                            className="w-full mb-2 p-2 border rounded"
                            placeholder='WhapsApp'

                        />
                        <input
                            name="telegram"
                            value={editData.telegram}
                            onChange={handleInputChange}
                            className="w-full mb-2 p-2 border rounded"
                            placeholder='Telegram'

                        />
                         <label className="block text-lg">
                                    College Name:
                                </label>
                                <select
                                    name="college"
                                    value={editData.college}
                                    onChange={handleInputChange}
                                    onMouseLeave={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                >
                                    <option value="" >Select a College</option>
                                    {colleges.map((college, index) => (
                                        <option key={index} value={college._id} >
                                            {college.name}
                                        </option>
                                    ))}
                                </select>
                        {/* Add similar inputs for other fields */}
                        <button
                            onClick={submitEdit}
                            className="w-full mt-4 p-2 bg-green-500 text-white rounded-md"
                        >
                            Save
                        </button>
                    </>
                ) : (
                    <>{showData ? (
                    <div>
                        <h2
                            id="modal-title"
                            className="text-2xl font-bold mb-4 text-center"
                        >
                            {senior.name}
                        </h2>
                        <p className="mb-2">
                            <strong>Branch:</strong> {senior.branch}
                        </p>
                        <p className="mb-2">
                            <strong>Year:</strong> {senior.year}
                        </p>
                        <p className="mb-2">
                            <strong>Expertise:</strong> {senior.domain}
                        </p>
                        </div>):null}
                    </>
                )}

                {/* Social Media Links */}
                <div className="flex justify-center space-x-4 mb-4">
                    {senior.whatsapp && (
                        <a
                            href={senior.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-500 hover:text-green-700 transition"
                            aria-label="WhatsApp"
                        >
                            <i className="fab fa-whatsapp"></i> WhatsApp
                        </a>
                    )}
                    {senior.telegram && (
                        <a
                            href={senior.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 transition"
                            aria-label="Telegram"
                        >
                            <i className="fab fa-telegram"></i> Telegram
                        </a>
                    )}
                </div>

                {/* Edit and Delete Buttons */}
                {senior.owner === currentUser && (
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={handleEdit}
                            className="p-2 bg-yellow-500 text-white rounded-md"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="p-2 bg-red-500 text-white rounded-md"
                        >
                            Delete
                        </button>
                    </div>
                )}

                {/* Close Button */}
                <Link to="/">
                <button
                    className="mt-5 w-full p-2 bg-gray-500 text-white rounded-md"
                    aria-label="Close Modal"
                >
                    Close
                </button>
                </Link>
            </div>
        </div>):(
            <div
                className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
                aria-labelledby="modal-title"
                role="dialog"
                aria-modal="true"
            >
                <div className=" p-8 rounded-lg max-w-lg w-full">
           <div className="bg-green-100 border-l-4 border-green-500 text-gray-600 p-4" role="alert">
           <p className="font-bold">Submit Successful </p>
           <p>Your Senior Form has been successfully submitted. Once the admin verifies the information, you will appear as a senior on the platform.</p>
        <Link to="/"> <p className='bg-white text-center p-2 m-2 hover:bg-slate-400 hover:text-black'> Close</p></Link>
         </div>
         </div></div>
        )}
        </>
    );
};

export default SeniorModal;
