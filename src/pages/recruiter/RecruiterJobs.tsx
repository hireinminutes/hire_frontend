import { Briefcase, PlusCircle, MapPin, Calendar, Clock, IndianRupee, Search, Filter, MoreVertical } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { RecruiterPageProps, Job } from './types';
import { useState } from 'react';

interface RecruiterJobsProps extends RecruiterPageProps {
  myJobs: Job[];
  onPostJob: () => void;
  loading?: boolean;
  profile?: any;
}

export function RecruiterJobs({ onNavigate, myJobs, onPostJob, loading, profile }: RecruiterJobsProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'draft': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'closed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredJobs = myJobs.filter(job =>
    job.jobDetails?.basicInfo?.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.jobDetails?.location?.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans pb-20 sm:pb-12 px-4 pt-4 sm:px-0 sm:pt-0">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-slate-900 text-white p-6 sm:p-8 md:p-10 shadow-xl ring-1 ring-white/10">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-600 rounded-full opacity-20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 tracking-tight">Job Listings</h1>
            <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed">
              Manage your open positions and track applicant pipelines.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={onPostJob}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 border-none px-4 sm:px-6 py-2.5 h-auto text-sm sm:text-base w-full sm:w-auto"
            >
              <PlusCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Post New Job
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 sm:mt-8 pt-6 border-t border-white/10">
          <div>
            <p className="text-slate-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider">Total Jobs</p>
            <p className="text-xl sm:text-2xl font-bold text-white mt-1">{loading ? '...' : myJobs.length}</p>
          </div>
          <div>
            <p className="text-slate-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider">Active</p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1">{loading ? '...' : myJobs.filter(j => j.status === 'active').length}</p>
          </div>
          <div>
            <p className="text-slate-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider">Closed</p>
            <p className="text-xl sm:text-2xl font-bold text-red-400 mt-1">{loading ? '...' : myJobs.filter(j => j.status === 'closed').length}</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs by title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" className="border-slate-200 bg-white hover:bg-slate-50 text-slate-600 w-full md:w-auto justify-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter Status
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 h-64 flex flex-col animate-pulse">
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-slate-200"></div>
                <div className="w-16 h-6 rounded-full bg-slate-100"></div>
              </div>
              <div className="space-y-3 mb-4">
                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                <div className="flex gap-4">
                  <div className="h-4 bg-slate-100 rounded w-20"></div>
                  <div className="h-4 bg-slate-100 rounded w-20"></div>
                </div>
              </div>
              <div className="mt-auto border-t border-slate-50 pt-4 space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-slate-100 rounded w-16"></div>
                  <div className="h-4 bg-slate-100 rounded w-20"></div>
                </div>
                <div className="flex gap-2 pt-2">
                  <div className="flex-1 h-9 bg-slate-100 rounded-lg"></div>
                  <div className="flex-1 h-9 bg-slate-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-16 text-center shadow-sm">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No jobs found</h3>
          <p className="text-slate-500 mb-6">Try adjusting your search or post a new job opening.</p>
          <Button
            onClick={onPostJob}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Job Post
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredJobs.map((job) => (
            <div key={job._id} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 hover:shadow-xl hover:border-blue-200 transition-all group duration-300 flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm overflow-hidden group-hover:scale-110 transition-transform duration-300">
                  {profile?.profile?.company?.logo || profile?.profilePicture ? (
                    <img src={profile?.profile?.company?.logo || profile?.profilePicture} alt="Company Logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(job.status)}`}>
                  {job.status}
                </span>
              </div>

              <div className="mb-4">
                <h3 className="font-bold text-xl text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {job.jobDetails?.basicInfo?.jobTitle || 'Untitled Job'}
                </h3>
                <div className="flex flex-wrap gap-y-2 text-sm text-slate-500">
                  <div className="flex items-center mr-4">
                    <MapPin className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                    {job.jobDetails?.location?.city || 'Remote'}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                    {job.jobDetails?.basicInfo?.employmentType || 'Full-time'}
                  </div>
                </div>
              </div>

              <div className="mt-auto border-t border-slate-50 pt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center">
                    <IndianRupee className="h-3.5 w-3.5 mr-1" />
                    Salary
                  </span>
                  <span className="font-semibold text-slate-900">
                    {job.jobDetails?.compensation?.salary ? `₹${job.jobDetails.compensation.salary.toLocaleString()}` : 'Not disclosed'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    Posted
                  </span>
                  <span className="font-medium text-slate-700">
                    {new Date(job.createdAt || job.created_at || '').toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                    onClick={() => onNavigate('recruiter-dashboard', job._id || job.id, undefined, undefined, undefined, undefined, 'edit-job')}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}