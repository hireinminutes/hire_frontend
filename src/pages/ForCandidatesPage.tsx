import { useState, useEffect } from 'react';
import {
  ArrowRight,
  Shield,
  DollarSign,
  MessageCircle, ShieldCheck,
  Rocket, TrendingUp,
  CheckCircle, Zap,
  Target, Users, Sparkles, Briefcase
} from 'lucide-react';
import { Button } from '../components/ui/Button';


interface ForCandidatesPageProps {
  onNavigate: (page: string) => void;
}

export function ForCandidatesPage({ onNavigate }: ForCandidatesPageProps) {

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const candidateBenefits = [
    {
      icon: ShieldCheck,
      title: 'Verified Skill Badges',
      description: 'Get certified for your skills and stand out to employers with verified badges',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50'
    },
    {
      icon: Zap,
      title: 'Instant Job Matching',
      description: 'Our AI matches you with relevant jobs instantly - no more endless searching',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Target,
      title: 'Career Path Guidance',
      description: 'Personalized career recommendations based on your skills and goals',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Users,
      title: 'Direct Employer Access',
      description: 'Connect directly with hiring managers and skip the middlemen',
      color: 'text-amber-500',
      bgColor: 'bg-amber-50'
    },
    {
      icon: TrendingUp,
      title: '3x More Interviews',
      description: 'Verified candidates get 3x more interview calls on average',
      color: 'text-rose-500',
      bgColor: 'bg-rose-50'
    },
    {
      icon: CheckCircle,
      title: 'Application Tracking',
      description: 'Track your applications from submitted to hired in real-time',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50'
    }
  ];



  const valuePropositions = [
    {
      title: 'Stop Getting Ghosted',
      description: 'Get real responses from verified employers who respect your time',
      icon: MessageCircle
    },
    {
      title: 'No More Resume Spam',
      description: 'Your contact info is only shared with companies you actually apply to',
      icon: Shield
    },
    {
      title: 'Salary Transparency',
      description: 'See real salary ranges before you apply - no more guessing games',
      icon: DollarSign
    },
    {
      title: 'Career Growth Focus',
      description: 'Jobs matched to your career path, not just immediate openings',
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">

      {/* Background Elements generic */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-br from-blue-50/20 via-purple-50/10 to-transparent"></div>
        <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[600px] h-[600px] bg-indigo-100/20 rounded-full blur-3xl opacity-30"></div>
      </div>

      {/* Hero Section */}
      <div className={`relative min-h-[85vh] flex items-center justify-center pt-24 pb-12 transition-all duration-1000 bg-slate-950 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>

        {/* Dark Theme Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] opacity-40"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] opacity-40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            {/* Left Content */}
            <div className="lg:w-1/2 max-w-2xl">
              {/* Animated Badge */}
              <div className="inline-flex items-center space-x-2 bg-blue-900/30 border border-blue-800 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up shadow-sm backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-sm font-semibold text-blue-300 tracking-wide">For Ambitious Talent</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-1.1 mb-6">
                Your Dream Job <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                  Is Waiting For You
                </span>
              </h1>

              <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-lg">
                Stop applying endlessly. Get matched with verified jobs that actually want your skills.
                Join thousands who found their perfect role through Hire in Minutes.
              </p>

              <p className="text-sm text-slate-400 mb-10 leading-relaxed max-w-lg">
                Our platform uses advanced AI to verify your skills and match you directly with hiring managers, skipping the ATS black hole. Create your profile once and let the opportunities come to you.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Button
                  onClick={() => onNavigate('role-select')}
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center group"
                >
                  Start Free Today
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <div className="flex items-center gap-2 text-sm text-slate-400 font-medium px-4">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  Verified Jobs Only
                </div>
              </div>
            </div>

            {/* Right Visual - Abstract Card Composition */}
            <div className="lg:w-1/2 relative w-full max-w-lg lg:max-w-none">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-300/20 to-purple-300/20 rounded-full blur-3xl transform scale-95"></div>

              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl shadow-black/20 p-6 md:p-8">
                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-700 transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Status</div>
                      <div className="text-sm font-bold text-white">Hired Successfully</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-700 transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Match Score</div>
                      <div className="text-sm font-bold text-white">98% Compatible</div>
                    </div>
                  </div>
                </div>

                {/* Main Card Content */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Recommended Job</div>
                      <h3 className="text-lg font-bold text-white">Senior React Developer</h3>
                    </div>
                    <div className="bg-slate-800 p-2 rounded-lg">
                      <Briefcase className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>

                  <div className="bg-slate-950/50 rounded-2xl border border-slate-800 w-full relative overflow-hidden p-5">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Company</span>
                        <span className="font-semibold text-white">TechFlow Systems</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Salary Range</span>
                        <span className="font-semibold text-white">$120k - $150k</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Location</span>
                        <span className="font-semibold text-white">Remote / Hybrid</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-blue-900/20 border border-blue-800/30 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                        <Zap size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">Instant Match</div>
                        <div className="text-xs text-slate-400">Profile matches 95% requirements</div>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-purple-900/20 border border-purple-800/30 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                        <Target size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">Career Goal Aligned</div>
                        <div className="text-xs text-slate-400">Fits your leadership path</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-400">Posted 2h ago</span>
                    <div className="px-4 py-2 bg-white text-slate-900 text-sm font-semibold rounded-lg shadow-lg shadow-white/10 cursor-default">
                      Apply Now
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-white relative overflow-hidden text-center md:text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Why Candidates Choose Us
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to land your dream job
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidateBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="group relative bg-white border border-slate-200 p-8 rounded-[2rem] hover:border-blue-200 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1">
                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-2xl ${benefit.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-7 w-7 ${benefit.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Value Propositions */}
      <div className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Solving Real Job <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Search Problems</span>
              </h2>
              <p className="text-lg text-slate-600 mb-10">
                We built this platform to fix everything you hate about job hunting. No more black holes.
              </p>

              <div className="space-y-4">
                {valuePropositions.map((prop, index) => {
                  const Icon = prop.icon;
                  return (
                    <div key={index} className="flex items-start gap-5 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{prop.title}</h3>
                        <p className="text-slate-600 text-sm">{prop.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Visual Side */}
            <div className="md:w-1/2 w-full">
              <div className="relative bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl shadow-slate-200/50">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl -z-10"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-50 rounded-full blur-3xl -z-10"></div>

                <div className="space-y-6">
                  {/* Mock UI Elements */}
                  <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600"><CheckCircle size={24} /></div>
                      <div>
                        <div className="text-base font-bold text-slate-900">Application Viewed</div>
                        <div className="text-sm text-slate-500">TechCorp Inc. • Just now</div>
                      </div>
                    </div>
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  </div>

                  <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-500/5 scale-105 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><MessageCircle size={24} /></div>
                      <div>
                        <div className="text-base font-bold text-slate-900">Interview Invite</div>
                        <div className="text-sm text-slate-500">StartupXYZ • 2 hours ago</div>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">New</div>
                  </div>

                  <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><Zap size={24} /></div>
                      <div>
                        <div className="text-base font-bold text-slate-900">Skills Verified</div>
                        <div className="text-sm text-slate-500">React & Node.js • Yesterday</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
            <Rocket className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-700">Ready to Transform?</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-8 tracking-tight">
            Your Next Career Move <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Starts Here</span>
          </h2>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
            Join thousands of successful candidates who found better jobs, faster
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => onNavigate('role-select')}
              className="bg-blue-600 hover:bg-blue-700 border-0 text-lg px-10 py-6 rounded-xl shadow-xl shadow-blue-600/30 transition-all hover:-translate-y-1"
            >
              <span className="flex items-center">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
}