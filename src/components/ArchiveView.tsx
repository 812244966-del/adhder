import { useState } from 'react';
import { format } from 'date-fns';
import { Thought } from '../types';
import ThoughtCard from './ThoughtCard';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X } from 'lucide-react';

interface ArchiveViewProps {
  thoughts: Thought[];
  onDelete: (id: string) => void;
}

export default function ArchiveView({ thoughts, onDelete }: ArchiveViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredThoughts = thoughts.filter(thought => 
    thought.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group thoughts by Month/Year
  const grouped = filteredThoughts.reduce((acc, thought) => {
    const key = format(new Date(thought.createdAt), 'yyyy年MM月');
    if (!acc[key]) acc[key] = [];
    acc[key].push(thought);
    return acc;
  }, {} as Record<string, Thought[]>);

  const months = Object.keys(grouped).sort((a, b) => {
    // Sort by date descending
    const dateA = new Date(grouped[a][0].createdAt);
    const dateB = new Date(grouped[b][0].createdAt);
    return dateB.getTime() - dateA.getTime();
  });

  if (thoughts.length === 0) {
    return (
      <div className="text-center py-20 text-earth/40 font-serif italic">
        你的收集箱是空的。
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-8">
      {/* Search Bar */}
      <div className="relative max-w-md mx-auto mb-12">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/30 group-focus-within:text-sprout transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索你的思绪..."
            className="w-full pl-12 pr-12 py-3 bg-white/60 backdrop-blur-md rounded-2xl border border-black/5 focus:border-sprout/50 outline-none transition-all font-serif text-lg placeholder:text-ink/10 text-ink shadow-xl"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-black/5 rounded-full text-ink/30 hover:text-ink transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {months.length > 0 ? (
          months.map((month) => (
            <motion.section 
              key={month} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <h2 className="font-display text-2xl text-ink">{month}</h2>
                <div className="flex-1 h-px bg-black/5" />
                <span className="text-xs font-serif italic text-ink/40">
                  {grouped[month].length} 条思绪
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {grouped[month].map((thought) => (
                  <ThoughtCard 
                    key={thought.id} 
                    thought={thought} 
                    variant="compact"
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </motion.section>
          ))
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-earth/40 font-serif italic"
          >
            没有找到匹配的思绪。
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
