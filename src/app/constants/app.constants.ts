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
  isAutoplay: false,
  isGameActive: false,
  colorMode: null,
};
