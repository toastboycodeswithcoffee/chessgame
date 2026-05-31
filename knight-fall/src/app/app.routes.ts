import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { GameComponent } from './game.component';
import { StatsComponent } from './stats.component';
import { HistoryComponent } from './history.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'game',
    component: GameComponent
  },
  {
    path: 'stats',
    component: StatsComponent
  },
  {
    path: 'history',
    component: HistoryComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
