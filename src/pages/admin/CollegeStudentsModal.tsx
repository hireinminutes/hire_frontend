import { X, User, Mail, Phone, MapPin, CheckCircle, GraduationCap, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface Student {
    _id: string;
    fullName: string;
    email: string;
    isVerified?: boolean;
    profile?: {
        phone?: string;
        location?: { city?: string } | string;
        skills?: (string | { name: string })[];
    };
    [key: string]: any; // Allow other properties for full profile view
}

interface CollegeStudentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    collegeName: string;
    students: Student[];
    loading: boolean;
    onViewProfile: (student: any) => void;
}

export const CollegeStudentsModal: React.FC<CollegeStudentsModalProps> = ({
    isOpen,
    onClose,
    collegeName,
    students,
    loading,
    onViewProfile
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-xl animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Students List</h2>
                            <p className="text-sm text-slate-500 font-medium">{collegeName}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm text-slate-500 font-medium">Loading students...</p>
                            </div>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <User className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No Students Found</h3>
                            <p className="text-slate-500 mt-1">This college hasn't added any students yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {students.map((student) => (
                                <div
                                    key={student._id}
                                    className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-indigo-100 hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            {/* Avatar */}
                                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500 font-bold text-lg border-2 border-white shadow-sm group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                {(student.fullName?.charAt(0) || '?').toUpperCase()}
                                            </div>

                                            {/* Info */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-slate-900">{student.fullName || 'Unknown'}</h3>
                                                    {student.isVerified && (
                                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <Mail className="w-3.5 h-3.5" />
                                                        <span>{student.email || 'No email'}</span>
                                                    </div>
                                                    {student.profile?.phone && (
                                                        <div className="flex items-center gap-1.5">
                                                            <Phone className="w-3.5 h-3.5" />
                                                            <span>{student.profile.phone}</span>
                                                        </div>
                                                    )}
                                                    {student.profile?.location && (
                                                        <div className="flex items-center gap-1.5">
                                                            <MapPin className="w-3.5 h-3.5" />
                                                            <span>
                                                                {typeof student.profile.location === 'string'
                                                                    ? student.profile.location
                                                                    : student.profile.location.city || 'Unknown Location'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Skills */}
                                                {student.profile?.skills && student.profile.skills.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {student.profile.skills.slice(0, 5).map((skill, index) => {
                                                            const skillName = typeof skill === 'string' ? skill : skill.name;
                                                            return (
                                                                <span
                                                                    key={index}
                                                                    className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wide rounded-md border border-slate-200"
                                                                >
                                                                    {skillName}
                                                                </span>
                                                            );
                                                        })}
                                                        {student.profile.skills.length > 5 && (
                                                            <span className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[10px] font-bold rounded-md">
                                                                +{student.profile.skills.length - 5}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="flex flex-col items-end">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onViewProfile(student)}
                                                className="text-xs h-8 border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200"
                                            >
                                                <Eye className="w-3.5 h-3.5 mr-1.5" />
                                                View Profile
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 flex justify-end">
                    <Button onClick={onClose} variant="outline" className="border-slate-200">
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};
