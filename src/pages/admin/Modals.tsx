import React from 'react';
import { Button } from '../../components/ui/Button';
import {
  X, AlertTriangle, Mail, Phone, MapPin, Briefcase, GraduationCap,
  Shield, Building2, Globe, FileText, Calendar, ExternalLink,
  Linkedin, Github, User, Award, Code, Hash, Users, Terminal, CheckCircle
} from 'lucide-react';
import type { Candidate, RecruiterProfile, VerificationApplication, FormattedJob } from './types';

// Delete Confirmation Dialog
interface DeleteDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md m-4">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              <p className="text-slate-600">{message}</p>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

// Verify Confirmation Dialog
interface VerifyDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const VerifyDialog: React.FC<VerifyDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md m-4">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Verify Candidate</h2>
              <p className="text-slate-600">Are you sure you want to verify this candidate?</p>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={onConfirm}
          >
            Verify
          </Button>
        </div>
      </div>
    </div>
  );
};

// Reject Recruiter Dialog
interface RejectRecruiterDialogProps {
  isOpen: boolean;
  recruiterName: string;
  rejectionReason: string;
  onRejectionReasonChange: (reason: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const RejectRecruiterDialog: React.FC<RejectRecruiterDialogProps> = ({
  isOpen,
  recruiterName,
  rejectionReason,
  onRejectionReasonChange,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md m-4">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Reject Recruiter Application</h2>
              <p className="text-slate-600">Are you sure you want to reject {recruiterName}'s application?</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Rejection Reason (Optional)
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => onRejectionReasonChange(e.target.value)}
              placeholder="Provide feedback to help the recruiter improve their application..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
          >
            Reject Application
          </Button>
        </div>
      </div>
    </div>
  );
};

// Profile Modal for Candidates and Recruiters
interface ProfileModalProps {
  isOpen: boolean;
  profile: Candidate | RecruiterProfile | null;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  profile,
  onClose
}) => {
  if (!isOpen || !profile) return null;

  // Type guard to check if it's a recruiter profile
  const isRecruiterProfile = (p: any): p is RecruiterProfile => {
    return p && (p._id || p.id) && (p._isRecruiterProfile === true || p.role === 'employer' || p.recruiterOnboardingDetails);
  };

  if (isRecruiterProfile(profile)) {
    const onboarding = profile.recruiterOnboardingDetails;
    const company = onboarding?.company;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-900">Recruiter Profile</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
            {/* Basic Info */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                {company?.logo ? (
                  <img
                    src={company.logo}
                    alt="Company Logo"
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <Building2 className="h-10 w-10 text-slate-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900">{profile.fullName}</h3>
                <p className="text-lg text-slate-600 font-medium">{onboarding?.jobTitle} at {company?.name}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${onboarding?.isComplete
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                    {onboarding?.isComplete ? 'Onboarding Complete' : 'Pending Onboarding'}
                  </span>
                  {profile.isVerified && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold rounded-full flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5" />
                      Verified Recruiter
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500" />
                  Contact Details
                </h4>
                <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                  <div className="flex items-center gap-3 text-slate-700">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Mail className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Email Address</p>
                      <p className="font-medium text-sm">{profile.email}</p>
                    </div>
                  </div>
                  {onboarding?.phone && (
                    <div className="flex items-center gap-3 text-slate-700">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Phone className="h-4 w-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Phone Number</p>
                        <p className="font-medium text-sm">{onboarding.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Company Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-500" />
                  Company Info
                </h4>
                <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                  <div className="flex items-center gap-3 text-slate-700">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Globe className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Website</p>
                      {company?.website ? (
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="font-medium text-sm text-blue-600 hover:underline">
                          {company.website.replace(/^https?:\/\//, '')}
                        </a>
                      ) : (
                        <p className="text-sm text-slate-400">Not provided</p>
                      )}
                    </div>
                  </div>
                  {company?.size && (
                    <div className="flex items-center gap-3 text-slate-700">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Users className="h-4 w-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Company Size</p>
                        <p className="font-medium text-sm">{company.size}</p>
                      </div>
                    </div>
                  )}
                  {company?.address && (
                    <div className="flex items-center gap-3 text-slate-700">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <MapPin className="h-4 w-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Location</p>
                        <p className="font-medium text-sm">{company.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Verification Proof */}
            {onboarding?.employmentProof && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  Details Provided
                </h4>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <a
                    href={onboarding.employmentProof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
                  >
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">Employment Verification Document</p>
                      <p className="text-xs text-slate-500">Click to view uploaded proof</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-slate-400 ml-auto group-hover:text-blue-500" />
                  </a>
                </div>
              </div>
            )}

            <div className="text-xs text-slate-400 pt-4 border-t border-slate-100">
              User ID: {profile.id || profile._id} • Joined: {new Date(profile.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
            <Button onClick={onClose}>Close Profile</Button>
          </div>
        </div>
      </div>
    );
  }

  // Candidate Profile logic
  const candidateProfile = profile.profile;
  const candidateLocation = candidateProfile?.location;
  const locationStr = candidateLocation
    ? [candidateLocation.city, candidateLocation.state, candidateLocation.country].filter(Boolean).join(', ')
    : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900">Candidate Profile</h2>
            {profile.plan && profile.plan !== 'free' && (
              <span className="px-2.5 py-0.5 bg-green-100 text-green-700 border border-green-200 text-xs font-bold rounded-full flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Verified
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-10">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="shrink-0 relative">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden shadow-inner border border-slate-100">
                {(profile.profilePicture || candidateProfile?.profilePhoto) ? (
                  <img
                    src={profile.profilePicture || candidateProfile?.profilePhoto}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-blue-300">{profile.fullName?.charAt(0)}</span>
                  </div>
                )}
              </div>
              {profile.plan && profile.plan !== 'free' && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-full border-4 border-white shadow-sm" title="Verified Candidate">
                  <Shield className="h-4 w-4 fill-current" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{profile.fullName}</h3>
                <p className="text-lg text-slate-500 mt-1 leading-relaxed">
                  {candidateProfile?.professionalSummary || "No summary provided."}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a href={`mailto:${profile.email}`} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-600 transition-colors">
                  <Mail className="h-4 w-4 text-slate-400" />
                  {profile.email}
                </a>
                {candidateProfile?.phone && (
                  <a href={`tel:${candidateProfile.phone}`} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-600 transition-colors">
                    <Phone className="h-4 w-4 text-slate-400" />
                    {candidateProfile.phone}
                  </a>
                )}
                {locationStr && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {locationStr}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {candidateProfile?.socialProfiles?.linkedin && (
                  <a href={candidateProfile.socialProfiles.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#0077b5]/10 text-[#0077b5] rounded-lg hover:bg-[#0077b5]/20 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {candidateProfile?.socialProfiles?.github && (
                  <a href={candidateProfile.socialProfiles.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition-colors">
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {candidateProfile?.socialProfiles?.website && (
                  <a href={candidateProfile.socialProfiles.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                    <Globe className="h-5 w-5" />
                  </a>
                )}
                {candidateProfile?.documents?.resume && (
                  <a
                    href={candidateProfile.documents.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm shadow-blue-200 transition-all ml-auto font-medium"
                  >
                    <FileText className="h-4 w-4" />
                    View Resume
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Experience & Projects */}
            <div className="lg:col-span-2 space-y-10">

              {/* Experience Section */}
              {candidateProfile?.experience && candidateProfile.experience.length > 0 && (
                <section className="space-y-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <h4 className="flex items-center gap-2 text-md font-bold text-slate-900 uppercase tracking-wider">
                    <div className="p-1.5 bg-blue-100 rounded text-blue-600">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    Work Experience
                  </h4>
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-3.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
                    {candidateProfile.experience.map((exp: any, index: number) => (
                      <div key={index} className="relative flex items-start group">
                        <div className="absolute left-0 top-1 h-7 w-7 rounded-full border-4 border-white bg-blue-500 shadow-sm z-10"></div>
                        <div className="ml-10 w-full">
                          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                              <div>
                                <h5 className="text-lg font-bold text-slate-900">{exp.jobTitle}</h5>
                                <div className="text-blue-600 font-medium">{exp.companyName}</div>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-100 shadow-sm shrink-0">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(exp.startDate).getFullYear()} -
                                {exp.isCurrentlyWorking ? ' Present' : ` ${new Date(exp.endDate).getFullYear()}`}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500 mt-3">
                              <span className="flex items-center gap-1">
                                <Building2 className="h-3.5 w-3.5" />
                                {exp.employmentType}
                              </span>
                              {exp.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {exp.location}
                                </span>
                              )}
                            </div>
                            {exp.description && (
                              <p className="mt-3 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects Section */}
              {candidateProfile?.projects && candidateProfile.projects.length > 0 && (
                <section className="space-y-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <h4 className="flex items-center gap-2 text-md font-bold text-slate-900 uppercase tracking-wider">
                    <div className="p-1.5 bg-purple-100 rounded text-purple-600">
                      <Code className="h-4 w-4" />
                    </div>
                    Projects
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {candidateProfile.projects?.map((project: any, index: number) => (
                      <div key={index} className="bg-white rounded-xl p-5 border border-slate-200 hover:border-purple-200 hover:shadow-md transition-all flex flex-col h-full">
                        <div className="flex justify-between items-start mb-3">
                          <h5 className="font-bold text-slate-900 line-clamp-1" title={project.title}>{project.title}</h5>
                          {project.isLive && (
                            <span className="shrink-0 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full tracking-wide">Live</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-1">{project.description}</p>

                        {project.techStack && project.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {project.techStack.map((tech: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 bg-slate-50 text-slate-600 text-[10px] font-medium rounded border border-slate-100">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center text-xs gap-3 pt-3 border-t border-slate-100 mt-auto">
                          {project.githubLink && (
                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-slate-600 hover:text-purple-600 font-medium transition-colors">
                              <Github className="h-3.5 w-3.5" /> Code
                            </a>
                          )}
                          {project.demoLink && (
                            <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-slate-600 hover:text-purple-600 font-medium transition-colors">
                              <ExternalLink className="h-3.5 w-3.5" /> Demo
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>

            {/* Right Column: Skills, Education, Certifications */}
            <div className="space-y-8">

              {/* Skills */}
              {candidateProfile?.skills && candidateProfile.skills.length > 0 && (
                <section className="bg-slate-50 rounded-2xl p-6 border border-slate-100 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                    <Hash className="h-4 w-4 text-slate-500" />
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {candidateProfile.skills.map((skill: any, index: number) => (
                      <span
                        key={index}
                        className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${skill.isVerified
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                          : 'bg-white text-slate-700 border border-slate-200'
                          }`}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {candidateProfile?.education && candidateProfile.education.length > 0 && (
                <section className="space-y-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <h4 className="flex items-center gap-2 text-md font-bold text-slate-900 uppercase tracking-wider">
                    <div className="p-1.5 bg-orange-100 rounded text-orange-600">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    Education
                  </h4>
                  <div className="space-y-3">
                    {candidateProfile.education.map((edu: any, index: number) => (
                      <div key={index} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-5">
                          <GraduationCap className="h-16 w-16" />
                        </div>
                        <div className="relative z-10">
                          <h5 className="font-bold text-slate-900">{edu.degreeName}</h5>
                          {edu.specialization && <p className="text-blue-600 text-sm font-medium mb-1">{edu.specialization}</p>}
                          <p className="text-slate-600 text-sm">{edu.institution}</p>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                            <span className="text-xs text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded">
                              Class of {edu.endYear || 'N/A'}
                            </span>
                            {(edu.score || edu.grade) && (
                              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                {edu.score || edu.grade}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Certifications */}
              {candidateProfile?.certifications && candidateProfile.certifications.length > 0 && (
                <section className="space-y-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                  <h4 className="flex items-center gap-2 text-md font-bold text-slate-900 uppercase tracking-wider">
                    <div className="p-1.5 bg-teal-100 rounded text-teal-600">
                      <Award className="h-4 w-4" />
                    </div>
                    Certifications
                  </h4>
                  <div className="space-y-3">
                    {candidateProfile.certifications.map((cert: any, index: number) => (
                      <div key={index} className="flex gap-3 items-start p-3 rounded-xl bg-white border border-slate-100 hover:border-teal-200 transition-colors">
                        <div className="mt-1">
                          <Award className="h-4 w-4 text-teal-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-bold text-slate-900 leading-snug">{cert.certificateName}</h5>
                          <p className="text-xs text-slate-500 mt-0.5">{cert.issuingOrganization}</p>
                          <div className="flex items-center gap-3 mt-2">
                            {cert.issueDate && <span className="text-[10px] text-slate-400">Issued: {new Date(cert.issueDate).getFullYear()}</span>}
                            {cert.credentialUrl && (
                              <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-teal-600 hover:underline flex items-center gap-1 ml-auto">
                                Verify <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Coding Profiles */}
              {candidateProfile?.codingProfiles && Object.values(candidateProfile.codingProfiles).some(Boolean) && (
                <section className="space-y-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                  <h4 className="flex items-center gap-2 text-md font-bold text-slate-900 uppercase tracking-wider">
                    <div className="p-1.5 bg-slate-100 rounded text-slate-600">
                      <Terminal className="h-4 w-4" />
                    </div>
                    Coding Profiles
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(candidateProfile.codingProfiles).map(([platform, url]) => {
                      if (!url) return null;
                      return (
                        <a key={platform} href={url as string} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-blue-600 hover:border-blue-200 transition-all capitalize flex items-center gap-2">
                          <Code className="h-3 w-3" />
                          {platform}
                        </a>
                      )
                    })}
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

// Verification Application Modal
interface VerificationModalProps {
  isOpen: boolean;
  application: VerificationApplication | null;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  application,
  onClose,
  onApprove,
  onReject
}) => {
  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Verification Application</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* Company Info */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900">Company Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-500">Company Name</label>
                <p className="text-slate-900">{application.companyName}</p>
              </div>
              <div>
                <label className="text-sm text-slate-500">Industry</label>
                <p className="text-slate-900">{application.industry}</p>
              </div>
              <div>
                <label className="text-sm text-slate-500">Email</label>
                <p className="text-slate-900">{application.companyEmail}</p>
              </div>
              <div>
                <label className="text-sm text-slate-500">Website</label>
                <a href={application.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {application.companyWebsite}
                </a>
              </div>
            </div>
          </div>

          {/* Documents */}
          {application.documents && application.documents.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">Submitted Documents</h4>
              <div className="space-y-2">
                {application.documents.map((doc, index) => (
                  <a
                    key={index}
                    href={doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    Document {index + 1}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="text-sm text-slate-500">Current Status</label>
            <p className={`inline-flex px-3 py-1 rounded-full text-sm mt-1 ${application.status === 'approved' ? 'bg-green-100 text-green-700' :
              application.status === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
              {application.status}
            </p>
          </div>

          {/* Submission Date */}
          <div className="text-sm text-slate-500">
            Submitted: {new Date(application.createdAt).toLocaleString()}
          </div>
        </div>
        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Close</Button>
          {application.status === 'pending' && (
            <>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={onReject}
              >
                Reject
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={onApprove}
              >
                Approve
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Job Details Modal
interface JobDetailsModalProps {
  isOpen: boolean;
  job: FormattedJob | null;
  onClose: () => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  isOpen,
  job,
  onClose
}) => {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900">Job Details</h2>
            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${job.status === 'active' || job.status === 'open' ? 'bg-green-100 text-green-700 border-green-200' :
              job.status === 'closed' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                'bg-amber-100 text-amber-700 border-amber-200'
              }`}>
              {job.status?.charAt(0).toUpperCase() + job.status?.slice(1)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-8">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 shrink-0">
              {job.postedBy?.profile?.company?.logo ? (
                <img src={job.postedBy.profile.company.logo} alt="Company Logo" className="w-12 h-12 object-contain" />
              ) : (
                <Building2 className="h-8 w-8 text-slate-400" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900">{job.jobDetails?.basicInfo?.jobTitle}</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-slate-600">
                <span className="font-medium text-slate-800">{job.postedBy?.profile?.company?.name || 'Unknown Company'}</span>
                <span>•</span>
                <span>{job.jobDetails?.basicInfo?.department}</span>
                <span>•</span>
                <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0 min-w-[140px]">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">Applications</p>
                <p className="text-2xl font-bold text-blue-700 mt-1">{job.applicationCount || 0}</p>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Summary */}
              <section>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  Role Summary
                </h4>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {job.jobDetails?.description?.roleSummary}
                </p>
              </section>

              {/* Key Responsibilities */}
              {job.jobDetails?.description?.responsibilities && job.jobDetails.description.responsibilities.length > 0 && (
                <section>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-purple-500" />
                    Key Responsibilities
                  </h4>
                  <ul className="space-y-2">
                    {job.jobDetails.description.responsibilities.map((item, i) => (
                      <li key={i} className="flex gap-2 text-slate-600">
                        <span className="text-purple-500 font-bold mt-1.5">•</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Requirements */}
              {job.jobDetails?.description?.requiredSkills && job.jobDetails.description.requiredSkills.length > 0 && (
                <section>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Requirements
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.jobDetails.description.requiredSkills.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* At a Glance */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Job Overview
                </h4>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Employment Type</p>
                    <p className="font-medium text-slate-900">{job.jobDetails?.basicInfo?.employmentType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Work Mode</p>
                    <p className="font-medium text-slate-900">{job.jobDetails?.basicInfo?.workMode}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Job Level</p>
                    <p className="font-medium text-slate-900">{job.jobDetails?.basicInfo?.jobLevel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Location</p>
                    <div className="flex items-start gap-1.5">
                      <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                      <p className="font-medium text-slate-900">
                        {job.jobDetails?.location?.city}, {job.jobDetails?.location?.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compensation */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Compensation
                </h4>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Annual Salary</p>
                    <p className="font-bold text-lg text-green-700">
                      {job.jobDetails?.compensation?.salary?.toLocaleString()}
                      <span className="text-xs font-normal text-slate-500 ml-1 uppercase">{job.jobDetails?.compensation?.salaryType}</span>
                    </p>
                  </div>
                  {job.benefits && job.benefits.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Benefits</p>
                      <div className="flex flex-wrap gap-1.5">
                        {job.benefits.map((benefit, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs text-slate-600">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Criteria */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Hiring Criteria
                </h4>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Education</p>
                    <p className="font-medium text-slate-900">{job.jobDetails?.qualifications?.minimumEducation}</p>
                    {job.jobDetails?.qualifications?.preferredEducation && (
                      <p className="text-xs text-slate-500 mt-0.5">Preferred: {job.jobDetails.qualifications.preferredEducation}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Experience</p>
                    <p className="font-medium text-slate-900">{job.jobDetails?.qualifications?.yearsOfExperience} Years</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="text-xs text-slate-400 pt-4 border-t border-slate-100">
            Job ID: {job._id}
          </div>
        </div>
      </div>
    </div>
  );
};

export default {
  DeleteDialog,
  VerifyDialog,
  ProfileModal,
  VerificationModal,
  JobDetailsModal
};
