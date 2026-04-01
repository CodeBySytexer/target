import { Route } from '@angular/router';
import { InputLibComponent } from '@target/input-lib';
import { QuoteSummaryComponent } from '@target/quote-summary';

const ROUTES = {
  INPUTS: 'inputs',
  QUOTE_SUMMARY: 'quote-summary',
};

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ROUTES.INPUTS,
  },
  {
    path: ROUTES.INPUTS,
    component: InputLibComponent,
  },
  {
    path: ROUTES.QUOTE_SUMMARY,
    component: QuoteSummaryComponent,
  },
  {
    path: '**',
    redirectTo: ROUTES.INPUTS,
  },
];
