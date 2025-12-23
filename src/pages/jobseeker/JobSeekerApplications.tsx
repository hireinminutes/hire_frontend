import { useEffect, useState } from 'react';
import {
  Briefcase, MapPin, Search,
  CheckCircle, XCircle, Clock, ArrowRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { getApiUrl } from '../../config/api';
import { getAuthHeaders } from '../../contexts/AuthContext';
import { JobSeekerPageProps, Application } from './types';

export function JobSeekerApplications({ onNavigate }: JobSeekerPageProps) {
  const { } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(getApiUrl('/api/applications/my/my-applications'), {
          headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (data.success) {
          const transformedApps = data.data.map((app: any) => ({
            id: app._id,
            job: {
              id: app.job?._id,
              title: app.job?.jobDetails?.basicInfo?.jobTitle || 'Unknown Role',
              company: {
                name: app.job?.postedBy?.profile?.company?.name || 'Unknown Company',
                logo: app.job?.postedBy?.profile?.company?.logo
              },
              location: app.job?.jobDetails?.basicInfo?.location ?
                `${app.job.jobDetails.basicInfo.location.city || ''}, ${app.job.jobDetails.basicInfo.location.state || ''}`
                : 'Remote',
              job_type: app.job?.jobDetails?.basicInfo?.jobType || 'Full-time'
            },
            status: app.status,
            created_at: app.createdAt,
            last_updated: app.updatedAt
          }));
          setApplications(transformedApps);
          setFilteredApplications(transformedApps);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    let result = applications;

    if (activeTab !== 'all') {
      result = result.filter(app => app.status === activeTab);
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(app =>
        app.job.title.toLowerCase().includes(lowerQuery) ||
        app.job.company.name.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredApplications(result);
  }, [activeTab, searchQuery, applications]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10';
      case 'rejected': return 'text-red-500 border-red-500/20 bg-red-500/10';
      default: return 'text-amber-500 border-amber-500/20 bg-amber-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'rejected': return <XCircle className="w-3.5 h-3.5" />;
      default: return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6 pb-24 px-4 pt-4 sm:px-0 sm:pt-0">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white p-5 md:p-8 shadow-2xl shadow-slate-900/20 isolate">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_14px]"></div>

        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-blue-500 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-indigo-600 rounded-full opacity-20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight mb-1">
              My Applications
            </h1>
            <p className="text-slate-400 text-sm md:text-base font-medium max-w-lg">
              Track your journey in real-time.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl flex gap-6 items-center self-start md:self-auto">
            <div>
              <div className="text-xl md:text-2xl font-black">{applications.length}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</div>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div>
              <div className="text-xl md:text-2xl font-black text-emerald-400">
                {applications.filter(a => a.status === 'accepted').length}
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accepted</div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar & Tabs */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Mobile Tabs - Compact Grid */}
        <div className="bg-white p-1 rounded-lg border border-slate-200 grid grid-cols-4 w-full md:w-auto md:inline-flex shadow-sm gap-1">
          {['all', 'pending', 'accepted', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`
                 px-1 py-1.5 rounded-md text-xs font-bold capitalize transition-all duration-300 flex items-center justify-center
                 ${activeTab === tab
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
               `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-white border-slate-200 rounded-2xl shadow-sm focus:ring-slate-900/20 text-base"
          />
        </div>
      </div>

      {
        loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-4">
                <div className="flex gap-4">
                  <Skeleton className="w-14 h-14 rounded-2xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[32px] border border-slate-100 border-dashed">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No applications found</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              {searchQuery
                ? "We couldn't find any applications matching your search."
                : "You haven't applied to any jobs yet. Start your journey today!"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => onNavigate('job-seeker-dashboard', undefined, undefined, undefined, undefined, undefined, 'browse')}
                className="bg-slate-900 text-white hover:bg-black px-8 py-3 h-auto rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20"
              >
                Browse Jobs
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {filteredApplications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => onNavigate('job-details', app.job.id)}
                  className="group p-4 hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-4 text-left"
                >
                  {/* Logo */}
                  <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-lg font-bold text-slate-500 overflow-hidden shrink-0">
                    {typeof app.job.company.logo === 'string' && app.job.company.logo.length > 2 ? <img src={app.job.company.logo} alt="" className="w-full h-full object-cover" /> : app.job.company.logo || app.job.company.name.charAt(0)}
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors text-base">{app.job.title}</h4>
                      <div className={`shrink-0 px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}
                        <span className="hidden sm:inline">{app.status}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 truncate">
                      <span className="truncate">{app.job.company.name}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0"></span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3" /> {app.job.location}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0 hidden sm:block"></span>
                      <span className="hidden sm:block">Applied {new Date(app.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Action Arrow */}
                  <div className="hidden sm:block">
                    <Button size="icon" variant="ghost" className="text-slate-300 group-hover:text-blue-600 rounded-full">
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }
    </div >
  );
}
