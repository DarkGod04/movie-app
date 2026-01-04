import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, CheckCircle, Smartphone, Wallet, QrCode, Clock, Tag, Plus, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';

const PaymentModal = ({ isOpen, onClose, amount: initialAmount, onSuccess }) => {
    const [status, setStatus] = useState('idle'); // idle, processing, success
    const [method, setMethod] = useState('card'); // card, upi, wallet
    const [amount, setAmount] = useState(initialAmount);

    // Timer State
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

    // Card State
    const [cardType, setCardType] = useState('saved'); // 'saved' or 'new'
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [name, setName] = useState('');

    // UPI State
    const [vpa, setVpa] = useState('');
    const [upiMethod, setUpiMethod] = useState('vpa'); // 'vpa' or 'qr'

    // Wallet State
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [walletBalances, setWalletBalances] = useState({
        'Paytm': 5000,
        'PhonePe': 250,
        'Amazon Pay': 1200,
        'Mobikwik': 850
    });

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [couponError, setCouponError] = useState('');

    // Reset state when opened
    useEffect(() => {
        if (isOpen) {
            setStatus('idle');
            setMethod('card');
            setCardType('saved');
            setCardNumber('');
            setExpiry('');
            setCvv('');
            setName('');
            setVpa('');
            setUpiMethod('vpa');
            setSelectedWallet(null);
            setAmount(initialAmount);
            setCouponCode('');
            setCouponApplied(false);
            setCouponError('');
            setTimeLeft(600);
        }
    }, [isOpen, initialAmount]);

    // Timer Logic
    useEffect(() => {
        if (!isOpen || status !== 'idle') return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    onClose(); // Auto close on timeout
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isOpen, status, onClose]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleApplyCoupon = () => {
        const code = couponCode.toUpperCase();
        if (code === 'MOVIE50') {
            setAmount(prev => Math.floor(prev * 0.5));
            setCouponApplied(true);
            setCouponError('');
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else if (code === 'WELCOME20') {
            setAmount(prev => Math.floor(prev * 0.8));
            setCouponApplied(true);
            setCouponError('');
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else {
            setCouponError('Invalid Coupon Code');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('processing');

        // Simulate network delay
        setTimeout(() => {
            setStatus('success');
            // Wait a bit on success before closing
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        }, 2000);
    };

    // Auto-format card number
    const handleCardNumberChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        val = val.substring(0, 16);
        val = val.replace(/(\d{4})/g, '$1 ').trim();
        setCardNumber(val);
    };

    // Auto-format expiry
    const handleExpiryChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length >= 2) {
            val = val.substring(0, 2) + '/' + val.substring(2, 4);
        }
        setExpiry(val);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#1a1a1a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                    >

                        {/* Sidebar / Tabs */}
                        <div className="w-full md:w-1/3 bg-black/40 border-b md:border-b-0 md:border-r border-white/5 p-4 md:p-6 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible no-scrollbar">
                            <div className="mb-6 hidden md:block">
                                <h4 className="text-white/50 text-xs font-bold uppercase tracking-widest px-2">Payment Methods</h4>
                            </div>

                            <button
                                onClick={() => setMethod('card')}
                                className={`flex-1 md:flex-none flex items-center gap-3 p-4 rounded-xl transition-all ${method === 'card' ? 'bg-pink-600/20 text-pink-500 border border-pink-500/30' : 'hover:bg-white/5 text-gray-400'}`}
                            >
                                <CreditCard className="w-5 h-5" />
                                <span className="font-bold text-sm">Card</span>
                            </button>
                            <button
                                onClick={() => setMethod('upi')}
                                className={`flex-1 md:flex-none flex items-center gap-3 p-4 rounded-xl transition-all ${method === 'upi' ? 'bg-pink-600/20 text-pink-500 border border-pink-500/30' : 'hover:bg-white/5 text-gray-400'}`}
                            >
                                <Smartphone className="w-5 h-5" />
                                <span className="font-bold text-sm">UPI</span>
                            </button>
                            <button
                                onClick={() => setMethod('wallet')}
                                className={`flex-1 md:flex-none flex items-center gap-3 p-4 rounded-xl transition-all ${method === 'wallet' ? 'bg-pink-600/20 text-pink-500 border border-pink-500/30' : 'hover:bg-white/5 text-gray-400'}`}
                            >
                                <Wallet className="w-5 h-5" />
                                <span className="font-bold text-sm">Wallets</span>
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#1a1a1a] sticky top-0 z-10">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-bold text-white">Payment Details</h3>
                                    {status === 'idle' && (
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                                            <Clock className="w-3 h-3 text-red-500" />
                                            <span className="text-xs font-mono font-bold text-red-400">{formatTime(timeLeft)}</span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {status === 'success' ? (
                                    <div className="flex flex-col items-center justify-center py-6 text-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            type="spring"
                                            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                                        >
                                            <CheckCircle className="w-8 h-8 text-white" />
                                        </motion.div>
                                        <h2 className="text-xl font-bold text-white mb-2">Paid Successfully!</h2>
                                        <p className="text-white/50 text-sm">Redirecting to tickets...</p>
                                    </div>
                                ) : status === 'processing' ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="relative w-16 h-16 mb-6">
                                            <div className="absolute inset-0 border-4 border-pink-500/30 rounded-full" />
                                            <div className="absolute inset-0 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Lock className="w-6 h-6 text-pink-500 animate-pulse" />
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-white animate-pulse">Processing Payment...</h3>
                                        <p className="text-white/50 text-sm mt-2">Please do not close this window</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">

                                        {/* Amount Display */}
                                        <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-5 border border-white/10 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                                <Tag className="w-24 h-24 rotate-12" />
                                            </div>
                                            <div className="flex justify-between items-start relative z-10">
                                                <div>
                                                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Amount</span>
                                                    <div className="flex items-baseline gap-2 mt-1">
                                                        <span className="text-3xl font-bold text-white">₹{amount}</span>
                                                        {couponApplied && (
                                                            <span className="text-sm text-gray-500 line-through">₹{initialAmount}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                {!couponApplied ? (
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={couponCode}
                                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                            placeholder="COUPON"
                                                            className="w-24 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-pink-500 focus:outline-none uppercase"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={handleApplyCoupon}
                                                            className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs font-bold transition-colors"
                                                        >
                                                            Apply
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="bg-green-500/20 border border-green-500/40 rounded-lg px-3 py-1 flex items-center gap-2">
                                                        <Check className="w-3 h-3 text-green-400" />
                                                        <span className="text-xs font-bold text-green-400">COUPON APPLIED</span>
                                                    </div>
                                                )}
                                            </div>
                                            {couponError && <p className="text-red-400 text-xs mt-2 relative z-10">{couponError}</p>}
                                            {couponApplied && <p className="text-green-400 text-xs mt-2 relative z-10">You saved ₹{initialAmount - amount}!</p>}
                                        </div>

                                        {method === 'card' && (
                                            <div className="space-y-4">
                                                {/* Card Selection Tabs */}
                                                <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                                                    <button
                                                        type="button"
                                                        onClick={() => setCardType('saved')}
                                                        className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${cardType === 'saved' ? 'bg-pink-600/20 text-pink-500 shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                                    >
                                                        Saved Cards
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setCardType('new')}
                                                        className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${cardType === 'new' ? 'bg-pink-600/20 text-pink-500 shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                                    >
                                                        New Card
                                                    </button>
                                                </div>

                                                {cardType === 'saved' ? (
                                                    <div className="group relative overflow-hidden p-5 border border-pink-500/50 bg-gradient-to-br from-pink-600/10 to-purple-600/10 rounded-2xl cursor-pointer hover:border-pink-500 transition-all">
                                                        <div className="absolute top-0 right-0 p-4 opacity-50">
                                                            <CreditCard className="w-16 h-16 text-white/5 -rotate-12" />
                                                        </div>
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-2">
                                                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                                                                <span className="text-white/50 text-sm">Fintech Bank</span>
                                                            </div>
                                                            <div className="w-4 h-4 rounded-full border border-pink-500 flex items-center justify-center">
                                                                <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                                                            </div>
                                                        </div>
                                                        <div className="text-xl font-mono text-white tracking-widest mb-4">
                                                            •••• •••• •••• 4242
                                                        </div>
                                                        <div className="flex justify-between items-end">
                                                            <div>
                                                                <p className="text-[10px] text-white/50 uppercase tracking-wider">Card Holder</p>
                                                                <p className="text-sm font-bold text-white">NIKHIL KUMAR SINGH</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] text-white/50 uppercase tracking-wider">Expires</p>
                                                                <p className="text-sm font-bold text-white">12/28</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Card Number</label>
                                                            <div className="relative">
                                                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                                                <input
                                                                    type="text"
                                                                    value={cardNumber}
                                                                    onChange={handleCardNumberChange}
                                                                    placeholder="0000 0000 0000 0000"
                                                                    maxLength="19"
                                                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors font-mono"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Expiry</label>
                                                                <input
                                                                    type="text"
                                                                    value={expiry}
                                                                    onChange={handleExpiryChange}
                                                                    placeholder="MM/YY"
                                                                    maxLength="5"
                                                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors text-center font-mono"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">CVV</label>
                                                                <input
                                                                    type="password"
                                                                    value={cvv}
                                                                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                                                                    placeholder="123"
                                                                    maxLength="3"
                                                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors text-center font-mono"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Cardholder Name</label>
                                                            <input
                                                                type="text"
                                                                value={name}
                                                                onChange={(e) => setName(e.target.value)}
                                                                placeholder="JOHN DOE"
                                                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors uppercase"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {method === 'upi' && (
                                            <div className="space-y-4">
                                                <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 mb-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setUpiMethod('vpa')}
                                                        className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${upiMethod === 'vpa' ? 'bg-pink-600/20 text-pink-500 shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                                    >
                                                        Enter UPI ID
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setUpiMethod('qr')}
                                                        className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${upiMethod === 'qr' ? 'bg-pink-600/20 text-pink-500 shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                                    >
                                                        Scan QR
                                                    </button>
                                                </div>

                                                {upiMethod === 'vpa' ? (
                                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">UPI ID</label>
                                                        <div className="relative">
                                                            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                                            <input
                                                                type="text"
                                                                value={vpa}
                                                                onChange={(e) => setVpa(e.target.value)}
                                                                placeholder="username@upi"
                                                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors"
                                                                required
                                                            />
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-2 ml-1">Examples: number@paytm, user@okicici</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl animate-in fade-in zoom-in duration-300">
                                                        <QRCodeSVG
                                                            value={`upi://pay?pa=mock@upi&pn=MovieApp&am=${amount}&cu=INR`}
                                                            size={200}
                                                        />
                                                        <p className="text-black font-bold mt-4 text-sm">Scan with any UPI App</p>
                                                        <div className="flex gap-2 mt-2 grayscale opacity-60">
                                                            <span className="text-[10px] bg-gray-200 px-1 rounded">GPay</span>
                                                            <span className="text-[10px] bg-gray-200 px-1 rounded">PhonePe</span>
                                                            <span className="text-[10px] bg-gray-200 px-1 rounded">Paytm</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {method === 'wallet' && (
                                            <div className="space-y-4">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Select Wallet</label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {['Paytm', 'PhonePe', 'Amazon Pay', 'Mobikwik'].map((wallet) => (
                                                        <button
                                                            key={wallet}
                                                            type="button"
                                                            onClick={() => setSelectedWallet(wallet)}
                                                            className={`p-4 border rounded-xl flex items-center justify-center text-sm font-medium transition-all relative group
                                            ${selectedWallet === wallet
                                                                    ? 'bg-pink-600/20 border-pink-500 text-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                                                                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-pink-500/50 text-gray-300'
                                                                }`}
                                                        >
                                                            {wallet}
                                                            {selectedWallet === wallet && (
                                                                <div className="absolute top-3 right-3 w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>

                                                {selectedWallet && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="bg-white/5 border border-white/10 rounded-xl p-4 mt-2"
                                                    >
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-gray-400 text-sm">{selectedWallet} Balance</span>
                                                            <span className={`font-bold text-lg ${walletBalances[selectedWallet] >= amount ? 'text-green-500' : 'text-red-500'}`}>
                                                                ₹{walletBalances[selectedWallet]}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-500 flex justify-between items-center">
                                                            <span>Deduction: ₹{amount}</span>
                                                            {walletBalances[selectedWallet] < amount ? (
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-red-400 font-bold flex items-center gap-1">
                                                                        <X className="w-3 h-3" /> Insufficient
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            const needed = amount - walletBalances[selectedWallet] + 100;
                                                                            setWalletBalances(prev => ({
                                                                                ...prev,
                                                                                [selectedWallet]: prev[selectedWallet] + needed
                                                                            }));
                                                                        }}
                                                                        className="flex items-center gap-1 px-2 py-1 bg-pink-600 rounded text-[10px] font-bold text-white hover:bg-pink-500 transition-colors shadow-lg shadow-pink-600/20"
                                                                    >
                                                                        <Plus className="w-3 h-3" /> Add Funds
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <span className="text-green-400 font-bold flex items-center gap-1">
                                                                    <Check className="w-3 h-3" /> Sufficient Balance
                                                                </span>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={method === 'wallet' && (!selectedWallet || walletBalances[selectedWallet] < amount)}
                                            className={`w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl shadow-lg transition-all transform flex items-center justify-center gap-2 mt-6 group
                            ${(method === 'wallet' && (!selectedWallet || walletBalances[selectedWallet] < amount))
                                                    ? 'opacity-50 cursor-not-allowed grayscale'
                                                    : 'hover:from-pink-500 hover:to-purple-500 hover:shadow-pink-600/40 hover:scale-[1.02] active:scale-[0.98]'
                                                }
                        `}
                                        >
                                            <Lock className="w-4 h-4 group-hover:animate-pulse" />
                                            {method === 'wallet'
                                                ? (selectedWallet && walletBalances[selectedWallet] >= amount ? "Pay with Wallet" : "Select Wallet")
                                                : (upiMethod === 'qr' && method === 'upi' ? "I Have Paid" : "Pay Now")
                                            }
                                        </button>

                                    </form>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PaymentModal;
