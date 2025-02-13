import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const errorMessage =
          (error.error as { message?: string }).message ??
          (error.message || 'An unknown error occurred');

        // Show error in snackbar
        snackBar.open(errorMessage, 'Ok', { panelClass: 'failure-snackbar' });
      }

      return throwError(() => error);
    }),
  );
};
