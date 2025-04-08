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

import {
  imagePaths,
  initialAppState,
  taskMessagePhrases,
  taskProbabilities,
} from '../constants';
import { ColorMode } from '../models';
import { includesAny } from '../utils';
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
    suggestShopItems: computed(() => {
      const gold = App.Game.gold();
      const lives = App.Game.lives();

      if (gold < 50) {
        return [];
      }

      if (lives < 2) {
        return ['hpot'];
      }

      if (gold < 100) {
        return [];
      }

      const items = App.Shop.entities();
      const filtered = items.filter(({ id }) => id !== 'hpot');
      const grouped = Object.groupBy(filtered, ({ cost }) => cost);

      const sorted = Object.entries(grouped)
        .sort(([costA], [costB]) => {
          const costAValue = parseInt(costA, 10);
          const costBValue = parseInt(costB, 10);
          return costBValue - costAValue;
        })
        .filter(([cost]) => parseInt(cost, 10) <= gold)
        .map(([, items]) => items)
        .flat();

      const randomItem = sorted[Math.floor(Math.random() * sorted.length)];

      return randomItem ? [randomItem.id] : [];
    }),
    suggestTask: computed(() => {
      const sorted = App.Task.entities().sort((a, b) => {
        const aScore = a.reward * taskProbabilities[a.probability];
        const bScore = b.reward * taskProbabilities[b.probability];
        return bScore - aScore;
      });

      const preferred = sorted.filter(({ message }) => {
        const { negative, trap } = taskMessagePhrases;
        return !includesAny(message, [...negative, ...trap]);
      });

      return preferred.length ? preferred[0] : sorted[0];
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
          await this.purchaseShopItems(App.suggestShopItems());

          const task = App.suggestTask();
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
