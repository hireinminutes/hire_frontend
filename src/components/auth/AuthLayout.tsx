import React from 'react';
import { Briefcase, Users, Shield, CheckCircle, Zap, Globe, ArrowLeft, Sparkles } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    role: 'job_seeker' | 'employer';
    onNavigate: (page: string) => void;
    isSignUp: boolean;
}

export function AuthLayout({ children, role, onNavigate, isSignUp }: AuthLayoutProps) {
    const benefits = {
        job_seeker: [
            { icon: Briefcase, text: 'Access 50K+ verified job listings' },
            { icon: Shield, text: 'Build certified skill profiles' },
            { icon: Zap, text: 'Get matched with top employers' },
            { icon: Globe, text: 'Remote and global opportunities' },
        ],
        employer: [
            { icon: Users, text: 'Reach 100K+ pre-vetted candidates' },
            { icon: CheckCircle, text: '90-day hiring satisfaction guarantee' },
            { icon: Zap, text: '70% faster hiring process' },
            { icon: Shield, text: 'Verified skill certifications' },
        ],
    };

    const roleData = {
        job_seeker: {
            image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80',
            title: 'Candidate Portal',
            subtitle: 'Build Your Career'
        },
        employer: {
            image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
            title: 'Employer Workspace',
            subtitle: 'Find Top Talent'
        }
    };

    const currentRoleData = roleData[role];

    return (
        <div className="h-screen w-full flex flex-col md:flex-row font-sans bg-slate-950 overflow-hidden relative selection:bg-blue-500/30 selection:text-blue-200">

            {/* Left Side: Image Panel */}
            <div className="md:w-5/12 lg:w-1/2 relative overflow-hidden h-[30vh] md:h-full group flex-shrink-0">
                <div className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${currentRoleData.image})` }}>
                </div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent md:bg-hidden"></div>
                {/* Desktop Merging Effect */}
                <div className="hidden md:block absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-900 to-transparent"></div>

                {/* Content Overlay - Text on Image */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end md:justify-center text-white z-10 pointers-events-none">
                    {/* Navigation / Return (Mobile: Top Left, Desktop: Top Left absolute) */}
                    <div className="absolute top-6 left-6 z-20 pointer-events-auto">
                        <button
                            onClick={() => onNavigate('role-select')}
                            className="inline-flex items-center text-xs md:text-sm font-bold text-white/90 hover:text-white transition-colors bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 hover:bg-black/50 shadow-lg"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </button>
                    </div>

                    {/* Mobile Header (On Image) */}
                    <div className="md:hidden pointer-events-auto mb-2">
                        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-md">
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </h1>
                        <p className="text-slate-200 text-base font-medium drop-shadow-md">
                            {isSignUp
                                ? `Join us as a ${role === 'employer' ? 'recruiter' : 'job seeker'}`
                                : `Log in to your ${role === 'employer' ? 'employer' : 'candidate'} account`
                            }
                        </p>
                    </div>

                    {/* Desktop Header content */}
                    <div className="hidden md:block mb-8 md:mb-0 md:pl-12 pointer-events-auto">
                        <div className="inline-flex items-center px-3 py-1 mb-6 border border-white/20 bg-slate-900/40 backdrop-blur-md rounded-full w-fit">
                            <Sparkles className="h-3 w-3 text-blue-400 mr-2" />
                            <span className="text-xs font-bold tracking-widest uppercase text-blue-100">{currentRoleData.title}</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight shadow-black/50 drop-shadow-lg">
                            {isSignUp ? 'Begin Journey.' : 'Welcome Back.'}
                        </h1>
                        <p className="text-slate-300 text-lg mb-8 max-w-sm drop-shadow-md">
                            {isSignUp ? "Join the network transforming technical recruitment." : "Access your dashboard to manage your professional profile."}
                        </p>

                        <div className="space-y-4">
                            {benefits[role].map((benefit, index) => {
                                const Icon = benefit.icon;
                                return (
                                    <div key={index} className="flex items-center gap-3 text-slate-300">
                                        <div className="p-1.5 rounded-lg bg-slate-900/40 border border-white/10 backdrop-blur-sm">
                                            <Icon className="h-4 w-4 text-blue-400" />
                                        </div>
                                        <span className="text-sm font-medium">{benefit.text}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form Panel */}
            <div className="w-full md:w-7/12 lg:w-1/2 flex flex-col justify-center bg-slate-900 border-l border-slate-800 h-full overflow-y-auto scrollbar-hide">
                <div className="w-full max-w-md mx-auto px-6 py-8 md:p-12">


                    {children}
                </div>
            </div>
        </div>
    );
}
