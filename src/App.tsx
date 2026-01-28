import { useState, useEffect, useCallback } from 'react';
import { Clock } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { SocketProvider } from './contexts/SocketContext';
import { Navbar } from './components/ui/Navbar';
import { Footer } from './components/layout';
import { FullScreenModalAd } from './components/ads/FullScreenModalAd';
import { ScrollToTop } from './components/ScrollToTop';
import { LandingPage } from './pages/LandingPage';
import { RoleSelectPage } from './pages/RoleSelectPage';
import { AuthPage } from './pages/AuthPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { SettingsPage } from './pages/SettingsPage';
import { PostJobPage } from './pages/PostJobPage';
import { SavedJobsPage } from './pages/SavedJobsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ApplicantsPage } from './pages/ApplicantsPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { ForCandidatesPage } from './pages/ForCandidatesPage';
import { ForRecruitersPage } from './pages/ForRecruitersPage';
import { RecruiterOnboardingPage } from './pages/RecruiterOnboardingPage';
import { CourseDetailsPage } from './pages/CourseDetailsPage';
import { PublicCandidateProfile } from './pages/PublicCandidateProfile';
import { TermsPrivacyPage } from './pages/TermsPrivacyPage';
import { PaymentStatusPage } from './pages/PaymentStatusPage';
import { PassportPage } from './pages/jobseeker/PassportPage';
import { VerifyTwoFactorPage } from './pages/VerifyTwoFactorPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Import separated Job Seeker Dashboard pages
import {
  JobSeekerLayout,
  JobSeekerOverview,
  JobSeekerBrowseJobs,
  JobSeekerApplications,
  JobSeekerSavedJobs,
  JobSeekerNotifications,
  JobSeekerProfile,
  JobSeekerSettings,
} from './pages/jobseeker';

// Import separated Recruiter Dashboard pages
import {
  RecruiterLayout,
  RecruiterOverview,
  RecruiterJobs,
  RecruiterApplicants,
  RecruiterFindCandidates,
  RecruiterCompany,
  RecruiterPostJob,
  PostInternshipPage,
  Job,
  Application,
  Candidate,
} from './pages/recruiter';

import CollegeDashboardLayout from './pages/college/CollegeDashboardLayout';
import CollegeRegisterPage from './pages/CollegeRegisterPage';
import CollegeLoginPage from './pages/CollegeLoginPage';
import { CollegeStudentsPage } from './pages/admin/CollegeStudentsPage';

type PageState = {
  page: string;
  role?: 'job_seeker' | 'employer' | 'admin';
  authMode?: 'signin' | 'signup';
  jobId?: string;
  collegeId?: string;
  courseId?: string;
  successMessage?: string;
  profileSlug?: string;
  dashboardSection?: string;
};

// ... (keep existing imports/code)

// Helper function to get auth headers (already exists)

// Recruiter Dashboard Component - Handles sub-routing and data fetching
import { jobsApi, applicationsApi } from './services/api';

interface RecruiterDashboardProps {
  onNavigate: any;
  activeSection: string;
  jobId?: string;
}

