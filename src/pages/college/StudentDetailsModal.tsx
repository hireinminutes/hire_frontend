import React from 'react';
import {
    X, Mail, Phone, MapPin, Calendar,
    User, Briefcase, GraduationCap, Award,
    Code, Globe, FileText, ExternalLink,
    Github, Linkedin, Instagram, Twitter, Facebook,
    Terminal, Shield, CheckCircle2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Student } from './types';

interface StudentDetailsModalProps {
    student: Student | null;
    isOpen: boolean;
    onClose: () => void;
}

export const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
    student,
    isOpen,
    onClose
}) => {
    if (!isOpen || !student) return null;

    const formatDate = (dateString?: string | Date) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        });
    };

    const renderLocation = () => {
        const loc = student.profile?.location;
        if (!loc) return null;
        if (typeof loc === 'string') return loc;
        return [loc.city, loc.state, loc.country].filter(Boolean).join(', ');
    };

    const socialIconMap: Record<string, any> = {
        github: Github,
        linkedin: Linkedin,
        instagram: Instagram,
        twitter: Twitter,
        facebook: Facebook,
        website: Globe
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up border border-slate-200">

                {/* Formal Header */}
                <div className="bg-slate-50 border-b border-slate-200 px-8 py-6 flex items-start justify-between shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-white p-1 shadow-sm border border-slate-200 shrink-0">
                            {student.profilePicture || student.profile?.profilePhoto ? (
                                <img
                                    src={student.profilePicture || student.profile?.profilePhoto}
                                    alt={student.fullName}
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                    <span className="text-3xl font-bold">{student.fullName.charAt(0).toUpperCase()}</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{student.fullName}</h2>
                            <p className="text-lg text-slate-600 font-medium mb-2">{student.profile?.headline || 'Job Seeker'}</p>

                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> {student.email}
                                </div>
                                {student.profile?.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" /> {student.profile.phone}
                                    </div>
                                )}
                                {student.profile?.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> {renderLocation()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content - Two Column Layout */}
                <div className="flex-1 overflow-y-auto">
                    <div className="flex flex-col lg:flex-row min-h-full">

                        {/* Left Sidebar (Info, Skills, Contact) */}
                        <div className="lg:w-1/3 bg-slate-50 border-r border-slate-200 p-8 space-y-8">

                            {/* Skill Passport */}
                            {student.skillPassport?.level && (
                                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Skill Passport</h4>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-indigo-700">{student.skillPassport.level}</div>
                                            <div className="text-xs text-slate-500">Score: {student.skillPassport.score}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Skills */}
                            <section>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Skills</h3>
                                {student.profile?.skills && student.profile.skills.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {student.profile.skills.map((skill, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 rounded text-sm text-slate-700 font-medium">
                                                {typeof skill === 'string' ? skill : skill.name}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">No skills listed</p>
                                )}
                            </section>

                            {/* Coding Profiles */}
                            {student.profile?.codingProfiles && Object.values(student.profile.codingProfiles).some(Boolean) && (
                                <section>
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Coding Profiles</h3>
                                    <div className="space-y-2">
                                        {Object.entries(student.profile.codingProfiles).map(([platform, url]) => {
                                            if (!url) return null;
                                            return (
                                                <a key={platform} href={url as string} target="_blank" rel="noreferrer" className="flex items-center justify-between text-sm text-slate-600 hover:text-indigo-600 group">
                                                    <span className="capitalize">{platform}</span>
                                                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </a>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}

                            {/* Social Links */}
                            {student.profile?.socialProfiles && Object.keys(student.profile.socialProfiles).length > 0 && (
                                <section>
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Social</h3>
                                    <div className="flex gap-3">
                                        {Object.entries(student.profile.socialProfiles).map(([platform, url]) => {
                                            if (!url) return null;
                                            const Icon = socialIconMap[platform] || Globe;
                                            return (
                                                <a key={platform} href={url as string} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-700 transition-colors">
                                                    <Icon className="w-5 h-5" />
                                                </a>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}

                            {/* Documents */}
                            <section>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Documents</h3>
                                <div className="space-y-3">
                                    {student.profile?.documents?.resume ? (
                                        <div className="flex items-center gap-3 text-sm text-slate-700">
                                            <FileText className="w-4 h-4 text-slate-400" />
                                            <span>Resume Available</span>
                                            {/* Viewer logic implies we might need a separate viewer or download */}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">No resume</p>
                                    )}

                                    {student.profile?.documents?.portfolioUrl && (
                                        <a href={student.profile.documents.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-indigo-600 hover:underline">
                                            <Globe className="w-4 h-4" /> Portfolio Link
                                        </a>
                                    )}
                                </div>
                            </section>

                        </div>

                        {/* Right Main Content */}
                        <div className="lg:w-2/3 p-8 space-y-10">

                            {/* Summary */}
                            {student.profile?.professionalSummary && (
                                <section>
                                    <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <User className="w-5 h-5 text-slate-400" /> About
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                                        {student.profile.professionalSummary}
                                    </p>
                                </section>
                            )}

                            {/* Experience */}
                            <section>
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-slate-400" /> Experience
                                </h3>
                                {student.profile?.experience && student.profile.experience.length > 0 ? (
                                    <div className="space-y-6">
                                        {student.profile.experience.map((exp: any, i) => (
                                            <div key={i} className="relative pl-6 border-l-2 border-slate-100 last:border-0 pb-6 last:pb-0">
                                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-slate-300"></div>
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-slate-900">{exp.jobTitle}</h4>
                                                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                                        {formatDate(exp.startDate)} - {exp.isCurrentlyWorking ? 'Present' : formatDate(exp.endDate)}
                                                    </span>
                                                </div>
                                                <div className="text-sm font-semibold text-indigo-600 mb-2">{exp.companyName} &bull; {exp.location}</div>
                                                <p className="text-sm text-slate-600 leading-relaxed">{exp.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">No experience added</p>
                                )}
                            </section>

                            {/* Education */}
                            <section>
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <GraduationCap className="w-5 h-5 text-slate-400" /> Education
                                </h3>
                                {student.profile?.education && student.profile.education.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {student.profile.education.map((edu: any, i) => (
                                            <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                                <h4 className="font-bold text-slate-900 text-sm mb-1">{edu.degreeName}</h4>
                                                <div className="text-xs font-semibold text-slate-600 mb-2">{edu.institution}</div>
                                                <div className="flex justify-between text-xs text-slate-500">
                                                    <span>{edu.startYear} - {edu.endYear}</span>
                                                    {edu.score && <span>Generic: {edu.score}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">No education added</p>
                                )}
                            </section>

                            {/* Projects */}
                            {student.profile?.projects && student.profile.projects.length > 0 && (
                                <section>
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Code className="w-5 h-5 text-slate-400" /> Projects
                                    </h3>
                                    <div className="space-y-4">
                                        {student.profile.projects.map((proj: any, i) => (
                                            <div key={i} className="border border-slate-200 rounded-lg p-4 hover:border-indigo-200 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-slate-900">{proj.title}</h4>
                                                    <div className="flex gap-2">
                                                        {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-700"><Github className="w-4 h-4" /></a>}
                                                        {proj.demoLink && <a href={proj.demoLink} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600"><ExternalLink className="w-4 h-4" /></a>}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-600 mb-3">{proj.description}</p>
                                                {proj.techStack && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {proj.techStack.map((tech: string, t: number) => (
                                                            <span key={t} className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Certifications */}
                            {student.profile?.certifications && student.profile.certifications.length > 0 && (
                                <section>
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Award className="w-5 h-5 text-slate-400" /> Certifications
                                    </h3>
                                    <div className="flex flex-col gap-2">
                                        {student.profile.certifications.map((cert: any, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                                <div className="p-1.5 bg-white rounded-full border border-slate-200 text-indigo-600 shadow-sm">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-slate-900">{cert.certificateName}</div>
                                                    <div className="text-xs text-slate-600">{cert.issuingOrganization} &bull; {formatDate(cert.issueDate)}</div>
                                                    {cert.credentialUrl && (
                                                        <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-indigo-600 hover:underline mt-1 inline-block">Verify Credential</a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
