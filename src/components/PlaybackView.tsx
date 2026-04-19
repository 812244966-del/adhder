import React from 'react';
import { motion } from 'motion/react';
import { DailyPlayback } from '../types';
import { Sparkles, Hash, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface PlaybackViewProps {
  playback: DailyPlayback;
  loading?: boolean;
}

export default function PlaybackView({ playback, loading }: PlaybackViewProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-12 h-12 text-sprout" />
        </motion.div>
        <p className="font-serif italic text-ink/60">正在汇集你零散的思绪……</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-3xl p-10 space-y-8 border border-black/5 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/5 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sprout/10 rounded-2xl">
              <Sparkles className="w-6 h-6 text-sprout" />
            </div>
            <div>
              <h2 className="font-display text-2xl text-ink">思绪回放</h2>
              <p className="text-xs font-serif italic text-ink/40">你的每日反思</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-ink/60 font-serif">
              <CalendarIcon className="w-4 h-4" />
              <span>{format(new Date(playback.date), 'yyyy年MM月dd日')}</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-ink/40">今日总结</h3>
          <p className="font-display text-2xl leading-relaxed text-ink">
            {playback.summary}
          </p>
        </div>

        {/* Themes */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-ink/40">高频主题</h3>
          <div className="flex flex-wrap gap-3">
            {playback.themes.map((theme, i) => (
              <motion.div
                key={theme}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full border border-black/5 text-ink/80 font-medium"
              >
                <Hash className="w-3 h-3 text-sprout" />
                {theme}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer Decoration */}
        <div className="pt-6 border-t border-black/5 flex justify-center">
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-sprout/20" />
            ))}
          </div>
        </div>
      </motion.div>

      <p className="text-center text-ink/40 font-serif italic text-sm">
        “自我认知是呵护心灵的第一步。”
      </p>
    </div>
  );
}
