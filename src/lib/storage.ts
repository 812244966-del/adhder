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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(thoughts));
  },
  addThought: (content: string): Thought => {
    const thoughts = storage.getThoughts();
    const newThought: Thought = {
      id: crypto.randomUUID(),
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
