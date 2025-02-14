import { shopItemImpacts } from '../constants';

export type ShopItemId = keyof typeof shopItemImpacts;

export interface ShopItem {
  id: ShopItemId;
  name: string;
  cost: number;
}

export interface ShopPurchase {
  shoppingSuccess: boolean;
  gold: number;
  lives: number;
  level: number;
  turn: number;
}

export interface ShopHistory {
  id: number;
  timestamp: number;
  item: ShopItem;
  response: ShopPurchase;
}

export interface ShopColumn {
  def: string;
  icon: string;
  getCellValue: (element: ShopItem) => string;
  getFooterValue: () => string;
}

export interface ShopHistoryColumn {
  def: string;
  icon: string;
  getCellValue: (element: ShopHistory) => string;
}
