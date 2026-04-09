import { format } from 'date-fns';
import { Thought } from '../types';
import ThoughtCard from './ThoughtCard';
import { motion } from 'motion/react';

interface ArchiveViewProps {
  thoughts: Thought[];
  onDelete: (id: string) => void;
}

export default function ArchiveView({ thoughts, onDelete }: ArchiveViewProps) {
  // Group thoughts by Month/Year
  const grouped = thoughts.reduce((acc, thought) => {
    const key = format(new Date(thought.createdAt), 'MMMM yyyy');
    if (!acc[key]) acc[key] = [];
    acc[key].push(thought);
    return acc;
  }, {} as Record<string, Thought[]>);

  const months = Object.keys(grouped).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  if (thoughts.length === 0) {
    return (
      <div className="text-center py-20 text-earth/40 font-serif italic">
        Your long-term box is empty.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-12">
      {months.map((month) => (
        <section key={month} className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-2xl text-earth">{month}</h2>
            <div className="flex-1 h-px bg-earth/10" />
            <span className="text-xs font-serif italic text-earth/40">
              {grouped[month].length} thoughts
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
        </section>
      ))}
    </div>
  );
}
