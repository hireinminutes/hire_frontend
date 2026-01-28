import React from 'react';
import { UserPlus, Filter, Eye, Edit3, Phone, MapPin, CheckCircle, Search, MoreVertical } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import type { Student } from './types';

interface StudentsSectionProps {
  students: Student[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddStudent: () => void;
  onViewStudent?: (student: Student) => void;
  onEditStudent?: (student: Student) => void;
}

export const StudentsSection: React.FC<StudentsSectionProps> = ({
  students,
  searchTerm,
  onSearchChange,
  onAddStudent,
  onViewStudent,
  onEditStudent
}) => {
  const filteredStudents = students.filter(student =>
    (student.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (student.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Students</h1>
          <p className="text-slate-500 font-medium text-sm">Manage and track student profiles.</p>
        </div>
        <Button
          onClick={onAddStudent}
          className="bg-slate-900 text-white hover:bg-black rounded-xl font-bold shadow-lg shadow-slate-900/10 active:scale-[0.98] transition-all h-10 px-6"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Search and Content */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <Button variant="outline" className="border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div key={student._id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
                      <span className="text-indigo-600 font-black text-lg">
                        {(student.fullName?.charAt(0) || '?').toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-slate-900 truncate text-base">{student.fullName || 'Unknown Student'}</h3>
                        {student.isVerified && (
                          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-slate-500 font-medium mb-2 truncate">{student.email || 'No Email'}</p>

                      <div className="flex flex-wrap gap-3">
                        {student.profile?.phone && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                            <Phone className="h-3 w-3" />
                            {student.profile.phone}
                          </span>
                        )}
                        {student.profile?.location && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                            <MapPin className="h-3 w-3" />
                            {student.profile.location.city}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onViewStudent?.(student)} className="hidden sm:flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold">
                      View
                    </Button>
                    <div className="sm:hidden">
                      <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-full">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Skills Chips */}
                {student.profile?.skills && student.profile.skills.length > 0 && (
                  <div className="mt-4 pl-[64px]">
                    <div className="flex flex-wrap gap-2">
                      {student.profile.skills.slice(0, 5).map((skill, index) => {
                        const skillName = typeof skill === 'string' ? skill : skill.name;
                        return (
                          <span
                            key={index}
                            className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 font-bold text-[10px] uppercase tracking-wide rounded-lg shadow-sm"
                          >
                            {skillName}
                          </span>
                        );
                      })}
                      {student.profile.skills.length > 5 && (
                        <span className="px-2.5 py-1 bg-slate-50 text-slate-400 font-bold text-[10px] rounded-lg">
                          +{student.profile.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No students found</h3>
              <p className="text-slate-500">Try adjusting your search or add a new student.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentsSection;
