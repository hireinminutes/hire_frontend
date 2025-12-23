import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { Testimonials } from '../components/Testimonials';
import { AboutSection } from '../components/AboutSection';

interface LandingPageProps {
  onNavigate: (page: string, jobId?: string, role?: 'job_seeker' | 'employer', courseId?: string, successMessage?: string, profileSlug?: string, dashboardSection?: string, authMode?: 'signin' | 'signup') => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [skillCardVisible, setSkillCardVisible] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const skillCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsVisible(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    // Separate observer for skill card animations
    const skillCardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSkillCardVisible(true);
            skillCardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (skillCardRef.current) {
      skillCardObserver.observe(skillCardRef.current);
    }

    return () => {
      observer.disconnect();
      skillCardObserver.disconnect();
    };
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  // --- Restored Data ---




  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">

      {/* Mobile Floating FAQ Tag */}
      <button
        onClick={() => onNavigate('faq')}
        className="md:hidden fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-black text-white px-1.5 py-4 rounded-l-md shadow-lg hover:shadow-xl transition-all"
        style={{ writingMode: 'vertical-rl' }}
      >
        <span className="text-[10px] font-bold tracking-wider">FAQS</span>
      </button>

      {/* Hero Section */}
      <div className={`relative min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover transform -translate-x-1/2 -translate-y-1/2 opacity-60"
          >
            <source src="/KODERSPARK.mp4" type="video/mp4" />
          </video>
          {/* Dark Tint Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
          {/* Gradient Overlay for Fade */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col justify-center">
          <div className="max-w-2xl">
            {/* Animated Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-white tracking-wide">Hire in Minutes</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-6 drop-shadow-lg">
              Where Skills <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Meet Opportunity
              </span>
            </h1>

            <p className="text-xl text-slate-200 mb-10 leading-relaxed max-w-xl drop-shadow-md">
              We transform the hiring process into an elegant, skill-first experience. Elevate your career or company with our verified talent ecosystem.
            </p>
          </div>
        </div>
      </div>


      {/* Skill Passport Section */}
      <section className="flex flex-col justify-center py-12 md:py-20 bg-slate-950 relative overflow-hidden">
        {/* Background Gradients & Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f640_1px,transparent_1px),linear-gradient(to_bottom,#3b82f640_1px,transparent_1px)] bg-[size:24px_24px] animate-grid-wave"></div>
        <div className="absolute left-0 top-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-500/10 rounded-full blur-[80px] md:blur-[128px]"></div>
        <div className="absolute right-0 bottom-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-purple-500/10 rounded-full blur-[80px] md:blur-[128px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">

            {/* Left Column - Content */}
            <div ref={addToRefs} className={`space-y-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="flex items-center space-x-2 text-blue-400 font-semibold tracking-wider text-sm mb-4 uppercase">
                <span className="w-8 h-[2px] bg-blue-500"></span>
                <span>For Students</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Build Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400">Skill Passport</span>
              </h2>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">Build verified Skill Passport</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">Showcase your skills with verified assessments and certifications that matter to employers.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3.5 h-3.5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">Take skill assessments</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">Complete industry-standard assessments to validate your expertise and stand out.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3.5 h-3.5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">Direct internship access</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">Get matched with internship opportunities based on your verified skills and interests.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">Earn badges & rewards</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">Unlock achievements and recognition as you complete projects and grow your skills.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 bg-slate-900/50 rounded-xl p-4 border border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-semibold text-xl">50+</span>
                  <Briefcase className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-slate-400 text-xs">New internships added this week</p>
              </div>
            </div>

            {/* Right Column - ID Card */}
            <div ref={addToRefs} className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div ref={skillCardRef} className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 md:p-6 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-lg">

                {/* Decorative Glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>

                {/* Card Header */}
                <div className="relative mb-2">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Verified Skills</div>
                    <GraduationCap className="w-4 h-4 text-blue-400" />
                  </div>

                  {/* Profile Section */}
                  <div className="flex items-start gap-3 mb-3">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shadow-xl border-2 border-blue-500/30">
                        <img
                          src="/akhil-profile.png"
                          alt="profile alt image"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-base mb-1">Karthik</h3>
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 rounded-md border border-blue-500/30 mb-0.5">
                        <span className="text-[9px] font-bold text-blue-300 uppercase tracking-wide">Dev</span>
                      </div>
                      <p className="text-slate-500 text-[10px]">#8926</p>
                      <p className="text-slate-400 text-[10px] mt-0.5">MIT University</p>
                    </div>

                    {/* Total Score Badge */}
                    <div className="ml-auto">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2 text-center shadow-lg">
                        <div className="text-xl font-black text-white">86%</div>
                        <div className="text-[8px] text-blue-100 uppercase tracking-wide font-bold">Total Score</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* VERIFIED SKILLS Header */}
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Verified Skills</span>
                  <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-blue-400" />
                  </div>
                </div>

                {/* Skills Grid - 2x2 with circular progress */}
                <div className="grid grid-cols-2 gap-2.5 mb-3">
                  {/* React Skill */}
                  <div className="bg-slate-800/30 rounded-lg p-2 border border-white/5 hover:border-blue-500/30 transition-all">
                    <div className="flex items-center gap-3">
                      {/* Circular Progress */}
                      <div className="relative w-10 h-10 flex-shrink-0">
                        <svg className="transform -rotate-90 w-10 h-10">
                          <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="none" className="text-slate-700/50" />
                          <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray={`${2 * Math.PI * 16}`} strokeDashoffset={`${2 * Math.PI * 16 * (1 - 0.96)}`} className={`text-blue-500 transition-all duration-1500 ease-out ${skillCardVisible ? 'animate-ring-96' : 'opacity-0'}`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-[10px] font-bold text-blue-400 transition-opacity duration-500 ${skillCardVisible ? 'opacity-100' : 'opacity-0'}`}>96%</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold text-xs mb-0.5">React</div>
                        <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1500 ease-out ${skillCardVisible ? 'w-[96%]' : 'w-0'}`}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Node.js Skill */}
                  <div className="bg-slate-800/30 rounded-lg p-2 border border-white/5 hover:border-green-500/30 transition-all">
                    <div className="flex items-center gap-2">
                      {/* Circular Progress */}
                      <div className="relative w-10 h-10 flex-shrink-0">
                        <svg className="transform -rotate-90 w-10 h-10">
                          <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="none" className="text-slate-700/50" />
                          <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray={`${2 * Math.PI * 16}`} strokeDashoffset={`${2 * Math.PI * 16 * (1 - 0.85)}`} className={`text-green-500 transition-all duration-1500 ease-out delay-200 ${skillCardVisible ? 'animate-ring-85' : 'opacity-0'}`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-[10px] font-bold text-green-400 transition-opacity duration-500 delay-200 ${skillCardVisible ? 'opacity-100' : 'opacity-0'}`}>85%</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold text-xs mb-0.5">Node.js</div>
                        <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1500 ease-out delay-200 ${skillCardVisible ? 'w-[85%]' : 'w-0'}`}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AWS Skill */}
                  <div className="bg-slate-800/30 rounded-lg p-2 border border-white/5 hover:border-orange-500/30 transition-all">
                    <div className="flex items-center gap-2">
                      {/* Circular Progress */}
                      <div className="relative w-10 h-10 flex-shrink-0">
                        <svg className="transform -rotate-90 w-10 h-10">
                          <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="none" className="text-slate-700/50" />
                          <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray={`${2 * Math.PI * 16}`} strokeDashoffset={`${2 * Math.PI * 16 * (1 - 0.75)}`} className={`text-orange-500 transition-all duration-1500 ease-out delay-100 ${skillCardVisible ? 'animate-ring-75' : 'opacity-0'}`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-[10px] font-bold text-orange-400 transition-opacity duration-500 delay-100 ${skillCardVisible ? 'opacity-100' : 'opacity-0'}`}>75%</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold text-xs mb-0.5">AWS</div>
                        <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-1500 ease-out delay-100 ${skillCardVisible ? 'w-[75%]' : 'w-0'}`}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Figma Skill */}
                  <div className="bg-slate-800/30 rounded-lg p-2 border border-white/5 hover:border-pink-500/30 transition-all">
                    <div className="flex items-center gap-2">
                      {/* Circular Progress */}
                      <div className="relative w-10 h-10 flex-shrink-0">
                        <svg className="transform -rotate-90 w-10 h-10">
                          <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="none" className="text-slate-700/50" />
                          <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray={`${2 * Math.PI * 16}`} strokeDashoffset={`${2 * Math.PI * 16 * (1 - 0.86)}`} className={`text-pink-500 transition-all duration-1500 ease-out delay-300 ${skillCardVisible ? 'animate-ring-86' : 'opacity-0'}`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-[10px] font-bold text-pink-400 transition-opacity duration-500 delay-300 ${skillCardVisible ? 'opacity-100' : 'opacity-0'}`}>86%</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold text-xs mb-0.5">Figma</div>
                        <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r from-pink-500 to-pink-400 rounded-full transition-all duration-1500 ease-out delay-300 ${skillCardVisible ? 'w-[86%]' : 'w-0'}`}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Section - Compact */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10">
                  <div className="bg-slate-800/30 rounded-lg p-2 border border-white/5 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Briefcase className="w-3 h-3 text-amber-400" />
                    </div>
                    <div className="text-base font-black text-amber-400">10+</div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-wide font-medium">Projects</div>
                  </div>

                  <div className="bg-slate-800/30 rounded-lg p-2 border border-white/5 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <svg className="w-3 h-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div className="text-base font-black text-purple-400">Top 5%</div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-wide font-medium">Rank</div>
                  </div>

                  <div className="bg-slate-800/30 rounded-lg p-2 border border-white/5 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <div className="w-3.5 h-3.5 bg-green-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-[9px] text-green-400 uppercase tracking-wide font-bold mt-1">Verified Candidate</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* For Recruiters Card - Inside same section */}
          <div className="mt-12 md:mt-16">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-lg border border-white/10 hover:border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 flex-shrink-0">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2">For Recruiters</h2>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
                    Skip the noise. Hire pre-vetted candidates with verified skills. Reduce your time-to-hire by 60% with our automated screening.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 md:gap-10 mt-6">
                {/* Feature Badges */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold border border-purple-500/30">
                    Verified Candidates
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold border border-purple-500/30">
                    Instant Hiring
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold border border-purple-500/30">
                    Premium Talent
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 md:gap-6 ml-auto">
                  <div className="bg-green-500/20 rounded-xl px-4 py-3 border border-green-500/30">
                    <div className="flex items-center gap-2 mb-0.5">
                      <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="text-xl md:text-2xl font-black text-green-400">60%</span>
                    </div>
                    <p className="text-[10px] text-green-300 font-medium">Faster Hiring</p>
                  </div>

                  <div className="bg-blue-500/20 rounded-xl px-4 py-3 border border-blue-500/30">
                    <div className="flex items-center gap-2 mb-0.5">
                      <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-xl md:text-2xl font-black text-blue-400">10k+</span>
                    </div>
                    <p className="text-[10px] text-blue-300 font-medium">Active Talent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <AboutSection onNavigate={onNavigate} />

      {/* RESTORED: User Reviews Section */}
      <Testimonials />



      {/* RESTORED: Detailed Footer */}


      {/* Styles for animations */}
      <style>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) translateX(0) scale(1) !important;
        }

        @keyframes ring-96 {
          from {
            stroke-dashoffset: ${2 * Math.PI * 16};
          }
          to {
            stroke-dashoffset: ${2 * Math.PI * 16 * (1 - 0.96)};
          }
        }

        @keyframes ring-85 {
          from {
            stroke-dashoffset: ${2 * Math.PI * 16};
          }
          to {
            stroke-dashoffset: ${2 * Math.PI * 16 * (1 - 0.85)};
          }
        }

        @keyframes ring-75 {
          from {
            stroke-dashoffset: ${2 * Math.PI * 16};
          }
          to {
            stroke-dashoffset: ${2 * Math.PI * 16 * (1 - 0.75)};
          }
        }

        @keyframes ring-86 {
          from {
            stroke-dashoffset: ${2 * Math.PI * 16};
          }
          to {
            stroke-dashoffset: ${2 * Math.PI * 16 * (1 - 0.86)};
          }
        }

        .animate-ring-96 {
          animation: ring-96 1.5s ease-out forwards;
        }

        .animate-ring-85 {
          animation: ring-85 1.5s ease-out forwards;
        }

        .animate-ring-75 {
          animation: ring-75 1.5s ease-out forwards;
        }

        .animate-ring-86 {
          animation: ring-86 1.5s ease-out forwards;
        }

        @keyframes grid-wave {
          0% {
            mask-image: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 25%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.8) 75%, transparent 100%);
            mask-size: 100% 200%;
            mask-position: 0 -100%;
          }
          100% {
            mask-position: 0 200%;
          }
        }

        .animate-grid-wave {
          mask-image: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 25%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.8) 75%, transparent 100%);
          mask-size: 100% 200%;
          -webkit-mask-image: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 25%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.8) 75%, transparent 100%);
          -webkit-mask-size: 100% 200%;
          animation: grid-wave 12s linear infinite;
        }
      `}</style>

    </div>
  );
}