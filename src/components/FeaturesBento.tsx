import {
    Shield, GraduationCap, Briefcase, CheckCircle,
    TrendingUp, Users
} from 'lucide-react';
import { Button } from './ui/Button';

export function FeaturesBento({ onNavigate }: { onNavigate: (page: string) => void }) {
    return (
        <section className="min-h-screen flex flex-col justify-center py-12 md:py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 leading-tight">
                        A Smarter Way to <span className="text-blue-600">Hire & Get Hired</span>
                    </h2>
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                        We combine real skills, verified assessments, and meaningful opportunities into one platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto md:auto-rows-[minmax(180px,auto)]">

                    {/* Skill Passport - Large Card */}
                    <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-xl">
                        <div className="absolute top-0 right-0 p-8 md:p-12 opacity-5 pointer-events-none">
                            <Shield size={200} className="md:w-[300px] md:h-[300px]" />
                        </div>
                        <div className="p-6 md:p-8 h-full flex flex-col relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                                    <Shield size={24} className="md:w-7 md:h-7" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-slate-900">Skill Passport</h3>
                            </div>
                            <p className="text-base md:text-lg text-slate-600 mb-8 max-w-lg md:max-w-[45%]">
                                Your new digital hiring identity. Showcase verified skills, earned badges, and project portfolios.
                                Share it anywhere to stand out from the crowd.
                            </p>
                            <div className="mt-auto flex gap-4">
                                <Button onClick={() => onNavigate('profile')} className="bg-blue-600 text-white hover:bg-blue-700 rounded-full w-full md:w-auto justify-center">
                                    Create Your Passport
                                </Button>
                            </div>

                            {/* Visual Representation - Hidden on mobile, shown on md+ */}
                            <div className="hidden md:block absolute bottom-8 right-8 w-[520px] rounded-2xl shadow-2xl transition-all duration-500 hover:shadow-blue-500/20">
                                <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-2xl p-6 relative overflow-hidden border border-slate-700/50">
                                    {/* Gradient Accents */}
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>

                                    {/* Content Grid */}
                                    <div className="relative z-10 grid grid-cols-[auto_1fr_auto] gap-6 items-start">

                                        {/* Left: Profile Section */}
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="relative">
                                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                                    <span className="text-2xl font-bold text-white">AM</span>
                                                </div>
                                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                                                    <CheckCircle size={12} className="text-white" fill="white" />
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <h4 className="text-white font-bold text-base leading-tight">Alex Morgan</h4>
                                                <div className="flex items-center gap-1.5 mt-1 justify-center">
                                                    <div className="px-2 py-0.5 rounded-md bg-blue-500/20 border border-blue-500/30 text-[10px] font-bold text-blue-400">DEV</div>
                                                </div>
                                                <span className="text-slate-500 text-[9px] font-mono mt-1 block">#8920</span>
                                            </div>
                                        </div>

                                        {/* Middle: Skills Section */}
                                        <div className="space-y-2.5 pt-1">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Verified Skills</span>
                                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                                            </div>
                                            {[
                                                { name: 'React', pct: 90, color: 'from-blue-500 to-cyan-500' },
                                                { name: 'Node.js', pct: 85, color: 'from-green-500 to-emerald-500' },
                                                { name: 'AWS', pct: 75, color: 'from-orange-500 to-amber-500' },
                                                { name: 'Figma', pct: 80, color: 'from-purple-500 to-pink-500' }
                                            ].map((skill) => (
                                                <div key={skill.name} className="group">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white transition-colors">{skill.name}</span>
                                                        <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-400">{skill.pct}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                                                        <div
                                                            className={`h-full rounded-full bg-gradient-to-r ${skill.color} shadow-lg transition-all duration-500 group-hover:shadow-xl`}
                                                            style={{ width: `${skill.pct}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Right: Stats & Badge */}
                                        <div className="flex flex-col gap-3 min-w-[140px]">
                                            {/* Stats */}
                                            <div className="space-y-2">
                                                <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-xl p-3 border border-orange-500/20 backdrop-blur-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                                            <Briefcase size={14} className="text-orange-400" />
                                                        </div>
                                                        <div>
                                                            <div className="text-lg font-bold text-white leading-none">33</div>
                                                            <div className="text-[9px] text-orange-300/80 uppercase tracking-wide">Projects</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 rounded-xl p-3 border border-indigo-500/20 backdrop-blur-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                                            <TrendingUp size={14} className="text-indigo-400" />
                                                        </div>
                                                        <div>
                                                            <div className="text-lg font-bold text-white leading-none">Top 5%</div>
                                                            <div className="text-[9px] text-indigo-300/80 uppercase tracking-wide">Rank</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Verification Badge */}
                                            <div className="relative mt-auto">
                                                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg blur opacity-30"></div>
                                                <div className="relative bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-2 flex items-center justify-center gap-1.5">
                                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                    <span className="text-[10px] font-bold text-green-400 tracking-wide">VERIFIED</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* For Students - Vertical Card */}
                    <div className="md:row-span-2 relative group overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl">
                        <div className="p-6 md:p-8 h-full flex flex-col">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                    <GraduationCap size={24} className="md:w-7 md:h-7" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold">For Students</h3>
                            </div>
                            <ul className="space-y-4 md:space-y-6">
                                {[
                                    'Build verified Skill Passport',
                                    'Take skill assessments',
                                    'Direct internship access',
                                    'Earn badges & rewards'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="mt-1 p-0.5 rounded-full bg-blue-500 border border-blue-400">
                                            <CheckCircle size={14} className="text-white" />
                                        </div>
                                        <span className="text-blue-50 font-medium text-base md:text-lg">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-auto pt-8">
                                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                                    <div className="text-2xl md:text-3xl font-bold mb-1">500+</div>
                                    <div className="text-xs md:text-sm text-blue-200">New internships added this week</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* For Recruiters - Wide Card */}
                    <div className="md:col-span-3 relative group overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-xl">
                        <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
                                        <Briefcase size={24} className="md:w-7 md:h-7" />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-slate-900">For Recruiters</h3>
                                </div>
                                <p className="text-base md:text-lg text-slate-600 mb-6">
                                    Skip the noise. Hire pre-vetted candidates with verified skills.
                                    Reduce your time-to-hire by 60% with our automated screening.
                                </p>
                                <div className="flex flex-wrap gap-2 md:gap-3">
                                    {['Verified Candidates', 'Instant Hiring', 'Premium Talent'].map(tag => (
                                        <span key={tag} className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-100 text-xs md:text-sm font-medium">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="relative mt-6 md:mt-0">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                        <TrendingUp className="text-green-500 mb-2 w-5 h-5 md:w-6 md:h-6" />
                                        <div className="text-xl md:text-2xl font-bold text-slate-900">60%</div>
                                        <div className="text-xs text-slate-500">Faster Hiring</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                        <Users className="text-blue-500 mb-2 w-5 h-5 md:w-6 md:h-6" />
                                        <div className="text-xl md:text-2xl font-bold text-slate-900">10k+</div>
                                        <div className="text-xs text-slate-500">Active Talent</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
