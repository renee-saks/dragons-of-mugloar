export type ColorMode = 'light' | 'dark';

export interface App {
  colorMode: ColorMode | null;
  isAutoplayActive: boolean;
}

export interface ToolbarAction {
  icon: string;
  getIcon: () => string;
  getLabel: () => string;
  onClick: () => void;
  isDisabled: () => boolean;
}

export interface GameStat {
  icon: string;
  value: () => number;
}
