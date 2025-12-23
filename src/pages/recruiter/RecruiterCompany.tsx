import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { recruiterApi } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import {
  Building2, Globe, MapPin, Users,
  Save, AlertTriangle, CheckCircle,
  Calendar, Loader2, Sparkles,
  Link as LinkIcon, Linkedin, Twitter,
  ExternalLink,
  Edit2,
  X
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { RecruiterPageProps } from './types';

// Interface representing the full User object structure as passed via 'profile' prop
interface RecruiterCompanyProps extends RecruiterPageProps {
  profile: unknown;
  onNavigateToOnboarding: () => void;
}

interface CompanyDetails {
  name: string;
  description: string;
  website: string;
  size: string;
  logo: string;
  companyType: string;
  industry: string;
  foundingYear: string;
  headOfficeLocation: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  socialLinks: {
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
    youtube: string;
  };
}

export function RecruiterCompany({ profile: _propsProfile, onNavigateToOnboarding: _ }: RecruiterCompanyProps) {
  const { user, loading: authLoading } = useAuth(); // Get live user from context for permission checks
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<CompanyDetails>({
    name: '',
    description: '',
    website: '',
    size: '',
    logo: '',
    companyType: '',
    industry: '',
    foundingYear: '',
    headOfficeLocation: {
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    socialLinks: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: '',
      youtube: ''
    }
  });

  const companySizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Retail', 'Media', 'Real Estate', 'Consulting', 'Other'
  ];

  useEffect(() => {
    // Only fetch if user is present
    if (user) {
      fetchCompanyDetails();
    }
  }, [user]);

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      const response = await recruiterApi.getCompanyDetails();
      if (response.success && response.data) {
        // Merge with default state to handle missing fields
        const data = response.data as Partial<CompanyDetails>;
        setFormData(prev => ({
          ...prev,
          ...data,
          // Handle nested objects carefully
          headOfficeLocation: {
            ...prev.headOfficeLocation,
            ...(data.headOfficeLocation || {})
          },
          socialLinks: {
            ...prev.socialLinks,
            ...(data.socialLinks || {})
          }
        }));
      }
    } catch (err) {
      console.error('Failed to fetch company details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // name will be 'city', 'state', etc.
    setFormData(prev => ({
      ...prev,
      headOfficeLocation: { ...prev.headOfficeLocation, [name]: value }
    }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await recruiterApi.updateCompanyDetails(formData);

      if (response.success) {
        setSuccess('Company details updated successfully!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Optional: Exit edit mode after successful save
        // setIsEditing(false); 
      } else {
        throw new Error(response.error || 'Failed to update details');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  // Loading state for auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  // Access Control Check
  if (user && !user.isApproved) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Pending Approval</h2>
        <p className="text-slate-600 text-center max-w-md">
          You can update your company profile once your account has been approved by our admin team.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Format Address for display
  const displayAddress = formData.headOfficeLocation.address
    ? formData.headOfficeLocation.address
    : (formData.headOfficeLocation.city ? `${formData.headOfficeLocation.city}, ${formData.headOfficeLocation.country}` : '');

  // Render View Mode
  if (!isEditing) {
    return (
      <div className="space-y-8 animate-fade-in font-sans pb-12">
        <div className="flex items-center justify-end">
          <Button onClick={() => setIsEditing(true)} className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/10">
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white min-h-[280px] flex items-end p-8 md:p-10 shadow-xl ring-1 ring-white/10 group">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-slate-900">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
          <div className="absolute top-0 right-0 -mt-32 -mr-32 w-96 h-96 bg-indigo-600 rounded-full opacity-30 blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute bottom-0 left-0 -mb-32 -ml-32 w-96 h-96 bg-blue-600 rounded-full opacity-30 blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>

          {/* Company Info Content */}
          <div className="relative z-20 flex flex-col md:flex-row items-start md:items-end gap-8 w-full">
            <div className="w-32 h-32 rounded-3xl bg-white p-4 shadow-2xl border-[6px] border-white/10 backdrop-blur-md flex-shrink-0 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-500">
              {formData.logo ? (
                <img
                  src={formData.logo}
                  alt="Company Logo"
                  className="w-full h-full object-contain"
                />
              ) : (
                <Building2 className="h-16 w-16 text-slate-300" />
              )}
            </div>

            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-4 mb-3">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-sm">{formData.name || 'Company Name'}</h1>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-slate-300 font-medium text-lg">
                {displayAddress && (
                  <span className="flex items-center gap-2.5 hover:text-white transition-colors duration-200">
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                      <MapPin className="h-4 w-4 text-indigo-400" />
                    </div>
                    {displayAddress}
                  </span>
                )}
                {formData.size && (
                  <span className="flex items-center gap-2.5 hover:text-white transition-colors duration-200">
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                      <Users className="h-4 w-4 text-blue-400" />
                    </div>
                    {formData.size} employees
                  </span>
                )}
                {formData.website && (
                  <a href={formData.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-white transition-colors duration-200 group/link">
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 group-hover/link:bg-white/10 transition-colors">
                      <Globe className="h-4 w-4 text-sky-400" />
                    </div>
                    <span className="underline decoration-slate-600 underline-offset-4 group-hover/link:decoration-white transition-all">
                      Website
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-50 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                Details
              </h3>
              <div className="space-y-4">
                {formData.foundingYear && (
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase">Founded</p>
                    <p className="font-semibold text-slate-900">{formData.foundingYear}</p>
                  </div>
                )}
                {formData.industry && (
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase">Industry</p>
                    <p className="font-semibold text-slate-900">{formData.industry}</p>
                  </div>
                )}
                {formData.companyType && (
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase">Type</p>
                    <p className="font-semibold text-slate-900">{formData.companyType}</p>
                  </div>
                )}
              </div>
            </div>

            {(Object.values(formData.socialLinks).some(Boolean)) && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-slate-600" /> Social Profiles
                </h3>
                <div className="space-y-3">
                  {formData.socialLinks.linkedin && (
                    <a href={formData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                      <Linkedin className="h-5 w-5 text-[#0077b5]" />
                      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">LinkedIn</span>
                      <ExternalLink className="h-3 w-3 text-slate-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                  {formData.socialLinks.twitter && (
                    <a href={formData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                      <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Twitter</span>
                      <ExternalLink className="h-3 w-3 text-slate-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                  {formData.socialLinks.facebook && (
                    <a href={formData.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#1877F2] text-white font-bold text-[10px]">f</span>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Facebook</span>
                      <ExternalLink className="h-3 w-3 text-slate-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                  {formData.socialLinks.instagram && (
                    <a href={formData.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                      <span className="w-5 h-5 flex items-center justify-center rounded-md bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white font-bold text-[10px]">
                        <span className="sr-only">IG</span>
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                      </span>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Instagram</span>
                      <ExternalLink className="h-3 w-3 text-slate-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: About */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm min-h-[300px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  About Us
                </h3>
              </div>
              {formData.description ? (
                <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-wrap">
                  {formData.description}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-slate-400 italic">No description added yet.</p>
                  <Button variant="ghost" onClick={() => setIsEditing(true)} className="mt-2 text-purple-600 hover:bg-purple-50">
                    Add Description
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Company Profile</h1>
          <p className="text-slate-600">Manage your company information and branding</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setIsEditing(false)} variant="ghost" className="text-slate-600 hover:text-slate-900">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white">
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter company name"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                placeholder="Tell us about your company..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Company Size</label>
              <Select
                name="size"
                value={formData.size}
                onChange={handleChange}
              >
                <option value="">Select size</option>
                {companySizes.map(size => (
                  <option key={size} value={size}>{size} employees</option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Industry</label>
              <Select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
              >
                <option value="">Select industry</option>
                {industries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Founding Year</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  name="foundingYear"
                  value={formData.foundingYear}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="e.g. 2010"
                  type="number"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Location */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-slate-900">Head Office Location</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Address Line</label>
              <Input
                name="address"
                value={formData.headOfficeLocation.address}
                onChange={handleLocationChange}
                placeholder="Street address, building, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
              <Input
                name="city"
                value={formData.headOfficeLocation.city}
                onChange={handleLocationChange}
                placeholder="City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
              <Input
                name="state"
                value={formData.headOfficeLocation.state}
                onChange={handleLocationChange}
                placeholder="State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
              <Input
                name="country"
                value={formData.headOfficeLocation.country}
                onChange={handleLocationChange}
                placeholder="Country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">ZIP Code</label>
              <Input
                name="zipCode"
                value={formData.headOfficeLocation.zipCode}
                onChange={handleLocationChange}
                placeholder="ZIP / Postal Code"
              />
            </div>
          </div>
        </Card>

        {/* Social Links */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-slate-900">Social Presence</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn</label>
              <Input
                name="linkedin"
                value={formData.socialLinks.linkedin}
                onChange={handleSocialChange}
                placeholder="LinkedIn profile URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Twitter (X)</label>
              <Input
                name="twitter"
                value={formData.socialLinks.twitter}
                onChange={handleSocialChange}
                placeholder="Twitter profile URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Facebook</label>
              <Input
                name="facebook"
                value={formData.socialLinks.facebook}
                onChange={handleSocialChange}
                placeholder="Facebook page URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Instagram</label>
              <Input
                name="instagram"
                value={formData.socialLinks.instagram}
                onChange={handleSocialChange}
                placeholder="Instagram profile URL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">YouTube</label>
              <Input
                name="youtube"
                value={formData.socialLinks.youtube}
                onChange={handleSocialChange}
                placeholder="YouTube channel URL"
              />
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
