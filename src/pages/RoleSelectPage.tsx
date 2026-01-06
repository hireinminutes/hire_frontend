import { useState, useEffect } from 'react';
import { ArrowRight, Briefcase, GraduationCap, User, CheckCircle2, ArrowLeft } from 'lucide-react';

interface RoleSelectPageProps {
  onNavigate: (page: string, jobId?: string, role?: 'job_seeker' | 'employer', courseId?: string, successMessage?: string, profileSlug?: string, dashboardSection?: string, authMode?: 'signin' | 'signup') => void;
}

type RoleType = 'candidate' | 'employer' | 'college';

export function RoleSelectPage({ onNavigate }: RoleSelectPageProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<RoleType>('candidate');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTabChange = (tab: RoleType) => {
    if (tab === activeTab) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsTransitioning(false);
    }, 200);
  };

  const handleNavigate = () => {
    if (activeTab === 'college') {
      onNavigate('college/login');
    } else {
      const roleId = activeTab === 'candidate' ? 'job_seeker' : 'employer';
      onNavigate('auth', undefined, roleId, undefined, undefined, undefined, undefined, 'signin');
    }
  };

  const roles = {
    candidate: {
      title: 'Job Seeker',
      subtitle: 'Find Your Dream Role',
      description: 'Access premium job listings, verified skill assessments, and direct career paths.',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80', // Developer coding
      icon: User,
      color: 'text-blue-400',
      bgIcon: 'bg-blue-500/10',
      button: 'bg-blue-600 hover:bg-blue-500 text-white',
      features: ['Verified Companies', 'Skill Assessments', 'One-Click Apply']
    },
    employer: {
      title: 'Employer',
      subtitle: 'Hire Top Talent',
      description: 'Streamline your hiring process with AI-driven matching and verified candidates.',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', // Modern meeting
      icon: Briefcase,
      color: 'text-purple-400',
      bgIcon: 'bg-purple-500/10',
      button: 'bg-purple-600 hover:bg-purple-500 text-white',
      features: ['AI Candidate Scoring', 'Automated Scheduling', 'Global Talent Pool']
    },
    college: {
      title: 'College',
      subtitle: 'Campus Placement',
      description: 'Connect your students with top-tier companies and track placement success.',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', // Students group
      icon: GraduationCap,
      color: 'text-teal-400',
      bgIcon: 'bg-teal-500/10',
      button: 'bg-teal-600 hover:bg-teal-500 text-white',
      features: ['Corporate Connect', 'Student Tracking', 'Placement Analytics']
    }
  };

  const activeRole = roles[activeTab];

  return (
    <div className="min-h-screen w-full font-sans bg-slate-950 selection:bg-blue-500/30 selection:text-blue-200 overflow-hidden">

      {/* Back Button - Fixed Position */}
      <button
        onClick={() => onNavigate('landing')}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 backdrop-blur-md text-white rounded-xl border border-slate-700/50 hover:bg-slate-700 transition-all duration-300 group shadow-lg hover:shadow-xl"
      >
        <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
        <span className="text-sm font-semibold">Back to Home</span>
      </button>

      {/* Main Split Layout */}
      <div className={`flex flex-col md:flex-row h-screen w-full transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>

        {/* Left Side: Image Panel */}
        <div className="md:w-5/12 lg:w-1/2 relative overflow-hidden h-[35vh] md:h-full group flex-shrink-0">
          <div className={`absolute inset-0 bg-cover bg-center transition-transform duration-1000 ${isTransitioning ? 'scale-105' : 'scale-100'}`}
            style={{ backgroundImage: `url(${activeRole.image})` }}>
          </div>
          {/* Gradient Overlay for Text Visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent md:bg-hidden"></div>
          {/* Desktop Merging Effect (Fade to Slate-900) */}
          <div className="hidden md:block absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-900 to-transparent"></div>

          {/* Mobile Title Overlay (Hidden on Desktop) */}
          <div className="absolute bottom-6 left-6 md:hidden z-10 pr-6">
            <div className={`inline-flex items-center px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider mb-2`}>
              {activeRole.subtitle}
            </div>
            <h3 className="text-3xl font-bold text-white shadow-black/50 drop-shadow-md leading-tight">{activeRole.title}</h3>
          </div>
        </div>

        {/* Right Side: Content Panel */}
        <div className="md:w-7/12 lg:w-1/2 flex flex-col justify-center bg-slate-900 relative flex-1 md:h-full overflow-y-auto border-l border-slate-800">

          <div className="max-w-xl mx-auto w-full px-6 py-8 md:p-12 lg:p-20 flex flex-col justify-center min-h-full">
            {/* Tabs */}
            <div className="flex bg-slate-950/50 p-1 rounded-xl mb-8 md:mb-12 w-full self-start border border-slate-800 shrink-0">
              {(['candidate', 'employer', 'college'] as RoleType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`
                    flex-1 px-2 py-2.5 md:px-4 md:py-3 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 text-center whitespace-nowrap relative group
                    ${activeTab === tab
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}
                  `}
                >
                  <div className="flex items-center justify-center gap-2">
                    {tab === 'candidate' ? 'Job Seeker' : tab === 'employer' ? 'Employer' : 'College'}
                  </div>
                </button>
              ))}
            </div>

            {/* Dynamic Content */}
            <div className={`transition-all duration-300 flex-1 flex flex-col justify-center ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>

              <div className="hidden md:flex items-center mb-6">
                <div className={`p-2 rounded-xl ${activeRole.bgIcon} mr-3`}>
                  <activeRole.icon className={`w-5 h-5 ${activeRole.color}`} />
                </div>
                <span className={`text-sm font-bold uppercase tracking-wider ${activeRole.color}`}>{activeRole.subtitle}</span>
              </div>

              <h2 className="hidden md:block text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                {activeRole.title}
              </h2>

              <p className="text-slate-400 text-sm md:text-lg leading-relaxed mb-8 md:mb-10">
                {activeRole.description}
              </p>

              <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
                {activeRole.features.map((feature, i) => (
                  <div key={i} className="flex items-center text-slate-300 font-medium text-sm md:text-base">
                    <CheckCircle2 className={`w-4 h-4 md:w-5 md:h-5 mr-3 md:mr-3.5 ${activeRole.color} shrink-0`} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 md:mt-0 flex flex-col items-center">
                <button
                  onClick={handleNavigate}
                  className={`w-full md:w-auto md:px-10 py-3 rounded-lg text-white font-bold text-sm md:text-base shadow-lg shadow-slate-950/20 transition-all duration-300 flex items-center justify-center group hover:scale-[1.02] active:scale-[0.98] ${activeRole.button}`}
                >
                  <span>Continue as {activeTab === 'candidate' ? 'Job Seeker' : activeTab === 'employer' ? 'Employer' : 'College Partner'}</span>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <div className="mt-6 md:mt-8 text-center">
                  <button onClick={() => onNavigate('landing')} className="text-slate-500 text-xs md:text-sm hover:text-slate-300 transition-colors py-2">
                    Back to Home
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
