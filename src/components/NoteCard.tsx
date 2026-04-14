import { motion } from 'framer-motion';
import { Pin, Trash2, Edit3 } from 'lucide-react';
import { Note, categoryConfig } from '@/lib/notes';
import { formatDistanceToNow } from 'date-fns';

interface NoteCardProps {
  note: Note;
  viewMode: 'grid' | 'list';
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export function NoteCard({ note, viewMode, onEdit, onDelete, onTogglePin }: NoteCardProps) {
  const cat = categoryConfig[note.category];
  const isGrid = viewMode === 'grid';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`group relative bg-card rounded-lg border shadow-card hover:shadow-card-hover transition-shadow cursor-pointer ${
        isGrid ? 'p-5' : 'p-4 flex items-start gap-4'
      }`}
      onClick={() => onEdit(note)}
    >
      {/* Pin indicator */}
      {note.pinned && (
        <div className="absolute top-3 right-3">
          <Pin className="h-3.5 w-3.5 text-primary fill-primary" />
        </div>
      )}

      <div className={isGrid ? '' : 'flex-1 min-w-0'}>
        {/* Category badge */}
        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${cat.bgClass} ${cat.colorClass} mb-2`}>
          {cat.label}
        </span>

        <h3 className="font-display text-base font-semibold text-card-foreground truncate pr-6">
          {note.title}
        </h3>

        <p className={`text-sm text-muted-foreground mt-1.5 leading-relaxed ${
          isGrid ? 'line-clamp-3' : 'line-clamp-1'
        }`}>
          {note.content}
        </p>

        <p className="text-xs text-muted-foreground/60 mt-3">
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </p>
      </div>

      {/* Actions */}
      <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${
        isGrid ? 'absolute bottom-3 right-3' : ''
      }`}>
        <button
          onClick={(e) => { e.stopPropagation(); onTogglePin(note.id); }}
          className="p-1.5 rounded-md hover:bg-muted transition-colors"
          title={note.pinned ? 'Unpin' : 'Pin'}
        >
          <Pin className={`h-3.5 w-3.5 ${note.pinned ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(note); }}
          className="p-1.5 rounded-md hover:bg-muted transition-colors"
        >
          <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
          className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5 text-destructive" />
        </button>
      </div>
    </motion.div>
  );
}
