import { useEffect, useState, useCallback } from 'react';
import {
  MapPin, DollarSign, CheckCircle, FileText, Share2, Calendar, Sparkles, Briefcase, Hand
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { getApiUrl } from '../../config/api';
import { useAuth, getAuthHeaders } from '../../contexts/AuthContext';
import { Job, Application, JobSeekerPageProps } from './types';
import { Skeleton } from '../../components/ui/Skeleton';
import { SkillPassport } from '../../components/candidate/SkillPassport';
import { UpgradeModal } from '../../components/ui/UpgradeModal';

// Modern Stat Card
const StatCard = ({ label, value, icon: Icon, bgClass, iconClass, subtext }: any) => (
  <div className="bg-white p-3 sm:p-6 rounded-2xl sm:rounded-[28px] border border-slate-100 shadow-sm sm:shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
    <div className={`absolute -right-4 -top-4 p-4 opacity-[0.03] transform scale-150 hidden sm:block`}>
      <Icon className="w-24 h-24" />
    </div>

    <div className="relative z-10 flex sm:block items-center gap-3 sm:gap-0">
      <div className="flex items-start justify-between sm:mb-4 shrink-0">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${bgClass} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconClass}`} />
        </div>
        {subtext && <span className="hidden sm:inline-block text-[10px] uppercase font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">{subtext}</span>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center sm:block">
          <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">{value}</h3>
          {subtext && <span className="sm:hidden text-[9px] uppercase font-bold text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md">{subtext}</span>}
        </div>
        <p className="text-xs sm:text-sm font-bold text-slate-400 mt-0.5 sm:mt-1 truncate">{label}</p>
      </div>
    </div>
  </div>
);

// Profile Strength Widget
const ProfileStrengthWidget = ({ completionScore, onCompleteProfile }: { completionScore: number, onCompleteProfile: () => void }) => (
  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20 border border-slate-700/50">
    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>

    <div className="relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-bold text-lg leading-tight">Profile Strength</h3>
          <p className="text-sm text-slate-400 font-medium mt-1">Complete to rank higher</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-3xl font-black text-white">{completionScore}%</span>
        </div>
      </div>

      <div className="w-full bg-slate-800 rounded-full h-3 mb-6 p-0.5">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out relative shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          style={{ width: `${completionScore}%` }}
        ></div>
      </div>

      <Button onClick={onCompleteProfile} className="w-full bg-white !text-slate-900 hover:bg-slate-50 font-bold rounded-xl h-12 shadow-lg shadow-white/10 active:scale-[0.98] transition-all">
        Complete Profile
      </Button>
    </div>
  </div>
);

// Interview Request Widget
const InterviewRequestWidget = ({ interviewCount, plan, onRequest, isLoading }: { interviewCount: number, plan: string, onRequest: () => void, isLoading: boolean }) => {
  const isEligible = plan === 'premium' || plan === 'pro';

  return (
    <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
        <Sparkles className="w-16 h-16" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 leading-tight">Guaranteed Interview</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Premium Service</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-end mb-1">
            <span className="text-2xl font-black text-slate-900">{interviewCount}</span>
            <span className="text-xs font-bold text-slate-400 mb-1">Credits left</span>
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Use your credits to request a guaranteed interview with our placement team.
          </p>
        </div>

        <Button
          onClick={onRequest}
          disabled={!isEligible || interviewCount <= 0 || isLoading}
          className={`w-full h-11 rounded-xl font-bold transition-all ${isEligible && interviewCount > 0
            ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
        >
          {isLoading ? 'Processing...' : (isEligible ? (interviewCount > 0 ? 'Request Interview' : 'No Credits Left') : 'Upgrade to Request')}
        </Button>
      </div>
    </div>
  );
};

