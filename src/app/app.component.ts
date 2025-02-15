import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  RendererFactory2,
} from '@angular/core';

import { TaskComponent, ToolbarComponent } from './components';
import { imagePaths } from './constants';
import { AppStore } from './stores';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [TaskComponent, ToolbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  readonly App = inject(AppStore);
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(RendererFactory2).createRenderer(
    null,
    null,
  );

  ngOnInit() {
    // Set random background image
    const contentEl = this.document.getElementsByClassName('main-content')[0];
    const images = Object.values(imagePaths.backgrounds);
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const imageUrl = `url(${randomImage ?? imagePaths.backgrounds[0]})`;

    if (contentEl) {
      this.renderer.setStyle(contentEl, 'background-image', imageUrl);
    }
  }
}
