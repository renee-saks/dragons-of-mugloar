import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TaskComponent, ToolbarComponent } from './components';
import { AppStore } from './stores';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [TaskComponent, ToolbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly App = inject(AppStore);
}
