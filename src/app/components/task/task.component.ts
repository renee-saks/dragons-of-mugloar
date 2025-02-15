import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { taskProbabilities } from '../../constants';
import { Task, TaskImpact, TaskStat } from '../../models';
import {
  isTaskBadForState,
  isTaskGoodForPeople,
  isTaskNeutral,
  isTaskTrap,
} from '../../utils';

@Component({
  standalone: true,
  selector: 'app-task',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskComponent {
  readonly LOGO_PATH = 'url(./logo.webp)';

  readonly task = input.required<Task>();
  readonly taskTaken = output<string>();

  readonly probability = computed(
    () => taskProbabilities[this.task().probability],
  );

  readonly taskStats: TaskStat[] = [
    {
      icon: 'monetization_on',
      class: 'reward',
      getValue: () => this.task().reward,
    },
    {
      icon: 'timer',
      class: 'expires',
      getValue: () => this.task().expiresIn,
    },
  ];

  readonly impacts: TaskImpact[] = [
    {
      type: 'good',
      icon: 'thumb_up',
      text: 'Good for people',
      isVisible: () => isTaskGoodForPeople(this.task()),
    },
    {
      type: 'bad',
      icon: 'thumb_down',
      text: 'Bad for state',
      isVisible: () => isTaskBadForState(this.task()),
    },
    {
      type: 'neutral',
      icon: 'handshake',
      text: 'Neutral',
      isVisible: () => isTaskNeutral(this.task()),
    },
    {
      type: 'trap',
      icon: 'announcement',
      text: 'Trap',
      iconClass: 'task-trap-icon',
      isVisible: () => isTaskTrap(this.task()),
    },
    {
      type: 'encrypted',
      icon: 'lock',
      text: 'Decrypted task',
      isVisible: () => !!this.task().encrypted,
    },
  ];

  getVisibleImpacts(): TaskImpact[] {
    return this.impacts.filter((impact) => impact.isVisible());
  }

  takeTask() {
    this.taskTaken.emit(this.task().adId);
  }
}
