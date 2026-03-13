import React from 'react';
import SEO from '../components/SEO';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20">
            <SEO title="Privacy Policy - QuickShow" />

            <div className="max-w-4xl mx-auto px-6">
                <h1 className="text-4xl font-bold mb-8 text-pink-500">Privacy Policy</h1>
                <p className="text-gray-500 mb-12">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-12 text-gray-300 leading-loose">
                    <Section title="1. Information We Collect">
                        <p>We collect information you provide directly to us, such as when you create an account, book a ticket, or contact support.</p>
                        <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-400">
                            <li>Name and contact information</li>
                            <li>Payment information (processed securely by third parties)</li>
                            <li>Movie preferences and booking history</li>
                        </ul>
                    </Section>

                    <Section title="2. How We Use Your Information">
                        <p>We use the information we collect to provide, maintain, and improve our services, including:</p>
                        <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-400">
                            <li>Processing your transactions and sending tickets</li>
                            <li>Sending you updates, security alerts, and support messages</li>
                            <li>Personalizing your movie recommendations</li>
                        </ul>
                    </Section>

                    <Section title="3. Data Security">
                        <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>
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

export default Privacy;
