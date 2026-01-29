"use client"

import { useEffect, useState, useRef, useCallback } from 'react';
import {
  GraduationCap, TrendingUp, Target, User,
  LogOut, ChevronDown, Menu, X,
  Home
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getApiUrl } from '../../config/api';
import type { Student, CollegeProfile, NewStudent } from './types';
import { OverviewSection } from './OverviewSection';
import { StudentsSection } from './StudentsSection';
import { ProfileSection } from './ProfileSection';
import { CreateStudentModal } from './CreateStudentModal';
import { StudentDetailsModal } from './StudentDetailsModal';
import { Skeleton } from '../../components/ui/Skeleton';

interface CollegeDashboardLayoutProps {
  onNavigate: (page: string, jobId?: string, role?: 'job_seeker' | 'employer', courseId?: string, successMessage?: string, profileSlug?: string, dashboardSection?: string) => void;
  activeSection: string;
}

export const CollegeDashboardLayout: React.FC<CollegeDashboardLayoutProps> = ({
  onNavigate,
  activeSection
}) => {
  /* Authentication Check */
  const { user, signOut, loading: authLoading } = useAuth();

  /* State Definitions */
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CollegeProfile | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateStudent, setShowCreateStudent] = useState(false);
  const [newStudent, setNewStudent] = useState<NewStudent>({ fullName: '', email: '', password: '' });
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !loading) {
      if (!user) {
        onNavigate('college/login');
        return;
      }
      if (user.role !== 'college') {
        onNavigate('role-select');
        return;
      }
    }
  }, [user, onNavigate, loading, authLoading]);

  const fetchCollegeProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${getApiUrl()}/api/college/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) setProfile(data.data);
      }
    } catch (error) {
      console.error('Error fetching college profile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${getApiUrl()}/api/college/students`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) setStudents(data.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      // We might want to set an error state here to show in UI
    }
  }, []);

  useEffect(() => {
    fetchCollegeProfile();
    fetchStudents();
  }, [fetchCollegeProfile, fetchStudents]);

  // Handle click outside dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const studentData = { ...newStudent };

      const response = await fetch(`${getApiUrl()}/api/college/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(studentData)
      });

      const data = await response.json();
      if (data.success) {
        setShowCreateStudent(false);
        setNewStudent({ fullName: '', email: '', password: '' });
        fetchStudents();
      }
    } catch (error) {
      console.error('Error creating student:', error);
    }
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleSectionChange = (sectionId: string) => {
    onNavigate('college', undefined, undefined, undefined, undefined, undefined, sectionId);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md p-6">
          <Skeleton className="h-12 w-12 rounded-xl mx-auto" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', icon: TrendingUp, label: 'Overview', count: null },
    { id: 'students', icon: Target, label: 'Students', count: students.length },
    { id: 'profile', icon: User, label: 'Profile', count: null },
  ];

  const bottomNavItems = [
    { id: 'overview', icon: Home, label: 'Home' },
    { id: 'students', icon: User, label: 'Students' },
    { id: 'profile', icon: GraduationCap, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-slate-900 border-r border-slate-800 flex flex-col transform transition-all duration-300 ease-in-out lg:translate-x-0 shadow-2xl lg:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}>
        {/* Brand */}
        <div className={`h-20 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-8'} border-b border-slate-800 transition-all duration-300 relative`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="animate-fade-in">
                <h1 className="font-bold text-lg text-white leading-none">Hire In Minutes</h1>
                <p className="text-xs text-slate-400 font-medium mt-1">College Portal</p>
              </div>
            )}
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>

          {/* Collapse Toggle Button (Desktop Only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 shadow-sm z-50 transition-colors"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4 -rotate-90" /> : <ChevronDown className="w-4 h-4 rotate-90" />}
          </button>
        </div>

        {/* Start Nav */}
        <div className={`flex-1 flex flex-col gap-1 overflow-y-auto scrollbar-hide py-6 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          {!isCollapsed && <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 animate-fade-in">Main Menu</p>}
          {menuItems.map((item) => {
            const isActive = activeSection === item.id || (!activeSection && item.id === 'overview');
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`
                  relative flex items-center transition-all duration-200 group
                  ${isActive
                    ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-900/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }
                  ${isCollapsed ? 'justify-center rounded-xl w-12 h-12 mx-auto' : 'px-4 py-3 rounded-xl gap-3'}
                `}
                title={isCollapsed ? item.label : ''}
              >
                {isActive && !isCollapsed && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />}

                <Icon className={`w-5 h-5 transition-colors shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />

                {!isCollapsed && <span className="whitespace-nowrap animate-fade-in">{item.label}</span>}

                {item.count !== null && item.count > 0 && (
                  <span className={`
                    bg-indigo-500 text-white text-[10px] font-bold rounded-full shadow-sm flex items-center justify-center
                    ${isCollapsed ? 'absolute -top-1 -right-1 w-4 h-4' : 'ml-auto px-2 py-0.5'}
                  `}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-6 mt-6 border-t border-slate-800">
            {!isCollapsed && <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 animate-fade-in">Account</p>}
            <button
              onClick={() => { signOut(); onNavigate('role-select'); }}
              className={`
                 flex items-center transition-colors text-slate-400 hover:bg-red-900/20 hover:text-red-400
                 ${isCollapsed ? 'justify-center rounded-xl w-12 h-12 mx-auto' : 'w-full gap-3 px-4 py-3 rounded-xl text-sm font-medium'}
              `}
              title={isCollapsed ? "Sign Out" : ""}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>

        {/* User Footer */}
        <div className={`
          border-t border-slate-800 m-4 mb-6 rounded-2xl bg-slate-800/50 transition-all duration-300
          ${isCollapsed ? 'p-2' : 'p-4'}
        `}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-2' : 'gap-3'}`}>
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold border-2 border-slate-600 shadow-sm overflow-hidden shrink-0">
              {profile?.name ? (
                <div className="font-bold text-white">{profile.name.charAt(0)}</div>
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>

            {!isCollapsed ? (
              <div className="flex-1 min-w-0 animate-fade-in">
                <p className="text-sm font-bold text-white truncate">{profile?.name || 'College'}</p>
                <p className="text-xs text-slate-400 truncate">Administrator</p>
              </div>
            ) : null}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 relative ${isCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>

        {/* Mobile Top Bar */}
        <div className="lg:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h1 className="font-bold text-lg text-slate-900 tracking-tight">Hire In Minutes</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-indigo-100 transition-all"
              >
                <div className="font-bold text-slate-600 text-sm">{profile?.name?.charAt(0) || 'C'}</div>
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1 animate-fade-in-up z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50">
                    <p className="font-bold text-sm text-slate-900 truncate">{profile?.name}</p>
                    <p className="text-xs text-slate-500 truncate">College Admin</p>
                  </div>
                  <div className="py-1">
                    <button onClick={() => { handleSectionChange('profile'); setIsProfileDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-3 transition-colors">
                      <User className="w-4 h-4" /> View Profile
                    </button>
                  </div>
                  <div className="border-t border-slate-50 py-1">
                    <button onClick={() => { signOut(); onNavigate('role-select'); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <header className="hidden lg:flex sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-slate-100 px-8 py-4 items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 capitalize flex items-center gap-2">
              {activeSection ? activeSection.replace('-', ' ') : 'Overview'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 pb-28 lg:p-8 lg:pb-12 max-w-7xl mx-auto w-full">
          {/* Render active section */}
          {(!activeSection || activeSection === 'overview') && (
            <OverviewSection
              profile={profile}
              students={students}
              user={user}
              onViewAllStudents={() => handleSectionChange('students')}
            />
          )}

          {activeSection === 'students' && (
            <StudentsSection
              students={students}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onAddStudent={() => setShowCreateStudent(true)}
              onViewStudent={handleViewStudent}
            />
          )}

          {activeSection === 'profile' && (
            <ProfileSection profile={profile} onProfileUpdate={fetchCollegeProfile} />
          )}
        </main>
      </div>

      {/* Mobile Bottom Dock */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 px-2 pb-safe">
        <nav className="flex justify-between items-center h-16">
          {bottomNavItems.map(item => {
            const isActive = activeSection === item.id || (!activeSection && item.id === 'overview');
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`flex-1 flex flex-col items-center justify-center h-full transition-colors relative group`}
              >
                <Icon
                  className={`w-6 h-6 mb-1 transition-colors ${isActive ? 'text-indigo-600 fill-indigo-600/10' : 'text-slate-400 group-hover:text-slate-600'}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Create Student Modal */}
      <CreateStudentModal
        isOpen={showCreateStudent}
        newStudent={newStudent}
        onClose={() => setShowCreateStudent(false)}
        onSubmit={handleCreateStudent}
        onChange={(data) => setNewStudent({ ...newStudent, ...data })}
      />

      {/* Student Details Modal */}
      <StudentDetailsModal
        student={selectedStudent}
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
};

export default CollegeDashboardLayout;