const RecruiterDashboardRouter = ({ onNavigate, activeSection, jobId }: RecruiterDashboardProps) => {
  const { profile } = useAuth();
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [jobsRes, appsRes] = await Promise.all([
        jobsApi.getMyJobs(),
        applicationsApi.getRecruiterApplications()
      ]);

      if (jobsRes.data) {
        // handle potential different response structures
        const jobsData = Array.isArray(jobsRes.data) ? jobsRes.data : (jobsRes.data as any).jobs || [];
        setMyJobs(jobsData);
      }

      if (appsRes.data) {
        setApplications(Array.isArray(appsRes.data) ? appsRes.data : []);
      }
    } catch (error) {
      console.error('Error fetching recruiter data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handler for posting a job
  const handlePostJob = () => {
    onNavigate('recruiter-dashboard', undefined, undefined, undefined, undefined, undefined, 'post-job');
  };

  const handleJobPosted = () => {
    fetchData(); // Refresh data
    onNavigate('recruiter-dashboard', undefined, undefined, undefined, undefined, undefined, 'jobs');
  };

  return (
    <RecruiterLayout onNavigate={onNavigate} activeSection={activeSection}>
      {activeSection === 'overview' && (
        <RecruiterOverview
          onNavigate={onNavigate}
          applications={applications}
          myJobs={myJobs}
          stats={{
            activeJobs: myJobs.filter(j => j.status === 'active').length,
            totalApplications: applications.length,
            pendingApplications: applications.filter(a => a.status === 'pending').length
          }}
        />
      )}
      {activeSection === 'jobs' && (
        <RecruiterJobs
          onNavigate={onNavigate}
          myJobs={myJobs}
          onPostJob={handlePostJob}
          loading={loading}
          profile={profile}
        />
      )}
      {activeSection === 'applicants' && (
        <RecruiterApplicants
          onNavigate={onNavigate}
          applications={applications}
          loadingApplications={loading}
          onRefreshApplications={fetchData}
          // @ts-ignore - Prop mismatch in types vs usage, passing jobId if needed for filtering
          jobId={jobId}
        />
      )}
      {activeSection === 'find-candidates' && (
        <RecruiterFindCandidates
          onNavigate={onNavigate}
          // Pass dummy or fetched candidates if needed, or let component fetch. 
          // Assuming component fetches its own data for now as it's a search page.
          candidates={[]}
          loadingCandidates={false}
        />
      )}
      {activeSection === 'company' && (
        <RecruiterCompany
          onNavigate={onNavigate}
          profile={profile}
          onNavigateToOnboarding={() => onNavigate('recruiter-onboarding')}
        />
      )}
      {activeSection === 'post-job' && (
        <RecruiterPostJob
          onNavigate={onNavigate}
          onJobPosted={handleJobPosted}
          onCancel={() => onNavigate('recruiter-dashboard', undefined, undefined, undefined, undefined, undefined, 'overview')}
        />
      )}
    </RecruiterLayout>
  );
};

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [pageState, setPageState] = useState<PageState>(() => {
    // Load page from URL or localStorage
    const path = window.location.pathname.slice(1);
    let page = 'landing';
    let jobId: string | undefined;
    let courseId: string | undefined;
    let profileSlug: string | undefined;
    let dashboardSection: string | undefined;
    let collegeId: string | undefined;
    let role: 'job_seeker' | 'employer' | 'admin' | undefined;
    let authMode: 'signin' | 'signup' | undefined;

    if (path) {
      if (path.startsWith('auth/')) {
        // ... (existing auth logic)
        const parts = path.split('/');
        page = 'auth';
        if ((parts[1] === 'signin' || parts[1] === 'signup') && parts[2]) {
          authMode = parts[1] as 'signin' | 'signup';
          const roleParam = parts[2];
          role = (roleParam === 'job-seeker' || roleParam === 'candidate') ? 'job_seeker' :
            (roleParam === 'employer' || roleParam === 'recruiter') ? 'employer' : undefined;
        } else if (parts[1]) {
          const roleParam = parts[1];
          role = (roleParam === 'job-seeker' || roleParam === 'candidate') ? 'job_seeker' :
            (roleParam === 'employer' || roleParam === 'recruiter') ? 'employer' : undefined;
          authMode = 'signin';
        }
      } else if (path.startsWith('admin/')) {
        if (path === 'admin/login') {
          page = path;
        } else if (path.startsWith('admin/college/') && path.endsWith('/students')) {
          // Check for /admin/college/:id/students
          const parts = path.split('/');
          // path is admin/college/:id/students
          // parts[0]=admin, parts[1]=college, parts[2]=id, parts[3]=students
          if (parts.length === 4 && parts[1] === 'college' && parts[3] === 'students') {
            page = 'admin-college-students';
            collegeId = parts[2];
          } else {
            const parts = path.split('/');
            page = 'admin';
            dashboardSection = parts[1] || 'overview';
          }
        } else {
          const parts = path.split('/');
          page = 'admin';
          dashboardSection = parts[1] || 'overview';
        }
      } else if (path.startsWith('job-details/')) {
        const parts = path.split('/');
        page = 'job-details';
        jobId = parts[1];
      } else if (path.startsWith('courses/')) {
        const parts = path.split('/');
        page = 'course-details';
        courseId = parts[1];
      } else if (path.startsWith('c/')) {
        const parts = path.split('/');
        page = 'public-profile';
        profileSlug = parts[1];
      } else if (path.startsWith('job-seeker-dashboard/')) {
        const parts = path.split('/');
        page = 'job-seeker-dashboard';
        dashboardSection = parts[1] || 'overview';
      } else if (path.startsWith('recruiter-dashboard/')) {
        const parts = path.split('/');
        page = 'recruiter-dashboard';
        dashboardSection = parts[1] || 'overview';
      } else if (path.startsWith('payment/status')) {
        page = 'payment-status';
      } else if ((path === 'college' || path.startsWith('college/')) && !path.startsWith('college/register') && !path.startsWith('college/login')) {
        const parts = path.split('/');
        page = 'college';
        dashboardSection = parts[1] || 'overview';
      } else if (path === '') {
        page = 'landing';
      } else {
        const validStaticPages = [
          'landing',
          'role-select',
          'forgot-password',
          'verify-2fa',
          'recruiter-onboarding',
          'admin/login',
          'college/register',
          'college/login',
          'faq',
          'contact',
          'about',
          'for-candidates',
          'for-recruiters',
          'terms-privacy',
          'payment-status',
          'passport',
          'settings',
          'post-job',
          'post-internship',
          'saved-jobs',
          'notifications',
          'applicants'
        ];

        if (validStaticPages.includes(path)) {
          page = path;
        } else {
          page = 'not-found';
        }
      }
    }

    // ... (keep existing return logic)
    if (page !== 'landing' || path === '' || path === 'landing') {
      return { page, jobId, courseId, profileSlug, dashboardSection, role, authMode, collegeId };
    }

    const savedState = localStorage.getItem('pageState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        return { ...parsed, profileSlug, dashboardSection, collegeId };
      } catch {
        // Ignore invalid JSON
      }
    }
    return { page, jobId, courseId, profileSlug, dashboardSection, collegeId };
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1);
      let page = 'landing';
      let jobId: string | undefined;
      let dashboardSection: string | undefined;
      let collegeId: string | undefined;
      let role: 'job_seeker' | 'employer' | 'admin' | undefined;
      let authMode: 'signin' | 'signup' | undefined;
      let courseId: string | undefined;
      let profileSlug: string | undefined;

      if (path) {
        if (path.startsWith('auth/')) {
          // ... (auth logic)
          const parts = path.split('/');
          page = 'auth';
          if ((parts[1] === 'signin' || parts[1] === 'signup') && parts[2]) {
            authMode = parts[1] as 'signin' | 'signup';
            const roleParam = parts[2];
            role = (roleParam === 'job-seeker' || roleParam === 'candidate') ? 'job_seeker' :
              (roleParam === 'employer' || roleParam === 'recruiter') ? 'employer' : undefined;
          } else if (parts[1]) {
            const roleParam = parts[1];
            role = (roleParam === 'job-seeker' || roleParam === 'candidate') ? 'job_seeker' :
              (roleParam === 'employer' || roleParam === 'recruiter') ? 'employer' : undefined;
            authMode = 'signin';
          }
        } else if (path.startsWith('admin/')) {
          if (path === 'admin/login') {
            page = path;
          } else if (path.startsWith('admin/college/') && path.endsWith('/students')) {
            const parts = path.split('/');
            if (parts.length === 4 && parts[1] === 'college' && parts[3] === 'students') {
              page = 'admin-college-students';
              collegeId = parts[2];
            } else {
              const parts = path.split('/');
              page = 'admin';
              dashboardSection = parts[1] || 'overview';
            }
          } else {
            const parts = path.split('/');
            page = 'admin';
            dashboardSection = parts[1] || 'overview';
          }
        } else if (path.startsWith('job-details/')) {
          const parts = path.split('/');
          page = 'job-details';
          jobId = parts[1];
        } else if (path.startsWith('courses/')) {
          const parts = path.split('/');
          page = 'course-details';
          courseId = parts[1];
        } else if (path.startsWith('c/')) {
          const parts = path.split('/');
          page = 'public-profile';
          profileSlug = parts[1];
        } else if (path.startsWith('job-seeker-dashboard/')) {
          const parts = path.split('/');
          page = 'job-seeker-dashboard';
          dashboardSection = parts[1] || 'overview';
        } else if (path.startsWith('recruiter-dashboard/')) {
          const parts = path.split('/');
          page = 'recruiter-dashboard';
          dashboardSection = parts[1] || 'overview';
        } else if (path.startsWith('payment/status')) {
          page = 'payment-status';
        } else if (path.startsWith('college/') && !path.startsWith('college/register') && !path.startsWith('college/login')) {
          const parts = path.split('/');
          page = 'college';
          dashboardSection = parts[1] || 'overview';
        } else {
          // ... (validStaticPages check)
          const validStaticPages = [
            'landing', 'role-select', 'forgot-password', 'verify-2fa', 'recruiter-onboarding',
            'admin/login', 'college/register', 'college/login', 'faq', 'contact', 'about',
            'for-candidates', 'for-recruiters', 'terms-privacy', 'payment-status', 'passport',
            'settings', 'post-job', 'post-internship', 'saved-jobs', 'notifications', 'applicants'
          ];
          if (validStaticPages.includes(path)) {
            page = path;
          } else {
            page = 'not-found';
          }
        }
      }

      setPageState({ page, jobId, dashboardSection, role, authMode, courseId, profileSlug, collegeId });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Debug log for page state
  console.log('App Render - PageState:', pageState);

  // Handle auth redirect
  useEffect(() => {
    if (!loading && user) {
      // If user is logged in, redirect to appropriate dashboard if on public/auth pages
      const publicPages = ['landing', 'auth', 'role-select', 'admin/login', 'college/login', 'recruiter-onboarding', 'verify-2fa', 'forgot-password'];

      if (publicPages.includes(pageState.page)) {
        if (profile?.role === 'admin') {
          handleNavigate('admin');
        } else if (profile?.role === 'employer') {
          if (profile.requiresOnboarding) {
            handleNavigate('recruiter-onboarding');
          } else {
            handleNavigate('recruiter-dashboard');
          }
        } else if (profile?.role === 'job_seeker') {
          handleNavigate('job-seeker-dashboard');
        } else if (user.role === 'college') {
          handleNavigate('college');
        }
      }
    }
  }, [user, loading, profile, pageState.page]);

  // Handle 404 redirect
  useEffect(() => {
    // If page is not-found, we show the 404 page.
    // This effect can be used for any side effects if needed, or we can leave it empty if rendering is handled.
    // For now, removing the placeholder comment.
  }, [pageState.page]);

  const handleNavigate = (page: string, jobId?: string, role?: 'job_seeker' | 'employer' | 'admin', courseId?: string, successMessage?: string, profileSlug?: string, dashboardSection?: string, authMode?: 'signin' | 'signup', collegeId?: string) => {
    const newState = { page, jobId, role, courseId, successMessage, profileSlug, dashboardSection, authMode, collegeId };
    setPageState(newState);
    localStorage.setItem('pageState', JSON.stringify(newState));
    let url = `/${page}`;
    if (page === 'landing') {
      url = '/';
    } else if (page === 'auth' && role) {
      const mode = authMode || 'signin';
      const roleSlug = role === 'job_seeker' ? 'job-seeker' : 'employer';
      url = `/auth/${mode}/${roleSlug}`;
    } else if (jobId) {
      url = `/${page}/${jobId}`;
    } else if (courseId) {
      url = `/courses/${courseId}`;
    } else if (profileSlug) {
      url = `/c/${profileSlug}`;
    } else if (page === 'admin-college-students' && collegeId) {
      url = `/admin/college/${collegeId}/students`;
    } else if (dashboardSection && (page === 'job-seeker-dashboard' || page === 'recruiter-dashboard' || page === 'college' || page === 'admin')) {
      url = `/${page}/${dashboardSection}`;
    }
    window.history.pushState({}, '', url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <>
      {/* Scroll to top on navigation */}
      <ScrollToTop trigger={pageState} />

      {/* Show Navbar on public pages - HIDE if user is logged in OR on auth/role-select pages */}
      {!user && !['auth', 'role-select'].includes(pageState.page) && (
        <Navbar onNavigate={handleNavigate} currentPage={pageState.page} />
      )}

      <main>
        {pageState.page === 'landing' && <LandingPage onNavigate={handleNavigate} />}
        {pageState.page === 'role-select' && <RoleSelectPage onNavigate={handleNavigate} />}
        {pageState.page === 'public-profile' && pageState.profileSlug && (
          <PublicCandidateProfile profileSlug={pageState.profileSlug} />
        )}
        {pageState.page === 'auth' && pageState.role && pageState.role !== 'admin' && (
          <AuthPage
            role={pageState.role as 'job_seeker' | 'employer'}
            onNavigate={handleNavigate}
            successMessage={pageState.successMessage}
            initialMode={pageState.authMode}
          />
        )}
        {pageState.page === 'verify-2fa' && (
          <VerifyTwoFactorPage
            onNavigate={handleNavigate}
            role={pageState.role as 'job_seeker' | 'employer' | 'admin'}
          />
        )}
        {pageState.page === 'forgot-password' && (
          <ForgotPasswordPage role={pageState.role as 'job_seeker' | 'employer' || 'job_seeker'} onNavigate={handleNavigate} />
        )}
        {pageState.page === 'recruiter-onboarding' && (
          <RecruiterOnboardingPage onComplete={() => handleNavigate('landing')} />
        )}
        {pageState.page === 'admin/login' && <AdminLoginPage onNavigate={handleNavigate} />}
        {pageState.page === 'job-details' && pageState.jobId && (
          <JobDetailsPage jobId={pageState.jobId} onNavigate={handleNavigate} />
        )}
        {pageState.page === 'course-details' && pageState.courseId && (
          <CourseDetailsPage />
        )}
        {pageState.page === 'job-seeker-dashboard' && (
          profile?.role === 'job_seeker' ? (
            <JobSeekerLayout
              onNavigate={handleNavigate}
              activeSection={pageState.dashboardSection || 'overview'}
            >
              {(!pageState.dashboardSection || pageState.dashboardSection === 'overview') && (
                <JobSeekerOverview onNavigate={handleNavigate} />
              )}
              {pageState.dashboardSection === 'browse' && (
                <JobSeekerBrowseJobs onNavigate={handleNavigate} />
              )}

              {pageState.dashboardSection === 'applications' && (
                <JobSeekerApplications onNavigate={handleNavigate} />
              )}
              {pageState.dashboardSection === 'saved' && (
                <JobSeekerSavedJobs onNavigate={handleNavigate} />
              )}
              {pageState.dashboardSection === 'notifications' && (
                <JobSeekerNotifications onNavigate={handleNavigate} />
              )}
              {pageState.dashboardSection === 'profile' && (
                <JobSeekerProfile onNavigate={handleNavigate} />
              )}
              {pageState.dashboardSection === 'settings' && (
                <JobSeekerSettings onNavigate={handleNavigate} />
              )}
            </JobSeekerLayout>
          ) : (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
              <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h2>
                <p className="text-slate-600 mb-4">You need to be logged in as a job seeker to access this page.</p>
                <div className="space-y-2">
                  <button
                    onClick={() => handleNavigate('auth', undefined, 'job_seeker', undefined, undefined, undefined, undefined, 'signin')}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Sign In as Job Seeker
                  </button>
                  <button
                    onClick={() => handleNavigate('landing')}
                    className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                  >
                    Go to Home
                  </button>
                </div>
              </div>
            </div>
          )
        )}
        {pageState.page === 'recruiter-dashboard' && (
          profile?.role === 'employer' ? (
            profile?.isApproved ? (
              <RecruiterDashboardRouter
                onNavigate={handleNavigate}
                activeSection={pageState.dashboardSection || 'overview'}
                jobId={pageState.jobId}
              />
            ) : (
              <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-amber-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Clock className="h-8 w-8 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Pending Approval</h2>
                    <p className="text-slate-600 mb-4">
                      Your recruiter application is currently under review by our admin team.
                      You'll receive an email notification once your account is approved.
                    </p>
                    {profile?.rejectionReason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <p className="text-red-800 text-sm">
                          <strong>Feedback:</strong> {profile.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleNavigate('landing')}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 mb-2"
                    >
                      Go to Home
                    </button>
                    <button
                      onClick={() => {
                        localStorage.removeItem('token');
                        window.location.reload();
                      }}
                      className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
              <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Recruiter Dashboard</h2>
                <div className="text-left mb-4">
                  <p className="text-slate-600 mb-2"><strong>Profile loaded:</strong> {profile ? 'Yes' : 'No'}</p>
                  <p className="text-slate-600 mb-2"><strong>Role:</strong> {profile?.role || 'Not set'}</p>
                  <p className="text-slate-600 mb-2"><strong>Email:</strong> {profile?.email || 'Not set'}</p>
                  <p className="text-slate-600 mb-2"><strong>Full Name:</strong> {profile?.fullName || 'Not set'}</p>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => handleNavigate('landing')}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 mb-2"
                  >
                    Go to Home
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                  >
                    Reload Page
                  </button>
                </div>
              </div>
            </div>
          )
        )}
        {pageState.page === 'settings' && <SettingsPage onNavigate={handleNavigate} />}
        {pageState.page === 'post-job' && profile?.role === 'employer' && (
          <PostJobPage onNavigate={handleNavigate} />
        )}
        {pageState.page === 'post-internship' && profile?.role === 'employer' && (
          <PostInternshipPage onNavigate={handleNavigate} />
        )}
        {pageState.page === 'saved-jobs' && profile?.role === 'job_seeker' && (
          <SavedJobsPage onNavigate={handleNavigate} />
        )}
        {pageState.page === 'notifications' && <NotificationsPage onNavigate={handleNavigate} />}



        {pageState.page === 'admin' && profile?.role === 'admin' && (
          <AdminDashboard
            activeSection={pageState.dashboardSection || 'overview'}
            onNavigate={handleNavigate}
          />
        )}
        {pageState.page === 'admin-college-students' && profile?.role === 'admin' && pageState.collegeId && (
          <CollegeStudentsPage
            collegeId={pageState.collegeId}
            onBack={() => handleNavigate('admin', undefined, undefined, undefined, undefined, undefined, 'colleges')}
          />
        )}
        {pageState.page === 'college' && (
          <CollegeDashboardLayout
            onNavigate={handleNavigate}
            activeSection={pageState.dashboardSection || 'overview'}
          />
        )}
        {pageState.page === 'college/register' && <CollegeRegisterPage onNavigate={handleNavigate} />}
        {pageState.page === 'college/login' && <CollegeLoginPage onNavigate={handleNavigate} />}
        {pageState.page === 'applicants' && profile?.role === 'employer' && (
          <ApplicantsPage onNavigate={handleNavigate} />
        )}
        {pageState.page === 'faq' && <FaqPage onNavigate={handleNavigate} />}
        {pageState.page === 'contact' && <ContactPage onNavigate={handleNavigate} />}
        {pageState.page === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {pageState.page === 'for-candidates' && <ForCandidatesPage onNavigate={handleNavigate} />}
        {pageState.page === 'for-recruiters' && <ForRecruitersPage onNavigate={handleNavigate} />}
        {pageState.page === 'terms-privacy' && <TermsPrivacyPage onNavigate={handleNavigate} />}
        {pageState.page === 'payment-status' && <PaymentStatusPage onNavigate={handleNavigate} />}

        {pageState.page === 'passport' && <PassportPage />}
        {pageState.page === 'not-found' && <NotFoundPage onNavigate={handleNavigate} />}

      </main>

      {/* Show Footer on public pages */}
      {![
        'auth',
        'role-select',
        'forgot-password',
        'verify-2fa',
        'recruiter-onboarding',
        'admin/login',
        'college/register',
        'college/login',
        'job-seeker-dashboard',
        'recruiter-dashboard',
        'college',
        'admin'
      ].includes(pageState.page) && (
          <Footer onNavigate={handleNavigate} />
        )}

      {/* Global Full-Screen Modal Ad */}
      <FullScreenModalAd />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </SocketProvider>
    </AuthProvider>
  );
}