import { Routes } from '@angular/router';
import { AngularTreeComponent } from './components/angular-tree/angular-tree.component';

export const routes: Routes = [
  { path: '', redirectTo: 'angular/tree', pathMatch: 'full' },
  {
    path: 'angular',
    children: [
      {
        path: 'tree',
        component: AngularTreeComponent,
      },
    ],
  },
];
