import { MatDialogConfig } from '@angular/material/dialog';

export const shopItemImpacts = {
  hpot: { lives: 1, levels: 0 },
  cs: { lives: 0, levels: 1 },
  gas: { lives: 1, levels: 0 },
  wax: { lives: 0, levels: 1 },
  tricks: { lives: 0, levels: 1 },
  wingpot: { lives: 0, levels: 1 },
  ch: { lives: 0, levels: 2 },
  rf: { lives: 0, levels: 2 },
  iron: { lives: 0, levels: 2 },
  mtrix: { lives: 0, levels: 2 },
  wingpotmax: { lives: 0, levels: 2 },
};

export const shopDialogConfig: MatDialogConfig = {
  width: 'calc(100% - 30px)',
  height: 'calc(100% - 30px)',
  maxWidth: '100%',
  maxHeight: '100%',
};
