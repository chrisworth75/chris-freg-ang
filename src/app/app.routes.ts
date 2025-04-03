import { Routes } from '@angular/router';
import {FeeListComponent} from './fee-list/fee-list.component';
import {FeeComponent} from './fee/fee.component';
import {UploadComponent} from './upload/upload.component';

export const routes: Routes = [
  { path: 'fees', component: FeeListComponent},
  { path: 'fee', component: FeeComponent},
  { path: 'upload', component: UploadComponent}
];

