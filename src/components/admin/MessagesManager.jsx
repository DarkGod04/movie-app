import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Mail, Trash2, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const MessagesManager = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this message?')) return;
        try {
            const { error } = await supabase.from('messages').delete().eq('id', id);
            if (error) throw error;
            toast.success('Message deleted');
            setMessages(messages.filter(m => m.id !== id));
        } catch (error) {
            toast.error('Failed to delete message');
        }
    };

    const handleMarkAsRead = async (id, currentStatus) => {
        const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
        try {
            const { error } = await supabase
                .from('messages')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            setMessages(messages.map(m => m.id === id ? { ...m, status: newStatus } : m));
            toast.success(`Marked as ${newStatus}`);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading) return <div className="text-center py-10 text-gray-500">Loading messages...</div>;

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Mail className="text-pink-500" /> Inbox
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Manage user inquiries and feedback</p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold text-white">{messages.length}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Total Messages</p>
                </div>
            </header>

            <div className="grid gap-4">
                {messages.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                        <Mail className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-400">No messages yet</h3>
                        <p className="text-gray-500">When users contact you, their messages will appear here.</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`p-6 rounded-2xl border transition-all ${msg.status === 'unread'
                                    ? 'bg-white/10 border-pink-500/30'
                                    : 'bg-white/5 border-white/5'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                        {msg.name}
                                        {msg.status === 'unread' && (
                                            <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full">New</span>
                                        )}
                                    </h3>
                                    <a href={`mailto:${msg.email}`} className="text-pink-400 hover:text-pink-300 text-sm transition-colors">
                                        {msg.email}
                                    </a>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleMarkAsRead(msg.id, msg.status)}
                                        className={`p-2 rounded-lg transition-colors ${msg.status === 'read'
                                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                            }`}
                                        title={msg.status === 'read' ? "Mark as Unread" : "Mark as Read"}
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(msg.id)}
                                        className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                                        title="Delete Message"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-gray-300 leading-relaxed bg-black/20 p-4 rounded-xl mb-3">
                                {msg.message}
                            </p>

                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(msg.created_at).toLocaleString()}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MessagesManager;
