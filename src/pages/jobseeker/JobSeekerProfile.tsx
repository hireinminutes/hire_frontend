import { useState, useRef, useEffect } from 'react';
import {
  MapPin, Mail, Phone, Edit3, Plus, Trash2, Upload, X,
  CheckCircle, Globe, Github, Linkedin, User
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Skeleton } from '../../components/ui/Skeleton';
import { useAuth } from '../../contexts/AuthContext';
import { JobSeekerPageProps, Experience, Education } from './types';
import { getApiUrl } from '../../config/api';

export function JobSeekerProfile(_props: JobSeekerPageProps) {
  const { profile, updateProfile, loading: authLoading } = useAuth();

  // Calculate profile strength
  const profileCompletion = () => {
    let completion = 0;

    // Basic Info (30%)
    if (profile?.fullName) completion += 5;
    if (profile?.email) completion += 5;
    if (profile?.profile?.phone) completion += 5;
    if (profile?.profilePicture) completion += 5;
    if (profile?.profile?.headline) completion += 5;
    // Location check: string or object with city
    if (typeof profile?.profile?.location === 'string' && profile.profile.location) completion += 5;
    else if (profile?.profile?.location?.city) completion += 5;

    // About (10%)
    if (profile?.profile?.professionalSummary) completion += 10;

    // Skills (15%)
    if (profile?.profile?.skills && profile.profile.skills.length > 0) completion += 15;

    // Experience (15%)
    if (profile?.profile?.experience && profile.profile.experience.length > 0) completion += 15;

    // Education (15%)
    if (profile?.profile?.education && profile.profile.education.length > 0) completion += 15;

    // Social Links (5%)
    if (profile?.profile?.socialProfiles?.linkedin || profile?.profile?.socialProfiles?.github || profile?.profile?.socialProfiles?.website) completion += 5;

    // Resume (10%) - Assume existing logic for resume existence check
    if (profile?.profile?.documents?.resume) completion += 10;

    return Math.min(completion, 100);
  };

  const strength = profileCompletion();
  const getStrengthColor = (score: number) => {
    if (score < 40) return 'text-red-600 bg-red-50';
    if (score < 70) return 'text-amber-600 bg-amber-50';
    return 'text-green-600 bg-green-50';
  };
  const getStrengthBarColor = (score: number) => {
    if (score < 40) return 'bg-red-500';
    if (score < 70) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Experience State
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({ employmentType: 'full-time' });
  const [showAddExp, setShowAddExp] = useState(false);

  // Education State
  const [educations, setEducations] = useState<Education[]>([]);
  const [newEducation, setNewEducation] = useState<Partial<Education>>({});
  const [showAddEdu, setShowAddEdu] = useState(false);

  // Skills State
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  // College Selection State
  // Define a minimal interface for the college list since we don't import the full model
  interface CollegeOption { _id: string; name: string; address?: { city?: string; country?: string }; logo?: string }
  const [colleges, setColleges] = useState<CollegeOption[]>([]);
  const [collegeSearch, setCollegeSearch] = useState('');
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<CollegeOption | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch(`${getApiUrl()}/api/college/list`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setColleges(data.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch colleges:', error);
      }
    };
    fetchColleges();
  }, []);

  const filteredColleges = colleges.filter(c =>
    c.name.toLowerCase().includes(collegeSearch.toLowerCase())
  );

  useEffect(() => {
    if (profile) {
      const p = profile.profile;

      // Parse location object to string if needed
      let locString = '';
      if (p?.location) {
        if (typeof p.location === 'string') locString = p.location;
        else locString = [p.location.city, p.location.state, p.location.country].filter(Boolean).join(', ');
      }

      setFormData({
        fullName: profile.fullName || '',
        email: profile.email || '',
        phone: p?.phone || '',
        location: locString,
        bio: p?.professionalSummary || '',
        title: p?.headline || '',
        github: p?.socialProfiles?.github || '',
        linkedin: p?.socialProfiles?.linkedin || '',
        portfolio: p?.socialProfiles?.website || '',
      });
      setImagePreview(profile.profilePicture || null);

      // Map experiences 
      setExperiences(p?.experience ? p.experience.map(e => ({ ...e, isCurrentlyWorking: e.isCurrentlyWorking || false })) : []);

      // Map educations
      setEducations(p?.education || []);

      // Map skills 
      if (p?.skills) {
        const s = p.skills.map(sk => typeof sk === 'string' ? sk : sk.name);
        setSkills(s);
      } else {
        setSkills([]);
      }
    }
  }, [profile]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenericUpdate = async () => {
    try {
      setUploading(true);

      // Parse location string into object
      let city = '', state = '', country = '';
      if (formData.location) {
        const parts = formData.location.split(',').map((p: string) => p.trim());
        if (parts.length > 0) city = parts[0];
        if (parts.length > 1) state = parts[1];
        if (parts.length > 2) country = parts[2];
        // Fallback for simple "City, Country"
        if (parts.length === 2) {
          city = parts[0];
          country = parts[1];
          state = '';
        }
      }

      const socialLinks = {
        github: formData.github,
        linkedin: formData.linkedin,
        website: formData.portfolio
      };

      // Construct a unified JSON payload matching backend expectations
      // Backend expects top-level keys for job seekers
      const updatePayload: any = {
        fullName: formData.fullName,
        phone: formData.phone,
        headline: formData.title,
        professionalSummary: formData.bio,
        city: city,
        state: state,
        country: country,
        socialProfiles: socialLinks,
        // Backend maps 'website' from company logic but for candidate it uses socialProfiles?
        // Candidate model uses socialProfiles.website from req.body.socialProfiles
      };

      // If there's a new image file, use the preview (which is base64)
      if (imageFile && imagePreview) {
        updatePayload.profilePicture = imagePreview;
      }

      await updateProfile(updatePayload);

      showToast('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      showToast(error.message || 'Failed to update profile', 'error');
    } finally {
      setUploading(false);
    }
  };

  const updateSubSection = async (type: 'experience' | 'education' | 'skills', data: any, successMessage?: string) => {
    try {
      setUploading(true);
      // Backend expects top-level keys in the body for these fields (check authController)
      // e.g. req.body.experience, req.body.skills

      let payloadData = data;
      // Backend expects skills as objects { name: string }
      if (type === 'skills' && Array.isArray(data)) {
        payloadData = data.map((skill: any) => typeof skill === 'string' ? { name: skill } : skill);
      }

      const updateData = { [type]: payloadData };
      await updateProfile(updateData);
      showToast(successMessage || `${type.charAt(0).toUpperCase() + type.slice(1)} updated!`);
      if (type === 'experience') setShowAddExp(false);
      if (type === 'education') setShowAddEdu(false);
    } catch (error) {
      showToast(`Failed to update ${type}`, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleAddExperience = async () => {
    if (!newExperience.jobTitle || !newExperience.companyName || !newExperience.startDate) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    const updatedExp = [...experiences, { ...newExperience, id: Date.now().toString() } as Experience];
    setExperiences(updatedExp);
    await updateSubSection('experience', updatedExp, 'Experience added successfully!');
    setNewExperience({ employmentType: 'full-time' }); // Reset form with default
  };

  const handleAddEducation = async () => {
    if (!newEducation.degreeName || !newEducation.institution || !newEducation.startYear) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    // Ensure years are numbers
    const eduToAdd = {
      ...newEducation,
      id: Date.now().toString(),
      startYear: Number(newEducation.startYear),
      endYear: newEducation.endYear ? Number(newEducation.endYear) : undefined
    } as Education;

    const updatedEdu = [...educations, eduToAdd];
    setEducations(updatedEdu);
    await updateSubSection('education', updatedEdu, 'Education added successfully!');
    setNewEducation({}); // Reset form
    setCollegeSearch('');
    setSelectedCollege(null);
    setIsManualEntry(false);
  };

  if (authLoading || !profile) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-[32px]" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 rounded-[24px]" />
          <Skeleton className="h-96 lg:col-span-2 rounded-[24px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-20 relative container mx-auto px-4 sm:px-6">

      {toast && (
        <div className={`fixed top-24 right-8 z-50 px-6 py-4 rounded-xl shadow-2xl text-white font-bold animate-fade-in-up flex items-center gap-3 ${toast.type === 'error' ? 'bg-red-500' : 'bg-slate-900'}`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      {/* Clean Professional Header */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm mb-6 md:mb-8 relative">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 z-10 p-2 bg-white text-slate-700 rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
            title="Edit Profile"
          >
            <Edit3 className="w-5 h-5" />
          </button>
        )}

        {/* Cover Image */}
        <div className="h-32 md:h-48 bg-slate-900 w-full relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900"></div>
        </div>

        <div className="px-4 md:px-8 pb-8">
          <div className="relative flex flex-col lg:flex-row items-center lg:items-start -mt-12 lg:-mt-16 mb-6 gap-6">
            {/* Profile Picture */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full bg-white p-1 md:p-1.5 shadow-md border border-slate-100">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 relative">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                      <User className="w-10 h-10 lg:w-16 lg:h-16" />
                    </div>
                  )}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer transition-opacity group-hover:opacity-100" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} disabled={!isEditing} />
                </div>
              </div>
            </div>

            {/* Header Info */}
            <div className="flex-1 pb-2 text-center lg:text-left w-full lg:mt-[72px]">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">{profile.fullName}</h1>
              <p className="text-base md:text-lg text-slate-600 font-medium mb-3">{formData?.title || 'Add Job Title'}</p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3 lg:gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded lg:bg-transparent lg:p-0 lg:rounded-none">
                  <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" />
                  {formData?.location || 'Add Location'}
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded lg:bg-transparent lg:p-0 lg:rounded-none">
                  <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" />
                  {profile.email}
                </div>
                {formData?.phone && (
                  <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded lg:bg-transparent lg:p-0 lg:rounded-none">
                    <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" />
                    {formData.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-2 pb-2 justify-center lg:justify-start">
              {formData?.linkedin && (
                <a href={formData.linkedin} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-[#0077b5] hover:bg-blue-50 rounded-lg transition-colors"><Linkedin className="w-5 h-5" /></a>
              )}
              {formData?.github && (
                <a href={formData.github} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-[#333] hover:bg-slate-100 rounded-lg transition-colors"><Github className="w-5 h-5" /></a>
              )}
              {formData?.portfolio && (
                <a href={formData.portfolio} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"><Globe className="w-5 h-5" /></a>
              )}
            </div>
          </div>

          {/* Edit Form (Inline if active) */}
          {isEditing && (
            <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
              <Input label="Full Name" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
              <Input label="Job Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              <Input label="Location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
              <Input label="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              <div className="md:col-span-2">
                <Textarea label="Bio / Summary" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
              </div>
              <Input label="LinkedIn" value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} />
              <Input label="GitHub" value={formData.github} onChange={e => setFormData({ ...formData, github: e.target.value })} />
              <Input label="Portfolio" value={formData.portfolio} onChange={e => setFormData({ ...formData, portfolio: e.target.value })} />

              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <Button variant="ghost" onClick={() => setIsEditing(false)} size="sm">Cancel</Button>
                <Button onClick={handleGenericUpdate} disabled={uploading} className="bg-slate-900 text-white" size="sm">Save Changes</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

        {/* LEFT SIDEBAR (4 Cols) - Tablet Grid Optimization */}
        <div className="lg:col-span-4 space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 lg:block lg:space-y-6">

          {/* About Section */}
          <Card className="p-6 rounded-xl border border-slate-200 shadow-sm bg-white">
            <h3 className="font-semibold text-slate-900 mb-4 text-lg">About</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              {formData?.bio || 'Add a professional summary to tell recruiters about your experience and expertise.'}
            </p>
          </Card>

          {/* Profile Strength */}
          <Card className="p-6 rounded-xl border border-slate-200 shadow-sm bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-900">Profile Strength</h3>
              <span className={`text-sm font-bold px-2 py-1 rounded ${getStrengthColor(strength)}`}>{strength}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-4">
              <div className={`h-full rounded-full transition-all duration-500 ${getStrengthBarColor(strength)}`} style={{ width: `${strength}%` }}></div>
            </div>
            <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50" size="sm" onClick={() => setIsEditing(true)}>
              {strength < 100 ? 'Complete Profile' : 'Edit Profile'}
            </Button>
          </Card>

          {/* Skills Section */}
          <Card className="p-6 rounded-xl border border-slate-200 shadow-sm bg-white md:col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-slate-900 mb-4 text-lg">Skills</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {skills.map((skill, idx) => (
                <div key={idx} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm font-semibold text-slate-700 flex items-center gap-2 group">
                  {skill}
                  <button
                    onClick={() => {
                      const newSkills = skills.filter((_, i) => i !== idx);
                      setSkills(newSkills);
                      updateSubSection('skills', newSkills, 'Skill removed');
                    }}
                    className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {skills.length === 0 && <span className="text-slate-400 text-sm">No skills added.</span>}
            </div>

            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                placeholder="Add skill..."
                className="text-sm"
                onKeyPress={e => {
                  if (e.key === 'Enter' && newSkill) {
                    const updated = [...skills, newSkill];
                    setSkills(updated);
                    setNewSkill('');
                    updateSubSection('skills', updated, 'Skill added!');
                  }
                }}
              />
              <Button size="sm" className="bg-slate-900 text-white h-auto aspect-square p-0" onClick={() => {
                if (newSkill) {
                  const updated = [...skills, newSkill];
                  setSkills(updated);
                  setNewSkill('');
                  updateSubSection('skills', updated, 'Skill added!');
                }
              }}>
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </Card>


        </div>

        {/* RIGHT MAIN CONTENT (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* Experience Section */}
          <Card className="p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Experience</h2>
              <Button onClick={() => setShowAddExp(true)} variant="outline" size="sm" className="gap-2 border-slate-200">
                <Plus className="w-4 h-4" /> Add
              </Button>
            </div>

            {showAddExp && (
              <div className="mb-8 p-4 md:p-6 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4">Add Experience</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input placeholder="Job Title" value={newExperience.jobTitle || ''} onChange={e => setNewExperience({ ...newExperience, jobTitle: e.target.value })} />
                  <Input placeholder="Company Name" value={newExperience.companyName || ''} onChange={e => setNewExperience({ ...newExperience, companyName: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <select
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-slate-900/10"
                    value={newExperience.employmentType || 'full-time'}
                    onChange={e => setNewExperience({ ...newExperience, employmentType: e.target.value })}
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                    <option value="contract">Contract</option>
                  </select>
                  <Input type="date" value={newExperience.startDate || ''} onChange={e => setNewExperience({ ...newExperience, startDate: e.target.value })} />
                </div>
                <div className="md:col-span-2 mb-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 h-full pt-1">
                    <Input type="date" disabled={newExperience.isCurrentlyWorking} value={newExperience.endDate || ''} onChange={e => setNewExperience({ ...newExperience, endDate: e.target.value })} className="w-full md:w-1/2" />
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <input type="checkbox" checked={newExperience.isCurrentlyWorking} onChange={e => setNewExperience({ ...newExperience, isCurrentlyWorking: e.target.checked })} className="rounded border-slate-300 w-4 h-4 text-slate-900 focus:ring-slate-900" />
                      I currently work here
                    </label>
                  </div>
                </div>
                <Textarea placeholder="Description" value={newExperience.description || ''} onChange={e => setNewExperience({ ...newExperience, description: e.target.value })} className="mb-4" />
                <div className="flex justify-end gap-2 text-sm md:text-base">
                  <Button variant="ghost" onClick={() => setShowAddExp(false)} size="sm">Cancel</Button>
                  <Button onClick={handleAddExperience} className="bg-slate-900 text-white" size="sm">Save</Button>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {experiences.length === 0 && !showAddExp && <div className="text-center py-8 text-slate-400">No experience listed.</div>}
              {experiences.map((exp, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-slate-300 shrink-0"></div>
                  <div className="flex-1 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{exp.jobTitle}</h3>
                        <div className="text-slate-600 font-medium">{exp.companyName}</div>
                        <div className="text-sm text-slate-500 mt-1">
                          {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} -
                          {exp.isCurrentlyWorking ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Present')}
                        </div>
                        {exp.description && <p className="mt-2 text-slate-600 text-sm leading-relaxed">{exp.description}</p>}
                      </div>
                      <button onClick={() => {
                        const newExps = experiences.filter((_, i) => i !== idx);
                        setExperiences(newExps);
                        updateSubSection('experience', newExps, 'Experience deleted');
                      }} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Education Section */}
          <Card className="p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Education</h2>
              <Button onClick={() => setShowAddEdu(true)} variant="outline" size="sm" className="gap-2 border-slate-200">
                <Plus className="w-4 h-4" /> Add
              </Button>
            </div>

            {showAddEdu && (
              <div className="mb-8 p-4 md:p-6 bg-slate-50 rounded-xl border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* College Selection Logic */}
                  <div className="relative">
                    {!isManualEntry ? (
                      <>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Institution</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search for your college..."
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none transition-all"
                            value={collegeSearch}
                            onChange={(e) => {
                              setCollegeSearch(e.target.value);
                              setShowCollegeDropdown(true);
                              setSelectedCollege(null);
                              setNewEducation({ ...newEducation, institution: e.target.value, collegeId: undefined });
                            }}
                            onFocus={() => setShowCollegeDropdown(true)}
                          />
                          {showCollegeDropdown && collegeSearch && !selectedCollege && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              {filteredColleges.length > 0 ? (
                                filteredColleges.map((college) => (
                                  <button
                                    key={college._id}
                                    className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-center gap-2"
                                    onClick={() => {
                                      setSelectedCollege(college);
                                      setNewEducation({
                                        ...newEducation,
                                        institution: college.name,
                                        collegeId: college._id,
                                        isManualEntry: false
                                      });
                                      setCollegeSearch(college.name);
                                      setShowCollegeDropdown(false);
                                    }}
                                  >
                                    <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs font-bold text-slate-500">
                                      {college.name.charAt(0)}
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-slate-900">{college.name}</div>
                                      <div className="text-xs text-slate-500">{college.address?.city}, {college.address?.country}</div>
                                    </div>
                                  </button>
                                ))
                              ) : (
                                <div className="p-4 text-sm text-slate-500 text-center">No colleges found</div>
                              )}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setIsManualEntry(true);
                            setNewEducation({ ...newEducation, institution: '', collegeId: undefined, isManualEntry: true });
                            setCollegeSearch('');
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-1.5 inline-block"
                        >
                          My college is not listed
                        </button>
                      </>
                    ) : (
                      <>
                        <Input
                          label="Institution Name"
                          placeholder="Enter college name"
                          value={newEducation.institution || ''}
                          onChange={e => setNewEducation({ ...newEducation, institution: e.target.value, collegeId: undefined, isManualEntry: true })}
                        />
                        <button
                          onClick={() => {
                            setIsManualEntry(false);
                            setNewEducation({ ...newEducation, institution: '', collegeId: undefined, isManualEntry: false });
                            setCollegeSearch('');
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-1.5 inline-block"
                        >
                          Search from list
                        </button>
                      </>
                    )}
                  </div>

                  <div className="pt-6 md:pt-0"> {/* Spacer for label alignment on desktop or creating structure */}
                    <Input label="Degree" placeholder="Degree (e.g. B.Tech)" value={newEducation.degreeName || ''} onChange={e => setNewEducation({ ...newEducation, degreeName: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input label="Start Year" placeholder="YYYY" value={newEducation.startYear || ''} onChange={e => setNewEducation({ ...newEducation, startYear: e.target.value })} />
                  <Input label="End Year" placeholder="YYYY" value={newEducation.endYear || ''} onChange={e => setNewEducation({ ...newEducation, endYear: e.target.value })} />
                </div>
                <div className="flex justify-end gap-2 text-sm md:text-base">
                  <Button variant="ghost" onClick={() => setShowAddEdu(false)} size="sm">Cancel</Button>
                  <Button
                    onClick={handleAddEducation}
                    className="bg-slate-900 text-white"
                    size="sm"
                    disabled={!newEducation.institution || !newEducation.degreeName || !newEducation.startYear}
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {educations.length === 0 && !showAddEdu && <div className="text-center py-8 text-slate-400">No education listed.</div>}
              {educations.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-start p-4 hover:bg-slate-50 rounded-xl transition-colors group">
                  <div>
                    <h3 className="font-bold text-slate-900">{edu.degreeName}</h3>
                    <div className="text-slate-600">{edu.institution}</div>
                    <div className="text-sm text-slate-400 mt-1">{edu.startYear} - {edu.endYear}</div>
                  </div>
                  <button onClick={() => {
                    const newEdus = educations.filter((_, i) => i !== idx);
                    setEducations(newEdus);
                    updateSubSection('education', newEdus, 'Education deleted');
                  }} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div >    </div >
  );
}
