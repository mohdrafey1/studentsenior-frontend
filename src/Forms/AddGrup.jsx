import React, { useState } from 'react';

const AddGroup = ({ isOpen, onClose, colleges }) => {
const [showAlert, setshowAlert] = useState(false);
const [submitted, setSubmitted] = useState(false);
  const [groupData, setGroupData] = useState({
    college: '',
    title: '',
    info: '',
    domain: '',
    link: '',
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
  };

  const handleSubmit = async (e) =>{
    e.preventDefault();
   try {
     const resp = await fetch('https://panel.studentsenior.com/api/whatsappgroup',{
        "method":"POST",
        "headers":{
            'Content-Type': 'application/json',
        },
        "body":JSON.stringify(groupData),
     });
     if (!resp.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await resp.json();
      setshowAlert(true);
      setSubmitted(true);
      setTimeout(() => setshowAlert(false), setSubmitted(false), 3000);

   } catch (error) {
    throw error;
   }
  }

  if (!isOpen) return null; // Do not render if not open

  return (
    <>
     {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline">Group submitted successfully and is pending approval.</span>
          </div>
          </div>
        )}
     {!submitted ? (<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg m-4">
        <h2 className="mb-6 text-2xl font-bold">Add New Group</h2>
        
        <form className="space-y-4" onSubmit={handleSubmit} >
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
          <div className="flex justify-end space-x-4">
            <button onClick={console.log(groupData)} className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
              Submit
            </button>
            <button type="button" onClick={onClose} className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700">
              Close
            </button>
          </div>
        </form>
      </div> 
    </div>):(null)}
    </>
  );
};

export default AddGroup;
