import { ChevronDown, ChevronUp, MessageCircle, Shield, Award, Users, Briefcase, Search, Sparkles, Clock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';


interface FaqPageProps {
  onNavigate: (page: string) => void;
}

export function FaqPage({ onNavigate }: FaqPageProps) {

  const [openItems, setOpenItems] = useState<number[]>([0]);
  type FaqCategory = 'all' | 'candidates' | 'recruiters' | 'general';
  const [activeCategory, setActiveCategory] = useState<FaqCategory>('all');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

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

    return () => observer.disconnect();
  }, []);

  const faqs = {
    recruiters: [
      {
        question: 'What is Hire In Minutes?',
        answer: 'Hire In Minutes is a fast and reliable hiring platform that connects employers with pre-screened, interview-ready candidates, helping reduce hiring time significantly.',
        icon: Sparkles
      },
      {
        question: 'How does Hire In Minutes reduce hiring time?',
        answer: 'All candidates on the platform are evaluated and scored by our internal hiring team. This allows recruiters to shortlist quickly without spending time filtering unqualified resumes.',
        icon: Clock
      },
      {
        question: 'Are candidates already screened?',
        answer: 'Yes. Every candidate undergoes skill verification and internal evaluation before being listed, ensuring you interact only with qualified and relevant profiles.',
        icon: Shield
      },
      {
        question: 'What kind of roles can I hire for?',
        answer: 'Hire In Minutes supports hiring across tech, non-tech, entry-level, mid-level, and niche roles depending on your business needs.',
        icon: Briefcase
      },
      {
        question: 'Do I have to pay for shortlisting candidates?',
        answer: 'No. Recruiters can shortlist and interview candidates without additional shortlisting costs.',
        icon: Award
      },
      {
        question: 'Is Hire In Minutes a recruitment agency?',
        answer: 'No. Hire In Minutes is a technology-driven hiring platform, not a traditional recruitment agency.',
        icon: Users
      },
      {
        question: 'Can startups and small businesses use the platform?',
        answer: 'Absolutely. Hire In Minutes is built to support startups, SMEs, and enterprises alike.',
        icon: Briefcase
      },
      {
        question: 'How quickly can I make a hire?',
        answer: 'Many employers are able to connect with suitable candidates within days, significantly faster than traditional hiring methods.',
        icon: Clock
      },
      {
        question: 'Can I directly contact candidates?',
        answer: 'Yes. Once shortlisted, recruiters can directly connect with candidates to schedule interviews.',
        icon: MessageCircle
      },
      {
        question: 'Is my hiring data secure?',
        answer: 'Yes. We follow strict data security and privacy practices to ensure all company and hiring information remains confidential.',
        icon: Shield
      }
    ],
    candidates: [
      {
        question: 'What is Hire In Minutes for candidates?',
        answer: 'Hire In Minutes helps candidates get matched with relevant job opportunities based on verified skills rather than just resumes.',
        icon: Users
      },
      {
        question: 'Is it free for candidates?',
        answer: 'Yes. Candidates can register, create profiles, and apply for jobs at no cost.',
        icon: Award
      },
      {
        question: 'What does "pre-screened" mean?',
        answer: 'It means your skills and profile are evaluated by our internal team before being shared with recruiters, increasing your chances of meaningful interviews.',
        icon: Shield
      },
      {
        question: 'How are my skills verified?',
        answer: 'Skills are assessed through internal screening, evaluations, and role-based criteria set by our hiring experts.',
        icon: Shield
      },
      {
        question: 'Will my profile be visible to multiple companies?',
        answer: 'Yes. Your verified profile may be matched with multiple employers looking for similar skill sets.',
        icon: Briefcase
      },
      {
        question: 'Can freshers apply?',
        answer: 'Yes. Freshers and early-career professionals are welcome, provided they meet the skill requirements.',
        icon: Users
      },
      {
        question: 'How long does it take to get matched?',
        answer: 'Timelines vary based on demand and role fit, but verified profiles are prioritized for faster matching.',
        icon: Clock
      },
      {
        question: 'Will I receive feedback if not selected?',
        answer: 'We aim to provide transparent communication and reduce ghosting wherever possible.',
        icon: MessageCircle
      },
      {
        question: 'What type of companies hire through Hire In Minutes?',
        answer: 'From fast-growing startups to established enterprises across multiple industries.',
        icon: Briefcase
      },
      {
        question: 'Can I update my profile after registration?',
        answer: 'Yes. You can update your skills, experience, and preferences anytime.',
        icon: Sparkles
      }
    ],
    general: [
      {
        question: 'What makes Hire In Minutes different from other hiring platforms?',
        answer: 'Hire In Minutes focuses on verified skills over keywords, combining AI-driven matching with human evaluation for accurate and fair hiring.',
        icon: Sparkles
      },
      {
        question: 'Who is behind Hire In Minutes?',
        answer: 'Hire In Minutes is a product of Koder Spark Private Limited, a technology-driven company focused on hiring, education, and workforce enablement.',
        icon: Users
      },
      {
        question: 'Is Hire In Minutes available across India?',
        answer: 'Yes. Hire In Minutes operates pan-India, connecting talent and employers nationwide.',
        icon: Shield
      },
      {
        question: 'How does AI-driven matching work?',
        answer: 'Our system matches candidates to roles based on skill compatibility, role requirements, and evaluation scores not just resumes.',
        icon: Briefcase
      },
      {
        question: 'Is Hire In Minutes suitable for bulk hiring?',
        answer: 'Yes. The platform supports both individual and high-volume hiring requirements.',
        icon: Users
      },
      {
        question: 'Do you ensure transparency in the hiring process?',
        answer: 'Yes. Transparency, clear communication, and honest feedback are core to our platform philosophy.',
        icon: Shield
      },
      {
        question: 'How do I get started?',
        answer: 'Simply sign up as an employer or candidate, complete your profile, and start hiring or applying instantly.',
        icon: Sparkles
      },
      {
        question: 'Can I request a demo or contact sales?',
        answer: 'Yes. You can contact our sales team directly through the Contact Sales option on the website.',
        icon: MessageCircle
      },
      {
        question: 'Is my personal data safe on Hire In Minutes?',
        answer: 'Yes. We adhere to strong data protection practices to safeguard user information.',
        icon: Shield
      },
      {
        question: 'Does Hire In Minutes support career growth?',
        answer: 'Yes. We are building a community-driven ecosystem focused on mentorship, growth, and opportunity.',
        icon: Award
      }
    ]
  };

  const categories: { id: FaqCategory; label: string; count: number }[] = [
    { id: 'all', label: 'All Questions', count: faqs.recruiters.length + faqs.candidates.length + faqs.general.length },
    { id: 'recruiters', label: 'Employer / Recruiter', count: faqs.recruiters.length },
    { id: 'candidates', label: 'For Candidates', count: faqs.candidates.length },
    { id: 'general', label: 'General', count: faqs.general.length }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const getCurrentFaqs = () => {
    if (activeCategory === 'all') {
      return [...faqs.general, ...faqs.recruiters, ...faqs.candidates];
    }
    return faqs[activeCategory];
  };

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-50/80 to-transparent"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-indigo-100/30 rounded-full blur-2xl opacity-50"></div>
      </div>

      {/* Hero Section */}
      <div className={`relative min-h-[50vh] flex flex-col items-center justify-center pt-32 pb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-sm font-semibold text-blue-600 tracking-wide">Help Center</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
            Frequently Asked <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Questions
            </span>
          </h1>

          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about Hire in Minutes. Can't find the answer you're looking for? Chat with our friendly team.
          </p>

          {/* Search Bar Placeholder */}
          <div className="max-w-xl mx-auto relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-300"></div>
            <div className="relative bg-white border border-slate-200 rounded-full p-2 pl-6 flex items-center shadow-xl shadow-slate-200/50">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input
                type="text"
                placeholder="Search for answers..."
                className="bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 w-full text-base"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2.5 font-medium transition-colors shadow-md shadow-blue-600/20">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div
        ref={addToRefs}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24"
      >
        {/* Category Tabs */}
        <div className="mb-12 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex justify-center flex-wrap gap-3 min-w-max md:min-w-0">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${activeCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-transparent shadow-lg shadow-blue-600/25'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
                  }`}
              >
                {category.label}
                <span className={`ml-2 text-xs py-0.5 px-1.5 rounded-full ${activeCategory === category.id
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-500'
                  }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {getCurrentFaqs().map((faq, index) => {
            const Icon = faq.icon;
            const isOpen = openItems.includes(index);

            return (
              <div
                key={index}
                className={`group relative bg-white border rounded-2xl transition-all duration-300 overflow-hidden ${isOpen
                  ? 'border-blue-200 shadow-xl shadow-blue-900/5'
                  : 'border-slate-200 hover:border-blue-200 hover:shadow-md'
                  }`}
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                ></div>

                <button
                  onClick={() => toggleItem(index)}
                  className="relative w-full px-6 md:px-8 py-6 text-left flex justify-between items-center"
                >
                  <div className="flex items-start gap-4 md:gap-6">
                    <div className={`mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isOpen
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md'
                      : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                      }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className={`text-lg font-bold transition-colors duration-300 ${isOpen ? 'text-blue-900' : 'text-slate-800 group-hover:text-blue-700'
                        }`}>
                        {faq.question}
                      </span>
                    </div>
                  </div>
                  <div className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${isOpen
                    ? 'bg-blue-50 border-blue-200 rotate-180'
                    : 'bg-transparent border-slate-200 group-hover:border-blue-200'
                    }`}>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-blue-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-blue-500" />
                    )}
                  </div>
                </button>

                <div
                  className={`relative px-6 md:px-8 transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-8 opacity-100' : 'max-h-0 pb-0 opacity-0'
                    }`}
                >
                  <div className="pl-14 md:pl-16 border-l-2 border-slate-100 ml-5">
                    <p className="text-slate-600 leading-relaxed text-base pl-6">
                      {faq.answer}
                    </p>
                  </div>

                  {/* Optional: Helpful buttons could go here */}
                  <div className="pl-20 md:pl-22 mt-4 flex gap-4 opacity-0 animation-delay-300" style={{ opacity: isOpen ? 1 : 0, transition: 'opacity 0.5s ease 0.2s' }}>
                    {/* Placeholder for future interactivity */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Section */}
      <div
        ref={addToRefs}
        className="relative pb-24 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-1000"></div>
          <div className="relative bg-white border border-slate-200 rounded-3xl p-10 md:p-14 text-center overflow-hidden shadow-2xl shadow-slate-200/50">

            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-50 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-50 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-100">
                <MessageCircle className="h-8 w-8 text-blue-600" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Still have questions?
              </h2>
              <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
                Can't find the answer you're looking for? Please chat to our friendly team.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-1"
                >
                  Contact Support
                </button>
                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 rounded-xl font-semibold transition-all shadow-sm"
                >
                  Send us an Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) scale(1) !important;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}