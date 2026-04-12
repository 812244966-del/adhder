import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Thought } from '../types';
import ThoughtCard from './ThoughtCard';
import { Trash2, Archive, RotateCcw } from 'lucide-react';

interface SortStackProps {
  thoughts: Thought[];
  onAction: (id: string, action: 'archived' | 'trash') => void;
  onComplete: () => void;
}

export default function SortStack({ thoughts, onAction, onComplete }: SortStackProps) {
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  
  // Filter out thoughts that have been "swiped" in this session
  const visibleThoughts = thoughts.filter(t => !removedIds.includes(t.id));
  const currentThought = visibleThoughts[0];

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const archiveOpacity = useTransform(x, [50, 150], [0, 1]);
  const trashOpacity = useTransform(x, [-150, -50], [1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      handleAction('archived');
    } else if (info.offset.x < -100) {
      handleAction('trash');
    }
  };

  const handleAction = (action: 'archived' | 'trash') => {
    if (!currentThought) return;

    const idToRemove = currentThought.id;
    setRemovedIds(prev => [...prev, idToRemove]);
    onAction(idToRemove, action);

    if (visibleThoughts.length <= 1) {
      // Delay onComplete slightly to allow exit animation
      setTimeout(onComplete, 300);
    }
  };

  if (!currentThought && removedIds.length >= thoughts.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-earth/40">
        <RotateCcw className="w-12 h-12 mb-4 opacity-20" />
        <p className="font-serif italic">思绪已整理完毕。</p>
        <button 
          onClick={onComplete}
          className="mt-8 px-6 py-2 bg-sprout text-white rounded-full hover:bg-sprout/90 transition-colors"
        >
          返回首页
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto h-[500px] flex items-center justify-center perspective-1000">
      {/* Background cards for "layering" effect */}
      {visibleThoughts.slice(1, 4).map((thought, i) => {
        const index = i + 1;
        const rotation = index % 2 === 0 ? index * 2 : -index * 2;
        const xOffset = index % 2 === 0 ? index * 4 : -index * 4;
        
        return (
          <div
            key={thought.id}
            className="absolute w-full"
            style={{
              zIndex: 10 - index,
              transform: `translateY(${index * 12}px) translateX(${xOffset}px) rotate(${rotation}deg) scale(${1 - index * 0.04})`,
              opacity: 0.4 / (index),
            }}
          >
            <ThoughtCard thought={thought} variant="compact" />
          </div>
        );
      })}

      {/* Active card */}
      <AnimatePresence mode="popLayout">
        {currentThought && (
          <motion.div
            key={currentThought.id}
            style={{ x, rotate, opacity, zIndex: 20 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ 
              x: x.get() > 0 ? 500 : -500, 
              opacity: 0,
              transition: { duration: 0.3 }
            }}
            className="absolute w-full cursor-grab active:cursor-grabbing"
          >
            <ThoughtCard thought={currentThought} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe Indicators - Absolute instead of Fixed for iOS compatibility */}
      <div className="absolute inset-y-0 -left-12 -right-12 pointer-events-none z-50 flex justify-between items-center px-4 overflow-hidden">
        <motion.div 
          style={{ 
            opacity: trashOpacity,
            x: useTransform(x, [-150, 0], [0, -20])
          }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-14 h-14 bg-petal/10 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-petal/30 shadow-lg">
            <Trash2 className="w-7 h-7 text-petal" />
          </div>
          <span className="text-petal font-bold text-[10px] bg-white/90 px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider">删除</span>
        </motion.div>

        <motion.div 
          style={{ 
            opacity: archiveOpacity,
            x: useTransform(x, [0, 150], [20, 0])
          }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-14 h-14 bg-sprout/10 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-sprout/30 shadow-lg">
            <Archive className="w-7 h-7 text-sprout" />
          </div>
          <span className="text-sprout font-bold text-[10px] bg-white/90 px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider">保存</span>
        </motion.div>
      </div>

      <div className="absolute -bottom-24 left-0 right-0 flex justify-center gap-12">
        <button 
          onClick={() => handleAction('trash')}
          className="p-4 bg-white rounded-full shadow-lg text-petal hover:scale-110 active:scale-95 transition-all border border-earth/5"
        >
          <Trash2 className="w-6 h-6" />
        </button>
        <button 
          onClick={() => handleAction('archived')}
          className="p-4 bg-white rounded-full shadow-lg text-sprout hover:scale-110 active:scale-95 transition-all border border-earth/5"
        >
          <Archive className="w-6 h-6" />
        </button>
      </div>
      
      <div className="absolute -top-16 left-0 right-0 text-center">
        <span className="bg-earth/5 px-4 py-1 rounded-full text-earth/40 text-xs font-serif italic">
          还有 {visibleThoughts.length} 条思绪待整理
        </span>
      </div>
    </div>
  );
}
