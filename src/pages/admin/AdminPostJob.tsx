import { useState, useEffect } from 'react';
import { Briefcase, Building2, MapPin, DollarSign, Users, FileText, Send, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface Company {
    id: string;
    name: string;
    logo: string | null;
    recruiterName: string;
    recruiterEmail: string;
}

interface AdminPostJobProps {
    onNavigate?: (section: string) => void;
}

export function AdminPostJob({ onNavigate }: AdminPostJobProps) {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [companyMode, setCompanyMode] = useState<'select' | 'add'>('select'); // Toggle between select and add
    const [customCompany, setCustomCompany] = useState({
        name: '',
        logo: ''
    });

    const [formData, setFormData] = useState({
        companyId: '',
        jobDetails: {
            basicInfo: {
                jobTitle: '',
                employmentType: 'full-time',
                experienceLevel: 'mid-level',
                department: '',
                numberOfOpenings: 1,
                workMode: 'onsite',
                jobLevel: 'mid-level'
            },
            location: {
                city: '',
                state: '',
                country: 'India',
                workplaceType: 'On-site',
                officeAddress: ''
            },
            compensation: {
                salary: '',
                currency: 'INR',
                salaryType: 'annual'
            },
            description: {
                roleSummary: '',
                responsibilities: [] as string[],
                requiredSkills: [] as string[]
            },
            qualifications: {
                minimumEducation: 'bachelors',
                preferredEducation: '',
                yearsOfExperience: 0
            },
            benefits: '',
            applicationDeadline: ''
        }
    });

    const [skillInput, setSkillInput] = useState('');

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const token = localStorage.getItem('token');
            const API_BASE_URL = import.meta.env.VITE_API_URL;
            const response = await fetch(`${API_BASE_URL}/api/admin/companies`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (data.success) {
                setCompanies(data.data);
            } else {
                setError('Failed to load companies');
            }
        } catch (err) {
            setError('Error loading companies');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        const keys = field.split('.');
        setFormData(prev => {
            const newData = { ...prev };
            let current: any = newData;

            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;

            return newData;
        });
    };

    const addSkill = () => {
        if (skillInput.trim()) {
            setFormData(prev => ({
                ...prev,
                jobDetails: {
                    ...prev.jobDetails,
                    description: {
                        ...prev.jobDetails.description,
                        requiredSkills: [...prev.jobDetails.description.requiredSkills, skillInput.trim()]
                    }
                }
            }));
            setSkillInput('');
        }
    };

    const removeSkill = (index: number) => {
        setFormData(prev => ({
            ...prev,
            jobDetails: {
                ...prev.jobDetails,
                description: {
                    ...prev.jobDetails.description,
                    requiredSkills: prev.jobDetails.description.requiredSkills.filter((_, i) => i !== index)
                }
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate based on mode
        if (companyMode === 'select' && !formData.companyId) {
            setError('Please select a company');
            return;
        }
        if (companyMode === 'add' && !customCompany.name.trim()) {
            setError('Please enter a company name');
            return;
        }

        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const API_BASE_URL = import.meta.env.VITE_API_URL;

            const response = await fetch(`${API_BASE_URL}/api/admin/jobs`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    customCompany: companyMode === 'add' ? customCompany : undefined
                })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Job posted successfully!');
                // Reset form
                setFormData({
                    companyId: '',
                    jobDetails: {
                        basicInfo: {
                            jobTitle: '',
                            employmentType: 'full-time',
                            experienceLevel: 'mid-level',
                            department: '',
                            numberOfOpenings: 1,
                            workMode: 'onsite',
                            jobLevel: 'mid-level'
                        },
                        location: {
                            city: '',
                            state: '',
                            country: 'India',
                            workplaceType: 'On-site',
                            officeAddress: ''
                        },
                        compensation: {
                            salary: '',
                            currency: 'INR',
                            salaryType: 'annual'
                        },
                        description: {
                            roleSummary: '',
                            responsibilities: [],
                            requiredSkills: []
                        },
                        qualifications: {
                            minimumEducation: 'bachelors',
                            preferredEducation: '',
                            yearsOfExperience: 0
                        },
                        benefits: '',
                        applicationDeadline: ''
                    }
                });

                // Navigate to jobs tab after 2 seconds
                setTimeout(() => {
                    if (onNavigate) onNavigate('jobs');
                }, 2000);
            } else {
                setError(data.message || 'Failed to post job');
            }
        } catch (err) {
            setError('Error posting job. Please try again.');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-10 shadow-xl">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Post a Job</h1>
                    <p className="text-slate-300 text-lg">Post jobs on behalf of companies as admin</p>
                </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl">
                    {success}
                </div>
            )}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Selection */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 rounded-xl">
                            <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Company</h2>
                    </div>

                    {/* Toggle between Select and Add */}
                    <div className="flex gap-2 mb-4">
                        <button
                            type="button"
                            onClick={() => setCompanyMode('select')}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${companyMode === 'select'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            Select Existing Company
                        </button>
                        <button
                            type="button"
                            onClick={() => setCompanyMode('add')}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${companyMode === 'add'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            Add New Company
                        </button>
                    </div>

                    {companyMode === 'select' ? (
                        <select
                            value={formData.companyId}
                            onChange={(e) => setFormData(prev => ({ ...prev, companyId: e.target.value }))}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required={companyMode === 'select'}
                        >
                            <option value="">Choose a company...</option>
                            {companies.map(company => (
                                <option key={company.id} value={company.id}>
                                    {company.name} ({company.recruiterName})
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name *</label>
                                <input
                                    type="text"
                                    value={customCompany.name}
                                    onChange={(e) => setCustomCompany(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Tech Solutions Inc."
                                    required={companyMode === 'add'}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Company Logo (Optional)</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setCustomCompany(prev => ({ ...prev, logo: reader.result as string }));
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    {customCompany.logo && (
                                        <div className="w-16 h-16 rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center bg-slate-50">
                                            <img src={customCompany.logo} alt="Logo preview" className="w-full h-full object-contain" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Basic Info */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-50 rounded-xl">
                            <Briefcase className="w-5 h-5 text-purple-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Job Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Job Title *</label>
                            <input
                                type="text"
                                value={formData.jobDetails.basicInfo.jobTitle}
                                onChange={(e) => handleInputChange('jobDetails.basicInfo.jobTitle', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Senior Software Engineer"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Department *</label>
                            <input
                                type="text"
                                value={formData.jobDetails.basicInfo.department}
                                onChange={(e) => handleInputChange('jobDetails.basicInfo.department', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Engineering"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Openings *</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.jobDetails.basicInfo.numberOfOpenings}
                                onChange={(e) => handleInputChange('jobDetails.basicInfo.numberOfOpenings', parseInt(e.target.value) || 1)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="1"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Employment Type *</label>
                            <select
                                value={formData.jobDetails.basicInfo.employmentType}
                                onChange={(e) => handleInputChange('jobDetails.basicInfo.employmentType', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Contract</option>
                                <option>Internship</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Experience Level *</label>
                            <select
                                value={formData.jobDetails.basicInfo.experienceLevel}
                                onChange={(e) => handleInputChange('jobDetails.basicInfo.experienceLevel', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option>Entry-level</option>
                                <option>Mid-level</option>
                                <option>Senior-level</option>
                                <option>Lead</option>
                                <option>Executive</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-50 rounded-xl">
                            <MapPin className="w-5 h-5 text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Location</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">City *</label>
                            <input
                                type="text"
                                value={formData.jobDetails.location.city}
                                onChange={(e) => handleInputChange('jobDetails.location.city', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Bangalore"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">State</label>
                            <input
                                type="text"
                                value={formData.jobDetails.location.state}
                                onChange={(e) => handleInputChange('jobDetails.location.state', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Karnataka"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Workplace Type *</label>
                            <select
                                value={formData.jobDetails.location.workplaceType}
                                onChange={(e) => handleInputChange('jobDetails.location.workplaceType', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option>On-site</option>
                                <option>Remote</option>
                                <option>Hybrid</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Compensation */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-amber-50 rounded-xl">
                            <DollarSign className="w-5 h-5 text-amber-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Compensation</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Annual Salary (₹)</label>
                            <input
                                type="number"
                                value={formData.jobDetails.compensation.salary}
                                onChange={(e) => handleInputChange('jobDetails.compensation.salary', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. 1200000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Application Deadline</label>
                            <input
                                type="date"
                                value={formData.jobDetails.applicationDeadline}
                                onChange={(e) => handleInputChange('jobDetails.applicationDeadline', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-50 rounded-xl">
                            <FileText className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Job Description</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Role Summary *</label>
                            <textarea
                                value={formData.jobDetails.description.roleSummary}
                                onChange={(e) => handleInputChange('jobDetails.description.roleSummary', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                                placeholder="Brief overview of the role..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Responsibilities</label>
                            <textarea
                                value={formData.jobDetails.description.responsibilities.join('\n')}
                                onChange={(e) => handleInputChange('jobDetails.description.responsibilities', e.target.value.split('\n').filter(r => r.trim()))}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                                placeholder="Enter each responsibility on a new line..."
                            />
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-pink-50 rounded-xl">
                            <Users className="w-5 h-5 text-pink-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Required Skills</h2>
                    </div>

                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Type a skill and press Enter"
                        />
                        <Button type="button" onClick={addSkill} className="bg-blue-600 text-white">
                            Add
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {formData.jobDetails.description.requiredSkills.map((skill, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium flex items-center gap-2"
                            >
                                {skill}
                                <button
                                    type="button"
                                    onClick={() => removeSkill(index)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Benefits */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-3">Benefits & Perks</h2>
                    <textarea
                        value={formData.jobDetails.benefits}
                        onChange={(e) => handleInputChange('jobDetails.benefits', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                        placeholder="Health insurance, flexible hours, etc..."
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onNavigate && onNavigate('jobs')}
                        className="px-6"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Posting...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Post Job
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
