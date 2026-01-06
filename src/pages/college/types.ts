import { LucideIcon } from 'lucide-react';

export interface Student {
  _id: string;
  fullName: string;
  email: string;
  profile: {
    phone?: string;
    location?: {
      city?: string;
      state?: string;
      country?: string;
    } | string; // Handle both object and string cases
    dateOfBirth?: string;
    gender?: string;
    headline?: string;
    professionalSummary?: string;
    profilePhoto?: string;
    skills?: (string | { name: string; isVerified?: boolean })[];
    experience?: Experience[];
    education?: Education[];
    projects?: Project[];
    certifications?: Certification[];
    socialProfiles?: SocialProfiles;
    codingProfiles?: CodingProfiles;
    documents?: {
      resume?: string | any;
      portfolioUrl?: string;
    };
  };
  skillPassport?: {
    badgeId?: string;
    level?: string;
    score?: number;
    verifiedSkills?: string[];
  };
  isVerified?: boolean;
  createdAt: string;
}

export interface Experience {
  id?: string;
  jobTitle: string;
  companyName: string;
  employmentType: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrentlyWorking: boolean;
  description?: string;
}

export interface Education {
  id?: string;
  degreeName: string;
  institution: string;
  specialization?: string;
  startYear: number;
  endYear?: number;
  score?: string;
  grade?: string;
}

export interface Project {
  title: string;
  description: string;
  techStack?: string[];
  role?: string;
  startDate?: string;
  endDate?: string;
  githubLink?: string;
  demoLink?: string;
  isLive?: boolean;
}

export interface Certification {
  certificateName: string;
  issuingOrganization: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  isVerified?: boolean;
}

export interface SocialProfiles {
  linkedin?: string;
  github?: string;
  website?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

export interface CodingProfiles {
  leetcode?: string;
  geeksforgeeks?: string;
  hackerrank?: string;
  codechef?: string;
  codeforces?: string;
  atcoder?: string;
}

export interface CollegeProfile {
  _id: string;
  name: string;
  email: string;
  contactNumber?: string;
  address?: {
    city?: string;
    country?: string;
  };
  website?: string;
  description?: string;
  logo?: string;
  isVerified: boolean;
  verificationStatus: string;
  students: Student[];
}

export interface NewStudent {
  fullName: string;
  email: string;
  password: string;
}

export interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
  count: number | null;
  path: string;
}
