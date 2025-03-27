import React from 'react';
import Seo from '../components/SEO/Seo';

function AboutPage() {
    return (
        <>
            <div className="bg-gradient-to-t from-sky-500 to-white min-h-screen">
                <section className="relative py-20">
                    <div className="container mx-auto px-6 text-center">
                        <Seo
                            title="About Us"
                            desc={`A one-stop platform for students to select courses, access previous year's question papers (PYQs), and download Comprehensive notes, simplifying exam preparation.`}
                        />
                        <h1 className="text-5xl font-bold mb-8 text-gray-800">
                            About Us
                        </h1>
                        <div className="max-w-4xl mx-auto text-left space-y-6 text-lg text-gray-700">
                            <p>
                                A one-stop platform for students to select
                                courses, access previous year's question papers{' '}
                                <strong>(PYQs)</strong>, and download{' '}
                                <strong>Comprehensive notes</strong>,
                                simplifying <strong>exam</strong> preparation.
                            </p>
                            <p>
                                Connecting students with experienced{' '}
                                <strong>Senior Students</strong> for guidance,
                                support, and mentorship through{' '}
                                <strong>live chats</strong> and{' '}
                                <strong>community forums</strong>, ensuring
                                informed decisions and academic success.
                            </p>
                            <p>
                                A college-focused <strong>Marketplace</strong>{' '}
                                where students can select their institution,{' '}
                                <strong>
                                    buy, and sell used stationery, books, and
                                    resources
                                </strong>
                                , fostering a sustainable and cost-effective
                                community.
                            </p>
                            <p>
                                A course-centric platform connecting students
                                with relevant{' '}
                                <strong>internship opportunities</strong>,
                                allowing them to select their course and apply
                                for internships, kickstarting their professional
                                journey.
                            </p>
                            <p>
                                A college discovery platform where students can
                                select their institution and access direct links
                                to <strong>official websites</strong>,
                                admissions, and{' '}
                                <strong>essential college resources</strong>{' '}
                                effortlessly.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-20 ">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                            Our Mission
                        </h2>
                        <p className="text-center max-w-2xl mx-auto mb-12 text-gray-600 text-lg">
                            Our mission is to empower students by providing easy
                            access to guidance, resources, and opportunities
                            that help them excel in their academic and
                            professional journeys.
                        </p>
                        <div className="grid md:grid-cols-3 gap-8 lg:w-3/4 mx-auto">
                            {[
                                {
                                    title: 'Guidance',
                                    description:
                                        'Connect with experienced seniors who can guide you through your academic challenges and career choices.',
                                    icon: '👥',
                                },
                                {
                                    title: 'Resources',
                                    description:
                                        'Access a wide range of resources including notes, previous year questions, and much more, all curated for your success.',
                                    icon: '📚',
                                },
                                {
                                    title: 'Opportunities',
                                    description:
                                        'Discover and seize opportunities that align with your skills and interests, from internships to projects and more.',
                                    icon: '🚀',
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-8 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
                                >
                                    <div className="text-4xl mb-4">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section (Optional) */}
                {/* <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Meet Our Team</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                // Add team members here
                            ].map((member, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-8 shadow-lg rounded-lg text-center hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
                                >
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                                    />
                                    <h3 className="text-2xl font-semibold mb-2 text-gray-800">{member.name}</h3>
                                    <p className="text-sm text-gray-600 mb-4">{member.role}</p>
                                    <p className="text-gray-600">{member.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section> */}
            </div>
            {/* <Footer /> */}
        </>
    );
}

export default AboutPage;
