import { Routes } from '@angular/router';
import { SchuelerComponent } from './schueler.component';
import { LehrerComponent } from './lehrer.component';
import { KlassenComponent } from './klassen.component';
import { FaecherComponent } from './faecher.component';
import { RaeumeComponent } from './raeume.component';

export const routes: Routes = [
  { path: '', redirectTo: 'schueler', pathMatch: 'full' },
  { path: 'schueler', component: SchuelerComponent },
  { path: 'lehrer', component: LehrerComponent },
  { path: 'klassen', component: KlassenComponent },
  { path: 'faecher', component: FaecherComponent },
  { path: 'raeume', component: RaeumeComponent }
];
