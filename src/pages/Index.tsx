import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Search, LayoutGrid, List, StickyNote } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';
import { NoteCard } from '@/components/NoteCard';
import { NoteEditor } from '@/components/NoteEditor';
import { Note, Category, categoryConfig } from '@/lib/notes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const categories: { key: Category | 'all'; label: string }[] = [
  { key: 'all', label: 'All Notes' },
  { key: 'work', label: 'Work' },
  { key: 'personal', label: 'Personal' },
  { key: 'ideas', label: 'Ideas' },
  { key: 'tasks', label: 'Tasks' },
];

export default function Index() {
  const {
    notes, totalCount, search, setSearch,
    activeCategory, setActiveCategory,
    viewMode, setViewMode,
    addNote, updateNote, deleteNote, togglePin,
  } = useNotes();

  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const openNew = () => {
    setEditingNote(null);
    setIsNew(true);
    setIsEditorOpen(true);
  };

  const openEdit = (note: Note) => {
    setEditingNote(note);
    setIsNew(false);
    setIsEditorOpen(true);
  };

  const handleSave = (data: { title: string; content: string; category: Category }) => {
    if (isNew) {
      addNote(data);
    } else if (editingNote) {
      updateNote(editingNote.id, data);
    }
    setIsEditorOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                <StickyNote className="h-4.5 w-4.5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold leading-tight">Smart Notes</h1>
                <p className="text-xs text-muted-foreground">{totalCount} notes</p>
              </div>
            </div>

            <Button onClick={openNew} size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Note</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Search & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="pl-9 bg-card"
            />
          </div>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-card shadow-sm' : 'hover:bg-card/50'}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-card shadow-sm' : 'hover:bg-card/50'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {categories.map(({ key, label }) => {
            const isActive = activeCategory === key;
            const catCfg = key !== 'all' ? categoryConfig[key] : null;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`whitespace-nowrap text-sm px-3.5 py-1.5 rounded-full transition-all ${
                  isActive
                    ? catCfg
                      ? `${catCfg.bgClass} ${catCfg.colorClass} font-medium`
                      : 'bg-primary text-primary-foreground font-medium'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Notes Grid/List */}
        {notes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <StickyNote className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No notes found</p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              {search ? 'Try a different search term' : 'Create your first note to get started'}
            </p>
          </motion.div>
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'flex flex-col gap-3'
          }>
            <AnimatePresence mode="popLayout">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  viewMode={viewMode}
                  onEdit={openEdit}
                  onDelete={deleteNote}
                  onTogglePin={togglePin}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Editor Modal */}
      {isEditorOpen && (
        <NoteEditor
          note={editingNote}
          isNew={isNew}
          onSave={handleSave}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </div>
  );
}
