import {
  withDevtools,
  withReset,
  withStorageSync,
} from '@angular-architects/ngrx-toolkit';
import { DOCUMENT } from '@angular/common';
import { computed, inject, RendererFactory2 } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';

import { imagePaths, initialAppState, taskProbabilities } from '../constants';
import { ColorMode, ShopItemId } from '../models';
import { GameStore } from './game.store';
import { ReputationStore } from './reputation.store';
import { ShopHistoryStore } from './shop-history.store';
import { ShopStore } from './shop.store';
import { TaskHistoryStore } from './task-history.store';
import { TaskStore } from './task.store';

export const AppStore = signalStore(
  { providedIn: 'root' },
  withDevtools('app'),
  withState(initialAppState),
  withStorageSync({
    key: 'app',
    select: ({ colorMode }) => ({ colorMode }),
  }),
  withReset(),
  withProps(() => ({
    Game: inject(GameStore),
    Reputation: inject(ReputationStore),
    ShopHistory: inject(ShopHistoryStore),
    Shop: inject(ShopStore),
    TaskHistory: inject(TaskHistoryStore),
    Task: inject(TaskStore),
    _document: inject(DOCUMENT),
    _renderer: inject(RendererFactory2).createRenderer(null, null),
  })),
  withComputed((App) => ({
    randomGameImage: computed(() => {
      const images = Object.values(imagePaths.backgrounds);
      const randomImage = images[Math.floor(Math.random() * images.length)];
      return `url(${randomImage ?? imagePaths.backgrounds[0]})`;
    }),
    isDarkMode: computed(() => App.colorMode() === 'dark'),
    isGameActive: computed(
      () =>
        !!App.Game.gameId() &&
        !!App.Game.lives() &&
        !!App.Task.entities().length &&
        !!App.Shop.entities().length,
    ),
    isHistoryAvailable: computed(
      () =>
        !!App.TaskHistory.entities().length ||
        !!App.ShopHistory.entities().length,
    ),
    _autoplayShopItems: computed(() => {
      const potId: ShopItemId = 'hpot';
      const csId: ShopItemId = 'cs';

      // Check health potions first
      const potionCost = App.Shop.entityMap()[potId]?.cost ?? Infinity;
      const potionsNeeded = Math.max(0, 5 - App.Game.lives());
      const affordablePotions = Math.floor(App.Game.gold() / potionCost);
      const potionsToBuy = Math.min(potionsNeeded, affordablePotions);

      if (potionsToBuy > 0) {
        return Array<string>(potionsToBuy).fill(potId);
      }

      // If no potions needed, try to buy level up items
      const csCost = App.Shop.entityMap()[csId]?.cost ?? Infinity;
      const affordableCs = Math.floor(App.Game.gold() / csCost);

      if (affordableCs > 0) {
        return Array<string>(affordableCs).fill(csId);
      }

      return [];
    }),
    _autoplayTask: computed(() => {
      const tasks = App.Task.entities();

      if (!tasks.length) {
        return null;
      }

      return tasks.reduce((previous, current) => {
        const currentProbability = taskProbabilities[current.probability];
        const previousProbability = taskProbabilities[previous.probability];
        const currentRatio = currentProbability * current.reward;
        const previousRatio = previousProbability * previous.reward;

        return previousRatio < currentRatio ? current : previous;
      });
    }),
  })),
  withMethods((App) => ({
    toggleColorMode(colorMode?: ColorMode) {
      colorMode = colorMode ?? (App.colorMode() === 'dark' ? 'light' : 'dark');
      const documentElement = App._document.documentElement;

      App._renderer.setStyle(documentElement, 'color-scheme', colorMode);
      patchState(App, { colorMode });
    },
    async startGame() {
      App.Game.resetState();
      App.Task.resetState();
      App.Reputation.resetState();
      App.ShopHistory.resetState();
      App.TaskHistory.resetState();

      await App.Game.start();
      await App.Task.fetch();
      await App.Shop.fetch();
    },
    async solveTask(id: string) {
      await App.Task.solve(id);

      if (App.Game.lives()) {
        await App.Task.fetch();
      } else {
        App.resetState();
      }
    },
    async investigateReputation() {
      await App.Reputation.fetch();
      await App.Task.fetch();
    },
    async purchaseShopItems(ids: string[]) {
      await App.Shop.purchase(ids);
      await App.Task.fetch();
    },
    async toggleAutoplay() {
      if (App.isAutoplayActive()) {
        patchState(App, { isAutoplayActive: false });
      } else {
        patchState(App, { isAutoplayActive: true });

        while (App.isGameActive() && App.isAutoplayActive()) {
          await this.purchaseShopItems(App._autoplayShopItems());

          const task = App._autoplayTask();
          if (task) {
            await this.solveTask(task.adId);
          } else {
            break;
          }
        }
      }
    },
  })),
  withHooks(({ colorMode, toggleColorMode }) => ({
    onInit() {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      toggleColorMode(colorMode() ?? (mediaQuery.matches ? 'dark' : 'light'));
    },
  })),
);
