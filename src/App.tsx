/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, ReactNode } from 'react';
import { Thought, DailyPlayback } from './types';
import { storage } from './lib/storage';
import { geminiService } from './lib/geminiService';
import ThoughtInput from './components/ThoughtInput';
import ThoughtCard from './components/ThoughtCard';
import SortStack from './components/SortStack';
import ArchiveView from './components/ArchiveView';
import PlaybackView from './components/PlaybackView';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, LayoutGrid, Layers, Trash2, Sparkles, Menu } from 'lucide-react';

type View = 'input' | 'sort' | 'archive' | 'trash' | 'playback';

export default function App() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [view, setView] = useState<View>('input');
  const [playback, setPlayback] = useState<DailyPlayback | null>(null);
  const [isPlaybackLoading, setIsPlaybackLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const loadThoughts = () => {
      const loaded = storage.getThoughts();
      setThoughts(loaded);
    };

    loadThoughts();

    // Sync across tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'mindsprout_thoughts') {
        loadThoughts();
      }
    });

    return () => {
      window.removeEventListener('storage', loadThoughts);
    };
  }, []);

  const handleSave = (content: string) => {
    storage.addThought(content);
    setThoughts(storage.getThoughts());
  };

  const handleAction = (id: string, status: 'archived' | 'trash') => {
    storage.updateThought(id, { status });
    setThoughts(storage.getThoughts());
  };

  const handleDelete = (id: string) => {
    storage.deleteThought(id);
    setThoughts(storage.getThoughts());
  };

  const generatePlayback = async () => {
    setView('playback');
    setIsSidebarOpen(false);
    setIsPlaybackLoading(true);
    const today = new Date().setHours(0, 0, 0, 0);
    const todayThoughts = thoughts.filter(t => new Date(t.createdAt).setHours(0, 0, 0, 0) === today);
    const result = await geminiService.generateDailyPlayback(todayThoughts);
    setPlayback(result);
    setIsPlaybackLoading(false);
  };

  const activeThoughts = thoughts.filter(t => t.status === 'active');
  const archivedThoughts = thoughts.filter(t => t.status === 'archived');
  const trashThoughts = thoughts.filter(t => t.status === 'trash');

  const navigateTo = (newView: View) => {
    setView(newView);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen paper-texture flex flex-col relative overflow-x-hidden">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-earth/20 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isSidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 p-8 flex flex-col"
      >
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-sprout rounded-xl flex items-center justify-center text-white font-display text-2xl shadow-sm">
            M
          </div>
          <h1 className="font-display text-2xl tracking-tight text-earth">MindSprout</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem 
            active={view === 'input'} 
            onClick={() => navigateTo('input')} 
            icon={<Plus className="w-5 h-5" />} 
            label="灵感" 
          />
          <SidebarItem 
            active={view === 'playback'} 
            onClick={generatePlayback} 
            icon={<Sparkles className="w-5 h-5" />} 
            label="今日回顾" 
          />
          <SidebarItem 
            active={view === 'archive'} 
            onClick={() => navigateTo('archive')} 
            icon={<LayoutGrid className="w-5 h-5" />} 
            label="收集箱" 
          />
          <SidebarItem 
            active={view === 'trash'} 
            onClick={() => navigateTo('trash')} 
            icon={<Trash2 className="w-5 h-5" />} 
            label="垃圾桶" 
          />
        </nav>

        <footer className="text-earth/30 font-serif text-xs italic">
          滋养你闪烁的灵感
        </footer>
      </motion.aside>

      {/* Header */}
      <header className="p-6 flex justify-between items-center z-30">
        <div className="flex items-center gap-4">
          {view === 'sort' ? (
            <button 
              onClick={() => setView('input')}
              className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-earth/10 text-earth hover:bg-white transition-all shadow-sm active:scale-95 flex items-center gap-2"
            >
              <Plus className="w-6 h-6 rotate-45" />
              <span className="font-medium">返回</span>
            </button>
          ) : (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-earth/10 text-earth hover:bg-white transition-all shadow-sm active:scale-95"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {view !== 'input' && view !== 'sort' && (
            <button 
              onClick={() => setView('input')}
              className="px-4 py-2 text-earth/60 font-serif italic hover:text-earth transition-colors text-sm"
            >
              返回灵感
            </button>
          )}
          {view !== 'sort' && (
            <button 
              onClick={() => setView('sort')}
              className={`flex items-center gap-2 px-4 py-2.5 md:px-6 rounded-full transition-all shadow-sm font-medium ${
                view === 'sort' 
                  ? 'bg-earth text-white' 
                  : 'bg-white/80 backdrop-blur-sm text-earth border border-earth/10 hover:bg-white'
              }`}
            >
              <Layers className="w-5 h-5" />
              <span className="hidden xs:inline">整理</span>
              {activeThoughts.length > 0 && (
                <span className="bg-petal text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {activeThoughts.length}
                </span>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-6">
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
                  <h2 className="font-serif italic text-earth/60">最近捕捉</h2>
                  <div className="flex-1 h-px bg-earth/10" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {activeThoughts.slice(0, 6).map(thought => (
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

          {view === 'playback' && (
            <motion.div
              key="playback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {playback || isPlaybackLoading ? (
                <PlaybackView playback={playback!} loading={isPlaybackLoading} />
              ) : (
                <div className="text-center py-20 text-earth/40 font-serif italic">
                  点击“今日回顾”生成你的每日思绪总结。
                </div>
              )}
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
                    永久清空垃圾桶
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Decoration */}
      <footer className="p-8 text-center text-earth/20 font-serif text-sm italic">
        灵感萌芽 — 呵护你闪烁的智慧
      </footer>
    </div>
  );
}

function SidebarItem({ active, onClick, icon, label }: { 
  active: boolean; 
  onClick: () => void; 
  icon: ReactNode; 
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-earth text-white shadow-md' 
          : 'text-earth/60 hover:bg-earth/5'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

