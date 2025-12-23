
import { useState, useEffect } from 'react';
import {
  Briefcase, Users, Building2, PlusCircle, UserCheck,
  LogOut, X, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { RecruiterPageProps, Alert } from './types';
import { Button } from '../../components/ui/Button';

interface RecruiterLayoutProps extends RecruiterPageProps {
  children: React.ReactNode;
  activeSection: string;
}

export function RecruiterLayout({
  children,
  onNavigate,
  activeSection
}: RecruiterLayoutProps) {
  const { profile, signOut } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'overview', icon: Briefcase, label: 'Overview', count: null },
    { id: 'jobs', icon: Briefcase, label: 'My Jobs', count: null },
    { id: 'applicants', icon: Users, label: 'Applicants', count: null },
    { id: 'find-candidates', icon: UserCheck, label: 'Find Candidates', count: null },
    { id: 'company', icon: Building2, label: 'Company Profile', count: null },
    { id: 'post-job', icon: PlusCircle, label: 'Post New Job', count: null },
  ];

  const handleSectionChange = (sectionId: string) => {
    onNavigate('recruiter-dashboard', undefined, undefined, undefined, undefined, undefined, sectionId);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const fetchAlerts = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_BASE_URL}/api/admin/alerts/active`);
      if (response.ok) {
        const data = await response.json();
        const allAlerts = data.data || [];
        const recruiterAlerts = allAlerts.filter((alert: Alert) =>
          alert.showFor === 'recruiters' || alert.showFor === 'both'
        );
        if (recruiterAlerts.length > 0) {
          setAlerts(recruiterAlerts);
          setShowAlertsModal(true);
          setCurrentAlertIndex(0);
          sessionStorage.setItem('alertsShownRecruiter', 'true');
        }
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  useEffect(() => {
    const alertsShown = sessionStorage.getItem('alertsShownRecruiter');
    if (!alertsShown && profile) {
      fetchAlerts();
    }
  }, [profile]);



  const [isCollapsed, setIsCollapsed] = useState(false);

  // Determine current page title
  const currentTitle = menuItems.find(item => item.id === activeSection)?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-slate-900 border-r border-slate-800 flex flex-col transform transition-all duration-300 ease-in-out shadow-xl lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}>
        {/* Brand */}
        <div className={`h-20 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-6'} border-b border-slate-800 transition-all duration-300 relative`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 shrink-0">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            {!isCollapsed && (
              <div className="animate-fade-in min-w-0">
                <h1 className="font-bold text-lg text-white tracking-tight truncate">Recruiter</h1>
                <p className="text-xs text-slate-400 truncate">Workspace</p>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 shadow-sm z-50 transition-colors"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4 -rotate-90" /> : <ChevronDown className="w-4 h-4 rotate-90" />}
          </button>
        </div>

        <nav className={`flex-1 overflow-y-auto scrollbar-hide py-6 ${isCollapsed ? 'px-2' : 'px-4'} space-y-1`}>
          {!isCollapsed && <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 animate-fade-in">Main Menu</p>}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                title={isCollapsed ? item.label : ''}
                className={`
                  relative w-full flex items-center transition-all duration-200 group
                  ${isActive
                    ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-900/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }
                  ${isCollapsed ? 'justify-center rounded-xl w-12 h-12 mx-auto' : 'px-4 py-3 rounded-xl gap-3'}
                `}
              >
                {isActive && !isCollapsed && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />}

                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />

                {!isCollapsed && (
                  <>
                    <span className="text-sm font-medium animate-fade-in whitespace-nowrap">{item.label}</span>
                    {item.count !== null && item.count > 0 && (
                      <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'}`}>
                        {item.count}
                      </span>
                    )}
                  </>
                )}

                {isCollapsed && item.count !== null && item.count > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className={`
          border-t border-slate-800 m-4 mb-6 rounded-2xl bg-slate-800/50 transition-all duration-300
          ${isCollapsed ? 'p-2' : 'p-4'}
        `}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-2' : 'gap-3'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white overflow-hidden shrink-0 border-2 border-slate-700">
              {profile?.profilePicture ? (
                <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                profile?.fullName?.charAt(0) || 'R'
              )}
            </div>

            {!isCollapsed ? (
              <div className="flex-1 min-w-0 animate-fade-in">
                <p className="text-sm font-bold text-white truncate">{profile?.fullName || 'Recruiter'}</p>
                <p className="text-xs text-slate-400 truncate">{profile?.email}</p>
              </div>
            ) : null}

            <button
              onClick={async () => {
                try { await signOut(); onNavigate('landing'); } catch (e) { console.error(e); }
              }}
              title="Sign Out"
              className={`text-slate-400 hover:text-red-400 transition-colors ${isCollapsed ? 'mt-1' : ''}`}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 relative ${isCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        {/* Top Header */}
        <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 px-6 sm:px-8 py-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button Removed as per request */}
              <div className="flex flex-col gap-1">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {currentTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">Manage your hiring pipeline</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {profile?.role === 'admin' && (
                <Button
                  onClick={() => onNavigate('admin')}
                  variant="outline"
                  className="border-slate-200 text-slate-600 hover:text-slate-900 hidden sm:flex"
                >
                  Admin Panel
                </Button>
              )}

              <button
                onClick={() => handleSectionChange('company')}
                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all lg:hidden"
                title="Company Profile"
              >
                {profile?.profilePicture ? (
                  <img src={profile.profilePicture} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>

              <button
                onClick={async () => {
                  try { await signOut(); onNavigate('landing'); } catch (e) { console.error(e); }
                }}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all lg:hidden"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-0 sm:p-6 pb-24 lg:pb-6">
          {children}
        </div>
      </main>

      {/* Alerts Modal - Keeping existing implementation */}
      {showAlertsModal && alerts.length > 0 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{alerts[currentAlertIndex].name}</h2>
                  <p className="text-purple-100 mt-1 opacity-90">Important System Announcement</p>
                </div>
                <button
                  onClick={() => setShowAlertsModal(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-8 max-h-[60vh] overflow-y-auto">
              <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap mb-6">
                {alerts[currentAlertIndex].message}
              </p>

              {alerts[currentAlertIndex].images && alerts[currentAlertIndex].images!.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {alerts[currentAlertIndex].images!.map((img, idx) => (
                    <img key={idx} src={img} alt="" className="rounded-xl w-full object-cover shadow-md" />
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 px-8 py-5 bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {alerts.map((_, idx) => (
                    <div key={idx} className={`h-2 rounded-full transition-all ${idx === currentAlertIndex ? 'w-8 bg-purple-600' : 'w-2 bg-slate-300'}`} />
                  ))}
                </div>

                <div className="flex gap-3">
                  {currentAlertIndex > 0 && (
                    <Button variant="outline" onClick={() => setCurrentAlertIndex(currentAlertIndex - 1)}>
                      Previous
                    </Button>
                  )}
                  {currentAlertIndex < alerts.length - 1 ? (
                    <Button onClick={() => setCurrentAlertIndex(currentAlertIndex + 1)} className="bg-purple-600 hover:bg-purple-700 text-white">
                      Next
                    </Button>
                  ) : (
                    <Button onClick={() => setShowAlertsModal(false)} className="bg-purple-600 hover:bg-purple-700 text-white">
                      Acknowledge
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Mobile Bottom Dock (Recruiter) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 px-2 pb-safe">
        <nav className="flex justify-between items-center h-16">
          {[
            { id: 'overview', icon: Briefcase, label: 'Home' },
            { id: 'jobs', icon: Briefcase, label: 'Jobs' },
            { id: 'post-job', icon: PlusCircle, label: 'Post' },
            { id: 'find-candidates', icon: UserCheck, label: 'Find' },
            { id: 'applicants', icon: Users, label: 'People' },
          ].map(item => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            const isPost = item.id === 'post-job';

            return (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`flex-1 flex flex-col items-center justify-center h-full transition-colors relative group ${isPost ? '' : ''}`}
              >
                {isPost ? (
                  <div className="relative -mt-8 mb-1">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-200 ${isActive ? 'scale-110' : 'hover:scale-105'} bg-gradient-to-r from-blue-600 to-indigo-600 border-4 border-white`}>
                      <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                ) : (
                  <Icon
                    className={`w-6 h-6 mb-1 transition-colors ${isActive ? 'text-blue-600 fill-blue-600/10' : 'text-slate-400 group-hover:text-slate-600'}`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                )}
                <span className={`text-[10px] font-medium transition-colors ${isActive || isPost ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </nav>
      </div>

    </div>
  );
}
