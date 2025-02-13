import { withDevtools, withReset } from '@angular-architects/ngrx-toolkit';
import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
} from '@ngrx/signals';
import { addEntity, withEntities } from '@ngrx/signals/entities';

import { ShopHistory, ShopItem, ShopPurchase } from '../models';

export const ShopHistoryStore = signalStore(
  { providedIn: 'root' },
  withDevtools('shopHistory'),
  withEntities<ShopHistory>(),
  withReset(),
  withComputed(({ ids }) => ({
    nextId: computed(() => ids().length + 1),
  })),
  withMethods((ShopHistory) => ({
    add(item: ShopItem, response: ShopPurchase) {
      patchState(
        ShopHistory,
        addEntity({ id: ShopHistory.nextId(), item, response }),
      );
    },
  })),
);
