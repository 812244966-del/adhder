export interface User {
  id: string;
  name: string;
  avatar?: string;
  createdAt: number;
}

export interface Thought {
  id: string;
  content: string;
  createdAt: number;
  status: 'active' | 'archived' | 'trash';
  tags?: string[];
}

export type GroupedThoughts = Record<string, Thought[]>;

export interface DailyPlayback {
  summary: string;
  themes: string[];
  date: string;
}
