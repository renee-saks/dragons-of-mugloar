import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { historyDialogConfig, shopDialogConfig } from '../../constants';
import { GameStat, ToolbarAction } from '../../models';
import { AppStore } from '../../stores';
import { HistoryDialogComponent } from '../history-dialog/history-dialog.component';
import { ShopDialogComponent } from '../shop-dialog/shop-dialog.component';

@Component({
  standalone: true,
  selector: 'app-toolbar',
  imports: [
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  readonly App = inject(AppStore);
  readonly dialog = inject(MatDialog);

  readonly toolbarActions: ToolbarAction[] = [
    {
      icon: 'play_arrow',
      getLabel: () => (this.App.isGameActive() ? 'Restart Game' : 'Start Game'),
      getIcon: () => (this.App.isGameActive() ? 'refresh' : 'play_arrow'),
      onClick: () => void this.App.startGame(),
      isDisabled: () => this.App.isAutoplayActive(),
    },
    {
      icon: 'history',
      getLabel: () => 'Open History',
      getIcon: () => 'history',
      onClick: () => {
        this.dialog.open(HistoryDialogComponent, historyDialogConfig);
      },
      isDisabled: () =>
        !this.App.isGameActive() && !this.App.isHistoryAvailable(),
    },
    {
      icon: 'shopping_cart',
      getLabel: () => 'Open Shop',
      getIcon: () => 'shopping_cart',
      onClick: () => {
        this.dialog.open(ShopDialogComponent, shopDialogConfig);
      },
      isDisabled: () => !this.App.isGameActive() || this.App.isAutoplayActive(),
    },
    {
      icon: 'star',
      getLabel: () => 'Investigate Reputation',
      getIcon: () => 'star',
      onClick: () => void this.App.investigateReputation(),
      isDisabled: () => !this.App.isGameActive() || this.App.isAutoplayActive(),
    },
    {
      icon: 'auto_mode',
      getLabel: () =>
        this.App.isAutoplayActive() ? 'Stop Autoplay' : 'Start Autoplay',
      getIcon: () => (this.App.isAutoplayActive() ? 'stop' : 'auto_mode'),
      onClick: () => void this.App.toggleAutoplay(),
      isDisabled: () => !this.App.isGameActive(),
    },
    {
      icon: 'dark_mode',
      getLabel: () => (this.App.isDarkMode() ? 'Light Mode' : 'Dark Mode'),
      getIcon: () => (this.App.isDarkMode() ? 'light_mode' : 'dark_mode'),
      onClick: () => {
        this.App.toggleColorMode();
      },
      isDisabled: () => false,
    },
  ];

  readonly gameStats: GameStat[] = [
    { icon: 'favorite', value: () => this.App.Game.lives() },
    { icon: 'star', value: () => this.App.Game.level() },
    { icon: 'directions_walk', value: () => this.App.Game.turn() },
    { icon: 'monetization_on', value: () => this.App.Game.gold() },
    { icon: 'score', value: () => this.App.Game.score() },
  ];
}
