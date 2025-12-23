import React, { useState } from 'react';
import { Mail, Send, ArrowUpRight, Linkedin, Twitter, Instagram, Youtube, Share2 } from 'lucide-react';

import { Button } from '../components/ui/Button';

interface ContactPageProps {
    onNavigate: (page: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
    });

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setStatus('success');
                alert('Thank you for contacting us!');
                setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
                setStatus('idle');
            } else {
                throw new Error(data.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
            alert('Failed to send message. Please try again.');
        } finally {
            if (status !== 'success') setStatus('idle');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">

            {/* Mobile Floating FAQ Tag */}
            <button
                onClick={() => onNavigate('faq')}
                className="md:hidden fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-black text-white px-1.5 py-4 rounded-l-md shadow-lg hover:shadow-xl transition-all"
                style={{ writingMode: 'vertical-rl' }}
            >
                <span className="text-[10px] font-bold tracking-wider">FAQS</span>
            </button>

            {/* Subtle Grid Background */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                    backgroundSize: `40px 40px`
                }}
            ></div>

            <div className="relative pt-24 md:pt-32 pb-12 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">

                <div className="mb-12 md:mb-16 text-center lg:text-left">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
                        Get in touch.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 font-light max-w-2xl mx-auto lg:mx-0">
                        We're here to help you find the right talent or the perfect job.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[minmax(160px,auto)] md:auto-rows-[minmax(180px,auto)]">

                    {/* Left Column: Form (Desktop: Left, Mobile: Second) */}
                    <div className="col-span-2 md:col-span-2 bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group order-2 md:order-1">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Send className="w-24 h-24 md:w-32 md:h-32" />
                        </div>

                        <h2 className="text-xl md:text-2xl font-bold mb-6 text-slate-900">Send a Message</h2>
                        <form onSubmit={handleSubmit} className="relative z-10 space-y-4 md:space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Jane Doe"
                                        className="w-full bg-slate-50 border-0 border-b-2 border-slate-200 focus:border-blue-600 focus:ring-0 px-0 py-3 transition-colors bg-transparent placeholder:text-slate-400 text-base md:text-lg"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+91 98765 43210"
                                        className="w-full bg-slate-50 border-0 border-b-2 border-slate-200 focus:border-blue-600 focus:ring-0 px-0 py-3 transition-colors bg-transparent placeholder:text-slate-400 text-base md:text-lg"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="jane@example.com"
                                        className="w-full bg-slate-50 border-0 border-b-2 border-slate-200 focus:border-blue-600 focus:ring-0 px-0 py-3 transition-colors bg-transparent placeholder:text-slate-400 text-base md:text-lg"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="Hiring Inquiry"
                                        className="w-full bg-slate-50 border-0 border-b-2 border-slate-200 focus:border-blue-600 focus:ring-0 px-0 py-3 transition-colors bg-transparent placeholder:text-slate-400 text-base md:text-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">How can we help?</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Tell us about your hiring needs..."
                                    className="w-full bg-slate-50 border-0 border-b-2 border-slate-200 focus:border-blue-600 focus:ring-0 px-0 py-3 transition-colors bg-transparent placeholder:text-slate-400 text-base md:text-lg resize-none"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end pt-4">
                                <Button type="submit" disabled={status === 'loading'} className="w-full sm:w-auto bg-slate-900 text-white hover:bg-black rounded-full px-8 h-12 font-bold text-sm tracking-wide shadow-lg shadow-slate-900/20 disabled:opacity-70 disabled:cursor-not-allowed">
                                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Info & Socials (Desktop: Right, Mobile: First) */}
                    <div className="col-span-2 md:col-span-1 flex flex-col gap-4 md:gap-6 order-1 md:order-2">

                        {/* Socials */}
                        <div className="bg-slate-50 rounded-2xl md:rounded-3xl p-5 md:p-8 border border-slate-200 flex flex-col justify-between hover:bg-white hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-start">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-200 rounded-lg md:rounded-xl flex items-center justify-center text-slate-600">
                                    <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                            </div>
                            <div>
                                <h3 className="text-base md:text-lg font-bold text-slate-900 mb-3 md:mb-4">Connect</h3>
                                <div className="flex gap-2 md:gap-3">
                                    <a href="https://www.linkedin.com/company/hire-in-minutes" target="_blank" rel="noopener noreferrer" className="p-1.5 md:p-2 bg-white border border-slate-200 rounded-lg hover:border-blue-700 hover:text-blue-700 transition-colors">
                                        <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
                                    </a>
                                    <a href="https://www.instagram.com/hire_in_minutes" target="_blank" rel="noopener noreferrer" className="p-1.5 md:p-2 bg-white border border-slate-200 rounded-lg hover:border-pink-600 hover:text-pink-600 transition-colors">
                                        <Instagram className="w-4 h-4 md:w-5 md:h-5" />
                                    </a>
                                    <a href="https://www.youtube.com/@HireInMinutes" target="_blank" rel="noopener noreferrer" className="p-1.5 md:p-2 bg-white border border-slate-200 rounded-lg hover:border-red-600 hover:text-red-600 transition-colors">
                                        <Youtube className="w-4 h-4 md:w-5 md:h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Direct Contact & FAQ Container */}
                        <div className="grid grid-cols-2 md:flex md:flex-col gap-4 md:gap-6">

                            {/* Direct Contact */}
                            <div className="col-span-1 bg-slate-900 rounded-2xl md:rounded-3xl p-5 md:p-8 text-white flex flex-col justify-between relative overflow-hidden group md:flex-1">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div>
                                    <div className="flex justify-between items-start mb-4 md:mb-6">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-lg md:rounded-xl flex items-center justify-center backdrop-blur-sm">
                                            <Mail className="w-4 h-4 md:w-5 md:h-5 text-blue-300" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider">Mon-Fri</p>
                                            <p className="text-[10px] text-slate-400 font-medium">9am - 6pm</p>
                                        </div>
                                    </div>

                                    <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4">Direct Contact</h3>

                                    <div className="space-y-3 md:space-y-4">
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Email</p>
                                            <a href="mailto:info@hireinminutes.in" className="text-xs md:text-sm font-medium hover:text-blue-300 transition-colors block text-white/90 truncate">
                                                info@hireinminutes.in
                                            </a>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Phone</p>
                                            <a href="tel:+919866293371" className="text-xs md:text-sm font-medium hover:text-blue-300 transition-colors block text-white/90">
                                                +91 98662 93371
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ */}
                            <div className="col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl md:rounded-3xl p-5 md:p-6 text-white text-center shadow-xl shadow-blue-900/10 cursor-pointer hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-center" onClick={() => onNavigate('faq')}>
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center mb-2 mx-auto backdrop-blur-sm">
                                    <span className="text-base md:text-lg font-bold">?</span>
                                </div>
                                <h2 className="text-base md:text-lg font-black mb-1 tracking-tight">FAQ'S</h2>
                            </div>
                        </div>
                    </div>

                </div>
            </div>


        </div>
    );
}

export default ContactPage;
