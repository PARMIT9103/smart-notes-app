import { useState, useCallback, useMemo } from 'react';
import { Note, Category, loadNotes, saveNotes, createNote } from '@/lib/notes';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const persist = useCallback((updated: Note[]) => {
    setNotes(updated);
    saveNotes(updated);
  }, []);

  const addNote = useCallback((partial: Partial<Note>) => {
    const note = createNote(partial);
    persist([note, ...notes]);
    return note;
  }, [notes, persist]);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    persist(notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n));
  }, [notes, persist]);

  const deleteNote = useCallback((id: string) => {
    persist(notes.filter(n => n.id !== id));
  }, [notes, persist]);

  const togglePin = useCallback((id: string) => {
    persist(notes.map(n => n.id === id ? { ...n, pinned: !n.pinned, updatedAt: new Date().toISOString() } : n));
  }, [notes, persist]);

  const filtered = useMemo(() => {
    let result = notes;
    if (activeCategory !== 'all') {
      result = result.filter(n => n.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
    }
    // pinned first, then by updatedAt
    return result.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [notes, search, activeCategory]);

  return {
    notes: filtered,
    totalCount: notes.length,
    search, setSearch,
    activeCategory, setActiveCategory,
    viewMode, setViewMode,
    addNote, updateNote, deleteNote, togglePin,
  };
}
