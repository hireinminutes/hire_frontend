import {
  Briefcase, Users, Clock, PlusCircle, Search, ArrowUpRight
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { RecruiterPageProps, Application, Job } from './types';
import { useAuth } from '../../contexts/AuthContext';

interface RecruiterOverviewProps extends RecruiterPageProps {
  applications: Application[];
  myJobs: Job[];
  stats?: {
    activeJobs: number;
    totalApplications: number;
    pendingApplications: number;
    totalJobs?: number;
    closedJobs?: number;
    totalViews?: number;
    shortlistedApplications?: number;
    rejectedApplications?: number;
    hiredApplications?: number;
  };
}

export function RecruiterOverview({
  onNavigate,
  applications,
  myJobs,
  stats
}: RecruiterOverviewProps) {
  const { profile } = useAuth();

  // Use provided stats or fallback to calculating from lists (only works if lists are full, but graceful degradation)
  const activeJobs = stats?.activeJobs ?? myJobs.filter(j => j.status === 'active').length;
  const totalApplications = stats?.totalApplications ?? applications.length; // Uses total from stats, not list length
  const pendingApplications = stats?.pendingApplications ?? applications.filter(a => a.status === 'pending').length;

  // Lists are already sorted and limited from backend
  const recentApplications = applications;

  const handleSectionChange = (section: string) => {
    onNavigate('recruiter-dashboard', undefined, undefined, undefined, undefined, undefined, section);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'reviewed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'accepted': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'draft': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const StatCard = ({ label, value, icon: Icon, color, className = '' }: any) => (
    <div className={`bg-white p-3 sm:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group h-full flex flex-col justify-between ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 h-full">
        <div className="order-2 sm:order-1 flex flex-col justify-between h-full">
          <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wide leading-tight">{label}</p>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mt-1 sm:mt-2 tracking-tight">{value}</h3>
        </div>
        <div className={`p-2 sm:p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100 group-hover:scale-110 transition-transform self-start order-1 sm:order-2 mb-1 sm:mb-0 shrink-0`}>
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-10 px-4 pt-4 sm:px-0 sm:pt-0 pb-20 sm:pb-12 animate-fade-in font-sans">
      {/* Glassmorphic Header - Mobile Optimized */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-[32px] bg-slate-900 text-white p-6 sm:p-8 md:p-12 shadow-2xl shadow-slate-900/20 isolate">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl -z-10"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 sm:mb-4 text-blue-200">
              <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" /> Recruiter Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-2 sm:mb-3">
              Welcome back, {profile?.fullName?.split(' ')[0] || 'Recruiter'}!
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-medium">
              Here is what's happening with your job postings and applications today.
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Button
              onClick={() => handleSectionChange('post-job')}
              className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20 border-none px-5 sm:px-6 py-3 h-12 sm:h-auto text-sm sm:text-base font-bold rounded-xl transition-all"
            >
              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Post New Job
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        <StatCard
          label="Active Jobs"
          value={activeJobs}
          icon={Briefcase}
          color="bg-emerald-600"
        />
        <StatCard
          label="Total Applicants"
          value={totalApplications}
          icon={Users}
          color="bg-blue-600"
        />
        <StatCard
          label="Pending Review"
          value={pendingApplications}
          icon={Clock}
          color="bg-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="xl:col-span-2 space-y-8">

          {/* Recent Applications Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-400" />
                <h3 className="font-bold text-slate-800">Recent Applications</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleSectionChange('applicants')} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                View All <ArrowUpRight className="ml-1 w-4 h-4" />
              </Button>
            </div>

            {applications.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-slate-300" />
                </div>
                <h4 className="text-slate-900 font-semibold mb-1">No applications yet</h4>
                <p className="text-sm">Wait for candidates to apply to your jobs.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-xs">
                    <tr>
                      <th className="px-6 py-4">Candidate</th>
                      <th className="px-6 py-4">Applying For</th>
                      <th className="px-6 py-4">Applied Date</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentApplications.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 shadow-sm border border-white">
                              {app.applicant?.fullName?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{app.applicant?.fullName || 'Unknown'}</div>
                              <div className="text-xs text-slate-500">{app.applicant?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded-md text-xs border border-slate-200">
                            {app.job?.jobDetails?.basicInfo?.jobTitle || 'Unknown Job'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium text-xs">
                          {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${getStatusStyle(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Active Jobs List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2 sm:gap-3">
                <Briefcase className="w-5 h-5 text-slate-400 shrink-0" />
                <h3 className="font-bold text-slate-800 text-base sm:text-lg">Active Jobs</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleSectionChange('jobs')} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs sm:text-sm font-bold">
                View All <ArrowUpRight className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
            <div className="divide-y divide-slate-100">
              {myJobs.filter(j => j.status === 'active').slice(0, 3).map((job) => (
                <div key={job._id} className="p-4 sm:p-5 hover:bg-slate-50 transition-all border-b border-slate-100 last:border-0 group">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100 group-hover:scale-105 transition-transform">
                        <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-tight truncate pr-2 group-hover:text-blue-600 transition-colors">
                          {job.jobDetails?.basicInfo?.jobTitle}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                          <span className="truncate max-w-[80px] sm:max-w-none">{job.jobDetails?.location?.city || 'Remote'}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0"></span>
                          <span>{job.jobDetails?.basicInfo?.employmentType}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                      <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wide">
                        Active
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSectionChange('jobs')}
                        className="h-8 w-8 sm:w-auto p-0 sm:px-3 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <ArrowUpRight className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Manage</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {myJobs.filter(j => j.status === 'active').length === 0 && (
                <div className="p-8 sm:p-12 text-center text-slate-500">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border-2 border-dashed border-slate-200">
                    <PlusCircle className="w-6 h-6 sm:w-8 sm:h-8 text-slate-300" />
                  </div>
                  <h3 className="text-slate-900 font-bold text-sm sm:text-base mb-1">No active jobs</h3>
                  <p className="text-xs sm:text-sm mb-4 max-w-[200px] sm:max-w-xs mx-auto text-slate-400">Post a job to start hiring.</p>
                  <Button size="sm" onClick={() => handleSectionChange('post-job')} className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm">Post Job</Button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">

          {/* Quick Find */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Find Candidates</h3>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Search our database of verified candidates to find your next hire directly.
              </p>
              <Button
                onClick={() => handleSectionChange('find-candidates')}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 border-none font-bold shadow-lg shadow-blue-900/20"
              >
                Search Database
              </Button>
            </div>
          </div>

          {/* Recent Activity (Placeholder) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full max-h-96">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Recent Activity</h3>
            </div>
            <div className="flex-1 p-6 flex items-center justify-center">
              <div className="text-center">
                <Clock className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-sm text-slate-500 font-medium">No recent activity</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}