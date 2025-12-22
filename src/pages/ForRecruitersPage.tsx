
import {
  ArrowRight,
  BarChart, Filter,
  FileText, Users as UsersIcon,
  ShieldCheck, BadgeCheck, Lock, Eye,
  CheckCircle as CheckCircleIcon,
  Zap as ZapIcon, Target as TargetIcon,
  BarChart as BarChartIcon, Globe as GlobeIcon
} from 'lucide-react';
import { Button } from '../components/ui/Button';


interface ForRecruitersPageProps {
  onNavigate: (page: string) => void;
}

export function ForRecruitersPage({ onNavigate }: ForRecruitersPageProps) {
  // Animation logic removed


  const recruiterBenefits = [
    {
      icon: ShieldCheck,
      title: 'Verified Talent Pool',
      description: 'Access 100K+ candidates with certified skills and background checks',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50'
    },
    {
      icon: ZapIcon,
      title: 'Instant Hiring',
      description: 'Reduce time-to-hire by 70% with our streamlined recruitment workflow',
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    {
      icon: TargetIcon,
      title: 'Smart Filtering',
      description: 'Advanced filters for skills, experience, location, and verified status',
      color: 'text-purple-500',
      bg: 'bg-purple-50'
    },
    {
      icon: BarChartIcon,
      title: 'Advanced Analytics',
      description: 'Real-time insights on applications, conversions, and hiring metrics',
      color: 'text-indigo-500',
      bg: 'bg-indigo-50'
    },
    {
      icon: GlobeIcon,
      title: 'Global Reach',
      description: 'Access talent from across India and remote candidates worldwide',
      color: 'text-cyan-500',
      bg: 'bg-cyan-50'
    },
    {
      icon: CheckCircleIcon,
      title: 'Quality Guarantee',
      description: '90-day satisfaction guarantee with full replacement support',
      color: 'text-rose-500',
      bg: 'bg-rose-50'
    }
  ];



  const advancedFeatures = [
    {
      title: 'Job Templates',
      description: 'Choose from templates like "Junior MERN Developer" or "Data Analyst Intern"',
      icon: FileText,
      benefit: 'SAVE 80% TIME',
      color: 'text-orange-500',
      bg: 'bg-orange-50'
    },
    {
      title: 'Saved Filters',
      description: 'Create and reuse filters like "Fresher MERN, < 5 LPA, Vijayawada"',
      icon: Filter,
      benefit: 'ONE-CLICK SEARCH',
      color: 'text-pink-500',
      bg: 'bg-pink-50'
    },
    {
      title: 'Talent Pool',
      description: 'Save candidates to your private talent pool for future positions',
      icon: UsersIcon,
      benefit: 'OWN DATABASE',
      color: 'text-violet-500',
      bg: 'bg-violet-50'
    },
    {
      title: 'ATS Integration',
      description: 'Sync with your existing Applicant Tracking System seamlessly',
      icon: BarChart,
      benefit: 'NO MIGRATION NEEDED',
      color: 'text-green-500',
      bg: 'bg-green-50'
    }
  ];

  const verificationBenefits = [
    { icon: ShieldCheck, text: 'Every skill validated through practical assessments' },
    { icon: BadgeCheck, text: 'Background checks on experience and education' },
    { icon: Eye, text: 'View candidate test scores and project portfolios' },
    { icon: Lock, text: 'Trust and safety verified by our platform' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-slate-900 selection:text-white">
      {/* Hero Section */}
      {/* Hero Section */}
      <div className={`relative bg-slate-950 min-h-screen flex flex-col justify-center pt-32 pb-24 overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`transform`}>
              <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-sm font-medium text-blue-200 tracking-wide">Recruiter Platform</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">
                HIRE ELITE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">VERIFIED TALENT.</span>
              </h1>

              <p className="text-lg text-slate-400 mb-10 max-w-xl font-light leading-relaxed">
                Connect with pre-vetted professionals ready to deploy.
                Reduce hiring cycles and eliminate guesswork with our rigorous verification protocol.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => onNavigate('role-select')}
                  className="h-14 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full text-sm font-bold uppercase tracking-[0.15em] transition-all shadow-lg shadow-blue-500/20"
                >
                  <span className="flex items-center">
                    Start Hiring
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onNavigate('role-select')}
                  className="h-14 px-8 border-white/10 text-white hover:bg-white/5 rounded-full text-sm font-bold uppercase tracking-[0.15em] transition-all"
                >
                  Schedule Demo
                </Button>
              </div>
            </div>

            {/* Abstract Graphic */}
            <div className={`hidden lg:flex justify-end transform`}>
              <div className="relative w-full max-w-md aspect-square border border-slate-800 bg-slate-900/50 p-8 rotate-3 hover:rotate-0 transition-transform duration-700">
                <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-slate-700 -mt-4 -mr-4"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 border-b border-l border-slate-700 -mb-4 -ml-4"></div>

                <div className="h-full flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="h-px w-full bg-slate-800"></div>
                    <div className="flex justify-between text-slate-500 text-xs font-mono uppercase tracking-widest">
                      <span>Metric_01</span>
                      <span>98.5%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 relative overflow-hidden">
                      <div className="absolute inset-y-0 left-0 w-[98.5%] bg-white"></div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-6xl font-bold text-white mb-2">100K+</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Verified Candidates</div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between text-slate-500 text-xs font-mono uppercase tracking-widest">
                      <span>Metric_02</span>
                      <span>24h</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 relative overflow-hidden">
                      <div className="absolute inset-y-0 left-0 w-[85%] bg-slate-400"></div>
                    </div>
                    <div className="h-px w-full bg-slate-800"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div
        className="py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-20">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
              Why Choose Us
            </h2>
            <h3 className="text-4xl font-light text-slate-900 tracking-tight max-w-2xl">
              Engineered for precision recruitment.
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {recruiterBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              // 2-1-2-1 Pattern Logic (for mobile/tablet where grid-cols-2 is active)
              // Indices 0,1: Square (Row 1)
              // Index 2: Full Width (Row 2)
              // Indices 3,4: Square (Row 3)
              // Index 5: Full Width (Row 4)
              const isWide = index === 2 || index === 5;

              return (
                <div
                  key={index}
                  className={`
                    bg-white border border-slate-200 p-5 md:p-10 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group rounded-2xl md:rounded-3xl relative overflow-hidden flex flex-col justify-between
                    ${isWide ? 'col-span-2 lg:col-span-1 aspect-auto' : 'col-span-1 aspect-square lg:aspect-auto'}
                  `}
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 ${benefit.bg} rounded-bl-full opacity-50`}></div>
                  <div className={`w-10 h-10 md:w-14 md:h-14 ${benefit.bg} rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-5 w-5 md:h-7 md:w-7 ${benefit.color}`} />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-lg font-bold text-slate-900 uppercase tracking-wide mb-2 md:mb-3 truncate">{benefit.title}</h3>
                    <p className="text-xs md:text-base text-slate-500 font-light leading-relaxed line-clamp-3 md:line-clamp-none">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Advanced Features */}
      <div
        className="py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-20">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
              Platform Power
            </h2>
            <h3 className="text-4xl font-light text-slate-900 tracking-tight max-w-2xl">
              Tools that amplify your reach.
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-8 mb-16">
            {advancedFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex flex-col md:flex-row md:items-start md:gap-8 p-5 md:p-10 bg-white border border-slate-200 rounded-2xl md:rounded-3xl hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 group aspect-square md:aspect-auto">
                  <div className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0 ${feature.bg} text-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-5 w-5 md:h-7 md:w-7 ${feature.color}`} strokeWidth={1.5} />
                  </div>
                  <div className="w-full">
                    <div className="flex flex-col xl:flex-row xl:items-baseline justify-between mb-2">
                      <h3 className="text-sm md:text-xl font-bold text-slate-900 uppercase tracking-wide truncate">{feature.title}</h3>
                      <span className={`text-[8px] md:text-[10px] font-bold ${feature.color} ${feature.bg} px-2 py-0.5 md:px-3 md:py-1 uppercase tracking-wider rounded-full w-fit mt-1 xl:mt-0`}>
                        {feature.benefit}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-500 font-light leading-relaxed line-clamp-3 md:line-clamp-none">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Verification Block */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-12 lg:p-16 relative overflow-hidden rounded-3xl shadow-2xl shadow-slate-900/20">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -ml-20 -mb-20"></div>

            <div className="absolute top-0 right-0 p-16 opacity-5">
              <ShieldCheck className="h-64 w-64 text-white" strokeWidth={1} />
            </div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-16">
              <div>
                <h3 className="text-3xl font-light mb-6 tracking-tight">
                  <span className="font-bold text-white">VERIFICATION</span> PROTOCOL
                </h3>
                <p className="text-slate-300 text-lg font-light mb-10 leading-relaxed max-w-md">
                  Every candidate undergoes rigorous skill validation and background checks.
                  We eliminate noise, providing you with a signal you can trust.
                </p>
                <Button
                  onClick={() => onNavigate('verification-process')}
                  variant="secondary"
                  className="bg-white !text-slate-900 hover:bg-blue-50 rounded-full h-12 px-8 uppercase font-bold text-xs tracking-[0.2em] transition-all"
                >
                  Learn More
                </Button>
              </div>
              <div className="space-y-6">
                {verificationBenefits.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-center gap-6 group">
                      <div className="w-12 h-12 border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-blue-500 group-hover:border-blue-500 transition-all duration-300 rounded-xl backdrop-blur-sm">
                        <Icon className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-slate-300 group-hover:text-white font-light text-sm tracking-wide uppercase transition-colors">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>






    </div>
  );
}