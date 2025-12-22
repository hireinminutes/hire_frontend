import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram, ArrowRight, Briefcase } from 'lucide-react';

interface FooterProps {
    onNavigate: (page: string, jobId?: string, role?: 'job_seeker' | 'employer', courseId?: string, successMessage?: string, profileSlug?: string, dashboardSection?: string, authMode?: 'signin' | 'signup') => void;
}

export function Footer({ onNavigate }: FooterProps) {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center">
                                <Briefcase className="w-6 h-6" strokeWidth={2.5} />
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">hireinminutes</span>
                        </div>
                        <p className="text-slate-400 mb-8 leading-relaxed max-w-sm">
                            Connecting talent with opportunity. The fastest way to hire and get hired in India. Verified skills, instant matches.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            <li>
                                <button onClick={() => onNavigate('landing')} className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                    <ArrowRight className="h-4 w-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    Home
                                </button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('for-candidates')} className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                    <ArrowRight className="h-4 w-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    For Candidates
                                </button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('for-recruiters')} className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                    <ArrowRight className="h-4 w-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    For Recruiters
                                </button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('about')} className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                    <ArrowRight className="h-4 w-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    About
                                </button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('contact')} className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                    <ArrowRight className="h-4 w-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    Contact
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Company & Address */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6">Contact Us</h3>

                        <div className="space-y-4 text-sm text-slate-400">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                                <span>
                                    Mayuri Tech Park, KoderSpark,<br />
                                    4th floor, Mangalagiri,<br />
                                    Andhra Pradesh 522503
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-blue-500 shrink-0" />
                                <a href="tel:+919866293371" className="hover:text-blue-400 transition-colors">+91 98662 93371</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-blue-500 shrink-0" />
                                <a href="mailto:info@hireinminutes.in" className="hover:text-blue-400 transition-colors">info@hireinminutes.in</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} hireinminutes. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-slate-500">
                        <button onClick={() => onNavigate('terms-privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
                        <button onClick={() => onNavigate('terms-privacy')} className="hover:text-white transition-colors">Terms of Service</button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
