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
    _meta: computed(() => ({ id: ids().length + 1, timestamp: Date.now() })),
  })),
  withMethods((ShopHistory) => ({
    add(item: ShopItem, response: ShopPurchase) {
      patchState(
        ShopHistory,
        addEntity({ ...ShopHistory._meta(), item, response }),
      );
    },
  })),
);
