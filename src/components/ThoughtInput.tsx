import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send } from 'lucide-react';

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
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What's on your mind? (Cmd+Enter to save)"
          className="w-full min-h-[200px] p-8 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-earth/10 focus:border-sprout/50 focus:ring-0 transition-all font-display text-2xl resize-none placeholder:text-earth/20 text-ink shadow-inner"
        />
        
        <AnimatePresence>
          {content.trim() && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleSubmit}
              className="absolute bottom-6 right-6 p-4 bg-sprout text-white rounded-full shadow-lg hover:bg-sprout/90 active:scale-95 transition-all"
            >
              <Send className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-4 text-center text-earth/40 text-sm font-serif italic">
        "Capture it before it floats away..."
      </div>
    </div>
  );
}
