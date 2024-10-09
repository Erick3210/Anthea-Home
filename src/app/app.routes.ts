import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { SecondPopupComponent } from './components/second-popup/second-popup.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'second-popup', component: SecondPopupComponent }, 
  
];
