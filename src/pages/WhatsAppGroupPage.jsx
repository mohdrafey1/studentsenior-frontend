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

  useEffect(() => {
    dispatch(fetchGroups(collegeId));
  }, [collegeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddGroup = (e) => {
    e.preventDefault();
    requireLogin(() => handleSubmit(e));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setText('Wait ...');
    try {
      await apiRequest(`${api.group}`, 'POST', {
        ...groupData,
        college: collegeId,
      });
      toast.success('Group Submitted Successfully, Available Once Approved');
      setIsModalOpen(false);
      setText('Submit');
    } catch (error) {
      console.error(error);
    }
  };

  const filteredGroups = groups.filter(
    (group) =>
      group.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.domain.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="container bg-gradient-to-t from-blue-300 to min-h-screen min-w-full">
      <CollegeLinks />
      <div className="max-w-6xl mx-auto p-5">
        <h1 className="text-2xl sm:text-4xl font-bold mb-4 text-center text-blue-700">
          WhatsApp Groups - {capitalizeWords(collegeName)}
        </h1>
        <p className="italic text-center text-sm sm:text-lg text-blue-600">
          "Join WhatsApp groups to connect and stay updated."
        </p>
        <br />
        <div className="mb-5 flex flex-col sm:flex-row w-full sm:w-2/3 mx-auto items-center gap-3">
          <input
            type="text"
            placeholder="Search by title or domain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded-md flex-1 focus:ring-2 focus:ring-blue-500"
          />
          <Button onClick={() => setIsModalOpen(true)}>Add Group</Button>
        </div>
        {groups.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredGroups.map((group) => (
              <div
                key={group._id}
                className="bg-white p-5 shadow-lg rounded-lg flex flex-col"
              >
                <h2 className="text-lg sm:text-xl font-bold mb-2 text-center text-blue-800">
                  {group.title}
                </h2>
                <p className="text-center text-sm sm:text-base text-gray-700">
                  {group.info}
                </p>
                <div className="flex justify-center mt-4">
                  <a
                    href={group.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-md text-center"
                  >
                    Join Group &nbsp;
                    <i className="fa-brands fa-whatsapp"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center w-full">
            {loadingGroups ? (
              <i className="fas fa-spinner fa-pulse fa-5x text-blue-500"></i>
            ) : (
              <p className="text-blue-600">No Groups Found</p>
            )}
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-11/12 sm:w-2/5 max-w-md transition-all duration-300 transform scale-100">
            <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white text-center border-b pb-2">
              Add WhatsApp Group
            </h2>

            <form onSubmit={handleAddGroup} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Group Title
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="Enter group title"
                  value={groupData.title}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="domain"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Domain
                </label>
                <input
                  id="domain"
                  type="text"
                  name="domain"
                  placeholder="CS, Mechanical, etc."
                  value={groupData.domain}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="info"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Group Description
                </label>
                <textarea
                  id="info"
                  name="info"
                  placeholder="Describe the purpose of this group"
                  value={groupData.info}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="link"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  WhatsApp Group Link
                </label>
                <input
                  id="link"
                  type="url"
                  name="link"
                  placeholder="https://chat.whatsapp.com/..."
                  value={groupData.link}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 mt-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600"
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
