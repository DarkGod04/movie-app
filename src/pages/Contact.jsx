import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import SEO from '../components/SEO';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.from('messages').insert([{
                name: formData.name,
                email: formData.email,
                message: formData.message
            }]);

            if (error) throw error;

            toast.success("Message sent! We'll get back to you soon.");
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pt-28 pb-20 relative overflow-hidden">
            <SEO title="Contact Us - QuickShow" description="Get in touch with the QuickShow team." />

            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-900/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-500">
                        Get in Touch
                    </h1>
                    <p className="text-gray-400 text-xl font-light max-w-2xl mx-auto">
                        Have a question or just want to say hi? We'd love to hear from you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                    {/* Contact Info Side */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <ContactItem
                                icon={<Mail className="w-6 h-6 text-white" />}
                                title="Email Us"
                                content="support@quickshow.com"
                                sub="Response within 24 hours"
                                color="bg-pink-500"
                            />
                            <ContactItem
                                icon={<Phone className="w-6 h-6 text-white" />}
                                title="Call Us"
                                content="+1 (555) 123-4567"
                                sub="Mon-Fri, 9am-6pm EST"
                                color="bg-purple-500"
                            />
                            <ContactItem
                                icon={<MapPin className="w-6 h-6 text-white" />}
                                title="Visit HQ"
                                content="123 Cinema Blvd, Hollywood, CA"
                                sub="Come say hello!"
                                color="bg-blue-500"
                            />
                        </div>

                        {/* Map */}
                        <div className="rounded-3xl overflow-hidden border border-white/10 h-72 w-full grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl hover:shadow-purple-500/20 group relative">
                            <div className="absolute inset-0 border-4 border-white/5 pointer-events-none z-10 rounded-3xl group-hover:border-purple-500/30 transition-colors" />
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d423286.27404345275!2d-118.69192057530666!3d34.02016130939095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fdf6f254608f4!2sLos%20Angeles%2C%20CA%2C%20USA!5e0!3m2!1sen!2sin!4v1703649281234!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="bg-[#1a1a1a]/60 border border-white/10 p-8 md:p-10 rounded-[2.5rem] backdrop-blur-2xl shadow-xl relative overflow-hidden group">

                        {/* Glow effect */}
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-600/30 transition-all" />

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>

                            <div className="group/input">
                                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider group-focus-within/input:text-purple-400 transition-colors">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="group/input">
                                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider group-focus-within/input:text-purple-400 transition-colors">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="group/input">
                                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider group-focus-within/input:text-purple-400 transition-colors">Your Message</label>
                                <textarea
                                    rows="5"
                                    required
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all resize-none"
                                    placeholder="How can we help you today?"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-white text-black rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-[0.98] transition-all shadow-lg shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                                <Send className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContactItem = ({ icon, title, content, sub, color }) => (
    <div className="flex items-start gap-5 group cursor-default">
        <div className={`p-4 rounded-2xl ${color} shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300`}>
            {icon}
        </div>
        <div className="pt-1">
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-200 transition-colors">{title}</h3>
            <p className="text-white/90 font-medium mb-1">{content}</p>
            <p className="text-sm text-gray-500">{sub}</p>
        </div>
    </div>
);

export default Contact;
