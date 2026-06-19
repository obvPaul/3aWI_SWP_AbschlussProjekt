import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { SchulApiService } from '../schul-api.service';
import { Fach, Lehrer } from '../models';

@Component({
  selector: 'app-faecher-page',
  imports: [FormsModule],
  templateUrl: './faecher-page.html'
})
export class FaecherPage implements OnInit {
  private api = inject(SchulApiService);

  faecher = signal<Fach[]>([]);
  lehrer = signal<Lehrer[]>([]);
  laden = signal(true);
  fehler = signal<string | null>(null);

  // Formularfelder (Backend bietet für Fächer kein Update an → nur Anlegen)
  bezeichnung = '';
  lehrerId: number | null = null;

  ngOnInit(): void {
    this.ladeDaten();
  }

  ladeDaten(): void {
    this.laden.set(true);
    forkJoin({
      faecher: this.api.getFaecher(),
      lehrer: this.api.getLehrer()
    }).subscribe({
      next: (r) => {
        this.faecher.set(r.faecher);
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
    if (!this.bezeichnung.trim()) return;
    this.api.createFach(this.bezeichnung.trim(), this.lehrerId).subscribe({
      next: () => {
        this.bezeichnung = '';
        this.lehrerId = null;
        this.ladeDaten();
      },
      error: () => this.fehler.set('Anlegen fehlgeschlagen.')
    });
  }

  loeschen(f: Fach): void {
    if (!confirm(`Fach "${f.bezeichnung}" wirklich löschen?`)) return;
    this.api.deleteFach(f.id).subscribe({
      next: () => this.ladeDaten(),
      error: () => this.fehler.set('Löschen fehlgeschlagen.')
    });
  }
}
