import { useEffect, useState } from 'react';
import {
  Briefcase, Heart, MapPin, Clock, ChevronRight, X, ArrowRight, Bookmark
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { getApiUrl } from '../../config/api';
import { getAuthHeaders } from '../../contexts/AuthContext';
import { JobSeekerPageProps, Job } from './types';

export function JobSeekerSavedJobs({ onNavigate }: JobSeekerPageProps) {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await fetch(getApiUrl('/api/jobs/saved/my-saved-jobs'), {
          headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (data.success) {
          const transformedJobs = data.data.filter((job: any) => job && job._id).map((job: any) => ({
            id: job._id,
            title: job.jobDetails?.basicInfo?.jobTitle || 'Untitled',
            company: {
              name: job.postedBy?.profile?.company?.name || job.postedBy?.recruiterOnboardingDetails?.company?.name || 'Unknown Company',
              logo: job.postedBy?.profile?.company?.logo || job.postedBy?.recruiterOnboardingDetails?.company?.logo
            },
            location: job.jobDetails?.location?.city ? `${job.jobDetails.location.city}, ${job.jobDetails.location.country}` : 'Remote',
            job_type: job.jobDetails?.basicInfo?.employmentType || 'Full-time',
            salary_min: job.jobDetails?.compensation?.salary || 0,
            salary_max: job.jobDetails?.compensation?.salary,
            posted_date: new Date(job.createdAt).toLocaleDateString()
          }));
          setSavedJobs(transformedJobs);
        }
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const handleUnsaveJob = async (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(getApiUrl(`/api/jobs/${jobId}/unsave`), {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        setSavedJobs(prev => prev.filter(job => job.id !== jobId));
      }
    } catch (error) {
      console.error('Error unsaving job:', error);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Glassmorphic Header */}
      <div className="relative overflow-hidden rounded-[32px] bg-slate-900 text-white p-8 md:p-12 shadow-2xl shadow-slate-900/20 isolate">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider mb-4 text-pink-200">
            <Heart className="w-3 h-3 fill-current" /> Wishlist
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4 flex items-center gap-4">
            Saved Jobs
            <span className="bg-white/10 text-white text-lg px-3 py-1 rounded-xl border border-white/10">{savedJobs.length}</span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed font-medium max-w-2xl">
            Keep track of the opportunities that caught your eye. Apply when you're ready.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <Skeleton className="w-14 h-14 rounded-2xl" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="pt-4 flex justify-between items-center">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-10 w-28 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[32px] border border-slate-100 border-dashed">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Bookmark className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No saved jobs yet</h3>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">Jobs you save will appear here so you can easily apply to them later.</p>
          <Button
            onClick={() => onNavigate('job-seeker-dashboard', undefined, undefined, undefined, undefined, undefined, 'browse')}
            className="bg-slate-900 text-white hover:bg-black px-8 py-3 rounded-xl font-bold shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-1"
          >
            Find Jobs to Save
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((job) => (
            <Card
              key={job.id}
              className="group flex flex-col h-full bg-white border border-slate-100 hover:border-blue-200 shadow-lg shadow-slate-200/50 hover:shadow-blue-500/10 rounded-[24px] overflow-hidden transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-xl font-bold text-slate-700 overflow-hidden relative z-10">
                    {job.company.logo ? (
                      <img src={job.company.logo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      job.company.name.charAt(0)
                    )}
                  </div>
                  <button
                    onClick={(e) => handleUnsaveJob(job.id, e)}
                    className="w-10 h-10 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 flex items-center justify-center transition-colors"
                    title="Remove from saved"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-black text-slate-900 mb-1 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-sm font-bold text-slate-500">{job.company.name}</p>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-bold text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs font-bold text-slate-400">
                  Posted {job.posted_date}
                </div>
                <Button
                  onClick={() => onNavigate('job-details', job.id)}
                  className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-bold text-sm h-10 px-5 rounded-xl transition-all shadow-sm hover:shadow"
                >
                  Apply Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
