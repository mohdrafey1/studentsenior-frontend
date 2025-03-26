import React from 'react';
import Seo from '../components/SEO/Seo';

const RefundPolicy = () => {
    return (
        <div className="bg-gradient-to-t from-sky-200 to bg-white">
            <Seo
                title="Refund and Return Policy - Student Senior"
                desc={`Welcome to Student Senior! This refund policy explains our approach to refunds and cancellations. By using our services, you agree to these terms.`}
            />
            <div className="container mx-auto px-4 py-10 max-w-6xl">
                <h1 className="text-4xl font-bold mb-6">Refund Policy</h1>
                <p className="mb-4">
                    Thank you for choosing Student Senior! We strive to ensure a satisfying experience with our services. This refund policy outlines the terms and conditions for refunds and cancellations of any purchases or transactions made through our website.
                </p>

                <h2 className="text-2xl font-semibold mb-3">
                    1. Eligibility for Refunds
                </h2>
                <p className="mb-4">
                    Refunds will be considered for the following reasons:
                    <ul className="list-disc pl-6">
                        <li>Incorrect or duplicate charges.</li>
                        <li>Non-delivery of the product or service (e.g., notes, courses, etc.).</li>
                        <li>Technical issues preventing access to the purchased content (e.g., PDF download failure).</li>
                    </ul>
                </p>

                <h2 className="text-2xl font-semibold mb-3">
                    2. Non-Refundable Items
                </h2>
                <p className="mb-4">
                    Please note that the following items are non-refundable:
                    <ul className="list-disc pl-6">
                        <li>Products or services that have been delivered and are functioning properly.</li>
                        <li>Content that has been downloaded or accessed in any form.</li>
                        <li>Any subscription or membership fees that are part of an ongoing service unless specified otherwise.</li>
                        <li className="font-bold text-red-600">There will be no return if the product is purchased.</li>
                    </ul>
                </p>

                <h2 className="text-2xl font-semibold mb-3">
                    3. Refund Request Credited
                </h2>
                <p className="mb-4">
                    If you believe you are eligible for a refund, please follow these steps:
                    <ul className="list-disc pl-6">
                        <li>Contact our support team within 2 days of purchase.</li>
                        <li>Provide your order details, including your order number and reason for the refund request.</li>
                        <li>Our team will review your request and get back to you with a resolution within 3 business days.</li>
                    </ul>
                </p>

                <h2 className="text-2xl font-semibold mb-3">
                    4. Refund Credited
                </h2>
                <p className="mb-4">
                    If your refund request is approved, we will credit the refund within 2 business days. The refund will be issued to the original payment method, and the transaction may take additional time depending on your payment provider's policies.
                </p>

                <h2 className="text-2xl font-semibold mb-3">
                    5. Cancellations
                </h2>
                <p className="mb-4">
                    If you wish to cancel any services or subscriptions, please contact us as soon as possible. Cancellations are subject to our refund policy and may not be applicable after certain conditions are met (such as content being accessed or downloaded).
                </p>

                <h2 className="text-2xl font-semibold mb-3">
                    6. Changes to This Refund Policy
                </h2>
                <p className="mb-4">
                    We may update this Refund Policy from time to time. Any changes will be posted on this page, and the updated date will be reflected at the bottom of the page.
                </p>

                <h2 className="text-2xl font-semibold mb-3">7. Contact Us</h2>
                <p className="mb-4">
                    If you have any questions or concerns regarding our Refund Policy or need assistance with your refund request, please contact us at
                    <a
                        href="mailto:studentsenior.help@gmail.com"
                        className="text-blue-500 hover:underline"
                    >
                        {' '}
                        studentsenior.help@gmail.com
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

export default RefundPolicy;
