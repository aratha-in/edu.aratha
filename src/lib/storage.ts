'use client';

import { Resource, UserProfile, UserBookmark, ResearchProject, ReadingStatus, ProjectNote, LearningPath } from '@/types';
import { SEED_RESOURCES, SEED_LEARNING_PATHS } from './data/seedData';

const STORAGE_KEYS = {
  RESOURCES: 'edu_aratha_resources_v1',
  USER: 'edu_aratha_user_v1',
  BOOKMARKS: 'edu_aratha_bookmarks_v1',
  PROJECTS: 'edu_aratha_projects_v1',
  LEARNING_PROGRESS: 'edu_aratha_learning_progress_v1',
  USER_SUBMISSIONS: 'edu_aratha_submissions_v1'
};

const DEFAULT_USER: UserProfile = {
  id: 'usr-demo-01',
  name: 'Ananya Sharma',
  email: 'ananya.sharma@iitd.ac.in',
  institution: 'IIT Delhi / Independent Scholar',
  role: 'researcher',
  bio: 'Doctoral researcher focusing on computational sustainability, open science, and educational equity.',
  joinedAt: '2026-08-15'
};

// Safe localStorage helper
function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

// Resource operations
export function getStoredResources(): Resource[] {
  const custom = safeGet<Resource[]>(STORAGE_KEYS.RESOURCES, []);
  if (!custom || custom.length === 0) {
    return SEED_RESOURCES;
  }
  return custom;
}

export function getResourceById(id: string): Resource | undefined {
  const all = getStoredResources();
  return all.find(r => r.id === id || r.slug === id);
}

export function saveResource(resource: Resource): void {
  const current = getStoredResources();
  const index = current.findIndex(r => r.id === resource.id);
  let updated: Resource[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = resource;
  } else {
    updated = [resource, ...current];
  }
  safeSet(STORAGE_KEYS.RESOURCES, updated);
}

export function updateResourceStatus(id: string, status: Resource['verificationStatus']): void {
  const current = getStoredResources();
  const updated = current.map(r => {
    if (r.id === id) {
      return {
        ...r,
        verificationStatus: status,
        lastVerifiedAt: new Date().toISOString().split('T')[0]
      };
    }
    return r;
  });
  safeSet(STORAGE_KEYS.RESOURCES, updated);
}

export function deleteResource(id: string): void {
  const current = getStoredResources();
  const updated = current.filter(r => r.id !== id);
  safeSet(STORAGE_KEYS.RESOURCES, updated);
}

// User / Auth operations
export function getCurrentUser(): UserProfile | null {
  return safeGet<UserProfile | null>(STORAGE_KEYS.USER, DEFAULT_USER);
}

export function setCurrentUser(user: UserProfile | null): void {
  safeSet(STORAGE_KEYS.USER, user);
}

export function logoutUser(): void {
  safeSet(STORAGE_KEYS.USER, null);
}

// Bookmarks / Reading Lists
export function getUserBookmarks(): UserBookmark[] {
  return safeGet<UserBookmark[]>(STORAGE_KEYS.BOOKMARKS, [
    {
      resourceId: 'course-swayam-ds-python',
      status: 'Reading',
      savedAt: '2026-10-09',
      notes: 'Currently working through week 2 NumPy arrays.'
    },
    {
      resourceId: 'paper-attention-all-you-need',
      status: 'Reviewed',
      savedAt: '2026-10-08',
      notes: 'Key reference for literature review on transformer networks.'
    },
    {
      resourceId: 'dataset-data-gov-in',
      status: 'To Read',
      savedAt: '2026-10-10',
      notes: 'Extract renewable energy district consumption data.'
    }
  ]);
}

export function toggleUserBookmark(resourceId: string, status: ReadingStatus = 'To Read'): boolean {
  const bookmarks = getUserBookmarks();
  const existingIdx = bookmarks.findIndex(b => b.resourceId === resourceId);
  let updated: UserBookmark[];
  let isAdded = false;

  if (existingIdx >= 0) {
    updated = bookmarks.filter(b => b.resourceId !== resourceId);
    isAdded = false;
  } else {
    updated = [
      ...bookmarks,
      {
        resourceId,
        status,
        savedAt: new Date().toISOString().split('T')[0]
      }
    ];
    isAdded = true;
  }
  safeSet(STORAGE_KEYS.BOOKMARKS, updated);
  return isAdded;
}

export function updateBookmarkStatus(resourceId: string, status: ReadingStatus, notes?: string): void {
  const bookmarks = getUserBookmarks();
  const updated = bookmarks.map(b => {
    if (b.resourceId === resourceId) {
      return {
        ...b,
        status,
        ...(notes !== undefined ? { notes } : {})
      };
    }
    return b;
  });
  safeSet(STORAGE_KEYS.BOOKMARKS, updated);
}

export function isResourceBookmarked(resourceId: string): boolean {
  const bookmarks = getUserBookmarks();
  return bookmarks.some(b => b.resourceId === resourceId);
}

