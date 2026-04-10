import { Thought } from '../types';

const STORAGE_KEY = 'mindsprout_thoughts';

export const storage = {
  getThoughts: (): Thought[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to parse thoughts from storage:", e);
      return [];
    }
  },
  saveThoughts: (thoughts: Thought[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(thoughts));
    } catch (e) {
      console.error("Failed to save thoughts to storage:", e);
      if (e instanceof Error && e.name === 'QuotaExceededError') {
        alert("存储空间已满，请清理一些旧的思绪。");
      }
    }
  },
  addThought: (content: string): Thought => {
    const thoughts = storage.getThoughts();
    const newThought: Thought = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      content,
      createdAt: Date.now(),
      status: 'active',
    };
    storage.saveThoughts([newThought, ...thoughts]);
    return newThought;
  },
  updateThought: (id: string, updates: Partial<Thought>) => {
    const thoughts = storage.getThoughts();
    const updated = thoughts.map(t => t.id === id ? { ...t, ...updates } : t);
    storage.saveThoughts(updated);
  },
  deleteThought: (id: string) => {
    const thoughts = storage.getThoughts();
    storage.saveThoughts(thoughts.filter(t => t.id !== id));
  }
};
