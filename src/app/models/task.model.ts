import { taskProbabilities } from '../constants';

export type TaskProbability = keyof typeof taskProbabilities;

export interface Task {
  adId: string;
  message: string;
  reward: number;
  expiresIn: number;
  encrypted?: 2 | 1 | null | undefined;
  probability: TaskProbability;
}

export interface TaskResolution {
  success: boolean;
  lives: number;
  gold: number;
  score: number;
  highScore: number;
  turn: number;
  message: string;
}

export interface TaskHistory {
  id: number;
  timestamp: number;
  task: Task;
  response: TaskResolution;
}

export interface TaskStat {
  icon: string;
  class: string;
  getValue: () => string | number;
}

export interface TaskImpact {
  type: 'good' | 'bad' | 'neutral' | 'trap' | 'encrypted';
  icon: string;
  text: string;
  iconClass?: string;
  isVisible: () => boolean;
}

export interface TaskHistoryColumn {
  def: string;
  icon: string;
  getCellValue: (element: TaskHistory) => string;
}
