export type ColorMode = 'light' | 'dark';

export interface App {
  isAutoplay: boolean;
  isGameActive: boolean;
  colorMode: ColorMode | null;
}

export interface ToolbarAction {
  icon: string;
  getIcon: () => string;
  getLabel: () => string;
  onClick: () => void;
  isDisabled: () => boolean;
  menuOnly?: boolean;
}

export interface GameStat {
  icon: string;
  value: () => number;
}
