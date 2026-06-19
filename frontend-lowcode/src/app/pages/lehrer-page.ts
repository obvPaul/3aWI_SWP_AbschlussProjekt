import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { SchulApiService } from '../schul-api.service';
import { Lehrer } from '../models';

@Component({
  selector: 'app-lehrer-page',
  imports: [FormsModule],
  templateUrl: './lehrer-page.html'
})
export class LehrerPage implements OnInit {
  private api = inject(SchulApiService);

  lehrer = signal<Lehrer[]>([]);
  laden = signal(true);
  fehler = signal<string | null>(null);

  // Formularfelder
  vorname = '';
  nachname = '';
  bearbeiteId: number | null = null;

  ngOnInit(): void {
    this.ladeDaten();
  }

  ladeDaten(): void {
    this.laden.set(true);
    this.api.getLehrer().subscribe({
      next: (lehrer) => {
        this.lehrer.set(lehrer);
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
      ? this.api.createLehrer(this.vorname.trim(), this.nachname.trim())
      : this.api.updateLehrer(this.bearbeiteId, this.vorname.trim(), this.nachname.trim());

    anfrage.subscribe({
      next: () => {
        this.formularZuruecksetzen();
        this.ladeDaten();
      },
      error: () => this.fehler.set('Speichern fehlgeschlagen.')
    });
  }

  bearbeiten(l: Lehrer): void {
    this.bearbeiteId = l.id;
    this.vorname = l.vorname;
    this.nachname = l.nachname;
  }

  loeschen(l: Lehrer): void {
    if (!confirm(`Lehrer "${l.vorname} ${l.nachname}" wirklich löschen?`)) return;
    this.api.deleteLehrer(l.id).subscribe({
      next: () => this.ladeDaten(),
      error: () => this.fehler.set('Löschen fehlgeschlagen – ist der Lehrer noch Klassenvorstand oder Fach zugeordnet?')
    });
  }

  formularZuruecksetzen(): void {
    this.bearbeiteId = null;
    this.vorname = '';
    this.nachname = '';
  }
}
