import React, { useState } from "react";
import { api } from "../config/apiConfiguration";
import useApiRequest from "../hooks/useApiRequest";
import Dialog from "../utils/Dialog";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    description: "",
  });
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [message, setMesssage] = useState("Your message has been sent");
  const { apiRequest, loading, error } = useApiRequest();
  const url = api.contactus;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiRequest(url, "POST", formData);
      setMesssage(response.message);
      setDialogOpen(true);
      setFormData({ email: "", subject: "", description: "" });
    } catch (error) {
      console.log("Error:", error);
      setMesssage("Error:", error);
      setDialogOpen(true)
    }
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div 
    className="flex justify-center items-center h-full lg:min-h-screen bg-gradient-to-t from-blue-200 to bg-white py-20 px-6">
  <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg">
    <h2 className="text-4xl font-semibold text-gray-700 text-center mb-8">Get in Touch</h2>
    {error && (
      <p className="text-red-500 text-center mb-4">Something went wrong. Please try again.</p>
    )}
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative group">
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder=" "
          className="peer w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          required
        />
        <label
          htmlFor="email"
          className="absolute cursor-text left-4 -top-3 text-gray-500 bg-white px-1 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-500 group-hover:text-blue-500 group-hover:-top-3 group-hover:text-sm"
        >
          Email
        </label>
      </div>
      <div className="relative group">
        <input
          id="subject"
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder=" "
          className="peer w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          required
        />
        <label
          htmlFor="subject"
          className="absolute cursor-text left-4 -top-3 text-gray-500 bg-white px-1 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-500 group-hover:text-blue-500 group-hover:-top-3 group-hover:text-sm"
        >
          Subject
        </label>
      </div>
      <div className="relative group">
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder=" "
          rows="4"
          className="peer w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          required
        ></textarea>
        <label
          htmlFor="description"
          className="absolute cursor-text left-4 -top-3 text-gray-500 bg-white px-1 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-500 group-hover:text-blue-500 group-hover:-top-3 group-hover:text-sm"
        >
          Description
        </label>
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 mt-4 text-lg font-bold text-white rounded-full shadow-lg transition-all transform ${
          loading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 hover:scale-105"
        }`}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 mr-2 inline-block text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  </div>
  <Dialog 
        isOpen={isDialogOpen} 
        onClose={handleCloseDialog} 
        title="Thank You"
        footer={
          <button 
            onClick={handleCloseDialog} 
            className= "relative px-8 py-1 bg-red-500 text-white rounded-2xl hover:bg-red-600"
          >
            Close
          </button>
        }
      >
        <p>{message}</p>
      </Dialog>
</div>

  );
};

export default ContactUs;
