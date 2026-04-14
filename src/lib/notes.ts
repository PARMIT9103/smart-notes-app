export type Category = 'work' | 'personal' | 'ideas' | 'tasks';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: Category;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'smart-notes-data';

const sampleNotes: Note[] = [
  {
    id: '1',
    title: 'Welcome to Smart Notes',
    content: 'This is your new smart notes app. Create, organize, and find your notes with ease. Try pinning this note or adding a new one!',
    category: 'personal',
    pinned: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Project Roadmap Q2',
    content: 'Focus areas:\n• Redesign dashboard UI\n• Implement search & filtering\n• Performance optimizations\n• User feedback integration',
    category: 'work',
    pinned: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'App idea: Habit Tracker',
    content: 'A minimalist habit tracker with streaks, gentle reminders, and weekly insights. Could integrate with calendar apps.',
    category: 'ideas',
    pinned: false,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    title: 'Grocery List',
    content: '• Avocados\n• Sourdough bread\n• Olive oil\n• Fresh basil\n• Parmesan\n• Cherry tomatoes',
    category: 'tasks',
    pinned: false,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

export function loadNotes(): Note[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  saveNotes(sampleNotes);
  return sampleNotes;
}

export function saveNotes(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function createNote(partial: Partial<Note>): Note {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: partial.title || 'Untitled',
    content: partial.content || '',
    category: partial.category || 'personal',
    pinned: partial.pinned || false,
    createdAt: now,
    updatedAt: now,
  };
}

export const categoryConfig: Record<Category, { label: string; colorClass: string; bgClass: string }> = {
  work: { label: 'Work', colorClass: 'text-category-work', bgClass: 'bg-category-work/10' },
  personal: { label: 'Personal', colorClass: 'text-category-personal', bgClass: 'bg-category-personal/10' },
  ideas: { label: 'Ideas', colorClass: 'text-category-ideas', bgClass: 'bg-category-ideas/10' },
  tasks: { label: 'Tasks', colorClass: 'text-category-tasks', bgClass: 'bg-category-tasks/10' },
};
