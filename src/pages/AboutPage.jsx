import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

function AboutPage() {
    return (
        <>
            <Header />
            <div className="bg-gradient-to-t from-sky-500 to-white">
                {/* Hero Section */}
                <section className="relative py-10">
                    <div className="container mx-auto px-6 text-center relative">
                        <h1 className="text-4xl font-bold mb-6">About Us</h1>
                        <ul className="space-y-4 text-base max-w-5xl mx-auto text-start">
                            <li>
                                A one-stop platform for students to select
                                courses, access previous year's question papers
                                <strong> (PYQs)</strong>, and download
                                <strong> Comprehensive notes</strong>,
                                simplifying exam preparation.
                            </li>
                            <li>
                                Connecting students with experienced{' '}
                                <strong>Seniors Students</strong> for guidance,
                                support, and mentorship through{' '}
                                <strong>live chats</strong> and
                                <strong> community forums</strong>, ensuring
                                informed decisions and academic success.
                            </li>
                            <li>
                                A college-focused <strong>Marketplace</strong>{' '}
                                where students can select their institution,{' '}
                                <strong>
                                    buy, and sell used stationery, books, and
                                    resources,
                                </strong>
                                fostering a sustainable and cost-effective
                                community.
                            </li>
                            <li>
                                A course-centric platform connecting students
                                with relevant{' '}
                                <strong>internship opportunities</strong>,
                                allowing them to select their course and apply
                                for internships, kickstarting their professional
                                journey.
                            </li>
                            <li>
                                A college discovery platform where students can
                                select their institution and access direct links
                                to <strong>official websites</strong>,
                                admissions, and{' '}
                                <strong>
                                    {' '}
                                    essential college resources effortlessly.{' '}
                                </strong>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-16 px-6 max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-6">
                        Our Mission
                    </h2>
                    <p className="text-center max-w-2xl mx-auto mb-10 text-gray-700">
                        Our mission is to empower students by providing easy
                        access to guidance, resources, and opportunities that
                        help them excel in their academic and professional
                        journeys.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Guidance',
                                description:
                                    'Connect with experienced seniors who can guide you through your academic challenges and career choices.',
                            },
                            {
                                title: 'Resources',
                                description:
                                    'Access a wide range of resources including notes, previous year questions, and much more, all curated for your success.',
                            },
                            {
                                title: 'Opportunities',
                                description:
                                    'Discover and seize opportunities that align with your skills and interests, from internships to projects and more.',
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <h3 className="text-xl font-semibold mb-3">
                                    {item.title}
                                </h3>
                                <p>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Team Section */}
                {/* <section className="py-16 px-6 max-w-7xl mx-auto">
                    <div className="container mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-8">
                            Meet Our Team
                        </h2>
                        <div className="w-full flex flex-wrap gap-5 justify-center">
                            {[
                                // {
                                //     name: 'Mohd Rafey',
                                //     role: 'Founder',
                                //     description:
                                //         'As the visionary behind the platform, Mohd Rafey is committed to leveraging technology and community to drive student success and enhance the academic experience.',
                                //     image: 'https://res.cloudinary.com/dqlugeoxg/image/upload/v1725214937/student_senior/u3tqpo9vbzq8wlrnfoab.jpg',
                                // },
                                // {
                                //     name: 'Vaishnavi Baranwal',
                                //     role: 'Manager',
                                //     description:
                                //         'With a knack for project management and technology integration, Vaishnavi ensures that all operations run smoothly, leading the team towards continuous innovation.',
                                //     image: 'https://res.cloudinary.com/dqlugeoxg/image/upload/v1725217498/student_senior/lpynwmrs8uvoo2vapfum.jpg',
                                // },
                                // {
                                //     name: 'Najmus Sahar',
                                //     role: 'Community Manager',
                                //     description:
                                //         'Najmus is focused on building a supportive community, fostering engagement, and enhancing user experience through active communication and feedback loops.',
                                //     image: 'https://res.cloudinary.com/dqlugeoxg/image/upload/v1725214975/student_senior/zbiisemkblddgqjfcjwz.jpg',
                                // },
                                // {
                                //     name: 'Muskan Khatoon',
                                //     role: 'Backend Developer',
                                //     description:
                                //         'Muskan specializes in developing robust backend systems, ensuring data integrity, and optimizing performance to support a seamless user experience.',
                                //     image: 'https://res.cloudinary.com/dqlugeoxg/image/upload/v1725429901/student_senior/qehp7dr9wnfthnwphqke.jpg',
                                // },
                                // {
                                //     name: 'Sahil Verma',
                                //     role: 'UI/UX Designer',
                                //     description:
                                //         'Sahil crafts intuitive and visually appealing designs, making sure that every interaction on the platform is user-friendly and engaging.',
                                //     image: 'https://avatars.githubusercontent.com/u/69185813?v=4',
                                // },
                            ].map((member, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-6 shadow-md rounded-lg text-center hover:shadow-xl transition-shadow duration-300 cards"
                                >
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                                    />
                                    <h3 className="text-xl font-semibold mb-2">
                                        {member.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {member.role}
                                    </p>
                                    <p className="mt-4">{member.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section> */}
            </div>
            <Footer />
        </>
    );
}

export default AboutPage;
