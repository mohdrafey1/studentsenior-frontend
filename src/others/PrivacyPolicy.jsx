import React from 'react';
import Seo from '../components/SEO/Seo';

const PrivacyPolicy = () => {
    return (
        <div className="bg-gradient-to-t from-sky-200 to bg-white">
            <Seo title='Privacy Policy - Student Senior' desc={` Welcome to Student Senior! This privacy policy explains how
                    we collect, use, and protect your personal information when
                    you visit our website. By using Student Senior, you agree to
                    the terms of this policy.`} />
            <div className="container mx-auto px-4 py-10 max-w-6xl ">
                <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
                <p className="mb-4">
                    Welcome to Student Senior! This privacy policy explains how
                    we collect, use, and protect your personal information when
                    you visit our website. By using Student Senior, you agree to
                    the terms of this policy.
                </p>

                <h2 className="text-2xl font-semibold mb-3">
                    1. Information We Collect
                </h2>
                <p className="mb-4">
                    We may collect personal information that you provide to us,
                    such as your name, email address, college details, and any
                    other information you choose to provide. Additionally, we
                    collect technical information such as IP address, browser
                    type, and usage data for analytics purposes.
                </p>

                <h2 className="text-2xl font-semibold mb-3">
                    2. How We Use Your Information
                </h2>
                <p className="mb-4">
                    We use your information to improve your experience on
                    Student Senior, manage user accounts, and provide services
                    such as connecting seniors and juniors. We may also use your
                    information to improve our website, analyze site traffic,
                    and send updates about new features.
                </p>

                <h2 className="text-2xl font-semibold mb-3">
                    3. Sharing of Information
                </h2>
                <p className="mb-4">
                    We do not share your personal information with third
                    parties, except when necessary to operate the website,
                    comply with legal obligations, or protect our rights. We may
                    share anonymous data for analytics and marketing purposes.
                </p>

                <h2 className="text-2xl font-semibold mb-3">4. Security</h2>
                <p className="mb-4">
                    We take reasonable steps to protect your personal
                    information from unauthorized access or disclosure. However,
                    please be aware that no internet transmission is entirely
                    secure.
                </p>

                <h2 className="text-2xl font-semibold mb-3">5. Your Rights</h2>
                <p className="mb-4">
                    You have the right to access, update, or delete your
                    personal information. If you would like to exercise these
                    rights, please contact us through our support channels.
                </p>

                <h2 className="text-2xl font-semibold mb-3">
                    6. Changes to This Policy
                </h2>
                <p className="mb-4">
                    We may update this Privacy Policy periodically. Any changes
                    will be posted on this page with an updated date.
                </p>

                <h2 className="text-2xl font-semibold mb-3">7. Contact Us</h2>
                <p className="mb-4">
                    If you have any questions about our Privacy Policy, please
                    contact us at
                    <a
                        href="mailto:your-email@example.com"
                        className="text-blue-500 hover:underline"
                    >
                        {' '}
                        studentsenior12@gmail.com
                    </a>
                    .
                </p>

                <p className="text-gray-500 text-sm">
                    Last updated: 06-11-2024
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
