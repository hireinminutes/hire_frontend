import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, CheckCircle, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { adminApi } from '../../services/api';
import { ProfileModal } from './Modals';

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
    [key: string]: any;
}

interface CollegeStudentsPageProps {
    collegeId: string;
    onBack: () => void;
}

export const CollegeStudentsPage: React.FC<CollegeStudentsPageProps> = ({
    collegeId,
    onBack
}) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [collegeName, setCollegeName] = useState('');
    const [selectedProfile, setSelectedProfile] = useState<any>(null);
    const [showProfileModal, setShowProfileModal] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                // We might need to fetch college details too to get the name if not passed
                // For now, let's assume the API returns what we need or we fetch purely students
                const response = await adminApi.getCollegeStudents(collegeId);
                if (response.success) {
                    setStudents(response.data);
                    // If the API returns college details in the wrapper, we could set it.
                    // But assume getCollegeStudents returns just students list for now based on previous code.
                }

                // Fetch college details separately if needed for the header name
                const collegeResponse = await adminApi.getColleges(); // optimized to find specific one?
                // Ideally we should have getCollegeById. But looking at adminApi, we might only have getColleges.
                // Let's rely on what we have. If getCollegeStudents doesn't return name, we might show generic "College Students"

                if (collegeResponse && collegeResponse.success && collegeResponse.data) {
                    const college = collegeResponse.data.find((c: any) => c.id === collegeId || c._id === collegeId);
                    if (college) setCollegeName(college.name);
                }

            } catch (error) {
                console.error('Error fetching students:', error);
            } finally {
                setLoading(false);
            }
        };

        if (collegeId) {
            fetchStudents();
        }
    }, [collegeId]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onBack}
                            className="bg-white"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Colleges
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                {collegeName ? `${collegeName} - Students` : 'College Students'}
                            </h1>
                            <p className="text-slate-500">Manage and view students registered under this college</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[400px]">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm text-slate-500 font-medium">Loading students...</p>
                            </div>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <User className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No Students Found</h3>
                            <p className="text-slate-500 mt-1">This college hasn't added any students yet.</p>
                        </div>
                    ) : (
                        <div className="p-6 grid grid-cols-1 gap-4">
                            {students.map((student) => (
                                <div
                                    key={student._id}
                                    className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group"
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
                                                onClick={() => {
                                                    setSelectedProfile(student);
                                                    setShowProfileModal(true);
                                                }}
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
            </div>

            <ProfileModal
                isOpen={showProfileModal}
                profile={selectedProfile}
                onClose={() => {
                    setShowProfileModal(false);
                    setSelectedProfile(null);
                }}
            />
        </div>
    );
};
