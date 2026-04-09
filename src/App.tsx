/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, ReactNode } from 'react';
import { Thought } from './types';
import { storage } from './lib/storage';
import ThoughtInput from './components/ThoughtInput';
import ThoughtCard from './components/ThoughtCard';
import SortStack from './components/SortStack';
import ArchiveView from './components/ArchiveView';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, LayoutGrid, Layers, Trash2 } from 'lucide-react';

type View = 'input' | 'sort' | 'archive' | 'trash';

export default function App() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [view, setView] = useState<View>('input');

  useEffect(() => {
    setThoughts(storage.getThoughts());
  }, []);

  const handleSave = (content: string) => {
    const newThought = storage.addThought(content);
    setThoughts([newThought, ...thoughts]);
    // Optional: show a success state or just stay on input
  };

  const handleAction = (id: string, status: 'archived' | 'trash') => {
    storage.updateThought(id, { status });
    setThoughts(storage.getThoughts());
  };

  const handleDelete = (id: string) => {
    storage.deleteThought(id);
    setThoughts(storage.getThoughts());
  };

  const activeThoughts = thoughts.filter(t => t.status === 'active');
  const archivedThoughts = thoughts.filter(t => t.status === 'archived');
  const trashThoughts = thoughts.filter(t => t.status === 'trash');

  return (
    <div className="min-h-screen paper-texture flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sprout rounded-full flex items-center justify-center text-white font-display text-xl">
            M
          </div>
          <h1 className="font-display text-2xl tracking-tight text-earth">MindSprout</h1>
        </div>
        
        <div className="flex gap-2 bg-white/50 backdrop-blur-sm p-1 rounded-full border border-earth/10">
          <NavButton 
            active={view === 'input'} 
            onClick={() => setView('input')} 
            icon={<Plus className="w-5 h-5" />} 
            label="Capture" 
          />
          <NavButton 
            active={view === 'sort'} 
            onClick={() => setView('sort')} 
            icon={<Layers className="w-5 h-5" />} 
            label="Organize" 
            count={activeThoughts.length}
          />
          <NavButton 
            active={view === 'archive'} 
            onClick={() => setView('archive')} 
            icon={<LayoutGrid className="w-5 h-5" />} 
            label="Archive" 
          />
          <NavButton 
            active={view === 'trash'} 
            onClick={() => setView('trash')} 
            icon={<Trash2 className="w-5 h-5" />} 
            label="Trash" 
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12">
        <AnimatePresence mode="wait">
          {view === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <ThoughtInput onSave={handleSave} />
              
              {/* Recent thoughts preview */}
              <div className="max-w-4xl mx-auto px-4">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="font-serif italic text-earth/60">Recently captured</h2>
                  <div className="flex-1 h-px bg-earth/10" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeThoughts.slice(0, 4).map(thought => (
                    <ThoughtCard 
                      key={thought.id} 
                      thought={thought} 
                      variant="compact"
                      onArchive={(id) => handleAction(id, 'archived')}
                      onDelete={(id) => handleAction(id, 'trash')}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'sort' && (
            <motion.div
              key="sort"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <SortStack 
                thoughts={activeThoughts} 
                onAction={handleAction}
                onComplete={() => setView('archive')}
              />
            </motion.div>
          )}

          {view === 'archive' && (
            <motion.div
              key="archive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ArchiveView 
                thoughts={archivedThoughts} 
                onDelete={(id) => handleAction(id, 'trash')}
              />
            </motion.div>
          )}

          {view === 'trash' && (
            <motion.div
              key="trash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ArchiveView 
                thoughts={trashThoughts} 
                onDelete={handleDelete}
              />
              {trashThoughts.length > 0 && (
                <div className="text-center mt-12">
                  <button 
                    onClick={() => {
                      trashThoughts.forEach(t => handleDelete(t.id));
                    }}
                    className="text-petal hover:underline font-serif italic"
                  >
                    Empty trash forever
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Decoration */}
      <footer className="p-8 text-center text-earth/20 font-serif text-sm italic">
        MindSprout — Nurturing your scattered brilliance.
      </footer>
    </div>
  );
}

function NavButton({ active, onClick, icon, label, count }: { 
  active: boolean; 
  onClick: () => void; 
  icon: ReactNode; 
  label: string;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
        active 
          ? 'bg-earth text-white shadow-sm' 
          : 'text-earth/60 hover:bg-earth/5'
      }`}
    >
      {icon}
      <span className="text-sm font-medium hidden sm:inline">{label}</span>
      {count !== undefined && count > 0 && (
        <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
          active ? 'bg-petal text-white' : 'bg-earth/20 text-earth'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

