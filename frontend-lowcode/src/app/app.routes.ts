import { Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard-page';
import { SchuelerPage } from './pages/schueler-page';
import { LehrerPage } from './pages/lehrer-page';
import { KlassenPage } from './pages/klassen-page';
import { FaecherPage } from './pages/faecher-page';
import { RaeumePage } from './pages/raeume-page';

export const routes: Routes = [
  { path: '', component: DashboardPage, title: 'Schulverwaltung – Dashboard' },
  { path: 'schueler', component: SchuelerPage, title: 'Schulverwaltung – Schüler' },
  { path: 'lehrer', component: LehrerPage, title: 'Schulverwaltung – Lehrer' },
  { path: 'klassen', component: KlassenPage, title: 'Schulverwaltung – Klassen' },
  { path: 'faecher', component: FaecherPage, title: 'Schulverwaltung – Fächer' },
  { path: 'raeume', component: RaeumePage, title: 'Schulverwaltung – Räume' },
  { path: '**', redirectTo: '' }
];
