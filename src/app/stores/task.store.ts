import { withDevtools, withReset } from '@angular-architects/ngrx-toolkit';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { patchState, signalStore, withMethods } from '@ngrx/signals';
import {
  SelectEntityId,
  setAllEntities,
  withEntities,
} from '@ngrx/signals/entities';
import { firstValueFrom } from 'rxjs';

import { apiRoutes } from '../constants';
import { Task, TaskResolution } from '../models';
import { parseTasks } from '../utils';
import { GameStore } from './game.store';
import { TaskHistoryStore } from './task-history.store';

const selectId: SelectEntityId<Task> = ({ adId }) => adId;

export const TaskStore = signalStore(
  { providedIn: 'root' },
  withDevtools('task'),
  withEntities<Task>(),
  withReset(),
  withMethods(
    (
      Task,
      Game = inject(GameStore),
      TaskHistory = inject(TaskHistoryStore),
      http = inject(HttpClient),
      snackBar = inject(MatSnackBar),
    ) => ({
      async fetch() {
        try {
          const request$ = http.get<Task[]>(apiRoutes.tasks);
          const response = await firstValueFrom(request$);

          patchState(Task, setAllEntities(parseTasks(response), { selectId }));
        } catch (error) {
          console.error('Error while fetching tasks', error);
        }
      },
      async solve(id: string) {
        try {
          const task = Task.entityMap()[id];
          const request$ = http.post<TaskResolution>(apiRoutes.solve(id), {});
          const response = await firstValueFrom(request$);
          const { success, message, ...gameValues } = response;

          snackBar.open(message, 'Ok', {
            panelClass: success ? 'success-snackbar' : 'failure-snackbar',
          });
          Game.updateValues({ ...gameValues });
          if (task) {
            TaskHistory.add(task, response);
          }
        } catch (error) {
          console.error('Error while solving task', error);
        }
      },
    }),
  ),
);
