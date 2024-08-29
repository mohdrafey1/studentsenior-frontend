import React, { useState,useEffect } from 'react';
import CollegeLinks from '../components/Links/CollegeLinks';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const WhatsAppGroupPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [groups, setGroupLink] = useState([]);
    
    useEffect(()=>{

        const Fetchlink = async () => {
            try{
      const response = await fetch('https://panel.studentsenior.com/api/whatsappgroup');
      const data = await response.json();
      setGroupLink(data);
            }catch(error){
    console.log("Error fetching whatsapp links : ",error);
            }
        }
        Fetchlink();
    }, []);
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
                <div className="mb-5">
                    <input
                        type="text"
                        placeholder="Search by title or domain..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border rounded-md w-full sm:w-1/2 mx-auto block"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredGroups.map((group) => (
                        <div
                            key={group._id}
                            className="bg-white p-5 shadow-md rounded-md"
                        >
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
            </div>
            <Footer />
        </div>
    );
};

export default WhatsAppGroupPage;
