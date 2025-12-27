import { useEffect, useState } from 'react';
import {
  Briefcase, Search, Clock, X, Filter, ChevronDown, Heart
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { getApiUrl } from '../../config/api';
import { getAuthHeaders, useAuth } from '../../contexts/AuthContext';
import { JobSeekerPageProps, Job } from './types';
import { AdBanner } from '../../components/ads/AdBanner';

import { PlanCard } from '../../components/subscription/PlanCard';
// Razorpay will be loaded via script tag

export function JobSeekerBrowseJobs({ onNavigate }: JobSeekerPageProps) {
  const { user } = useAuth();
  const [browseJobs, setBrowseJobs] = useState<Job[]>([]);
  const [browseJobsLoading, setBrowseJobsLoading] = useState(true);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [isTogglingSave, setIsTogglingSave] = useState<string | null>(null);

  // Subscription state
  const [subscribingTo, setSubscribingTo] = useState<string | null>(null);

  // Filter states
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobCategory, setJobCategory] = useState('all');
  const [jobType, setJobType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);


  // Fetch jobs and saved jobs
  // Fetch jobs and saved jobs
  // Debounce search query
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);



  const fetchJobs = async (pageNum = 1, reset = false) => {
    try {
      setBrowseJobsLoading(true);

      // Build query string
      const params = new URLSearchParams();
      if (jobSearchQuery) params.append('search', jobSearchQuery);
      if (jobLocation) params.append('location', jobLocation);
      // Department filter removed
      if (jobType !== 'all') {
        if (jobType === 'remote') {
          params.append('workMode', 'remote');
        } else {
          params.append('employmentType', jobType);
        }
      }
      params.append('limit', '20'); // Reduced from 50
      params.append('page', pageNum.toString());

      const response = await fetch(getApiUrl(`/api/jobs?${params.toString()}`), {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        const transformedJobs = data.data.map((job: any) => ({
          id: job._id,
          title: job.jobDetails?.basicInfo?.jobTitle || 'Untitled Position',
          company: {
            name: (() => {
              const postedBy = job.postedBy || {};
              const profileCompany = postedBy.profile?.company?.name;
              const onboardingCompany = postedBy.recruiterOnboardingDetails?.company?.name;

              return profileCompany ||
                onboardingCompany ||
                (postedBy.profile?.fullName ? `${postedBy.profile.fullName} 's Company` : '') ||
                (postedBy.fullName ? `${postedBy.fullName}'s Company` : '') ||
                'Confidential Company';
            })(),
            logo: job.postedBy?.profile?.company?.logo || job.postedBy?.recruiterOnboardingDetails?.company?.logo || job.postedBy?.profile?.profilePicture || job.postedBy?.profile?.company?.name?.charAt(0).toUpperCase() || job.postedBy?.recruiterOnboardingDetails?.company?.name?.charAt(0).toUpperCase() || '?',
          },
          location: job.jobDetails?.location ?
            `${job.jobDetails.location.city || ''}${job.jobDetails.location.city && job.jobDetails.location.country ? ', ' : ''}${job.jobDetails.location.country || ''}` || 'Remote'
            : 'Remote',
          job_type: job.jobDetails?.basicInfo?.employmentType || 'Full-time',
          salary_min: job.jobDetails?.compensation?.salary || 0,
          salary_max: job.jobDetails?.compensation?.salary,
          category: job.jobDetails?.basicInfo?.department || 'General',
          description: job.jobDetails?.description?.roleSummary ?
            (job.jobDetails.description.roleSummary.length > 150 ? job.jobDetails.description.roleSummary.substring(0, 150) + '...' : job.jobDetails.description.roleSummary)
            : 'No description available for this position.',
          posted_date: new Date(job.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
        }));

        if (reset) {
          setBrowseJobs(transformedJobs);
        } else {
          setBrowseJobs(prev => [...prev, ...transformedJobs]);
        }


        setHasMore(data.pagination?.page < data.pagination?.pages);
      }

      // Optimally fetch ONLY saved job IDs (only on first load or refresh to keep sync)
      if (reset) {
        const savedResponse = await fetch(getApiUrl('/api/jobs/saved/my-saved-jobs?idsOnly=true'), {
          headers: getAuthHeaders(),
        });
        const savedData = await savedResponse.json();
        if (savedData.success) {
          setSavedJobIds(savedData.data || []);
        }
      }

    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setBrowseJobsLoading(false);
    }
  };

  // Debounce search query - Reset page to 1 when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // Reset page
      fetchJobs(1, true); // Fetch first page, reset list
    }, 500);
    return () => clearTimeout(timer);
  }, [jobSearchQuery, jobLocation, jobCategory, jobType]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchJobs(nextPage, false);
  };

  const handleToggleSave = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      alert("Please login to save jobs");
      return;
    }

    if (isTogglingSave) return;

    // Optimistic Update
    const isSaved = savedJobIds.includes(jobId);
    setSavedJobIds(prev =>
      isSaved ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
    setIsTogglingSave(jobId);

    const endpoint = isSaved ? `/api/jobs/${jobId}/unsave` : `/api/jobs/${jobId}/save`;
    const method = isSaved ? 'DELETE' : 'POST';

    try {
      const response = await fetch(getApiUrl(endpoint), {
        method,
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to update');
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      // Revert on error
      setSavedJobIds(prev =>
        isSaved ? [...prev, jobId] : prev.filter(id => id !== jobId)
      );
      alert("Failed to save job. Please try again.");
    } finally {
      setIsTogglingSave(null);
    }
  };

  // No client-side filtering needed anymore
  const filteredJobs = browseJobs;

  const clearAllFilters = () => {
    setJobSearchQuery('');
    setJobLocation('');
    setJobCategory('all');
    setJobType('all');
  };

  // Razorpay script handler
  const handleSubscribe = async (plan: string) => {
    try {
      setSubscribingTo(plan);

      const token = localStorage.getItem('token');

      // Determine Amount with Differential Pricing
      let amount = 0;
      if (plan === 'premium') amount = 49900;
      if (plan === 'pro') amount = 99900;

      // Apply Differential Pricing Logic (Matches backend)
      if (user?.plan === 'premium') {
        if (plan === 'pro') amount = 50000;    // 999 - 499 = 500
      }

      // Create Order
      const orderResponse = await fetch(getApiUrl('/api/payment/create-order'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount,
          planType: plan
        })
      });

      if (!orderResponse.ok) {
        const errData = await orderResponse.json();
        throw new Error(errData.message || 'Failed to create order');
      }

      const orderData = await orderResponse.json();

      // Configure Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.data.finalAmount,
        currency: orderData.data.currency,
        name: 'Hire In Minutes',
        description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan ${user?.plan !== 'free' ? 'Upgrade' : ''}`,
        order_id: orderData.data.orderId,
        handler: async function (response: any) {
          console.log('Payment successful:', response);

          // Verify Payment
          const verifyResponse = await fetch(getApiUrl('/api/payment/verify'), {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            alert(verifyData.message || 'Subscription successful!');
            window.location.reload();
          } else {
            alert(verifyData.message || 'Payment verification failed');
          }
          setSubscribingTo(null);
        },
        modal: {
          ondismiss: function () {
            console.log('Payment cancelled');
            setSubscribingTo(null);
          }
        },
        prefill: {
          name: user?.fullName || '',
          email: user?.email || ''
        },
        theme: {
          color: '#1e293b'
        }
      };

      // Load Razorpay script and open checkout
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      };
      script.onerror = () => {
        alert('Failed to load payment gateway');
        setSubscribingTo(null);
      };
      document.body.appendChild(script);

    } catch (error: any) {
      console.error('Subscription error:', error);
      alert(error.message || 'Failed to process subscription');
      setSubscribingTo(null);
    }
  };

  // Render Plans Section
  const renderPlans = () => {
    // Determine which plans to show as upgrades
    const currentPlan = user?.plan || 'free';

    // Pricing configuration
    const planPrices = {
      premium: 499,
      pro: 999
    };

    // Calculate upgrade prices
    const getUpgradePrice = (targetPlan: string) => {
      if (currentPlan === 'premium') {
        if (targetPlan === 'pro') return 500;
      }
      return planPrices[targetPlan as keyof typeof planPrices];
    };

    // If already on Pro, show active message
    if (currentPlan === 'pro') {
      return (
        <div className="mb-6 p-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">You are on the Pro Plan 🚀</h2>
            <p className="text-blue-100 opacity-90 font-medium">
              You have unlocked all premium features and have 3 interview opportunities remaining.
            </p>
          </div>
          <div className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-2xl font-black border border-white/20 text-sm uppercase tracking-wider">
            Active
          </div>
        </div>
      );
    }

    return (
      <div className="mb-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            {currentPlan !== 'free' ? 'Upgrade Your Plan' : 'Choose Your Plan'}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto font-medium">
            {currentPlan !== 'free'
              ? `You are currently on the ${currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} plan. Upgrade to unlock even more opportunities.`
              : 'Job applications are free! Upgrade to get guaranteed interview opportunities with top companies.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
          {/* Premium Plan */}
          <div className={currentPlan === 'premium' ? 'opacity-50 pointer-events-none' : ''}>
            <PlanCard
              name="Premium"
              price={499}
              features={[
                "Apply for unlimited jobs",
                "Profile visibility to recruiters",
                "1 Guaranteed Interview Opportunity",
                "Priority application status"
              ]}
              recommended={currentPlan === 'free'}
              onSubscribe={() => handleSubscribe('premium')}
              isLoading={subscribingTo === 'premium'}
              isUpgrade={false}
            />
          </div>

          {/* Pro Plan */}
          <div>
            <PlanCard
              name="Pro"
              price={999}
              features={[
                "Everything in Premium",
                "3 Guaranteed Interview Opportunities",
                "Direct Admin Support",
                "Resume Review"
              ]}
              onSubscribe={() => handleSubscribe('pro')}
              isLoading={subscribingTo === 'pro'}
              isUpgrade={currentPlan === 'premium'}
              upgradePrice={getUpgradePrice('pro')}
              originalPrice={999}
              paidAmount={currentPlan === 'premium' ? 499 : undefined}
            />
          </div>
        </div>
      </div>
    );
  };




  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-10 pb-12">
      <div className="relative">
        {/* Glassmorphic Header - Mobile Optimized */}
        <div className="relative overflow-hidden rounded-2xl md:rounded-[32px] bg-slate-900 text-white p-5 sm:p-6 md:p-8 shadow-2xl shadow-slate-900/20 isolate mb-3 sm:mb-5">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs sm:text-sm font-bold uppercase tracking-wider mb-2 sm:mb-3 text-blue-200">
                  <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" /> Job Search
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-1 sm:mb-2">
                  Browse Jobs
                </h1>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
                  Discover opportunities that match your <span className="text-white font-bold">skills</span> and <span className="text-white font-bold">aspirations</span>.
                </p>
              </div>
              <Button
                onClick={scrollToPricing}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 whitespace-nowrap"
              >
                Get Premium
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div>



          {/* Ad Banner - Home Banner Placement */}
          <AdBanner position="home-banner" />

          {/* Sticky Search & Filter Bar */}
          {/* Sticky Search & Filter Bar - Compact Redesign */}
          <div className="sticky top-[72px] lg:top-4 z-30 mb-6 animate-fade-in-up">
            <div className="bg-white backdrop-blur-xl border border-slate-200/50 shadow-sm rounded-xl p-2 transition-all duration-300">
              <div className="flex flex-row gap-2 items-center">

                {/* Merged Search & Location Bar */}
                <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center md:bg-slate-50 md:border md:border-slate-200/50 md:rounded-xl md:shadow-inner-sm transition-all focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500/20 focus-within:bg-white gap-2 md:gap-0">

                  {/* Search Input */}
                  <div className="relative flex-1 group w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search jobs, location..."
                      value={jobSearchQuery}
                      onChange={(e) => setJobSearchQuery(e.target.value)}
                      className="block w-full pl-9 pr-3 h-10 bg-slate-50 md:bg-transparent border-transparent md:border-0 focus:bg-white md:focus:bg-transparent focus:border-blue-500/20 md:focus:border-0 focus:ring-2 md:focus:ring-0 focus:ring-blue-500/10 rounded-lg md:rounded-none text-sm font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Buttons Group */}
                <div className="flex gap-2 shrink-0">
                  {/* Filter Toggle - Compact */}
                  <Button
                    variant={showFilters ? "primary" : "outline"}
                    onClick={() => setShowFilters(!showFilters)}
                    className={`inline-flex h-10 px-3 rounded-lg text-sm font-bold gap-1.5 border-0 shadow-none ${showFilters ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Filters</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                  </Button>



                  {/* Mobile Kebab View */}

                </div>
              </div>
            </div>

            {/* Expanded Filters Panel */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showFilters ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              <div className="p-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Job Type</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-0 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500/20 cursor-pointer appearance-none"
                    >
                      <option value="all">Any Type</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="remote">Remote</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters Tags */}
            {(jobType !== 'all') && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100 px-1">
                {jobType !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 animate-in fade-in zoom-in duration-200 uppercase">
                    {jobType}
                    <button onClick={() => setJobType('all')} className="hover:bg-emerald-100 rounded-full p-0.5 transition-colors"><X className="w-3 h-3" /></button>
                  </span>
                )}
                <button onClick={clearAllFilters} className="text-xs font-bold text-slate-500 hover:text-slate-900 underline ml-auto transition-colors">Clear all</button>
              </div>
            )}
          </div>
        </div>


        {/* Jobs Grid Container */}
        <div className="relative">
          {/* Actual Job Grid */}
          <div>
            {browseJobsLoading ? (

              <div className="flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="p-4 flex gap-4 items-start bg-white">
                    {/* Logo */}
                    <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0" />

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-4 sm:pr-8 space-y-2">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-24 sm:w-32" />
                        <Skeleton className="h-3 w-16 hidden sm:block" />
                      </div>
                      <Skeleton className="h-5 w-40 sm:w-64" />
                      <div className="flex gap-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-20 hidden sm:block" />
                      </div>
                    </div>

                    {/* Action */}
                    <div className="hidden sm:flex flex-col items-end gap-2 ml-2">
                      <Skeleton className="h-8 w-24 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 md:p-16 border border-slate-100 text-center shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 transform hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No jobs found</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
                  We couldn't find any positions matching your search. Try adjusting your filters or search for something else.
                </p>
                <Button variant="outline" onClick={clearAllFilters} className="rounded-full px-8 py-3 !border-slate-200 !text-slate-600 hover:!border-slate-300 hover:!bg-slate-50 font-bold">
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100 relative z-0">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => onNavigate('job-details', job.id)}
                    className="group relative p-3 sm:p-4 flex gap-3 sm:gap-4 items-start hover:bg-slate-50 transition-colors cursor-pointer"
                  >


                    {/* Logo - Left */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
                        {typeof job.company.logo === 'string' && job.company.logo.length > 2
                          ? <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                          : <span className="text-sm font-bold text-slate-500">{job.company.name.charAt(0)}</span>}
                      </div>
                    </div>

                    {/* Middle Content */}
                    <div className="flex-1 min-w-0 pr-10 sm:pr-8">
                      {/* Top Line: Company Name + Time */}
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate pr-2">{job.company.name}</h4>
                        <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0 flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${job.job_type === 'remote' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                          {job.posted_date}
                        </span>
                      </div>

                      {/* Second Line: Job Title */}
                      <h3 className="font-bold text-slate-800 text-sm sm:text-base mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>

                      {/* Third Line: Location + Snippet (Gray) */}
                      <div className="text-xs sm:text-sm text-slate-500 line-clamp-2 sm:line-clamp-1 flex flex-wrap gap-x-2">
                        <span className="font-medium text-slate-600">{job.location}</span>
                        <span className="text-slate-300">•</span>
                        <span>{job.job_type}</span>
                        <span className="text-slate-300">•</span>
                        <span>{job.salary_min > 0 ? `₹${(job.salary_min / 100000).toFixed(1)}L` : 'Negotiable'}</span>
                      </div>
                    </div>

                    {/* Right Action: Star Button + View Details */}
                    <div className="hidden sm:flex flex-col items-end gap-2 ml-4">
                      <Button
                        onClick={(e) => { e.stopPropagation(); onNavigate('job-details', job.id); }}
                        className="px-4 py-1.5 h-auto text-xs font-bold bg-slate-900 text-white rounded-lg hover:bg-black"
                      >
                        View Details
                      </Button>
                    </div>

                    <button
                      onClick={(e) => handleToggleSave(e, job.id)}
                      disabled={isTogglingSave === job.id}
                      className={`absolute right-4 top-4 sm:static sm:order-none p-1.5 rounded-full transition-all ${savedJobIds.includes(job.id) ? 'text-amber-400 hover:bg-amber-50' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'}`}
                    >
                      <Heart className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${savedJobIds.includes(job.id) ? "fill-red-500 text-red-500" : "text-slate-400 hover:text-slate-600"}`} />
                    </button>











                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-center mt-8">
            {hasMore && !browseJobsLoading && (
              <Button onClick={handleLoadMore} variant="outline" className="px-8 py-3 rounded-xl border-slate-200 hover:bg-slate-50 font-bold text-slate-600">
                Load More Jobs
              </Button>
            )}
            {browseJobsLoading && browseJobs.length > 0 && (
              <div className="text-slate-400 font-medium">Loading more...</div>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Section at Bottom */}
      <div id="pricing-section" className="mt-16 scroll-mt-20">
        {renderPlans()}
      </div>
    </div >
  );
}

export default JobSeekerBrowseJobs;
