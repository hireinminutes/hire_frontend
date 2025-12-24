import { useState, useEffect } from 'react';
import { Menu, X, Briefcase, User, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
    onNavigate: (page: string, jobId?: string, role?: 'job_seeker' | 'employer' | 'admin', courseId?: string, successMessage?: string, profileSlug?: string, dashboardSection?: string, authMode?: 'signin' | 'signup') => void;
    currentPage?: string;
}

export function Navbar({ onNavigate, currentPage = 'landing' }: NavbarProps) {
    const { user, profile, signOut } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Pages with Dark Hero sections where text should be white initially
    const DARK_HERO_PAGES = ['landing', 'for-candidates', 'for-recruiters'];
    const isDarkHero = DARK_HERO_PAGES.includes(currentPage);

    // Theme logic:
    // If Scrolled -> Always White Background + Dark Text
    // If Top + Dark Hero -> Transparent Background + White Text
    // If Top + Light Hero -> Transparent Background + Dark Text
    const isDarkTheme = isDarkHero && !isScrolled;

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Update scrolled state
            setIsScrolled(currentScrollY > 20);

            // Show/hide navbar based on scroll direction
            if (currentScrollY < lastScrollY || currentScrollY < 100) {
                // Scrolling up or near top - show navbar
                setShowNavbar(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down and past 100px - hide navbar
                setShowNavbar(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Close mobile menu on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) { // lg breakpoint
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (showUserMenu && !target.closest('.user-menu-container')) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showUserMenu]);

    const handleSignOut = async () => {
        try {
            await signOut();
            onNavigate('landing');
            setShowUserMenu(false);
            setIsMobileMenuOpen(false);
        } catch (error) {
            console.error('Logout error:', error);
            onNavigate('landing');
        }
    };

    const handleNavClick = (page: string, role?: 'job_seeker' | 'employer', authMode?: 'signin' | 'signup') => {
        onNavigate(page, undefined, role, undefined, undefined, undefined, undefined, authMode);
        setIsMobileMenuOpen(false);
        setShowUserMenu(false);
    };

    const navItems = [
        { label: 'Home', page: 'landing' },
        { label: 'For Candidates', page: 'for-candidates' },
        { label: 'For Recruiters', page: 'for-recruiters' },
        { label: 'About', page: 'about' },
        { label: 'Contact', page: 'contact' }
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${showNavbar ? 'translate-y-0' : '-translate-y-full'
                    } ${isScrolled
                        ? 'bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-b border-white/20'
                        : 'bg-transparent py-2'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-14' : 'h-16'}`}>
                        {/* Brand Logo - Simple & Professional */}
                        <div
                            className="flex items-center gap-2 cursor-pointer group select-none"
                            onClick={() => handleNavClick('landing')}
                        >
                            <div className={`p-1.5 rounded-xl transition-colors ${isDarkTheme
                                ? 'bg-white/10 group-hover:bg-white/20'
                                : 'bg-blue-50 group-hover:bg-blue-100'
                                }`}>
                                <img src="/hireinminuteslogo.png" alt="Hire In Minutes" className="w-5 h-5 object-contain" />
                            </div>
                            <span className={`text-lg font-bold tracking-tight ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
                                hireinminutes
                            </span>
                        </div>

                        {/* Desktop Navigation - Pill Style with Floating Indicators */}
                        <div className={`hidden lg:flex items-center gap-1 p-1 rounded-full border transition-all duration-300 ${isScrolled
                            ? 'bg-slate-100/50 border-slate-200/50 backdrop-blur-sm'
                            : isDarkTheme
                                ? 'bg-white/10 border-white/10 backdrop-blur-sm'
                                : 'bg-white/40 border-white/40 backdrop-blur-md shadow-sm'
                            }`}>
                            {navItems.map((item) => {
                                const isActive = currentPage === item.page;
                                return (
                                    <button
                                        key={item.page}
                                        onClick={() => handleNavClick(item.page)}
                                        className={`relative px-4 py-1.5 text-sm font-semibold rounded-full transition-all group overflow-hidden ${isActive
                                            ? isDarkTheme
                                                ? 'text-white bg-white/20'
                                                : 'text-slate-900 bg-white shadow-sm'
                                            : isDarkTheme
                                                ? 'text-slate-200 hover:text-white'
                                                : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                    >
                                        <span className="relative z-10">{item.label}</span>
                                        {!isActive && (
                                            <span className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-300 transform scale-90 group-hover:scale-100 ${isDarkTheme ? 'bg-white/10' : 'bg-white'
                                                }`}></span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Desktop Auth Buttons / User Menu */}
                        <div className="hidden lg:flex items-center gap-4">
                            {!user ? (
                                <>
                                    <button
                                        onClick={() => handleNavClick('auth', 'job_seeker', 'signin')}
                                        className={`px-3 py-1.5 text-sm font-semibold transition-colors relative group ${isDarkTheme ? 'text-white hover:text-blue-300' : 'text-slate-600 hover:text-blue-600'}`}
                                    >
                                        Sign In
                                        <span className={`absolute bottom-1 left-4 right-4 h-0.5 origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${isDarkTheme ? 'bg-blue-300' : 'bg-blue-600'}`}></span>
                                    </button>
                                    <button
                                        onClick={() => handleNavClick('role-select')}
                                        className="relative px-5 py-2 rounded-full bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40 hover:-translate-y-0.5 transition-all overflow-hidden group"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            Get Started <Sparkles className="w-3.5 h-3.5" />
                                        </span>
                                        <div className="absolute inset-0 -translate-x-[100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out"></div>
                                    </button>
                                </>
                            ) : (
                                <div className="relative user-menu-container">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className={`flex items-center gap-2 px-2 py-1.5 pr-3 rounded-full border transition-all duration-300 group ${showUserMenu || isScrolled
                                            ? 'bg-white border-slate-200 shadow-sm'
                                            : isDarkTheme
                                                ? 'bg-white/10 border-white/10 hover:bg-white/20'
                                                : 'bg-white/50 border-transparent hover:bg-white hover:border-slate-200'
                                            }`}
                                    >
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px] shadow-sm">
                                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                                                {profile?.fullName?.charAt(0) || 'U'}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start leading-none">
                                            <span className={`text-[11px] font-bold ${showUserMenu || isScrolled || !isDarkTheme ? 'text-slate-800' : 'text-white'}`}>{profile?.fullName?.split(' ')[0] || 'User'}</span>
                                            <span className={`text-[9px] font-medium capitalize ${showUserMenu || isScrolled || !isDarkTheme ? 'text-slate-500' : 'text-slate-300'}`}>{profile?.role?.replace('_', ' ')}</span>
                                        </div>
                                        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : 'group-hover:translate-y-0.5'} ${showUserMenu || isScrolled || !isDarkTheme ? 'text-slate-400' : 'text-slate-300'}`} />
                                    </button>
                                    {/* Dropdown menu content remains same, just adjusted button trigger above */}
                                    {showUserMenu && (
                                        <div className="absolute top-full right-0 mt-3 w-64 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-white/20 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 ring-1 ring-black/5">
                                            <div className="p-4 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
                                                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Currently Signed In</p>
                                                <p className="text-sm font-bold text-slate-900 truncate">{profile?.email}</p>
                                            </div>

                                            <div className="p-2">
                                                <button
                                                    onClick={() => {
                                                        const dashboardPage = profile?.role === 'employer' ? 'recruiter-dashboard' :
                                                            profile?.role === 'admin' ? 'admin' :
                                                                profile?.role === 'college' ? 'college' : 'job-seeker-dashboard';
                                                        handleNavClick(dashboardPage);
                                                    }}
                                                    className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all flex items-center gap-3 group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold">Dashboard</span>
                                                        <span className="text-[10px] text-slate-400 font-normal">Manage your profile</span>
                                                    </div>
                                                </button>

                                                <div className="h-px bg-slate-100 my-1 mx-2"></div>

                                                <button
                                                    onClick={handleSignOut}
                                                    className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition-all flex items-center gap-3 group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                                                        <LogOut className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold">Sign Out</span>
                                                        <span className="text-[10px] text-slate-400 font-normal">End your session</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button - Modern Fab Style */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`lg:hidden relative z-50 p-2.5 backdrop-blur-md border rounded-xl shadow-sm hover:bg-white transition-all active:scale-95 ${isDarkTheme && !isMobileMenuOpen
                                ? 'text-white bg-white/10 border-white/20 hover:text-slate-900'
                                : 'text-slate-700 bg-white/50 border-white/50 hover:text-slate-900'
                                }`}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Modern Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-40 lg:hidden bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMobileMenuOpen(false)}
            ></div>

            <div className={`fixed top-0 right-0 bottom-0 z-50 w-[85%] max-w-[320px] bg-white shadow-2xl lg:hidden transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full flex flex-col pt-24 pb-8 px-6 overflow-y-auto">

                    <div className="space-y-2 mb-8">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Navigation</span>
                        {navItems.map((item) => {
                            const isActive = currentPage === item.page;
                            return (
                                <button
                                    key={item.page}
                                    onClick={() => handleNavClick(item.page)}
                                    className={`w-full text-left px-4 py-4 text-lg font-bold rounded-2xl transition-all border ${isActive
                                        ? 'text-blue-600 bg-blue-50 border-blue-200'
                                        : 'text-slate-900 hover:text-blue-600 hover:bg-blue-50 border-transparent hover:border-blue-100/50'
                                        }`}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-auto space-y-4">
                        {!user ? (
                            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                                <button
                                    onClick={() => handleNavClick('role-select')}
                                    className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-lg shadow-lg shadow-slate-900/20 mb-3 active:scale-95 transition-transform"
                                >
                                    Get Started
                                </button>
                                <button
                                    onClick={() => handleNavClick('auth', 'job_seeker', 'signin')}
                                    className="w-full py-4 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-bold text-lg hover:border-slate-900 hover:text-slate-900 transition-colors"
                                >
                                    Sign In
                                </button>
                            </div>
                        ) : (
                            <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl font-bold text-blue-600 shadow-sm">
                                        {profile?.fullName?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{profile?.fullName}</p>
                                        <p className="text-xs font-medium text-slate-500 truncate max-w-[160px]">{profile?.email}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => {
                                            const dashboardPage = profile?.role === 'employer' ? 'recruiter-dashboard' :
                                                profile?.role === 'admin' ? 'admin' :
                                                    profile?.role === 'college' ? 'college' : 'job-seeker-dashboard';
                                            handleNavClick(dashboardPage);
                                        }}
                                        className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all active:scale-95"
                                    >
                                        <User className="w-6 h-6 text-blue-600" />
                                        <span className="text-xs font-bold text-slate-700">Dashboard</span>
                                    </button>
                                    <button
                                        onClick={handleSignOut}
                                        className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-red-300 hover:shadow-md transition-all active:scale-95"
                                    >
                                        <LogOut className="w-6 h-6 text-red-500" />
                                        <span className="text-xs font-bold text-slate-700">Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}
