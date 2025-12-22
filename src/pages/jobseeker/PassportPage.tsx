
import { SkillPassport } from '../../components/candidate/SkillPassport';
import { Briefcase, Eye, TrendingUp, Lock, Share2, CheckCircle2, Shield } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PassportPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Navbar is handled by App.tsx CardNav */}
            <div className="h-20 hidden lg:block"></div> {/* Spacer for fixed nav */}

            <main className="pt-24 pb-20 lg:pt-8">
                <div className="container mx-auto px-4 max-w-6xl">

                    {/* Mobile Header (SaaS Style) */}
                    <div className="lg:hidden mb-8 text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-3">
                            <Shield className="w-3.5 h-3.5 fill-current" /> Verified Identity
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2 leading-tight">Skill Passport</h1>
                        <p className="text-slate-500 font-medium">Your universal professional identity.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

                        {/* Left: Passport Visualization */}
                        <div className="w-full lg:w-5/12 lg:sticky lg:top-32">
                            <div className="hidden lg:block mb-8">
                                <h1 className="text-4xl font-black text-slate-900 mb-2">Skill Passport</h1>
                                <p className="text-lg text-slate-500 font-medium">Your specific, verifiable hiring identity.</p>
                            </div>

                            <div className="transform transition-all duration-300 hover:scale-[1.01]">
                                <SkillPassport />
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <Button className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-xl shadow-slate-900/10 hover:bg-black hover:-translate-y-1 transition-all active:scale-95">
                                    <Share2 className="w-4 h-4" /> Share Profile
                                </Button>
                                <Button className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm">
                                    <Eye className="w-4 h-4" /> Public View
                                </Button>
                            </div>
                        </div>

                        {/* Right: Detailed Analytics */}
                        <div className="w-full lg:w-7/12 space-y-6 lg:space-y-8">

                            {/* Key Metrics */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                {[
                                    { label: 'Profile Views', value: '1,240', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                                    { label: 'Applications', value: '42', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
                                    { label: 'Skill Growth', value: '+12%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                                ].map((stat, i) => (
                                    <div key={i} className={`bg-white p-4 sm:p-5 rounded-2xl border ${stat.border} shadow-sm hover:shadow-md transition-shadow`}>
                                        <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                                            <stat.icon className="w-5 h-5" />
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-black text-slate-900 mb-0.5">{stat.value}</div>
                                        <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Verification Status */}
                            <div className="bg-white rounded-[24px] sm:rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 p-6 sm:p-8 overflow-hidden relative">
                                <div className="flex items-center justify-between mb-6 sm:mb-8 relative z-10">
                                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <CheckCircle2 className="w-6 h-6 text-slate-900" />
                                        Verification Status
                                    </h3>
                                    <Button variant="ghost" className="text-blue-600 text-sm font-bold hover:text-blue-700 transition-colors">View Details</Button>
                                </div>

                                <div className="space-y-3 sm:space-y-4 relative z-10">
                                    {[
                                        { label: 'Email Verified', status: 'Verified', date: 'Oct 12, 2024' },
                                        { label: 'Phone Verified', status: 'Verified', date: 'Oct 12, 2024' },
                                        { label: 'Skill Tests Passed', status: '3/4 Passed', date: 'Nov 01, 2024' },
                                        { label: 'Interview Badge', status: 'Pending', date: '-', action: 'Book Interview' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 border border-slate-100 transition-colors gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${item.status === 'Pending' ? 'bg-amber-400' : 'bg-green-500'}`} />
                                                <span className="font-bold text-slate-700">{item.label}</span>
                                            </div>
                                            <div className="flex items-center justify-between sm:justify-end gap-4 pl-5 sm:pl-0">
                                                <span className="text-xs text-slate-400 font-medium hidden sm:block">{item.date}</span>
                                                {item.action ? (
                                                    <Button className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-lg shadow-slate-900/20 hover:bg-black hover:scale-105 transition-all">
                                                        {item.action}
                                                    </Button>
                                                ) : (
                                                    <span className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-xs font-bold border border-green-200 flex items-center gap-1.5">
                                                        <CheckCircle2 className="w-3.5 h-3.5 fill-current/20" /> {item.status}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Locked Features (Monetization Teaser) */}
                            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/30">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                                <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]"></div>

                                <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-amber-500/30 shrink-0">
                                        <Lock className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-200">
                                            Unlock Premium Insights
                                        </h3>
                                        <p className="text-slate-300 text-sm mb-6 leading-relaxed max-w-md font-medium">
                                            See exactly which companies viewed your profile, get AI-powered resume improvements, and access detailed salary insights for your role.
                                        </p>
                                        <Button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-slate-900 font-black text-sm hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                            Upgrade to Pro • ₹499/mo
                                        </Button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </main>


        </div>
    );
}
