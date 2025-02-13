import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ShopHistoryColumn, TaskHistoryColumn } from '../../models';
import { ShopHistoryStore, TaskHistoryStore } from '../../stores';

@Component({
  standalone: true,
  selector: 'app-history-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
  ],
  templateUrl: './history-dialog.component.html',
  styleUrl: './history-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryDialogComponent {
  readonly TaskHistory = inject(TaskHistoryStore);
  readonly ShopHistory = inject(ShopHistoryStore);
  readonly dialogRef = inject(MatDialogRef<HistoryDialogComponent>);

  readonly displayedTaskColumns: string[] = [
    'task',
    'probability',
    'success',
    'gold',
    'score',
    'lives',
    'turn',
  ];

  readonly displayedShopColumns: string[] = [
    'name',
    'success',
    'gold',
    'lives',
    'level',
    'turn',
  ];

  readonly taskColumns: TaskHistoryColumn[] = [
    {
      def: 'task',
      icon: 'task',
      getCellValue: ({ task }) => task.message,
    },
    {
      def: 'probability',
      icon: 'percent',
      getCellValue: ({ task }) => task.probability,
    },
    {
      def: 'success',
      icon: 'check_circle',
      getCellValue: ({ response }) =>
        response.success ? 'Success' : 'Failure',
    },
    {
      def: 'gold',
      icon: 'monetization_on',
      getCellValue: ({ response }) => response.gold.toString(),
    },
    {
      def: 'score',
      icon: 'stars',
      getCellValue: ({ response }) => response.score.toString(),
    },
    {
      def: 'lives',
      icon: 'favorite',
      getCellValue: ({ response }) => response.lives.toString(),
    },
    {
      def: 'turn',
      icon: 'access_time',
      getCellValue: ({ response }) => response.turn.toString(),
    },
  ];

  readonly shopColumns: ShopHistoryColumn[] = [
    {
      def: 'name',
      icon: 'shopping_cart',
      getCellValue: ({ item }) => item.name,
    },
    {
      def: 'success',
      icon: 'check_circle',
      getCellValue: ({ response }) =>
        response.shoppingSuccess ? 'Success' : 'Failure',
    },
    {
      def: 'gold',
      icon: 'monetization_on',
      getCellValue: ({ response }) => response.gold.toString(),
    },
    {
      def: 'lives',
      icon: 'favorite',
      getCellValue: ({ response }) => response.lives.toString(),
    },
    {
      def: 'level',
      icon: 'stars',
      getCellValue: ({ response }) => response.level.toString(),
    },
    {
      def: 'turn',
      icon: 'access_time',
      getCellValue: ({ response }) => response.turn.toString(),
    },
  ];
}
