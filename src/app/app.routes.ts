import { Routes } from '@angular/router';
import {FeeListComponent} from './fee-list/fee-list.component';
import {FeeDetailsComponent} from './fee-details/fee-details.component';
import {UploadComponent} from './upload/upload.component';
import {NotFoundComponent} from './not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: 'fees', pathMatch: 'full' },
  { path: 'fees', component: FeeListComponent},
  { path: 'feedetails/:feeCode', component: FeeDetailsComponent},
  { path: 'upload', component: UploadComponent},
  { path: '**', component: NotFoundComponent }
];

