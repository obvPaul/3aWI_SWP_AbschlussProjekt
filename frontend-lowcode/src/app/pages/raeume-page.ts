import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SchulApiService } from '../schul-api.service';
import { Raum } from '../models';

@Component({
  selector: 'app-raeume-page',
  imports: [FormsModule],
  templateUrl: './raeume-page.html'
})
export class RaeumePage implements OnInit {
  private api = inject(SchulApiService);

  raeume = signal<Raum[]>([]);
  laden = signal(true);
  fehler = signal<string | null>(null);

  // Formularfeld (Backend bietet für Räume nur Lesen + Anlegen an)
  bezeichnung = '';

  ngOnInit(): void {
    this.ladeDaten();
  }

  ladeDaten(): void {
    this.laden.set(true);
    this.api.getRaeume().subscribe({
      next: (raeume) => {
        this.raeume.set(raeume);
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
    this.api.createRaum(this.bezeichnung.trim()).subscribe({
      next: () => {
        this.bezeichnung = '';
        this.ladeDaten();
      },
      error: () => this.fehler.set('Anlegen fehlgeschlagen.')
    });
  }
}
