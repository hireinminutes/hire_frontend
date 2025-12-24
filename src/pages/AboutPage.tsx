import React, { useEffect, useState } from 'react';

import { Button } from '../components/ui/Button';
import { Users, Target, Award, Sparkles, Globe } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">

      {/* Mobile Floating FAQ Tag */}
      <button
        onClick={() => onNavigate('faq')}
        className="md:hidden fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-black text-white px-1.5 py-4 rounded-l-md shadow-lg hover:shadow-xl transition-all"
        style={{ writingMode: 'vertical-rl' }}
      >
        <span className="text-[10px] font-bold tracking-wider">FAQS</span>
      </button>

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: `40px 40px`
        }}
      ></div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[20%] right-[10%] w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center space-x-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-slate-600 tracking-wide uppercase">About Us</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Hire In Minutes</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed mb-4">
            Hire In Minutes is a fast and reliable hiring platform designed to help companies reduce hiring time by connecting them with pre-screened, interview-ready candidates.
          </p>
          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed mb-4">
            All candidates on the platform are evaluated and scored by our internal hiring team, enabling recruiters to shortlist and hire efficiently without additional costs.
          </p>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Hire In Minutes is a product of <span className="font-semibold text-slate-600">Koder Spark Private Limited</span>, a technology-driven company focused on building scalable digital solutions in hiring, education, and workforce enablement.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className={`space-y-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Driven by a simple belief: <br />
              <span className="text-blue-600">Talent is everywhere.</span>
            </h2>
            <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
              <p>
                Founded in 2025, Hire In Minutes began with a frustration: the traditional hiring process was broken. Resumes were ignored, skills were undervalued, and finding the right fit felt like finding a needle in a haystack.
              </p>
              <p>
                We set out to change that. By combining AI-driven matching with verified skill assessments, we created a platform where candidates are seen for what they can do, not just where they worked.
              </p>
              <p>
                Today, we're proud to be the bridge for thousands of careers, helping startups grow and enterprises innovate with speed and precision.
              </p>
            </div>

            <div className="pt-4">
              <div className="inline-flex items-center gap-4 text-slate-900 font-semibold">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs text-slate-500">
                      <Users size={16} />
                    </div>
                  ))}
                </div>
                <span>Join our growing team</span>
              </div>
            </div>
          </div>

          <div className={`relative transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="aspect-square rounded-3xl overflow-hidden bg-slate-100 relative shadow-2xl shadow-blue-900/10">
              {/* Story Image */}
              <img
                src="/hiring-platform-illustration.jpg"
                alt="Hiring Platform Illustration"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Professional ID Card */}
              <div className="absolute bottom-8 left-8 right-8 bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-2xl border border-white/10">
                <div className="flex items-start gap-4 mb-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      HM
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-lg mb-1">Hire In Minutes</h4>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 rounded-md">
                      <span className="text-xs font-bold text-blue-300 uppercase">Platform</span>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-2xl font-black text-amber-400 mb-1">500+</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide">Companies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-blue-400 mb-1">Top 1%</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide">Platform</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-[10px] text-green-400 uppercase tracking-wide font-bold">Verified</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Values / Features Bento Grid */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Core Values</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">The principles that guide every decision we make.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
                <Target size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Precision First</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                We believe in the power of the right match. We don't just fill seats; we connect potential with opportunity. Our algorithms differ from the rest by prioritizing verified skills over keywords.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400">
                <Sparkles size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Innovation</h3>
              <p className="text-slate-400">
                Constantly pushing the boundaries of what's possible in HR Tech.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 text-green-400">
                <Users size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Community</h3>
              <p className="text-slate-400">
                Building a supportive ecosystem for career growth and mentorship.
              </p>
            </div>

            <div className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-colors"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Transparency</h3>
                  <p className="text-blue-100 max-w-md">
                    Open communication and honest feedback are at the heart of our platform. No ghosting, just clarity.
                  </p>
                </div>
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                  <Award size={32} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">Ready to start your journey?</h2>
        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
          Whether you're looking for your dream job or your next star employee, we're here to make it happen.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => onNavigate('role-select')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl shadow-blue-500/30 hover:scale-105 transition-transform"
          >
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;