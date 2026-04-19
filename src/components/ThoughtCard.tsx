import React from 'react';
import { format } from 'date-fns';
import { Thought } from '../types';
import { motion } from 'motion/react';
import { Lightbulb, Trash2, Archive } from 'lucide-react';

interface ThoughtCardProps {
  thought: Thought;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  variant?: 'default' | 'compact';
}

const ThoughtCard: React.FC<ThoughtCardProps> = ({ thought, onArchive, onDelete, variant = 'default' }) => {
  const date = new Date(thought.createdAt);
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-black/5 shadow-xl ${variant === 'compact' ? 'p-6' : 'p-10'}`}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Header like the screenshot */}
        <div className="w-full flex flex-col items-center border-b border-black/5 pb-4 mb-4">
          <div className="bg-sprout/10 px-4 py-1 rounded-full mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-sprout" />
            <Lightbulb className="w-4 h-4 text-sprout" />
            <Lightbulb className="w-4 h-4 text-sprout" />
          </div>
          <div className="font-serif text-ink/60 text-sm">
            {format(date, 'MMM.dd/yyyy')}
          </div>
          <div className="font-serif text-ink/30 text-xs italic">
            {format(date, 'eee.')}
          </div>
        </div>

        {/* Content */}
        <div className={`font-display text-ink leading-relaxed ${variant === 'compact' ? 'text-lg' : 'text-2xl'}`}>
          {thought.content}
        </div>

        {/* Footer / Actions */}
        <div className="w-full pt-4 mt-4 border-t border-black/5 flex justify-between items-center text-[10px] uppercase tracking-widest text-ink/20">
          <span>灵感</span>
          <div className="flex gap-4">
            {onArchive && (
              <button 
                onClick={() => onArchive(thought.id)}
                className="hover:text-sprout transition-colors cursor-pointer text-ink/40"
              >
                <Archive className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button 
                onClick={() => onDelete(thought.id)}
                className="hover:text-petal transition-colors cursor-pointer text-ink/40"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <span>类型</span>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-petal/10" />
      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-sprout/10" />
    </motion.div>
  );
};

export default ThoughtCard;