// Research Projects
export function getResearchProjects(): ResearchProject[] {
  const defaultProjects: ResearchProject[] = [
    {
      id: 'proj-01',
      userId: 'usr-demo-01',
      title: 'Solar Microgrids & Rural Electrification in India',
      description: 'Systematic literature review and empirical policy evaluation of decentralized solar photovoltaics in semi-arid Indian districts.',
      topic: 'Renewable Energy & Policy',
      researchQuestions: [
        'What are the primary techno-economic bottlenecks in village mini-grid maintenance?',
        'How do state-level agricultural electricity subsidies interact with solar adoption?'
      ],
      savedResourceIds: ['thesis-shodhganga-renewable-energy', 'dataset-data-gov-in', 'paper-ias-quantum-hall-india'],
      notes: [
        {
          id: 'note-01',
          title: 'Methodology Outline',
          content: 'Utilize Shodhganga methodologies for tariff calculation combined with data.gov.in district energy consumption reports.',
          createdAt: '2026-10-08',
          updatedAt: '2026-10-09'
        }
      ],
      tags: ['Solar Energy', 'Public Policy', 'Shodhganga', 'India'],
      status: 'In Progress',
      createdAt: '2026-09-12',
      updatedAt: '2026-10-10'
    },
    {
      id: 'proj-02',
      userId: 'usr-demo-01',
      title: 'Attention Architectures in Low-Resource Indian Languages',
      description: 'Investigating transformer model efficiency and tokenization for Hindi, Tamil, and Bengali datasets.',
      topic: 'Natural Language Processing',
      researchQuestions: [
        'Can sub-word vocabulary compaction reduce compute overhead for Indic scripts?'
      ],
      savedResourceIds: ['paper-attention-all-you-need', 'course-swayam-ds-python', 'tool-zotero'],
      notes: [
        {
          id: 'note-02',
          title: 'Paper references',
          content: 'Vaswani et al. 2017 transformer self-attention formula needs testing with IndicNLP tokenizer.',
          createdAt: '2026-10-05',
          updatedAt: '2026-10-06'
        }
      ],
      tags: ['NLP', 'Transformers', 'Deep Learning', 'Indic Languages'],
      status: 'Planning',
      createdAt: '2026-10-01',
      updatedAt: '2026-10-06'
    }
  ];

  return safeGet<ResearchProject[]>(STORAGE_KEYS.PROJECTS, defaultProjects);
}

export function saveResearchProject(project: ResearchProject): void {
  const projects = getResearchProjects();
  const idx = projects.findIndex(p => p.id === project.id);
  let updated: ResearchProject[];
  if (idx >= 0) {
    updated = [...projects];
    updated[idx] = { ...project, updatedAt: new Date().toISOString().split('T')[0] };
  } else {
    updated = [{ ...project, createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0] }, ...projects];
  }
  safeSet(STORAGE_KEYS.PROJECTS, updated);
}

export function deleteResearchProject(projectId: string): void {
  const projects = getResearchProjects();
  const updated = projects.filter(p => p.id !== projectId);
  safeSet(STORAGE_KEYS.PROJECTS, updated);
}

// Learning Progress
export function getLearningProgress(): Record<string, string[]> {
  // Map of pathId -> completed item ids
  return safeGet<Record<string, string[]>>(STORAGE_KEYS.LEARNING_PROGRESS, {
    'path-data-analytics-free': ['item-1']
  });
}

export function togglePathItemCompletion(pathId: string, itemId: string): void {
  const progress = getLearningProgress();
  const current = progress[pathId] || [];
  const exists = current.includes(itemId);
  const updated = exists ? current.filter(id => id !== itemId) : [...current, itemId];
  progress[pathId] = updated;
  safeSet(STORAGE_KEYS.LEARNING_PROGRESS, progress);
}

// User Data Export (GDPR / academic compliance)
export function exportAllUserData(): string {
  const data = {
    user: getCurrentUser(),
    bookmarks: getUserBookmarks(),
    projects: getResearchProjects(),
    learningProgress: getLearningProgress(),
    exportedAt: new Date().toISOString(),
    platform: 'Edu.aratha - Global Free Education & Research'
  };
  return JSON.stringify(data, null, 2);
}

// Admin Real Statistics
export function getRealMetrics() {
  const resources = getStoredResources();
  const projects = getResearchProjects();
  const bookmarks = getUserBookmarks();

  const total = resources.length;
  const verified = resources.filter(r => r.verificationStatus === 'Verified').length;
  const courses = resources.filter(r => r.resourceType === 'course').length;
  const papers = resources.filter(r => r.resourceType === 'paper').length;
  const books = resources.filter(r => r.resourceType === 'book').length;
  const theses = resources.filter(r => r.resourceType === 'thesis').length;
  const datasets = resources.filter(r => r.resourceType === 'dataset').length;
  const tools = resources.filter(r => r.resourceType === 'tool').length;
  const indianFocusCount = resources.filter(r => r.indiaFocus).length;

  return {
    totalResources: total,
    verifiedResources: verified,
    coursesCount: courses,
    papersCount: papers,
    booksCount: books,
    thesesCount: theses,
    datasetsCount: datasets,
    toolsCount: tools,
    indianFocusCount,
    userProjectsCount: projects.length,
    bookmarksCount: bookmarks.length
  };
}
