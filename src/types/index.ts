export type ResourceType =
  | 'course'
  | 'paper'
  | 'book'
  | 'journal'
  | 'thesis'
  | 'dataset'
  | 'tool';

export type AccessType =
  | 'Completely Free'
  | 'Free to Audit'
  | 'Free Learning Materials'
  | 'Paid Certificate'
  | 'Financial Assistance Available'
  | 'Open Access'
  | 'Freemium';

export type VerificationStatus =
  | 'Verified'
  | 'Pending'
  | 'Needs Review'
  | 'Archived';

export interface Resource {
  id: string;
  title: string;
  slug: string;
  description: string;
  resourceType: ResourceType;
  subject: string;
  provider: string;
  officialUrl: string;
  accessType: AccessType;
  language: string;
  licence?: string;
  verificationStatus: VerificationStatus;
  lastVerifiedAt: string;
  isFeatured?: boolean;
  tags: string[];
  indiaFocus?: boolean;
  metrics?: {
    views?: number;
    saves?: number;
  };

  // Course-specific fields
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration?: string;
  learningFormat?: string;
  skillsCovered?: string[];
  prerequisites?: string;
  certificateAvailable?: boolean;
  certificatePrice?: string;

  // Research paper / Thesis / Publication fields
  authors?: string[];
  publicationYear?: number;
  journalOrRepository?: string;
  doi?: string;
  publicationType?:
    | 'Journal Article'
    | 'Conference Paper'
    | 'Preprint'
    | 'Literature Review'
    | 'Meta-Analysis'
    | 'Thesis'
    | 'Research Report';
  openAccessStatus?: 'Gold OA' | 'Green OA' | 'Bronze OA' | 'Hybrid' | 'Preprint';
  isPeerReviewed?: boolean;
  pdfUrl?: string;
  abstract?: string;

  // Book & Dataset fields
  bookFormat?: string;
  geographicalCoverage?: string;
  datasetFormat?: string;
  dateRange?: string;
  downloadUrl?: string;

  // Research Tool fields
  toolCategory?: string;
  freeTierLimitations?: string;
  supportedPlatforms?: string[];
}

export interface LearningPathItem {
  id: string;
  order: number;
  resourceId?: string;
  title: string;
  type: string;
  provider: string;
  url: string;
  notes?: string;
  estimatedMinutes?: number;
}

export interface LearningPath {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  items: LearningPathItem[];
  outcomes: string[];
  indiaFocus?: boolean;
  enrolledUsersCount?: number;
}

export interface ProjectNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchProject {
  id: string;
  userId: string;
  title: string;
  description: string;
  topic: string;
  researchQuestions: string[];
  savedResourceIds: string[];
  notes: ProjectNote[];
  tags: string[];
  status: 'Planning' | 'In Progress' | 'Review' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

export type ReadingStatus = 'To Read' | 'Reading' | 'Reviewed' | 'Completed';

export interface UserBookmark {
  resourceId: string;
  status: ReadingStatus;
  savedAt: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  institution?: string;
  role: 'user' | 'admin' | 'researcher';
  bio?: string;
  avatarUrl?: string;
  joinedAt: string;
  emailVerified?: boolean;
}

export type CitationStyle =
  | 'apa'
  | 'mla'
  | 'harvard'
  | 'chicago'
  | 'ieee'
  | 'vancouver';

export interface CitationInput {
  style: CitationStyle;
  itemType: 'journal' | 'book' | 'website' | 'thesis' | 'conference' | 'dataset';
  title: string;
  authors: string[];
  year: string;
  sourceTitle: string; // Journal or Publisher or Website
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
  city?: string;
  doi?: string;
  url?: string;
  accessedDate?: string;
}
