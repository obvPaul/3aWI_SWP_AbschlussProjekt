import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly navLinks = [
    { pfad: '/', label: 'Dashboard', icon: '🏠', exakt: true },
    { pfad: '/schueler', label: 'Schüler', icon: '🎓', exakt: false },
    { pfad: '/lehrer', label: 'Lehrer', icon: '🧑‍🏫', exakt: false },
    { pfad: '/klassen', label: 'Klassen', icon: '🏫', exakt: false },
    { pfad: '/faecher', label: 'Fächer', icon: '📚', exakt: false },
    { pfad: '/raeume', label: 'Räume', icon: '🚪', exakt: false }
  ];
}
