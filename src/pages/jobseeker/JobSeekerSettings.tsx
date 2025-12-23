import { useEffect, useState } from 'react';
import {
  Bell, Lock, LogOut, CheckCircle, Award,
  Shield, Eye, AlertTriangle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { getApiUrl } from '../../config/api';
import { getAuthHeaders, useAuth } from '../../contexts/AuthContext';
import { JobSeekerPageProps } from './types';
// Razorpay will be loaded via script tag

export function JobSeekerSettings({ onNavigate }: JobSeekerPageProps) {
  const { profile, signOut, refreshProfile } = useAuth();

  // Initialize plan from profile
  const [currentPlan, setCurrentPlan] = useState(profile?.plan || 'free');

  useEffect(() => {
    if (profile?.plan) {
      setCurrentPlan(profile.plan);
    }
  }, [profile]);

  const [emailNotifications, setEmailNotifications] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);



  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load preferences
  useEffect(() => {
    const fetchData = async () => {
      if (!profile) return;

      // Preferences
      try {
        const response = await fetch(getApiUrl('/api/auth/preferences'), {
          headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (data.success) {
          const prefs = data.preferences;
          setEmailNotifications(prefs.emailNotifications || false);
          setProfileVisibility(prefs.profileVisibility ?? true);
        }
      } catch (error) { console.error(error); }
    };

    fetchData();
  }, [profile]);


  /* Password and Email handlers removed as simplified for this view */

  const handleLogout = async () => {
    try { await signOut(); onNavigate('landing'); } catch (e) { console.error(e); }
  };

  const handleEmailNotificationsToggle = async (enabled: boolean) => {
    setEmailNotifications(enabled);
    try {
      await fetch(getApiUrl('/api/auth/preferences'), {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ emailNotifications: enabled })
      });
      showToast('Preferences updated', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to update preferences', 'error');
    }
  };

  return (
    <div className="space-y-10 pb-20">

      {/* Glassmorphic Header */}
      <div className="relative overflow-hidden rounded-[32px] bg-slate-900 text-white p-8 md:p-12 shadow-2xl shadow-slate-900/20 isolate border border-slate-800">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider mb-4 text-emerald-200">
              <Shield className="w-3 h-3 fill-current" /> Security & Privacy
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
              Account Settings
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed font-medium max-w-xl">
              Manage your personal information, security preferences, and subscription plan.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 min-w-[240px]">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-xl text-white shadow-lg">
              {profile?.fullName?.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-white text-lg">{profile?.fullName}</div>
              <div className="text-emerald-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1">
                {currentPlan !== 'free' ? <Award className="w-3 h-3" /> : null}
                {currentPlan !== 'free' ? `${currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan` : 'Free Plan'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Navigation/Sections */}
        <div className="lg:col-span-2 space-y-8">

          {/* Account Section */}
          <section>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4 px-1">Account & Security</h2>
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-lg shadow-slate-200/50 overflow-hidden divide-y divide-slate-50">

              {/* Password */}
              <div className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Password</h3>
                    <p className="text-sm text-slate-500 font-medium">Last changed 3 months ago</p>
                  </div>
                </div>
                <Button variant="outline" disabled className="rounded-xl border-slate-200 font-bold opacity-50 cursor-not-allowed">
                  Change (Coming Soon)
                </Button>
              </div>



            </div>
          </section>

          {/* Preferences Section */}
          <section>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4 px-1">Preferences</h2>
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-lg shadow-slate-200/50 overflow-hidden divide-y divide-slate-50">

              {/* Notifications */}
              <div className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Email Notifications</h3>
                    <p className="text-sm text-slate-500 font-medium">Receive updates about your job applications</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={emailNotifications} onChange={(e) => handleEmailNotificationsToggle(e.target.checked)} className="sr-only peer" />
                  <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {/* Privacy */}
              <div className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Profile Visibility</h3>
                    <p className="text-sm text-slate-500 font-medium">Allow recruiters to find you</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={profileVisibility} onChange={(e) => setProfileVisibility(e.target.checked)} className="sr-only peer" />
                  <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

            </div>
          </section>

          {/* Danger Zone */}
          <section>
            <h2 className="text-sm font-black text-red-400 uppercase tracking-wider mb-4 px-1">Danger Area</h2>
            <div className="bg-red-50/30 rounded-[24px] border border-red-100 overflow-hidden divide-y divide-red-100">

              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <LogOut className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Sign Out</h3>
                  </div>
                </div>
                <Button variant="ghost" onClick={handleLogout} className="text-red-600 hover:bg-red-50 hover:text-red-700 font-bold">
                  Log Out
                </Button>
              </div>



            </div>
          </section>

        </div>

        {/* Right Column: Premium/Plan */}
        <div className="space-y-8">
          <section>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4 px-1">Subscription</h2>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-2">
                  {currentPlan !== 'free' ? `${currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan` : 'Free Plan'}
                </h3>
                <p className="text-slate-300 font-medium mb-8 leading-relaxed">
                  {currentPlan !== 'free'
                    ? 'You have access to premium features including priority support and analytics.'
                    : 'Upgrade to unlock insights, see who looks at your profile, and stand out to recruiters.'}
                </p>

                {currentPlan !== 'pro' && (
                  <Button
                    onClick={() => onNavigate('job-seeker-dashboard', undefined, undefined, undefined, undefined, undefined, 'browse')}
                    className="w-full bg-white text-slate-900 hover:bg-blue-50 font-black h-12 rounded-xl shadow-lg"
                  >
                    {currentPlan === 'free' ? 'View Plans' : 'Upgrade Plan'}
                  </Button>
                )}
                {currentPlan !== 'free' && (
                  <div className="mt-4 px-4 py-2 bg-white/10 rounded-xl text-sm font-bold text-center border border-white/10">
                    Active Plan
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold animate-fade-in-up z-50 flex items-center gap-3 ${toast.type === 'error' ? 'bg-red-500' : 'bg-slate-900'}`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

    </div>
  );
}
