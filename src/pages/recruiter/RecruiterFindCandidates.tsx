import { useState } from 'react';
import { UserCheck, CheckCircle, Mail, Search, MapPin, Briefcase, GraduationCap, X, Zap, Crown, BookOpen, Star, Phone, FileText, Link as LinkIcon } from 'lucide-react';

import { Button } from '../../components/ui/Button';
import { RecruiterPageProps, Candidate } from './types';

interface RecruiterFindCandidatesProps extends RecruiterPageProps {
  candidates: Candidate[];
  loadingCandidates: boolean;
}

interface FullCandidateProfile {
  _id: string;
  fullName: string;
  slug: string;
  profilePicture?: string;
  isVerified: boolean;
  email?: string; // Top level or inside applicant
  applicant?: { email: string };
  profile: {
    phone?: string;
    profilePhoto?: string;
    location?: {
      city: string;
      state: string;
      country: string;
    };
    professionalSummary?: string;
    skills?: Array<{
      name: string;
      isVerified: boolean;
    }>;
    experience?: Array<{
      jobTitle: string;
      companyName: string;
      employmentType: string;
      location?: string;
      startDate: Date;
      endDate?: Date;
      isCurrentlyWorking: boolean;
    }>;
    education?: Array<{
      degreeName: string;
      institution: string;
      specialization?: string;
      startYear: number;
      endYear?: number;
      score?: string;
      grade?: string;
    }>;
    projects?: Array<{
      title: string;
      description: string;
      techStack: string[];
      githubLink?: string;
      demoLink?: string;
      isLive: boolean;
    }>;
    certifications?: Array<{
      certificateName: string;
      issuingOrganization: string;
      issueDate?: Date;
    }>;
    socialProfiles?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      website?: string;
    };
    codingProfiles?: {
      leetcode?: string;
      hackerrank?: string;
    };
    documents?: {
      resume?: string;
      portfolioUrl?: string;
    };
  };
}

