import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { patchState, signalState } from '@ngrx/signals';

import { shopItemImpacts } from '../../constants';
import { ShopColumn } from '../../models';
import { AppStore } from '../../stores';

@Component({
  standalone: true,
  selector: 'app-shop-dialog',
  imports: [MatButtonModule, MatDialogModule, MatIconModule, MatTableModule],
  templateUrl: './shop-dialog.component.html',
  styleUrl: './shop-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopDialogComponent {
  readonly App = inject(AppStore);
  readonly dialogRef = inject(MatDialogRef<ShopDialogComponent>);
  readonly state = signalState<{ ids: string[] }>({ ids: [] });

  readonly displayedColumns: string[] = [
    'name',
    'cost',
    'lives',
    'levels',
    'quantity',
    'actions',
  ];

  columns: ShopColumn[] = [
    {
      def: 'name',
      icon: 'shopping_cart',
      getCellValue: (element) => element.name,
      getFooterValue: () => 'Total',
    },
    {
      def: 'cost',
      icon: 'monetization_on',
      getCellValue: (element) => element.cost.toString(),
      getFooterValue: () => this.cartTotal().toString(),
    },
    {
      def: 'lives',
      icon: 'favorite',
      getCellValue: (element) => {
        const lives = shopItemImpacts[element.id].lives;
        return lives ? `+${lives.toString()}` : '';
      },
      getFooterValue: () => {
        const total = this.cartLivesTotal();
        return total ? `+${total.toString()}` : '';
      },
    },
    {
      def: 'levels',
      icon: 'star',
      getCellValue: (element) => {
        const levels = shopItemImpacts[element.id].levels;
        return levels ? `+${levels.toString()}` : '';
      },
      getFooterValue: () => {
        const total = this.cartLevelsTotal();
        return total ? `+${total.toString()}` : '';
      },
    },
    {
      def: 'quantity',
      icon: 'numbers',
      getCellValue: (element) => this.getItemQuantity(element.id).toString(),
      getFooterValue: () => this.cartItems().length.toString(),
    },
    {
      def: 'actions',
      icon: '',
      getCellValue: () => '',
      getFooterValue: () => '',
    },
  ];

  readonly cartItems = computed(() =>
    this.state.ids().flatMap((id) => this.App.Shop.entityMap()[id] ?? []),
  );

  readonly uniqueCartItems = computed(() =>
    this.cartItems().filter((item, index, self) => {
      return self.findIndex(({ id }) => id === item.id) === index;
    }),
  );

  readonly cartTotal = computed(() =>
    this.cartItems().reduce((sum, { cost }) => sum + cost, 0),
  );

  readonly cartLivesTotal = computed(() =>
    this.cartItems().reduce(
      (sum, { id }) => sum + shopItemImpacts[id].lives,
      0,
    ),
  );

  readonly cartLevelsTotal = computed(() =>
    this.cartItems().reduce(
      (sum, { id }) => sum + shopItemImpacts[id].levels,
      0,
    ),
  );

  readonly balance = computed(() => this.App.Game.gold() - this.cartTotal());

  isAffordable(id: string) {
    const item = this.App.Shop.entityMap()[id];
    return item ? item.cost <= this.balance() : false;
  }

  getItemQuantity(id: string) {
    return this.state.ids().filter((i) => i === id).length;
  }

  addItem(id: string) {
    patchState(this.state, (state) => ({ ids: [...state.ids, id] }));
  }

  removeItem(id: string) {
    const items = [...this.state.ids()];
    const index = items.indexOf(id);

    if (index !== -1) {
      items.splice(index, 1);
      patchState(this.state, { ids: items });
    }
  }

  async checkout() {
    await this.App.purchaseShopItems(this.state.ids());
    this.dialogRef.close();
  }
}
