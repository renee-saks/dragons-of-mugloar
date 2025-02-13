import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AppStore } from '../stores';
import { buildEndpointUrl } from '../utils';

export const appInterceptor: HttpInterceptorFn = (req, next) => {
  const App = inject(AppStore);
  req = req.clone({ url: buildEndpointUrl(req.url, App.Game.gameId()) });

  return next(req);
};
