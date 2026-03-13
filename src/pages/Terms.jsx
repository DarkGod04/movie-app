import React from 'react';
import SEO from '../components/SEO';

const Terms = () => {
    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20">
            <SEO title="Terms of Service - QuickShow" />

            <div className="max-w-4xl mx-auto px-6">
                <h1 className="text-4xl font-bold mb-8 text-purple-500">Terms of Service</h1>
                <p className="text-gray-500 mb-12">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-12 text-gray-300 leading-loose">
                    <Section title="1. Acceptance of Terms">
                        <p>By accessing or using QuickShow, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
                    </Section>

                    <Section title="2. Booking & Cancellations">
                        <p>All ticket sales are final unless otherwise stated.</p>
                        <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-400">
                            <li>Tickets are subject to availability.</li>
                            <li>Cancellations must be made at least 2 hours before showtime for a refund (if applicable).</li>
                            <li>Management reserves the right to refuse entry.</li>
                        </ul>
                    </Section>

                    <Section title="3. User Conduct">
                        <p>You agree not to use the service for any unlawful purpose or to solicit others to perform or participate in any unlawful acts.</p>
                    </Section>
                </div>
            </div>
        </div>
    );
};

const Section = ({ title, children }) => (
    <section>
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        {children}
    </section>
);

export default Terms;
