import { useRef, useState } from 'react';
import { Download, Loader2, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import html2canvas from 'html2canvas';

export function SkillPassport() {
    const { profile } = useAuth();
    const cardRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const passport = (profile as any)?.skillPassport || {};
    // Only show real verified skills
    const displaySkills = passport.verifiedSkills || [];
    const score = passport.score || 0;

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsDownloading(true);
        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 3,
                useCORS: true,
            });
            const link = document.createElement('a');
            link.download = `Passport-${profile?.fullName || 'User'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Failed to download:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="w-full relative group">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                }}
                disabled={isDownloading}
                className="absolute top-5 right-5 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
                title="Save Card"
            >
                {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            </button>

            <div
                ref={cardRef}
                className="relative w-full min-h-[280px] sm:min-h-[320px] rounded-[24px] overflow-hidden bg-[#0F172A] shadow-2xl p-4 sm:p-6 flex flex-col justify-between select-none"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#4F46E5_0%,transparent_40%),radial-gradient(circle_at_bottom_left,#EC4899_0%,transparent_40%)] opacity-20"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>

                <div className="relative z-10 flex flex-col h-full gap-4 sm:gap-6">

                    {/* Top Row: Profile + Info + Score */}
                    <div className="flex items-start justify-between gap-2 sm:gap-4">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                            {/* Profile Image */}
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg bg-slate-800 shrink-0">
                                {profile?.profilePicture ? (
                                    <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" crossOrigin="anonymous" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xl font-bold text-slate-500 bg-slate-800">
                                        {profile?.fullName?.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Text Info */}
                            <div className="min-w-0 flex-1">
                                <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Passport ID</div>
                                <div className="text-lg sm:text-xl font-black text-white tracking-tight leading-none mb-1 truncate" title={profile?.fullName || 'USER'}>{profile?.fullName || 'USER'}</div>
                                <div className="text-[9px] sm:text-[10px] font-mono text-purple-400 font-medium tracking-wide break-all">{passport.badgeId ? `SP-${passport.badgeId}` : 'PENDING'}</div>
                            </div>
                        </div>

                        {/* Custom Score Circle */}
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path
                                    className="text-slate-800"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                />
                                <path
                                    className="text-purple-500 drop-shadow-[0_0_4px_rgba(168,85,247,0.8)]"
                                    strokeDasharray={`${score}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                <span className="text-xl font-bold leading-none">{score}</span>
                                <span className="text-[8px] uppercase font-bold text-slate-400 mt-0.5">Score</span>
                            </div>
                        </div>
                    </div>

                    {/* Middle: Chart / Status */}
                    <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                        </div>

                        <div className="text-right">
                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</div>
                            <div className="inline-flex items-center px-3 py-1 rounded bg-[#064E3B] border border-[#059669]/30 text-[#34D399] text-[10px] font-bold tracking-wide shadow-[0_0_15px_rgba(5,150,105,0.2)]">
                                VERIFIED
                            </div>
                        </div>
                    </div>

                    {/* Verified Capabilities */}
                    <div className="mt-auto">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,1)]"></div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Capabilities</div>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                            {displaySkills.map((skill: string, i: number) => (
                                <div key={i} className="bg-slate-800/50 border border-white/5 rounded-lg px-3 py-2.5 flex items-center gap-2.5 relative overflow-hidden backdrop-blur-sm">
                                    <div className={`w-2 h-2 rounded-full ${['bg-cyan-400', 'bg-pink-400', 'bg-emerald-400', 'bg-orange-400'][i % 4]} shadow-[0_0_8px_currentColor]`}></div>
                                    <span className="text-xs font-bold text-white tracking-wide truncate">{skill}</span>
                                </div>
                            ))}
                            {/* Removed +More counter */}
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}
