import React, { useState } from 'react';
import SEO from '../components/SEO';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
    const questions = [
        {
            q: "How do I book a ticket?",
            a: "Simply browse through our movies collection, select the movie you want to watch, choose your preferred theater and showtime, select your seats, and proceed to payment."
        },
        {
            q: "Can I cancel my tickets?",
            a: "Yes, you can cancel tickets up to 2 hours before the showtime. A cancellation fee may apply depending on the theater's policy."
        },
        {
            q: "Are my payment details secure?",
            a: "Absolutely. We use industry-standard encryption and trusted payment gateways to ensure your financial information is never compromised."
        },
        {
            q: "Do you offer student discounts?",
            a: "Discount policies vary by theater. Look for the 'Student Offer' tag on applicable showtimes."
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20">
            <SEO title="FAQ - QuickShow" />

            <div className="max-w-3xl mx-auto px-6 text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
                <p className="text-gray-400">Everything you need to know about QuickShow.</p>
            </div>

            <div className="max-w-3xl mx-auto px-6 space-y-4">
                {questions.map((item, idx) => (
                    <FAQItem key={idx} question={item.q} answer={item.a} />
                ))}
            </div>
        </div>
    );
};

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-white/5 transition-colors"
            >
                <span className="font-bold text-lg">{question}</span>
                {isOpen ? <ChevronUp className="text-pink-500" /> : <ChevronDown className="text-gray-400" />}
            </button>
            {isOpen && (
                <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                    {answer}
                </div>
            )}
        </div>
    )
}

export default FAQ;
