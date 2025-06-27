import { Routes } from '@angular/router';
import {FeeListComponent} from './fee-list/fee-list.component';
import {FeeDetailsComponent} from './fee-details/fee-details.component';
import {FeeCreateComponent} from './fee-create/fee-create.component';
import {DatatableComponent} from './datatable/datatable.component';

export const routes: Routes = [
  { path: '', redirectTo: 'fees', pathMatch: 'full' },
  { path: 'fees', component: FeeListComponent},
  { path: 'feedetails/:feeCode', component: FeeDetailsComponent},
  { path: 'create', component: FeeCreateComponent},
  { path: 'datatable', component: DatatableComponent}
];

