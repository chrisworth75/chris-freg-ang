import { Routes } from '@angular/router';
import {FeesComponent} from './fees/fees.component';
import {FeeComponent} from './fee/fee.component';
import {UploadComponent} from './upload/upload.component';

export const routes: Routes = [
  { path: 'fees', component: FeesComponent},
  { path: 'fee', component: FeeComponent},
  { path: 'upload', component: UploadComponent}
];

