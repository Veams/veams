import type { DocsPackage } from '../types';
import { ecosystemPackage } from './ecosystem';
import { methodologyPackage } from './methodology';
import { statusQuoPackage } from './status-quo';
import { statusQuoQueryPackage } from './status-quo-query';
import { ventPackage } from './vent';
import { formPackage } from './form';
import { partialHydrationPackage } from './partial-hydration';
import { cssAnimationsPackage } from './css-animations';

export const docsPackages: DocsPackage[] = [
  ecosystemPackage,
  methodologyPackage,
  statusQuoPackage,
  statusQuoQueryPackage,
  ventPackage,
  formPackage,
  partialHydrationPackage,
  cssAnimationsPackage,
];
