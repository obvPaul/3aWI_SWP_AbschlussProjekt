import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SchulApiService } from '../schul-api.service';

interface Kachel {
  titel: string;
  anzahl: number;
  link: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink],
  templateUrl: './dashboard-page.html'
})
export class DashboardPage implements OnInit {
  private api = inject(SchulApiService);

  kacheln = signal<Kachel[]>([]);
  // Werte, die sichtbar von 0 hochzählen (Count-up-Animation)
  angezeigteZahlen = signal<number[]>([]);
  laden = signal(true);
  fehler = signal<string | null>(null);

  ngOnInit(): void {
    forkJoin({
      schueler: this.api.getSchueler(),
      lehrer: this.api.getLehrer(),
      klassen: this.api.getKlassen(),
      faecher: this.api.getFaecher(),
      raeume: this.api.getRaeume()
    }).subscribe({
      next: (r) => {
        this.kacheln.set([
          { titel: 'Schüler', anzahl: r.schueler.length, link: '/schueler', icon: '🎓' },
          { titel: 'Lehrer', anzahl: r.lehrer.length, link: '/lehrer', icon: '🧑‍🏫' },
          { titel: 'Klassen', anzahl: r.klassen.length, link: '/klassen', icon: '🏫' },
          { titel: 'Fächer', anzahl: r.faecher.length, link: '/faecher', icon: '📚' },
          { titel: 'Räume', anzahl: r.raeume.length, link: '/raeume', icon: '🚪' }
        ]);
        this.laden.set(false);
        this.zaehlerAnimieren();
      },
      error: () => {
        this.fehler.set('Backend nicht erreichbar – läuft die API auf http://localhost:5225?');
        this.laden.set(false);
      }
    });
  }

  /** Lässt die Zahlen über ~0,9s mit Ease-out von 0 zum Zielwert laufen. */
  private zaehlerAnimieren(): void {
    const ziele = this.kacheln().map(k => k.anzahl);
    const dauer = 900;
    const start = performance.now();

    const schritt = (jetzt: number) => {
      const t = Math.min(1, (jetzt - start) / dauer);
      const eased = 1 - Math.pow(1 - t, 3);
      this.angezeigteZahlen.set(ziele.map(z => Math.round(z * eased)));
      if (t < 1) requestAnimationFrame(schritt);
    };
    requestAnimationFrame(schritt);
  }
}
