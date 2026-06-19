import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { SchulApiService } from '../schul-api.service';
import { Klasse, Schueler } from '../models';

@Component({
  selector: 'app-schueler-page',
  imports: [FormsModule],
  templateUrl: './schueler-page.html'
})
export class SchuelerPage implements OnInit {
  private api = inject(SchulApiService);

  schueler = signal<Schueler[]>([]);
  klassen = signal<Klasse[]>([]);
  laden = signal(true);
  fehler = signal<string | null>(null);

  // Formularfelder
  vorname = '';
  nachname = '';
  klasseId: number | null = null;
  bearbeiteId: number | null = null; // null = Neuanlage, sonst Bearbeitung

  ngOnInit(): void {
    this.ladeDaten();
  }

  ladeDaten(): void {
    this.laden.set(true);
    forkJoin({
      schueler: this.api.getSchueler(),
      klassen: this.api.getKlassen()
    }).subscribe({
      next: (r) => {
        this.schueler.set(r.schueler);
        this.klassen.set(r.klassen);
        this.fehler.set(null);
        this.laden.set(false);
      },
      error: () => {
        this.fehler.set('Backend nicht erreichbar – läuft die API auf http://localhost:5225?');
        this.laden.set(false);
      }
    });
  }

  speichern(): void {
    if (!this.vorname.trim() || !this.nachname.trim()) return;

    const anfrage: Observable<unknown> = this.bearbeiteId === null
      ? this.api.createSchueler(this.vorname.trim(), this.nachname.trim(), this.klasseId)
      : this.api.updateSchueler(this.bearbeiteId, this.vorname.trim(), this.nachname.trim(), this.klasseId);

    anfrage.subscribe({
      next: () => {
        this.formularZuruecksetzen();
        this.ladeDaten();
      },
      error: () => this.fehler.set('Speichern fehlgeschlagen.')
    });
  }

  bearbeiten(s: Schueler): void {
    this.bearbeiteId = s.id;
    this.vorname = s.vorname;
    this.nachname = s.nachname;
    this.klasseId = s.klasse?.id ?? null;
  }

  loeschen(s: Schueler): void {
    if (!confirm(`Schüler "${s.vorname} ${s.nachname}" wirklich löschen?`)) return;
    this.api.deleteSchueler(s.id).subscribe({
      next: () => this.ladeDaten(),
      error: () => this.fehler.set('Löschen fehlgeschlagen.')
    });
  }

  formularZuruecksetzen(): void {
    this.bearbeiteId = null;
    this.vorname = '';
    this.nachname = '';
    this.klasseId = null;
  }
}
