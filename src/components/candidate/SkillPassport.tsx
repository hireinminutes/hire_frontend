import { useRef, useState } from 'react';
import { Download, Loader2, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import html2canvas from 'html2canvas';

interface SkillPassportProps {
    userProfile?: any;
}

export function SkillPassport({ userProfile }: SkillPassportProps) {
    const { profile: authProfile } = useAuth();
    const profile = userProfile || authProfile;
    const cardRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const passport = (profile as any)?.skillPassport || {};
    // Parse skills with scores: "React-90" -> { name: "React", score: 90 }
    const rawSkills: string[] = passport.verifiedSkills || [];
    const parsedSkills = rawSkills.map(skillStr => {
        const [name, scoreStr] = skillStr.split('-');
        const score = parseInt(scoreStr) || 0;
        return { name: name?.trim() || skillStr, score };
    });

    // Prioritize status 'verified' string, but also check boolean isVerified.
    // However, if status is explicitly 'unverified', ensure we return false.
    const isVerified = (profile as any)?.status === 'verified' || ((profile as any)?.isVerified === true && (profile as any)?.status !== 'unverified');

    // Calculate total average score if not provided
    const averageScore = parsedSkills.length > 0
        ? Math.round(parsedSkills.reduce((acc, curr) => acc + curr.score, 0) / parsedSkills.length)
        : (passport.score || 0);

    const displayScore = averageScore || passport.score || 0;

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsDownloading(true);
        try {
            // Clone the element to manipulate it for capture without affecting the UI
            const clone = cardRef.current.cloneNode(true) as HTMLElement;

            // Set fixed inline styles for the clone to ensure consistent rendering
            clone.style.width = '400px';
            clone.style.height = 'auto';
            clone.style.position = 'fixed';
            clone.style.top = '-9999px';
            clone.style.left = '-9999px';
            clone.style.transform = 'none'; // remove any transforms
            document.body.appendChild(clone);

            const canvas = await html2canvas(clone, {
                backgroundColor: null,
                scale: 3,
                useCORS: true,
                allowTaint: true,
                width: 400, // enforced capture width
                windowWidth: 1200, // simulate desktop view
                onclone: (clonedDoc) => {
                    // Optional: Additional styling tweaks on the cloned document if needed
                }
            });

            // Cleanup
            document.body.removeChild(clone);

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
                className="relative w-full min-h-[360px] rounded-[24px] overflow-hidden bg-[#0F172A] shadow-2xl p-6 flex flex-col justify-between select-none border border-slate-800"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#4F46E5_0%,transparent_40%),radial-gradient(circle_at_bottom_left,#EC4899_0%,transparent_40%)] opacity-20"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>

                <div className="relative z-10 flex flex-col h-full gap-6">

                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            {/* Profile Image with Check */}
                            <div className="relative">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg bg-slate-800">
                                    {profile?.profilePicture ? (
                                        <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" crossOrigin="anonymous" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-slate-500 bg-slate-800">
                                            {profile?.fullName?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                {isVerified && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#0F172A] flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="text-xl font-black text-white leading-none mb-1">{profile?.fullName || 'USER'}</h3>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold text-blue-300 uppercase tracking-wider">DEV</span>
                                </div>
                                <div className="text-[10px] font-mono text-slate-500 font-medium tracking-wide">#{passport.badgeId || '8926'}</div>
                                {/* Display user's university/college from education */}
                                <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                                    {profile?.profile?.education?.[0]?.institution || 'Not specified'}
                                </div>
                            </div>
                        </div>

                        {/* Total Score Badge */}
                        <div className="w-20 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 p-[1px] shadow-lg shadow-purple-900/40">
                            <div className="w-full h-full rounded-[11px] bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white">
                                <span className="text-2xl font-black leading-none">{displayScore}%</span>
                                <span className="text-[7px] font-bold uppercase tracking-wider opacity-80 mt-0.5">Total Score</span>
                            </div>
                        </div>
                    </div>

                    {/* Skills Grid */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Skills</div>
                            <div className="w-4 h-4 text-slate-600"><TrendingUp className="w-4 h-4" /></div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {parsedSkills.map((skill, i) => (
                                <div key={i} className="bg-slate-800/40 border border-white/5 rounded-xl p-3 backdrop-blur-sm hover:bg-slate-800/60 transition-colors">
                                    <div className="flex items-center justify-between mb-2">

                                        {/* Skill Ring */}
                                        <div className="relative w-8 h-8">
                                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                                <path
                                                    className="text-slate-700"
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className={`${['text-blue-500', 'text-green-500', 'text-orange-500', 'text-pink-500'][i % 4]} drop-shadow-[0_0_2px_rgba(currentColor,0.5)]`}
                                                    strokeDasharray={`${skill.score || 0}, 100`}
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-[8px] font-bold text-white">{skill.score}%</span>
                                            </div>
                                        </div>

                                        <span className="text-xs font-bold text-white tracking-wide ml-2 flex-1 truncate">{skill.name}</span>
                                    </div>

                                    {/* Progress Bar (Visual Aid) */}
                                    <div className="h-1 w-full bg-slate-700/50 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${['bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500'][i % 4]}`}
                                            style={{ width: `${skill.score}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer - Verification Status */}
                    <div className="pt-4 mt-auto border-t border-white/5">
                        <div className="bg-slate-800/30 rounded-lg p-3 text-center border border-white/5 flex flex-col items-center justify-center">
                            {isVerified ? (
                                <>
                                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div className="text-sm font-bold text-green-400 uppercase leading-tight">Verified Candidate</div>
                                    <div className="text-[10px] text-slate-400 mt-1">Admin Approved</div>
                                </>
                            ) : (
                                <>
                                    <div className="w-8 h-8 rounded-full bg-slate-500/20 flex items-center justify-center mb-2">
                                        <span className="text-lg text-slate-500 font-bold">?</span>
                                    </div>
                                    <div className="text-sm font-bold text-slate-500 uppercase leading-tight">Unverified</div>
                                    <div className="text-[10px] text-slate-400 mt-1">Pending Verification</div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
