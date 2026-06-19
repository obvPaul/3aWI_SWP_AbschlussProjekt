import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { SchulApiService } from '../schul-api.service';
import { Klasse, Lehrer } from '../models';

@Component({
  selector: 'app-klassen-page',
  imports: [FormsModule],
  templateUrl: './klassen-page.html'
})
export class KlassenPage implements OnInit {
  private api = inject(SchulApiService);

  klassen = signal<Klasse[]>([]);
  lehrer = signal<Lehrer[]>([]);
  laden = signal(true);
  fehler = signal<string | null>(null);

  // Formularfelder (Backend bietet für Klassen kein Update an → nur Anlegen)
  name = '';
  klassenvorstandId: number | null = null;

  ngOnInit(): void {
    this.ladeDaten();
  }

  ladeDaten(): void {
    this.laden.set(true);
    forkJoin({
      klassen: this.api.getKlassen(),
      lehrer: this.api.getLehrer()
    }).subscribe({
      next: (r) => {
        this.klassen.set(r.klassen);
        this.lehrer.set(r.lehrer);
        this.fehler.set(null);
        this.laden.set(false);
      },
      error: () => {
        this.fehler.set('Backend nicht erreichbar – läuft die API auf http://localhost:5225?');
        this.laden.set(false);
      }
    });
  }

  anlegen(): void {
    if (!this.name.trim()) return;
    this.api.createKlasse(this.name.trim(), this.klassenvorstandId).subscribe({
      next: () => {
        this.name = '';
        this.klassenvorstandId = null;
        this.ladeDaten();
      },
      error: () => this.fehler.set('Anlegen fehlgeschlagen.')
    });
  }

  loeschen(k: Klasse): void {
    if (!confirm(`Klasse "${k.name}" wirklich löschen?`)) return;
    this.api.deleteKlasse(k.id).subscribe({
      next: () => this.ladeDaten(),
      error: () => this.fehler.set('Löschen fehlgeschlagen – sind der Klasse noch Schüler zugeordnet?')
    });
  }
}
