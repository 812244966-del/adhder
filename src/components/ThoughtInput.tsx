import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send } from 'lucide-react';
import catInputImage from '../assets/cat_input.png';

interface ThoughtInputProps {
  onSave: (content: string) => void;
}

export default function ThoughtInput({ onSave }: ThoughtInputProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (content.trim()) {
      onSave(content.trim());
      setContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="relative group">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="随意输入你的想法，代办……"
          className="w-full min-h-[240px] p-8 bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-earth/10 focus:border-sprout/50 outline-none focus:ring-0 transition-all font-display text-2xl resize-none placeholder:text-earth/20 text-ink shadow-inner relative z-10"
        />
        
        {/* Background Illustration - Using the uploaded cat image */}
        <div className="absolute bottom-4 right-20 w-40 h-40 pointer-events-none z-0 opacity-30 group-focus-within:opacity-50 transition-all duration-500">
          <img 
            src={catInputImage} 
            alt="" 
            className="w-full h-full object-contain"
          />
        </div>
        
        <AnimatePresence>
          {content.trim() && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleSubmit}
              className="absolute bottom-6 right-6 p-4 bg-sprout text-white rounded-full shadow-lg hover:bg-sprout/90 active:scale-95 transition-all z-30"
            >
              <Send className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-4 text-center text-earth/40 text-sm font-serif italic">
        “在思绪飘走前抓住它……”
      </div>
    </div>
  );
}
