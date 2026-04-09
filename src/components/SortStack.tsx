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
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentThought = thoughts[currentIndex];

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
    onAction(currentThought.id, action);
    if (currentIndex < thoughts.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  if (!currentThought) {
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
    <div className="relative w-full max-w-md mx-auto h-[600px] flex items-center justify-center perspective-1000">
      {/* Background cards for "layering" effect */}
      {thoughts.slice(currentIndex + 1, currentIndex + 4).map((thought, i) => {
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
      <AnimatePresence mode="wait">
        <motion.div
          key={currentThought.id}
          style={{ x, rotate, opacity, zIndex: 20 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className="absolute w-full cursor-grab active:cursor-grabbing"
        >
          <ThoughtCard thought={currentThought} />
          
          {/* Swipe Indicators */}
          <motion.div 
            style={{ opacity: archiveOpacity }}
            className="absolute top-1/2 -right-20 -translate-y-1/2 flex flex-col items-center text-sprout"
          >
            <Archive className="w-12 h-12" />
            <span className="text-xs font-bold mt-2">归档</span>
          </motion.div>
          
          <motion.div 
            style={{ opacity: trashOpacity }}
            className="absolute top-1/2 -left-20 -translate-y-1/2 flex flex-col items-center text-petal"
          >
            <Trash2 className="w-12 h-12" />
            <span className="text-xs font-bold mt-2">删除</span>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute -bottom-20 left-0 right-0 flex justify-center gap-12">
        <button 
          onClick={() => handleAction('trash')}
          className="p-4 bg-white rounded-full shadow-lg text-petal hover:scale-110 transition-transform"
        >
          <Trash2 className="w-6 h-6" />
        </button>
        <button 
          onClick={() => handleAction('archived')}
          className="p-4 bg-white rounded-full shadow-lg text-sprout hover:scale-110 transition-transform"
        >
          <Archive className="w-6 h-6" />
        </button>
      </div>
      
      <div className="absolute -top-12 left-0 right-0 text-center text-earth/40 text-sm font-serif italic">
        还有 {thoughts.length - currentIndex} 条思绪待整理
      </div>
    </div>
  );
}
