import React, { useState } from 'react';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import { Briefcase, MapPin, Clock } from 'lucide-react';

const Careers = () => {
    const [selectedJob, setSelectedJob] = useState(null);

    const jobs = [
        { role: "Senior Frontend Engineer", dept: "Engineering", location: "Remote / NY", type: "Full-time" },
        { role: "Product Designer", dept: "Design", location: "Los Angeles, CA", type: "Full-time" },
        { role: "Marketing Manager", dept: "Marketing", location: "Remote", type: "Contract" },
        { role: "Customer Success Lead", dept: "Support", location: "London, UK", type: "Full-time" },
    ];

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20">
            <SEO title="Careers - QuickShow" />

            {/* Modal */}
            {selectedJob && (
                <ApplicationModal job={selectedJob} onClose={() => setSelectedJob(null)} />
            )}

            <div className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
                <div className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 rounded-[3rem] p-12 md:p-24 text-center border border-white/10 relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-7xl font-black mb-6">Join the Revolution</h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                            We're looking for dreamers, doers, and movie buffs to help us build the future of entertainment.
                        </p>
                        <button className="px-10 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform">
                            View Open Positions
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6">
                <h2 className="text-3xl font-bold mb-10 border-b border-white/10 pb-6">Open Roles</h2>
                <div className="space-y-6">
                    {jobs.map((job, idx) => (
                        <div key={idx} onClick={() => setSelectedJob(job)} className="group p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-pink-500/50 hover:bg-white/10 transition-all flex flex-col md:flex-row justify-between md:items-center gap-6 cursor-pointer">
                            <div>
                                <h3 className="text-2xl font-bold mb-2 group-hover:text-pink-400 transition-colors">{job.role}</h3>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                    <span className="flex items-center gap-1"><Briefcase size={14} /> {job.dept}</span>
                                    <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                                    <span className="flex items-center gap-1"><Clock size={14} /> {job.type}</span>
                                </div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedJob(job);
                                }}
                                className="px-6 py-2 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all font-medium whitespace-nowrap"
                            >
                                Apply Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ApplicationModal = ({ job, onClose }) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast.success(`Application sent for ${job.role}!`);
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-lg p-8 relative shadow-2xl animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                >
                    ✕
                </button>

                <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-400 mb-1">Apply for</h3>
                    <h2 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        {job.role}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Full Name</label>
                        <input type="text" required className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors" placeholder="Jane Doe" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Email Address</label>
                        <input type="email" required className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors" placeholder="jane@example.com" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">LinkedIn / Portfolio URL</label>
                        <input type="url" required className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors" placeholder="https://..." />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Why you?</label>
                        <textarea rows="3" required className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors resize-none" placeholder="Tell us why you're a clear fit..." />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Careers;
