import { withDevtools, withReset } from '@angular-architects/ngrx-toolkit';
import { HttpClient } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import { apiRoutes, initialReputationState } from '../constants';
import { Reputation } from '../models';
import { GameStore } from './game.store';

export const ReputationStore = signalStore(
  { providedIn: 'root' },
  withDevtools('reputation'),
  withState(initialReputationState),
  withReset(),
  withComputed(({ people, state, underworld }) => ({
    toString: computed(() => {
      const str1 = people().toString();
      const str2 = state().toString();
      const str3 = underworld().toString();
      return `${str1} people, ${str2} state, ${str3} underworld`;
    }),
  })),
  withMethods(
    (
      Reputation,
      Game = inject(GameStore),
      http = inject(HttpClient),
      snackBar = inject(MatSnackBar),
    ) => ({
      async fetch() {
        try {
          const request$ = http.post<Reputation>(apiRoutes.reputation, {});
          const response = await firstValueFrom(request$);

          Game.updateValues({ turn: Game.turn() + 1 });
          patchState(Reputation, { ...response });
          snackBar.open(Reputation.toString(), 'Ok');
        } catch (error) {
          console.error('Error while fetching reputation', error);
        }
      },
    }),
  ),
);
