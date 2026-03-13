import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import { Facebook, Twitter, Instagram, Mail, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

const Footer = () => {
    const [email, setEmail] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Check for duplicate
            const { data: existing } = await supabase
                .from('subscribers')
                .select('id')
                .eq('email', email)
                .single();

            if (existing) {
                toast.error("You're already subscribed!");
                setLoading(false);
                return;
            }

            const { error } = await supabase.from('subscribers').insert([{ email }]);
            if (error) throw error;

            toast.success("Thanks for subscribing!");
            setEmail('');
        } catch (error) {
            console.error(error);
            toast.error("Failed to subscribe.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="relative bg-black pt-20 pb-10 border-t border-white/5 overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 px-6 md:px-16 lg:px-36">
                <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-20 mb-16">

                    {/* Brand Column */}
                    <div className="lg:w-1/3">
                        <img alt="QuickShow" className="h-10 mb-6 opacity-90" src={assets.logo} />
                        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
                            Experience movies like never before. QuickShow brings you the latest trailers, reviews, and booking options in one premium platform.
                        </p>
                        <div className="flex items-center gap-4">
                            <SocialIcon icon={<Facebook size={18} />} />
                            <SocialIcon icon={<Twitter size={18} />} />
                            <SocialIcon icon={<Instagram size={18} />} />
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:flex-1">
                        <div>
                            <h3 className="text-white font-bold mb-6">Company</h3>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li><FooterLink text="Home" to="/" /></li>
                                <li><FooterLink text="About Us" to="/about" /></li>
                                <li><FooterLink text="Contact" to="/contact" /></li>
                                <li><FooterLink text="Careers" to="/careers" /></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-6">Support</h3>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li><FooterLink text="Help Center" to="/help" /></li>
                                <li><FooterLink text="Terms of Service" to="/terms" /></li>
                                <li><FooterLink text="Privacy Policy" to="/privacy" /></li>
                                <li><FooterLink text="FAQ" to="/faq" /></li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="col-span-2 md:col-span-1">
                            <h3 className="text-white font-bold mb-6">Stay Updated</h3>
                            <p className="text-sm text-gray-400 mb-4">Subscribe to our newsletter for the latest releases.</p>
                            <form onSubmit={handleSubscribe} className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 pl-4 focus-within:border-pink-500/50 transition-colors">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address"
                                    className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-gray-600"
                                />
                                <button type="submit" disabled={loading} className="p-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all disabled:opacity-50">
                                    <ArrowRight size={16} className="text-white" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} QuickShow Inc. All rights reserved.</p>
                    <div className="flex items-center gap-8">
                        <Link to="/privacy" className="hover:text-white cursor-pointer transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-white cursor-pointer transition-colors">Terms</Link>
                        <span className="hover:text-white cursor-pointer transition-colors">Cookies</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialIcon = ({ icon }) => (
    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-pink-600 hover:border-pink-500 transition-all cursor-pointer shadow-lg hover:shadow-[0_0_15px_rgba(236,72,153,0.4)]">
        {icon}
    </div>
);

const FooterLink = ({ text, to }) => (
    <Link to={to} className="hover:text-pink-500 transition-colors inline-block hover:translate-x-1 duration-300">
        {text}
    </Link>
)

export default Footer;