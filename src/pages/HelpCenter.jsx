import React from 'react';
import SEO from '../components/SEO';
import { Search, CreditCard, Ticket, User, Shield } from 'lucide-react';

const HELP_ARTICLES = [
    {
        id: 1,
        title: 'How do I cancel my booking?',
        category: 'Bookings',
        answer: 'To cancel a booking, go to "My Bookings", select the ticket you wish to cancel, and click the "Cancel Booking" button. Note that cancellations are only allowed up to 2 hours before the showtime.'
    },
    {
        id: 2,
        title: 'Where can I find my tickets?',
        category: 'Bookings',
        answer: 'Your tickets are sent to your registered email address immediately after booking. You can also view them in the "My Bookings" section of the app.'
    },
    {
        id: 3,
        title: 'Payment failed but money was deducted',
        category: 'Payments',
        answer: 'If money was deducted for a failed transaction, it is usually auto-refunded within 5-7 business days. If not, please contact support with your transaction ID.'
    },
    {
        id: 4,
        title: 'Do you offer refunds?',
        category: 'Bookings',
        answer: 'Refunds are processed automatically for cancelled tickets (minus cancellation fees) or cancelled shows. The amount typically reflects in your source account within 5-7 days.'
    },
    {
        id: 5,
        title: 'How to reset my password?',
        category: 'Account',
        answer: 'Go to the Login page and click "Forgot Password". Enter your email to receive a password reset link.'
    },
    {
        id: 6,
        title: 'Is my payment information secure?',
        category: 'Safety',
        answer: 'Yes, we use top-tier, PCI-DSS compliant payment gateways. We do not store your full card details on our servers.'
    },
    {
        id: 7,
        title: 'Can I change my seat after booking?',
        category: 'Bookings',
        answer: 'Unfortunately, seats cannot be modified once booked. You would need to cancel the current booking (if eligible) and make a new one.'
    },
    {
        id: 8,
        title: 'How do I delete my account?',
        category: 'Account',
        answer: 'To delete your account, please send a request to support@quickshow.com from your registered email address. We will process it within 48 hours.'
    },
];

const HelpCenter = () => {
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredArticles = HELP_ARTICLES.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20">
            <SEO title="Help Center - QuickShow" />

            {/* Header */}
            <div className="bg-gradient-to-b from-purple-900/40 to-black py-20 px-6 text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-6">How can we help?</h1>
                <div className="max-w-xl mx-auto relative group">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for answers..."
                        className="w-full bg-white/10 border border-white/20 rounded-full py-4 pl-12 pr-6 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all backdrop-blur-md"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
            </div>

            {/* Categories */}
            <div className="max-w-6xl mx-auto px-6 py-20">
                {!searchQuery && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                        <CategoryCard icon={<Ticket className="w-8 h-8 text-pink-500" />} title="Bookings" desc="Tickets, cancellations, and refunds" />
                        <CategoryCard icon={<User className="w-8 h-8 text-blue-500" />} title="Account" desc="Profile settings and login issues" />
                        <CategoryCard icon={<CreditCard className="w-8 h-8 text-green-500" />} title="Payments" desc="Payment methods and billing" />
                        <CategoryCard icon={<Shield className="w-8 h-8 text-purple-500" />} title="Safety" desc="Platform policies and security" />
                    </div>
                )}

                <div>
                    <h2 className="text-2xl font-bold mb-8">
                        {searchQuery ? `Search Results for "${searchQuery}"` : 'Popular Articles'}
                    </h2>

                    {filteredArticles.length > 0 ? (
                        <div className="space-y-4">
                            {filteredArticles.map(article => (
                                <ArticleLink
                                    key={article.id}
                                    title={article.title}
                                    category={article.category}
                                    answer={article.answer}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            <p>No results found for "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CategoryCard = ({ icon, title, desc }) => (
    <div className="bg-white/5 border border-white/5 p-8 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group">
        <div className="mb-4 bg-black/40 w-fit p-3 rounded-xl border border-white/5 group-hover:scale-110 transition-transform">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{desc}</p>
    </div>
);

const ArticleLink = ({ title, category, answer }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="rounded-xl bg-white/5 border border-white/5 overflow-hidden transition-all hover:bg-white/10">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex justify-between items-center group text-left"
            >
                <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-300 group-hover:text-white transition-colors">{title}</span>
                    {category && (
                        <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-400 border border-white/5">
                            {category}
                        </span>
                    )}
                </div>
                <span className={`text-gray-600 group-hover:text-pink-500 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
                    →
                </span>
            </button>

            {/* Answer Content */}
            <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <div className="p-4 pt-0 text-gray-400 text-sm leading-relaxed border-t border-white/5 mx-4 mt-2">
                        {answer}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
