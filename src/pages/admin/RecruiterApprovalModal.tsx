import React from 'react';
import { Button } from '../../components/ui/Button';
import { X, Building2, Mail, Phone, Globe, MapPin, Calendar, FileText, Facebook, Linkedin, Twitter, Instagram, Image as ImageIcon } from 'lucide-react';
import type { FormattedRecruiterApproval } from './types';

interface RecruiterApprovalModalProps {
    isOpen: boolean;
    approval: FormattedRecruiterApproval | null;
    onClose: () => void;
}

export const RecruiterApprovalModal: React.FC<RecruiterApprovalModalProps> = ({
    isOpen,
    approval,
    onClose
}) => {
    if (!isOpen || !approval) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Recruiter Application Details</h2>
                        <p className="text-sm text-slate-500 mt-1">Review company and recruiter information</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Company Logo & Basic Info */}
                    <div className="flex items-start gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200">
                        {approval.companyLogo ? (
                            <img
                                src={approval.companyLogo.startsWith('data:') ? approval.companyLogo : `data:image/png;base64,${approval.companyLogo}`}
                                alt="Company Logo"
                                className="w-24 h-24 rounded-xl object-contain bg-white border-2 border-slate-200 p-2"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <Building2 className="h-12 w-12 text-white" />
                            </div>
                        )}
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-slate-900">{approval.company}</h3>
                            <p className="text-slate-600 mt-1">{approval.name}</p>
                            <p className="text-sm text-slate-500 mt-1">{approval.jobTitle}</p>
                            <div className="flex items-center gap-2 mt-3">
                                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                                    Pending Review
                                </span>
                                {approval.onboardingComplete && (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
                                        Onboarding Complete
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Mail className="h-5 w-5 text-blue-600" />
                            Contact Information
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Mail className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Email</p>
                                    <p className="text-sm text-slate-900 font-medium">{approval.email}</p>
                                </div>
                            </div>
                            {approval.phone && (
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Phone className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Phone</p>
                                        <p className="text-sm text-slate-900 font-medium">{approval.phone}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Company Details */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-purple-600" />
                            Company Details
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            {approval.website && (
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Globe className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-slate-500 font-medium">Website</p>
                                        <a
                                            href={approval.website.startsWith('http') ? approval.website : `https://${approval.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:underline font-medium truncate block"
                                        >
                                            {approval.website}
                                        </a>
                                    </div>
                                </div>
                            )}
                            {approval.companySize && (
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <Building2 className="h-4 w-4 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Company Size</p>
                                        <p className="text-sm text-slate-900 font-medium">{approval.companySize}</p>
                                    </div>
                                </div>
                            )}
                            {approval.companyAddress && (
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 md:col-span-2">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <MapPin className="h-4 w-4 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Address</p>
                                        <p className="text-sm text-slate-900 font-medium">{approval.companyAddress}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Social Links */}
                    {(approval.facebook || approval.linkedin || approval.twitter || approval.instagram) && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-slate-900">Social Media</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {approval.facebook && (
                                    <a
                                        href={approval.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                                    >
                                        <Facebook className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm font-medium text-blue-900">Facebook</span>
                                    </a>
                                )}
                                {approval.linkedin && (
                                    <a
                                        href={approval.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                                    >
                                        <Linkedin className="h-4 w-4 text-blue-700" />
                                        <span className="text-sm font-medium text-blue-900">LinkedIn</span>
                                    </a>
                                )}
                                {approval.twitter && (
                                    <a
                                        href={approval.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-3 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors"
                                    >
                                        <Twitter className="h-4 w-4 text-sky-600" />
                                        <span className="text-sm font-medium text-sky-900">Twitter</span>
                                    </a>
                                )}
                                {approval.instagram && (
                                    <a
                                        href={approval.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-3 bg-pink-50 hover:bg-pink-100 rounded-lg border border-pink-200 transition-colors"
                                    >
                                        <Instagram className="h-4 w-4 text-pink-600" />
                                        <span className="text-sm font-medium text-pink-900">Instagram</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Company Images */}
                    {approval.companyImages && approval.companyImages.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <ImageIcon className="h-5 w-5 text-emerald-600" />
                                Company Images
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {approval.companyImages.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image.startsWith('data:') ? image : `data:image/png;base64,${image}`}
                                        alt={`Company ${index + 1}`}
                                        className="w-full h-40 object-cover rounded-lg border-2 border-slate-200"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Employment Proof */}
                    {approval.employmentProof && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-red-600" />
                                Employment Proof
                            </h4>
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-red-600" />
                                        <span className="text-sm font-medium text-slate-700">Employment Proof Document</span>
                                    </div>
                                    <Button
                                        onClick={() => {
                                            // Create a temporary link to download/view the document
                                            const link = document.createElement('a');
                                            link.href = approval.employmentProof!;
                                            link.target = '_blank';
                                            link.rel = 'noopener noreferrer';
                                            link.click();
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                                    >
                                        View Document
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Application Date */}
                    <div className="flex items-center gap-2 text-sm text-slate-500 pt-4 border-t border-slate-200">
                        <Calendar className="h-4 w-4" />
                        <span>
                            Applied on {
                                approval.applicationDate && !isNaN(new Date(approval.applicationDate).getTime())
                                    ? new Date(approval.applicationDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })
                                    : 'Date not available'
                            }
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end">
                    <Button onClick={onClose} className="bg-slate-900 hover:bg-slate-800 text-white">
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RecruiterApprovalModal;
