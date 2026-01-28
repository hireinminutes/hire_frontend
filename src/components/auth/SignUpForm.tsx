import { useState, useRef } from 'react';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, ArrowLeft, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { config } from '../../config/api';

interface SignUpFormProps {
    role: 'job_seeker' | 'employer';
    onNavigate: (page: string, jobId?: string, role?: 'job_seeker' | 'employer' | 'admin', courseId?: string, successMessage?: string, profileSlug?: string, dashboardSection?: string, authMode?: 'signin' | 'signup', collegeId?: string) => void;
    onToggleMode: () => void;
    successMessage?: string;
}

export function SignUpForm({ role, onNavigate, onToggleMode, successMessage }: SignUpFormProps) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [registeredEmail, setRegisteredEmail] = useState('');

    const otpInputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null)
    ];

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            otpInputRefs[index + 1].current?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputRefs[index - 1].current?.focus();
        }
    };

    const verifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${config.endpoints.auth}/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: registeredEmail,
                    otp: otpValue,
                    role
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Verification failed');
            }

            // Login successful
            login(data.data.user, data.data.token);

            if (role === 'employer') {
                // Check if recruiter needs onboarding
                if (data.data.requiresOnboarding) {
                    onNavigate('recruiter-onboarding');
                } else {
                    onNavigate('recruiter-dashboard');
                }
            } else {
                onNavigate('jobseeker-dashboard');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!formData.fullName.trim()) {
            setError('Full name is required');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${config.endpoints.auth}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.fullName,
                    role,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            setRegisteredEmail(formData.email);
            setShowOtpInput(true);
            setError(null); // Clear any previous errors
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (showOtpInput) {
        return (
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Verify Email</h2>
                    <p className="text-slate-400 text-sm">
                        Please enter the 6-digit code sent to <br />
                        <span className="font-bold text-white mt-1 block">{registeredEmail}</span>
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 text-red-200 rounded-xl text-sm flex items-center gap-3 border border-red-500/20">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        {error}
                    </div>
                )}

                <form onSubmit={verifyOtp} className="space-y-8">
                    <div className="flex justify-center gap-2 md:gap-3">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={otpInputRefs[index]}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                className="w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-2xl font-bold border-2 border-slate-800 rounded-xl focus:border-blue-500 bg-slate-900/50 text-white transition-all placeholder:text-slate-600 outline-none focus:shadow-lg focus:shadow-blue-500/20 focus:-translate-y-1"
                            />
                        ))}
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        disabled={loading || otp.join('').length !== 6}
                        className="!h-12 !text-sm !font-bold !uppercase !tracking-widest !bg-blue-600 !hover:bg-blue-500 !text-white !shadow-lg !shadow-blue-600/30 !rounded-xl !border-0 hover:!scale-[1.02] active:!scale-[0.98]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            'Verify Email'
                        )}
                    </Button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => setShowOtpInput(false)}
                            className="text-sm font-medium text-slate-500 hover:text-white transition-colors"
                        >
                            Change email address
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-6 hidden md:block">
                <h2 className="text-3xl font-bold text-white">
                    Create Account
                </h2>
                <p className="text-slate-400 mt-2 font-medium">Join us as a {role === 'employer' ? 'recruiter' : 'job seeker'}</p>
            </div>

            {successMessage && (
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl mb-6 flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <p className="text-green-200 text-sm font-bold tracking-wide">{successMessage}</p>
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-6 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-200 text-sm font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-widest">
                        Full Name
                    </label>
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors">
                            <User className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder="JOHN DOE"
                            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border-2 border-slate-800 focus:border-blue-500 outline-none transition-all placeholder:text-slate-500 text-white font-medium rounded-xl focus:shadow-lg focus:shadow-blue-500/10"
                            required
                        />
                    </div>
                </div>

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
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="NAME@COMPANY.COM"
                            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border-2 border-slate-800 focus:border-blue-500 outline-none transition-all placeholder:text-slate-500 text-white font-medium rounded-xl focus:shadow-lg focus:shadow-blue-500/10"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-widest">
                        Password
                    </label>
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors">
                            <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

                <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-widest">
                        Confirm Password
                    </label>
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors">
                            <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-10 py-3 bg-slate-900/50 border-2 border-slate-800 focus:border-blue-500 outline-none transition-all placeholder:text-slate-500 text-white font-medium rounded-xl focus:shadow-lg focus:shadow-blue-500/10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors p-3"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                    className="!h-12 !text-sm !font-bold !uppercase !tracking-widest !bg-blue-600 !hover:bg-blue-500 !text-white !shadow-lg !shadow-blue-600/30 !rounded-xl !border-0 hover:!scale-[1.02] active:!scale-[0.98] mt-2"
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Creating Account...</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2">
                            <span>Get Started</span>
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    )}
                </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Already have an account?</p>
                <button
                    onClick={onToggleMode}
                    className="w-full py-3 border-2 border-slate-800 hover:border-blue-500 text-white hover:text-blue-400 font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group hover:bg-slate-800/50 text-sm"
                >
                    Sign in
                    <ArrowLeft className="h-4 w-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
