import React from 'react';
import { Users, CheckCircle, Award, Briefcase, MapPin, Globe, Phone, Mail, ArrowUpRight, Building2 } from 'lucide-react';

import { Button } from '../../components/ui/Button';
import type { Student, CollegeProfile } from './types';

interface OverviewSectionProps {
  profile: CollegeProfile | null;
  students: Student[];
  user: any;
  onViewAllStudents: () => void;
}

// Premium Stat Card
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

// Info Card
const InfoCard = ({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon?: any }) => (
  <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden h-full">
    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
      <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-indigo-500" />}
        {title}
      </h3>
    </div>
    <div className="p-5">
      {children}
    </div>
  </div>
);

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  profile,
  students,
  user,
  onViewAllStudents
}) => {
  const verifiedCount = students.filter(s => s.isVerified).length;
  const totalSkills = students.reduce((acc, s) => acc + (s.profile?.skills?.length || 0), 0);

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">

      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full mb-2 border border-indigo-100">
            Overview
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-1">
            Dashboard
          </h1>
          <p className="text-slate-500 font-medium text-sm md:text-lg">Track your students and college performance.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button
            onClick={onViewAllStudents}
            className="bg-slate-900 text-white hover:bg-black rounded-xl md:rounded-[14px] font-bold shadow-xl shadow-slate-900/10 active:scale-[0.98] transition-all text-sm md:text-base h-10 md:h-12 px-6"
          >
            Manage Students
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Students"
          value={students.length}
          icon={Users}
          bgClass="bg-blue-50"
          iconClass="text-blue-600"
          subtext="Active"
        />
        <StatCard
          label="Verified Profiles"
          value={verifiedCount}
          icon={CheckCircle}
          bgClass="bg-emerald-50"
          iconClass="text-emerald-600"
          subtext={`${Math.round((verifiedCount / (students.length || 1)) * 100)}%`}
        />
        <StatCard
          label="Total Skills"
          value={totalSkills}
          icon={Award}
          bgClass="bg-purple-50"
          iconClass="text-purple-600"
          subtext="Aggregate"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* College Info */}
        <div className="lg:col-span-2">
          <InfoCard title="Institution Details" icon={Building2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Institution Name</p>
                    <p className="font-bold text-slate-900">{profile?.name || (user && 'name' in user ? (user as any).name : 'Loading...')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                    <p className="font-bold text-slate-900 break-all">{profile?.email || (user && 'email' in user ? (user as any).email : 'Loading...')}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact</p>
                    <p className="font-bold text-slate-900">{profile?.contactNumber || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 px-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                    <p className="font-bold text-slate-900">{profile?.address?.city}, {profile?.address?.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </InfoCard>
        </div>

        {/* Recent Students */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" /> Recent Students
              </h3>
              <Button variant="ghost" onClick={onViewAllStudents} className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-8 text-xs font-bold px-3 rounded-lg">
                View All
              </Button>
            </div>
            <div className="p-2 flex-1 overflow-y-auto max-h-[400px]">
              {students.length > 0 ? (
                <div className="space-y-1">
                  {students.slice(0, 5).map((student) => (
                    <div key={student._id} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
                        {student.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-slate-900 truncate text-sm">{student.fullName}</p>
                          {student.isVerified && <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />}
                        </div>
                        <p className="text-xs text-slate-500 truncate">{student.email}</p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">No students yet</p>
                  <p className="text-xs text-slate-500 max-w-[150px] mx-auto mt-1">Start adding students to track them.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;
