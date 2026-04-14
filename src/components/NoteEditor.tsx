import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { Note, Category, categoryConfig } from '@/lib/notes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NoteEditorProps {
  note: Note | null;
  isNew: boolean;
  onSave: (data: { title: string; content: string; category: Category }) => void;
  onClose: () => void;
}

export function NoteEditor({ note, isNew, onSave, onClose }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('personal');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category);
    } else {
      setTitle('');
      setContent('');
      setCategory('personal');
    }
  }, [note]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    onSave({ title: title.trim() || 'Untitled', content, category });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-card rounded-xl shadow-float w-full max-w-lg border"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="font-display text-lg font-semibold">
              {isNew ? 'New Note' : 'Edit Note'}
            </h2>
            <button onClick={onClose} className="p-1 rounded-md hover:bg-muted transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            <Input
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-display font-semibold border-none bg-transparent px-0 focus-visible:ring-0 placeholder:text-muted-foreground/40"
              autoFocus
            />

            <textarea
              placeholder="Start writing..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full resize-none bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/40 focus:outline-none font-body"
            />

            {/* Category selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground mr-1">Category:</span>
              {(Object.keys(categoryConfig) as Category[]).map((cat) => {
                const cfg = categoryConfig[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`text-xs px-2.5 py-1 rounded-full transition-all ${
                      category === cat
                        ? `${cfg.bgClass} ${cfg.colorClass} ring-1 ring-current`
                        : 'bg-muted text-muted-foreground hover:bg-secondary'
                    }`}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 px-5 py-4 border-t">
            <Button variant="ghost" onClick={onClose} size="sm">
              Cancel
            </Button>
            <Button onClick={handleSave} size="sm" className="gap-1.5">
              <Save className="h-3.5 w-3.5" />
              {isNew ? 'Create' : 'Save'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