export function JobSeekerOverview({ onNavigate }: JobSeekerPageProps) {
  const { profile } = useAuth();
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [, setVerificationStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isRequestingInterview, setIsRequestingInterview] = useState(false);

  const profileCompletion = useCallback(() => {
    let completion = 0;
    if (profile?.fullName) completion += 15;
    if (profile?.email) completion += 15;
    if (profile?.profile?.location?.city) completion += 10;
    if (profile?.profile?.professionalSummary) completion += 15;
    if (profile?.profile?.skills && profile.profile.skills.length > 0) completion += 15;
    if (profile?.profile?.experience && profile.profile.experience.length > 0) completion += 15;
    if (profile?.profile?.documents?.resume) completion += 15;
    return Math.min(completion, 100);
  }, [profile]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'reviewed': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'shortlisted': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'accepted': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const handleShareProfile = async () => {
    if (!profile) return;
    let slug = profile.slug;
    if (!slug && profile.fullName) {
      slug = profile.fullName.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').trim();
    }
    const url = `${window.location.origin}/c/${slug}`;
    setShareUrl(url);
    setShowShareModal(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const checkVerificationStatus = useCallback(async () => {
    try {
      if (profile?.isVerified) {
        setVerificationStatus('none');
        return;
      }
      const response = await fetch(getApiUrl('/api/auth/verification-status'), {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setVerificationStatus(data.data.status || 'none');
        }
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  }, [profile]);

  const loadDashboardData = useCallback(async () => {
    try {
      const jobsResponse = await fetch(getApiUrl('/api/jobs?limit=3'), { headers: getAuthHeaders() });
      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        const mappedJobs = (jobsData.data || []).map((job: any) => ({
          id: job._id || job.id,
          title: job.jobDetails?.basicInfo?.jobTitle || 'Untitled Position',
          description: job.jobDetails?.description?.roleSummary || '',
          location: job.jobDetails?.location ? `${job.jobDetails.location.city || ''}` : 'Remote',
          company: {
            name: job.postedBy?.profile?.company?.name || 'Confidential Company',
            logo: job.postedBy?.profile?.company?.logo || '?'
          },
          salary_min: job.jobDetails?.compensation?.salary || 0,
          salary_max: job.jobDetails?.compensation?.salary,
          posted_date: new Date(job.createdAt).toLocaleDateString()
        }));
        setRecommendedJobs(mappedJobs);
      }

      if (profile) {
        const appsResponse = await fetch(getApiUrl('/api/applications/my/my-applications?limit=5'), { headers: getAuthHeaders() });
        if (appsResponse.ok) {
          const data = await appsResponse.json();
          const mappedApps = (data.data || []).map((app: any) => ({
            id: app._id,
            job: {
              id: app.job?._id || '',
              title: app.job?.jobDetails?.basicInfo?.jobTitle || 'Untitled Job',
              location: app.job?.jobDetails?.location?.city || 'Remote',
              company: { name: app.job?.recruiter?.companyName || 'Company', logo: app.job?.recruiter?.companyName?.charAt(0) || 'C' },
              posted_date: new Date(app.job?.createdAt).toLocaleDateString()
            },
            status: app.status,
            created_at: app.createdAt
          }));
          setApplications(mappedApps);
        }
      }
      await checkVerificationStatus();
      setIsLoadingData(false);
    } catch (error) {
      console.error('Error loading data', error);
      setIsLoadingData(false);
    }
  }, [profile, checkVerificationStatus]);

  const handleGeneralRequestInterview = async () => {
    if (!profile || (profile.plan !== 'premium' && profile.plan !== 'pro')) {
      setShowUpgradeModal(true);
      return;
    }

    if (!profile.interviewCount || profile.interviewCount <= 0) {
      alert("You don't have any interview credits left. Please upgrade your plan.");
      return;
    }

    if (!confirm("Are you sure you want to use 1 interview credit to request a guaranteed interview? Our team will contact you within 24-48 hours.")) {
      return;
    }

    setIsRequestingInterview(true);
    try {
      const response = await fetch(getApiUrl('/api/candidates/request-interview'), {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await response.json();

      if (data.success) {
        alert("Success! Your interview request has been sent to our placement team.");
        window.location.reload(); // Refresh to sync credits
      } else {
        alert(data.message || "Failed to request interview.");
      }
    } catch (error) {
      console.error('Error requesting interview:', error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsRequestingInterview(false);
    }
  };

  useEffect(() => { if (profile) loadDashboardData(); }, [profile, loadDashboardData]);

  const navigateToSection = (section: string) => {
    localStorage.setItem('jobSeekerActiveSection', section);
    window.history.pushState({}, '', `/job-seeker-dashboard/${section}`);
    onNavigate('job-seeker-dashboard', undefined, undefined, undefined, undefined, undefined, section);
  };

  return (
    <div className="space-y-5 md:space-y-8 animate-fade-in pb-24 lg:pb-0">

      {/* Hero / Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full mb-2 border border-blue-100">
            <Sparkles className="w-3 h-3 fill-current" /> Welcome Back
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-1 break-words">
            Hello, {profile?.fullName || 'User'} <Hand className="inline-block w-6 h-6 md:w-8 md:h-8 ml-1 text-amber-400" />
          </h1>
          <p className="text-slate-500 font-medium text-sm md:text-lg">Let's find your next big opportunity.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            className="flex-1 md:flex-none h-10 md:h-12 rounded-xl md:rounded-[14px] font-bold border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-sm md:text-base"
            onClick={handleShareProfile}
          >
            <Share2 className="w-3.5 h-3.5 mr-2" /> Share
          </Button>
          <Button
            className="flex-1 md:flex-none h-10 md:h-12 bg-slate-900 hover:bg-black text-white rounded-xl md:rounded-[14px] font-bold shadow-xl shadow-slate-900/10 active:scale-[0.98] transition-all text-sm md:text-base"
            onClick={() => navigateToSection('browse')}
          >
            Find Jobs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mobile Passport Card (Top) */}
        <div className="lg:hidden mb-2">
          <SkillPassport />
        </div>

        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">

          {/* Stats Grid */}

          {/* Mobile: Combined Horizontal Card */}
          <div className="sm:hidden bg-white p-3 rounded-[20px] border border-slate-100 shadow-sm flex items-center divide-x divide-slate-100 mb-5">
            <div className="flex-1 flex items-center gap-2.5 pr-2 justify-center min-w-0">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xl font-black text-slate-900 leading-none">{applications.length}</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mt-0.5 truncate">Applications</div>
              </div>
            </div>

            <div className="flex-1 flex items-center gap-2.5 pl-2 justify-center min-w-0">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xl font-black text-slate-900 leading-none">0</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mt-0.5 truncate">Interviews</div>
              </div>
            </div>
          </div>

          {/* Desktop: Separate Cards */}
          <div className="hidden sm:grid sm:grid-cols-2 sm:gap-4">
            <StatCard
              label="Applications"
              value={applications.length}
              icon={FileText}
              bgClass="bg-blue-50"
              iconClass="text-blue-600"
              subtext="Sent"
            />
            <StatCard
              label="Interviews"
              value={0}
              icon={Calendar}
              bgClass="bg-purple-50"
              iconClass="text-purple-600"
              subtext="Upcoming"
            />
          </div>

          {/* Recent Applications */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-bold text-base sm:text-xl text-slate-900">Recent Applications</h3>
              <Button variant="ghost" className="text-slate-400 hover:text-blue-600 font-bold hover:bg-transparent p-0 h-auto text-xs sm:text-sm" onClick={() => navigateToSection('applications')}>
                View All
              </Button>
            </div>

            {isLoadingData ? (
              <div className="space-y-3">
                {[1, 2].map(i => <Skeleton key={i} className="h-24 w-full rounded-[24px]" />)}
              </div>
            ) : applications.length === 0 ? (
              <div className="p-10 border-2 border-dashed border-slate-100 rounded-[24px] flex flex-col items-center justify-center text-center bg-white">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-slate-900 font-bold text-base mb-1">No applications yet</p>
                <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">Start applying to jobs and track your progress here.</p>
                <Button onClick={() => navigateToSection('browse')} className="bg-slate-900 text-white hover:bg-black rounded-xl font-bold h-10 px-6">
                  Browse Jobs
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {applications.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      onClick={() => onNavigate('job-details', app.job.id)}
                      className="group p-4 hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-lg font-bold text-slate-500 overflow-hidden shrink-0">
                        {typeof app.job.company.logo === 'string' && app.job.company.logo.length > 2 ? <img src={app.job.company.logo} alt="" className="w-full h-full object-cover" /> : app.job.company.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <h4 className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors text-base">{app.job.title}</h4>
                          <div className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(app.status)}`}>
                            {app.status}
                          </div>
                        </div>
                        <p className="text-xs font-medium text-slate-500 truncate">
                          {app.job.company.name} • Applied {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Recommended Jobs */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-bold text-base sm:text-xl text-slate-900">Recommended for You</h3>
            </div>

            {isLoadingData ? (
              <div className="space-y-3">
                {[1, 2].map(i => <Skeleton key={i} className="h-28 w-full rounded-[24px]" />)}
              </div>
            ) : (
              <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {recommendedJobs.slice(0, 3).map((job) => (
                    <div
                      key={job.id}
                      onClick={() => onNavigate('job-details', job.id)}
                      className="group p-4 hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-4 text-left relative"
                    >
                      <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-700 font-bold shrink-0 shadow-sm overflow-hidden">
                        {typeof job.company.logo === 'string' && job.company.logo.length > 2
                          ? <img src={job.company.logo} alt="" className="w-full h-full object-cover" />
                          : job.company.name.charAt(0)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base truncate">{job.title}</h4>
                        </div>
                        <p className="text-xs font-medium text-slate-500 truncate mb-1.5">{job.company.name}</p>

                        <div className="flex flex-wrap gap-2">
                          <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded">
                            <MapPin className="w-3 h-3" /> {job.location}
                          </span>
                          <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded">
                            <DollarSign className="w-3 h-3" /> {(job.salary_min / 100000).toFixed(1)}L - {(job.salary_max / 100000).toFixed(1)}L
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <div className="hidden lg:block">
            <ProfileStrengthWidget completionScore={profileCompletion()} onCompleteProfile={() => navigateToSection('profile')} />
          </div>
          {(profile?.plan === 'premium' || profile?.plan === 'pro') && (
            <div className="hidden lg:block">
              <InterviewRequestWidget
                interviewCount={profile?.interviewCount || 0}
                plan={profile?.plan || 'free'}
                onRequest={handleGeneralRequestInterview}
                isLoading={isRequestingInterview}
              />
            </div>
          )}
          <div className="hidden lg:block bg-white rounded-[28px] border border-slate-100 p-1 shadow-sm">
            <SkillPassport />
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowShareModal(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 ring-8 ring-blue-50/50">
                <Share2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Share Profile</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">Share your verified profile link with recruiters or on social media.</p>

              <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 mb-6 border border-slate-200/60 inner-shadow-sm">
                <p className="text-xs text-slate-500 font-mono font-medium flex-1 truncate text-left">{shareUrl}</p>
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  className={`rounded-xl px-4 font-bold transition-all ${copiedToClipboard ? 'bg-green-500 text-white' : 'bg-white text-slate-900 border border-slate-200 shadow-sm'}`}
                >
                  {copiedToClipboard ? <CheckCircle className="w-4 h-4" /> : 'Copy'}
                </Button>
              </div>

              <Button onClick={() => setShowShareModal(false)} variant="outline" className="w-full h-12 rounded-2xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => {
          setShowUpgradeModal(false);
          onNavigate('job-seeker-dashboard', undefined, undefined, undefined, undefined, undefined, 'browse');
        }}
      />
    </div>
  );
}

export default JobSeekerOverview;