export function RecruiterFindCandidates({ candidates, loadingCandidates }: RecruiterFindCandidatesProps) {
  const [candidateSearch, setCandidateSearch] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedCandidateSummary, setSelectedCandidateSummary] = useState<Candidate | null>(null);
  const [fullProfile, setFullProfile] = useState<FullCandidateProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const filteredCandidates = candidates.filter(candidate =>
    candidateSearch === '' ||
    candidate.profile.fullName.toLowerCase().includes(candidateSearch.toLowerCase()) ||
    candidate.profile.skills.some((skill: string) => skill.toLowerCase().includes(candidateSearch.toLowerCase())) ||
    candidate.profile.location.toLowerCase().includes(candidateSearch.toLowerCase()) ||
    candidate.profile.currentRole.toLowerCase().includes(candidateSearch.toLowerCase())
  );

  const fetchCandidateProfile = async (slugOrId: string) => {
    try {
      setLoadingProfile(true);
      setFullProfile(null);
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/candidates/profile/${slugOrId}`);

      if (response.ok) {
        const result = await response.json();
        setFullProfile(result.data);
      } else {
        console.error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleViewProfile = (candidate: Candidate) => {
    setSelectedCandidateSummary(candidate);
    setShowProfileModal(true);
    const identifier = candidate.slug || candidate._id;
    if (identifier) {
      fetchCandidateProfile(identifier);
    }
  };

  return (<><div className="space-y-6 sm:space-y-8 animate-fade-in font-sans pb-20 sm:pb-12 px-4 pt-4 sm:px-0 sm:pt-0">
    {/* Header Banner */}
    <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-slate-900 text-white p-6 sm:p-8 md:p-10 shadow-xl ring-1 ring-white/10">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-500 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-600 rounded-full opacity-20 blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 tracking-tight">Candidate Search</h1>
        <p className="text-slate-300 text-sm sm:text-lg leading-relaxed max-w-2xl">
          Discover and connect with verified talent for your open roles.
        </p>
      </div>

      <div className="relative z-10 mt-6 sm:mt-8 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, skills, location, or role..."
            value={candidateSearch}
            onChange={(e) => setCandidateSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all shadow-lg text-sm sm:text-base"
          />
          {candidateSearch && (
            <button
              onClick={() => setCandidateSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>

    {/* Candidates List */}
    {loadingCandidates ? (
      <div className="text-center py-24">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-4 text-slate-500 font-medium">Loading verified candidates...</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCandidates.map((candidate) => (
          <div key={candidate._id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all group duration-300 relative flex flex-col h-full">
            {/* Premium/Pro Badge */}
            {(candidate.plan === 'premium' || candidate.plan === 'pro') && (
              <div className={`absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide shadow-sm z-10 ${candidate.plan === 'premium'
                ? 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border-amber-200'
                : 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border-purple-200'
                }`}>
                {candidate.plan === 'premium' ? <Crown className="h-3.5 w-3.5 fill-amber-500 text-amber-600" /> : <Zap className="h-3.5 w-3.5 fill-purple-500 text-purple-600" />}
                {candidate.plan}
              </div>
            )}

            {/* Verified Badge (Positioned differently if plan badge exists) */}
            <div className={`absolute ${candidate.plan === 'premium' || candidate.plan === 'pro' ? 'top-16' : 'top-6'} right-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 uppercase tracking-wide`}>
              <CheckCircle className="h-3.5 w-3.5" />
              Verified
            </div>

            <div className="flex items-start gap-5 mb-5">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-slate-500 font-bold text-2xl shadow-inner border-2 ${candidate.plan === 'premium'
                ? 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 text-amber-600'
                : candidate.plan === 'pro'
                  ? 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-purple-600'
                  : 'bg-gradient-to-br from-slate-100 to-slate-200 border-white/50'
                }`}>
                {candidate.profile.profilePicture ? (
                  <img src={candidate.profile.profilePicture} alt="" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  candidate.profile.fullName.charAt(0)
                )}
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-slate-900 text-xl group-hover:text-blue-600 transition-colors">
                  {candidate.profile.fullName}
                </h3>
                <p className="text-slate-600 font-medium">{candidate.profile.currentRole}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {candidate.profile.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" /> {candidate.profile.experience}y exp
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6 space-y-4 flex-1">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Top Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {candidate.profile.skills.slice(0, 5).map((skill: string, index: number) => (
                    <span key={index} className="px-2.5 py-1 text-xs font-semibold bg-slate-50 text-slate-600 rounded-lg border border-slate-200">
                      {skill}
                    </span>
                  ))}
                  {candidate.profile.skills.length > 5 && (
                    <span className="px-2.5 py-1 text-xs font-semibold bg-slate-50 text-slate-400 rounded-lg border border-slate-200">+{candidate.profile.skills.length - 5}</span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-blue-500" /> Education
                </h4>
                <p className="text-sm text-slate-600 leading-snug">{candidate.profile.education}</p>
              </div>
            </div>

            <div className="flex items-center justify-end pt-5 border-t border-slate-100 mt-auto">
              <div className="text-xs text-slate-400 font-medium mr-auto">
                Verified since {new Date(candidate.verifiedAt).toLocaleDateString()}
              </div>

              <Button
                size="sm"
                className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/10"
                onClick={() => handleViewProfile(candidate)}
              >
                View Full Profile
              </Button>
            </div>
          </div>
        ))}
      </div>
    )}

    {candidates.length === 0 && !loadingCandidates && (
      <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
          <UserCheck className="h-10 w-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No Verified Candidates</h3>
        <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
          Our candidate pool is currently being updated. Verified candidates will appear here soon.
        </p>
      </div>
    )}

    {filteredCandidates.length === 0 && candidates.length > 0 && !loadingCandidates && (
      <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
          <Search className="h-10 w-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No Matches Found</h3>
        <p className="text-slate-500 mb-6 max-w-md mx-auto">
          We couldn't find any candidates matching "{candidateSearch}". Try adjusting your search criteria.
        </p>
        <Button onClick={() => setCandidateSearch('')} variant="outline" className="border-slate-200">
          Clear Search
        </Button>
      </div>
    )}
  </div>

    {/* Profile Modal */}
    {
      showProfileModal && selectedCandidateSummary && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200" onClick={() => setShowProfileModal(false)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Candidate Profile</h2>
                <p className="text-sm text-slate-500">Viewing profile of <span className="text-blue-600 font-medium">{selectedCandidateSummary.profile.fullName}</span></p>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-0">
              {loadingProfile ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-slate-500 font-medium">Loading full profile details...</p>
                </div>
              ) : fullProfile ? (
                <>
                  {/* Hero Section */}
                  <div className="bg-slate-50 px-4 sm:px-8 py-8 sm:py-10 border-b border-slate-200">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                        {fullProfile.profile?.profilePhoto || fullProfile.profilePicture ? (
                          <img
                            src={fullProfile.profile?.profilePhoto || fullProfile.profilePicture}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-300">
                            {(fullProfile.fullName || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center md:justify-start gap-2">
                          {fullProfile.fullName}
                          {fullProfile.isVerified && (
                            <CheckCircle className="h-5 w-5 text-blue-500" />
                          )}
                        </h2>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-sm text-slate-600">
                          {fullProfile.email && <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-slate-400" /> {fullProfile.email}</span>}
                          {fullProfile.applicant?.email && !fullProfile.email && <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-slate-400" /> {fullProfile.applicant.email}</span>}
                          {fullProfile.profile?.location && (
                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {fullProfile.profile.location.city}, {fullProfile.profile.location.state}</span>
                          )}
                          {fullProfile.profile?.phone && (
                            <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-slate-400" /> {fullProfile.profile.phone}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 sm:px-8 py-8 space-y-8">
                    {/* Professional Summary */}
                    {fullProfile.profile?.professionalSummary && (
                      <section>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                          About
                        </h3>
                        <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                          {fullProfile.profile.professionalSummary}
                        </p>
                      </section>
                    )}

                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Experience */}
                      {fullProfile.profile?.experience && fullProfile.profile.experience.length > 0 && (
                        <section>
                          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-blue-500" /> Experience
                          </h3>
                          <div className="space-y-4">
                            {fullProfile.profile.experience.map((exp, idx) => (
                              <div key={idx} className="relative pl-6 border-l-2 border-slate-100 pb-4 last:pb-0">
                                <div className="absolute top-0 left-[-7px] w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></div>
                                <h4 className="font-bold text-slate-900">{exp.jobTitle}</h4>
                                <div className="text-slate-600 text-sm font-medium mb-1">{exp.companyName}</div>
                                <div className="text-xs text-slate-400 uppercase tracking-wide">
                                  {new Date(exp.startDate).toLocaleDateString()} - {exp.isCurrentlyWorking ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString() : '')}
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {/* Education */}
                      {fullProfile.profile?.education && fullProfile.profile.education.length > 0 && (
                        <section>
                          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-indigo-500" /> Education
                          </h3>
                          <div className="space-y-4">
                            {fullProfile.profile.education.map((edu, idx) => (
                              <div key={idx} className="relative pl-6 border-l-2 border-slate-100 pb-4 last:pb-0">
                                <div className="absolute top-0 left-[-7px] w-3 h-3 rounded-full bg-indigo-500 border-2 border-white"></div>
                                <h4 className="font-bold text-slate-900">{edu.degreeName}</h4>
                                <div className="text-slate-600 text-sm font-medium mb-1">{edu.institution}</div>
                                <div className="text-xs text-slate-400 uppercase tracking-wide">
                                  {edu.startYear} - {edu.endYear || 'Present'} {edu.grade && `• Grade: ${edu.grade}`}
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                    </div>

                    {/* Skills */}
                    {fullProfile.profile?.skills && fullProfile.profile.skills.length > 0 && (
                      <section>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Star className="h-4 w-4 text-amber-500" /> Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {fullProfile.profile.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${skill.isVerified
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-white text-slate-700 border-slate-200'
                                }`}
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Documents & Links */}
                    {(fullProfile.profile?.documents || fullProfile.profile?.socialProfiles) && (
                      <section className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                          Attachments & Links
                        </h3>
                        <div className="flex flex-wrap gap-4">
                          {fullProfile.profile?.documents?.resume && (
                            <a
                              href={fullProfile.profile.documents.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors shadow-sm"
                            >
                              <FileText className="h-4 w-4" />
                              <span>Resume</span>
                            </a>
                          )}
                          {fullProfile.profile?.documents?.portfolioUrl && (
                            <a
                              href={fullProfile.profile.documents.portfolioUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors shadow-sm"
                            >
                              <LinkIcon className="h-4 w-4" />
                              <span>Portfolio</span>
                            </a>
                          )}
                        </div>
                      </section>
                    )}
                  </div>

                  {/* Modal Footer */}
                  <div className="sticky bottom-0 bg-white border-t border-slate-100 px-4 sm:px-8 py-4 sm:py-5 flex justify-end gap-4 z-10">
                    <Button
                      onClick={() => setShowProfileModal(false)}
                      className="bg-slate-900 hover:bg-slate-800 text-white"
                    >
                      Close
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-24">
                  <p className="text-slate-500">Failed to load profile information. Please try again later.</p>
                  <Button onClick={() => setShowProfileModal(false)} className="mt-4" variant="outline">Close</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }
  </>
  );
}
