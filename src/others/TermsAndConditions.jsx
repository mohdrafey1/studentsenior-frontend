import React from 'react';
import Seo from '../components/SEO/Seo';

const TermsAndConditions = () => {
    return (
        <div className="bg-gradient-to-t from-sky-200 to bg-white">
            <Seo
                title="Terms and Conditions - Student Senior"
                desc={` Welcome to Student Senior! These terms and conditions govern your use of the website. By accessing and using Student Senior, you agree to comply with these terms.`}
            />
            <div className="container mx-auto px-4 py-10 max-w-6xl">
                <h1 className="text-4xl font-bold mb-6">
                    Terms and Conditions
                </h1>
                <p className="mb-4">
                    Welcome to Student Senior! These terms and conditions govern
                    your use of the website. By accessing and using Student
                    Senior, you agree to comply with these terms. If you do not
                    agree with any of the terms, you should not use the website.
                </p>

                <h2 className="text-2xl font-semibold mb-3">
                    1. Acceptance of Terms
                </h2>
                <p className="mb-4">
                    By accessing and using Student Senior, you agree to be bound
                    by these terms and conditions. We may update these terms
                    from time to time, and your continued use of the website
                    will signify your acceptance of any updated terms.
                </p>

                <h2 className="text-2xl font-semibold mb-3">
                    2. Use of the Website
                </h2>
                <p className="mb-4">
                    You agree to use the website in accordance with all
                    applicable laws and regulations. You may not use the website
                    for any unlawful purpose or in a way that may damage,
                    disable, or impair the website.
                </p>

                <h2 className="text-2xl font-semibold mb-3">
                    3. Account Registration
                </h2>
                <p className="mb-4">
                    To access certain features of the website, you may be
                    required to register for an account. You agree to provide
                    accurate and complete information during the registration
                    process and keep your account details secure.
                </p>

                <h2 className="text-2xl font-semibold mb-3">4. User Content</h2>
                <p className="mb-4">
                    By submitting content to the website (such as notes,
                    comments, or reviews), you grant us a non-exclusive,
                    royalty-free, worldwide license to use, display, and
                    distribute your content on the website.
                </p>

                <h2 className="text-2xl font-semibold mb-3">
                    5. Payments and Purchases
                </h2>
                <p className="mb-4">
                    Any purchases made on the website, including notes or other
                    services, are subject to applicable fees and payment terms.
                    We reserve the right to modify prices at any time. Payments
                    are processed securely through our third-party payment
                    provider.
                </p>

                <h2 className="text-2xl font-semibold mb-3">6. Termination</h2>
                <p className="mb-4">
                    We reserve the right to suspend or terminate your account if
                    you violate these terms and conditions. Upon termination,
                    you will lose access to certain services, and any
                    outstanding payments will still be due.
                </p>

                <h2 className="text-2xl font-semibold mb-3">
                    7. Limitation of Liability
                </h2>
                <p className="mb-4">
                    Student Senior will not be held liable for any direct,
                    indirect, incidental, or consequential damages arising from
                    your use of the website or any services provided, except as
                    required by law.
                </p>

                <h2 className="text-2xl font-semibold mb-3">8. Privacy</h2>
                <p className="mb-4">
                    Your use of the website is also governed by our Privacy
                    Policy, which explains how we collect and use your personal
                    data.
                </p>

                <h2 className="text-2xl font-semibold mb-3">
                    9. Governing Law
                </h2>
                <p className="mb-4">
                    These terms and conditions are governed by the laws of [Your
                    Country], without regard to its conflict of law principles.
                    Any disputes arising from these terms will be resolved in
                    the competent courts of [Your Country].
                </p>

                <h2 className="text-2xl font-semibold mb-3">
                    10. Changes to the Terms
                </h2>
                <p className="mb-4">
                    We may update these Terms and Conditions periodically. Any
                    changes will be posted on this page, and the updated date
                    will be reflected at the bottom of the page.
                </p>

                <h2 className="text-2xl font-semibold mb-3">11. Contact Us</h2>
                <p className="mb-4">
                    If you have any questions about these Terms and Conditions,
                    please contact us at
                    <a
                        href="mailto:studentsenior12@gmail.com"
                        className="text-blue-500 hover:underline"
                    >
                        {' '}
                        studentsenior12@gmail.com
                    </a>
                    .
                </p>

                <p className="text-gray-500 text-sm">
                    Last updated: 18-02-2025
                </p>
            </div>
        </div>
    );
};

export default TermsAndConditions;
