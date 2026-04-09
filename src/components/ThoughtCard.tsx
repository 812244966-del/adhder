import React from 'react';
import { format } from 'date-fns';
import { Thought } from '../types';
import { motion } from 'motion/react';
import { Flower, Trash2, Archive } from 'lucide-react';

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
      className={`scrapbook-card rounded-lg overflow-hidden ${variant === 'compact' ? 'p-4' : 'p-8'}`}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Header like the screenshot */}
        <div className="w-full flex flex-col items-center border-b border-earth/20 pb-4 mb-4">
          <div className="bg-sprout/20 px-4 py-1 rounded-full mb-2 flex items-center gap-2">
            <Flower className="w-4 h-4 text-sprout" />
            <Flower className="w-4 h-4 text-sprout" />
            <Flower className="w-4 h-4 text-sprout" />
          </div>
          <div className="font-serif text-earth text-sm">
            {format(date, 'MMM.dd/yyyy')}
          </div>
          <div className="font-serif text-earth/60 text-xs italic">
            {format(date, 'eee.')}
          </div>
        </div>

        {/* Content */}
        <div className={`font-display text-ink leading-relaxed ${variant === 'compact' ? 'text-lg' : 'text-2xl'}`}>
          {thought.content}
        </div>

        {/* Footer / Actions */}
        <div className="w-full pt-4 mt-4 border-t border-earth/10 flex justify-between items-center text-[10px] uppercase tracking-widest text-earth/40">
          <span>TINY</span>
          <div className="flex gap-4">
            {onArchive && (
              <button 
                onClick={() => onArchive(thought.id)}
                className="hover:text-sprout transition-colors cursor-pointer"
              >
                <Archive className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button 
                onClick={() => onDelete(thought.id)}
                className="hover:text-petal transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <span>TYPE</span>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-petal/30" />
      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-sprout/30" />
    </motion.div>
  );
};

export default ThoughtCard;
