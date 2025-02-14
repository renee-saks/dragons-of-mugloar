import { withDevtools, withReset } from '@angular-architects/ngrx-toolkit';
import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
} from '@ngrx/signals';
import { addEntity, withEntities } from '@ngrx/signals/entities';

import { Task, TaskHistory, TaskResolution } from '../models';

export const TaskHistoryStore = signalStore(
  { providedIn: 'root' },
  withDevtools('taskHistory'),
  withEntities<TaskHistory>(),
  withReset(),
  withComputed(({ ids }) => ({
    _meta: computed(() => ({ id: ids().length + 1, timestamp: Date.now() })),
  })),
  withMethods((TaskHistory) => ({
    add(task: Task, response: TaskResolution) {
      patchState(
        TaskHistory,
        addEntity({ ...TaskHistory._meta(), task, response }),
      );
    },
  })),
);
