import React, { useState } from "react";
import { api } from "../config/apiConfiguration";
import useApiRequest from "../hooks/useApiRequest";
import { colleges } from '../hooks/useCollegeId.js';


const RequestPYQ = () => {

  const url = api.requestPyq;
  const [message, setMesssage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { apiRequest, loading, error } = useApiRequest();

  const [formData, setFormData] = useState({
    subject: "",
    semester: "",
    year: "",
    branch: "",
    examType: "",
    college: "",
    whatsapp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);

      const response = await apiRequest(url, "POST", formData);
      setMesssage(response.message);
      setDialogOpen(true);
      setFormData({
        subject: "",
        semester: "",
        year: "",
        branch: "",
        examType: "",
        college: "",
        whatsapp: "",
      });
    } catch (error) {
      setMesssage("Error:", error);
      setDialogOpen(true)
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };



  return (
    <div className="min-h-screen bg-gradient-to-t from-sky-200 to bg-white flex items-center justify-center p-4">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50 bg-opacity-75">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500"></div>
        </div>
      )}


      {dialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50 bg-opacity-75">
          <div
            role="alert"
            className="lg:mt-3 m-8 relative flex flex-col max-w-sm p-5 text-sm text-white bg-black rounded-md"
          >
            <p className="flex justify-center text-2xl">
              Attention
            </p>
            <p className="ml-4 p-3 text-center">{error ? "Error Requesting PYQ ! , Please mail us about the error" :message}</p>
            <button
              className="absolute top-2 right-3 text-red-600 "
              onClick={closeDialog}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-5 w-5"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md sm:max-w-lg md:max-w-xl">
        <h2 className="text-2xl font-bold text-sky-500 mb-6 text-center">Request PYQ</h2>
        <form onSubmit={handleSubmit}>
          {/* Subject Input */}
          <div className="mb-4">
            <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter subject"
            />
          </div>

          {/* Semester Input */}
          <div className="mb-4">
            <label htmlFor="semester" className="block text-gray-700 font-medium mb-2">
              Semester
            </label>
            <input
              type="text"
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter semester"
            />
          </div>

          {/* Year Input */}
          <div className="mb-4">
            <label htmlFor="year" className="block text-gray-700 font-medium mb-2">
              Year
            </label>
            <input
              type="text"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter year eg. 2023-2024"
            />
          </div>

          {/* Branch Input */}
          <div className="mb-4">
            <label htmlFor="branch" className="block text-gray-700 font-medium mb-2">
              Branch
            </label>
            <input
              type="text"
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter branch"
            />
          </div>

          {/* Exam Type Input */}
          <div className="mb-4">
            <label htmlFor="examType" className="block text-gray-700 font-medium mb-2">
              Exam Type
            </label>
            <input
              type="text"
              id="examType"
              name="examType"
              value={formData.examType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter exam type (e.g., Midsem, Endsem)"
            />
          </div>

          {/* College Input */}
          <div className="mb-4">
            <label htmlFor="college" className="block text-gray-700 font-medium mb-2">
              College
            </label>
            <select
              name="college"
              value={formData.college}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            >
              <option value="">
                Select Your College
              </option>
              {colleges.map((college) => (
                <option
                  key={college.id}
                  value={college.id}
                >
                  {college.name}
                </option>
              ))}
            </select>
          </div>

          {/* Whatsapp Input */}
          <div className="mb-4">
            <label htmlFor="whatsapp" className="block text-gray-700 font-medium mb-2">
              Whatsapp No.
            </label>
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your WhatsApp number"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition duration-300"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestPYQ;
