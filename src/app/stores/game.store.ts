import { withDevtools, withReset } from '@angular-architects/ngrx-toolkit';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import { apiRoutes, initialGameState } from '../constants';
import { Game } from '../models';

export const GameStore = signalStore(
  { providedIn: 'root' },
  withDevtools('game'),
  withState(initialGameState),
  withReset(),
  withMethods((Game, http = inject(HttpClient)) => ({
    async start() {
      try {
        const response$ = http.post<Game>(apiRoutes.start, {});
        const response = await firstValueFrom(response$);

        patchState(Game, { ...response });
      } catch (error) {
        console.error('Error while starting game', error);
      }
    },
    updateValues(updated: Partial<Game>) {
      patchState(Game, (state) => ({ ...state, ...updated }));
    },
  })),
);
