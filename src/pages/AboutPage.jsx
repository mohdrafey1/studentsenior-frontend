import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

function AboutPage() {
    return (
        <>
            <Header />
            <div className="bg-gray-100 text-gray-800">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-blue-500 to-teal-500 text-white py-20">
                    <div className="container mx-auto px-6 text-center">
                        <h1 className="text-4xl font-bold mb-4">About Us</h1>
                        <div className="text-base">
                            <ul>
                                <li>
                                    A one-stop platform for students to select
                                    courses, access previous year's question
                                    papers (PYQ's), and download comprehensive
                                    notes, simplifying exam preparation.
                                </li>
                                <li>
                                    Connecting students with experienced seniors
                                    for guidance, support, and mentorship
                                    through live chats and community forums,
                                    ensuring informed decisions and academic
                                    success.
                                </li>
                                <li>
                                    A college-focused marketplace where students
                                    can select their institution, buy, and sell
                                    used stationery, books, and resources,
                                    fostering a sustainable and cost-effective
                                    community.
                                </li>
                                <li>
                                    A course-centric platform connecting
                                    students with relevant internship
                                    opportunities, allowing them to select their
                                    course and apply for internships,
                                    kickstarting their professional journey.
                                </li>
                                <li>
                                    A college discovery platform where students
                                    can select their institution and access
                                    direct links to official websites,
                                    admissions, and essential college resources
                                    effortlessly.
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-16 container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-6">
                        Our Mission
                    </h2>
                    <p className="text-center max-w-2xl mx-auto mb-10">
                        Our mission is to empower students by providing easy
                        access to guidance, resources, and opportunities that
                        help them excel in their academic and professional
                        journeys.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 shadow-md rounded-lg">
                            <h3 className="text-xl font-semibold mb-3">
                                Guidance
                            </h3>
                            <p>
                                Connect with experienced seniors who can guide
                                you through your academic challenges and career
                                choices.
                            </p>
                        </div>
                        <div className="bg-white p-6 shadow-md rounded-lg">
                            <h3 className="text-xl font-semibold mb-3">
                                Resources
                            </h3>
                            <p>
                                Access a wide range of resources including
                                notes, previous year questions, and much more,
                                all curated for your success.
                            </p>
                        </div>
                        <div className="bg-white p-6 shadow-md rounded-lg">
                            <h3 className="text-xl font-semibold mb-3">
                                Opportunities
                            </h3>
                            <p>
                                Discover and seize opportunities that align with
                                your skills and interests, from internships to
                                projects and more.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-16 bg-gray-200">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl font-bold text-center mb-6">
                            Meet Our Team
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Sample Team Member */}
                            <div className="bg-white p-6 shadow-md rounded-lg text-center">
                                <img
                                    src="https://via.placeholder.com/150"
                                    alt="Team Member"
                                    className="w-32 h-32 rounded-full mx-auto mb-4"
                                />
                                <h3 className="text-xl font-semibold mb-2">
                                    John Doe
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Founder & CEO
                                </p>
                                <p className="mt-4">
                                    John is passionate about education and
                                    believes in the power of community to drive
                                    success.
                                </p>
                            </div>

                            <div className="bg-white p-6 shadow-md rounded-lg text-center">
                                <img
                                    src="https://via.placeholder.com/150"
                                    alt="Team Member"
                                    className="w-32 h-32 rounded-full mx-auto mb-4"
                                />
                                <h3 className="text-xl font-semibold mb-2">
                                    Jane Smith
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Chief Technical Officer
                                </p>
                                <p className="mt-4">
                                    Jane brings her expertise in technology to
                                    build and maintain our platform's robust
                                    infrastructure.
                                </p>
                            </div>

                            <div className="bg-white p-6 shadow-md rounded-lg text-center">
                                <img
                                    src="https://via.placeholder.com/150"
                                    alt="Team Member"
                                    className="w-32 h-32 rounded-full mx-auto mb-4"
                                />
                                <h3 className="text-xl font-semibold mb-2">
                                    Mike Johnson
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Community Manager
                                </p>
                                <p className="mt-4">
                                    Mike is dedicated to fostering a vibrant and
                                    supportive community for our users.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}

export default AboutPage;
