import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface SignInFormProps {
    role: 'job_seeker' | 'employer';
    onNavigate: (page: string, jobId?: string, role?: 'job_seeker' | 'employer', courseId?: string, successMessage?: string, profileSlug?: string, dashboardSection?: string, authMode?: 'signin' | 'signup') => void;
    onToggleMode: () => void;
}

export function SignInForm({ role, onNavigate, onToggleMode }: SignInFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(email, password, role);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            if (errorMessage === 'REQUIRES_2FA') {
                // Navigate to 2FA verification page
                onNavigate('verify-2fa', undefined, role);
            } else if (errorMessage === 'REQUIRES_ONBOARDING') {
                // Navigate to recruiter onboarding
                onNavigate('recruiter-onboarding');
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-widest">
                        Email Address
                    </label>
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors">
                            <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="NAME@COMPANY.COM"
                            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border-2 border-slate-800 focus:border-blue-500 outline-none transition-all placeholder:text-slate-500 text-white font-medium rounded-xl focus:shadow-lg focus:shadow-blue-500/10"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="block text-xs font-bold text-slate-200 uppercase tracking-widest">
                            Password
                        </label>
                        <button
                            type="button"
                            onClick={() => onNavigate('forgot-password', undefined, role)}
                            className="text-xs font-bold text-slate-400 hover:text-blue-400 transition-colors uppercase tracking-wide"
                        >
                            Forgot?
                        </button>
                    </div>
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors">
                            <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-10 py-3 bg-slate-900/50 border-2 border-slate-800 focus:border-blue-500 outline-none transition-all placeholder:text-slate-500 text-white font-medium rounded-xl focus:shadow-lg focus:shadow-blue-500/10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors p-3"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl animate-shake">
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-red-500/20 rounded-full">
                                <span className="text-red-500 font-bold block w-4 h-4 text-center leading-4 text-xs">!</span>
                            </div>
                            <p className="text-red-200 text-sm font-medium">{error}</p>
                        </div>
                    </div>
                )}

                <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                    className="!h-12 !text-sm !font-bold !uppercase !tracking-widest !bg-blue-600 !hover:bg-blue-500 !text-white !shadow-lg !shadow-blue-600/30 !rounded-xl !border-0 hover:!scale-[1.02] active:!scale-[0.98]"
                >
                    {loading ? 'Authenticating...' : 'Sign In'}
                </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">New to Platform?</p>
                <button
                    onClick={onToggleMode}
                    className="w-full py-3 border-2 border-slate-800 hover:border-blue-500 text-white hover:text-blue-400 font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group hover:bg-slate-800/50 text-sm"
                >
                    Create Account
                    <ArrowLeft className="h-4 w-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </>
    );
}
