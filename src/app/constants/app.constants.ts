import { App } from '../models';

export const API_URL = 'https://dragonsofmugloar.com/api/v2';

export const apiRoutes = {
  start: 'game/start',
  reputation: ':gameId/investigate/reputation',
  tasks: ':gameId/messages',
  shop: ':gameId/shop',
  purchase: (id: string) => `:gameId/shop/buy/${id}`,
  solve: (id: string) => `:gameId/solve/${id}`,
};

export const initialAppState: App = {
  colorMode: null,
  isAutoplayActive: false,
};

export const imagePaths = {
  logo: './logo.webp',
  backgrounds: ['./bg-1.webp', './bg-2.webp', './bg-3.webp'],
} as const;
