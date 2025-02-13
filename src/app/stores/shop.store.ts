import { withDevtools, withReset } from '@angular-architects/ngrx-toolkit';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { firstValueFrom } from 'rxjs';

import { apiRoutes } from '../constants';
import { ShopItem, ShopPurchase } from '../models';
import { GameStore } from './game.store';
import { ShopHistoryStore } from './shop-history.store';

export const ShopStore = signalStore(
  { providedIn: 'root' },
  withDevtools('shop'),
  withEntities<ShopItem>(),
  withReset(),
  withMethods(
    (
      Shop,
      Game = inject(GameStore),
      ShopHistory = inject(ShopHistoryStore),
      http = inject(HttpClient),
    ) => ({
      async fetch() {
        try {
          const response$ = http.get<ShopItem[]>(apiRoutes.shop);
          const response = await firstValueFrom(response$);

          patchState(Shop, setAllEntities(response));
        } catch (error) {
          console.error('Error while fetching shop items', error);
        }
      },
      async purchase(ids: string[]) {
        try {
          for (const id of ids) {
            const shopItem = Shop.entityMap()[id];
            const request$ = http.post<ShopPurchase>(
              apiRoutes.purchase(id),
              {},
            );
            const response = await firstValueFrom(request$);
            const { shoppingSuccess, ...gameValues } = response;

            Game.updateValues(gameValues);
            if (shopItem) {
              ShopHistory.add(shopItem, response);
            }
          }
        } catch (error) {
          console.error('Error while purchasing shop items', error);
        }
      },
    }),
  ),
);
