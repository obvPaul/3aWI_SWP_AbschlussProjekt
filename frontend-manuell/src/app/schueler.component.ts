import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-schueler',
  imports: [CommonModule, FormsModule],
  templateUrl: './schueler.component.html'
})
export class SchuelerComponent implements OnInit {
  schueler: any[] = [];
  klassen: any[] = [];

  vorname = '';
  nachname = '';
  klasseId: number | null = null;
  editId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.laden();
  }

  laden() {
    this.http.get<any[]>('http://localhost:5225/api/Schueler').subscribe(daten => {
      this.schueler = daten;
    });
    this.http.get<any[]>('http://localhost:5225/api/Klasse').subscribe(daten => {
      this.klassen = daten;
    });
  }

  speichern() {
    if (this.editId == null) {
      const body = {
        vorname: this.vorname,
        nachname: this.nachname,
        klasse: this.klasseId ? { id: this.klasseId } : null
      };
      this.http.post('http://localhost:5225/api/Schueler', body).subscribe(() => {
        this.zuruecksetzen();
        this.laden();
      });
    } else {
      const body = {
        id: this.editId,
        vorname: this.vorname,
        nachname: this.nachname,
        klasse: this.klasseId ? { id: this.klasseId } : null
      };
      this.http.put('http://localhost:5225/api/Schueler/' + this.editId, body).subscribe(() => {
        this.zuruecksetzen();
        this.laden();
      });
    }
  }

  bearbeiten(s: any) {
    this.editId = s.id;
    this.vorname = s.vorname;
    this.nachname = s.nachname;
    this.klasseId = s.klasse ? s.klasse.id : null;
  }

  loeschen(id: number) {
    if (confirm('Wirklich löschen?')) {
      this.http.delete('http://localhost:5225/api/Schueler/' + id).subscribe(() => {
        this.laden();
      });
    }
  }

  zuruecksetzen() {
    this.editId = null;
    this.vorname = '';
    this.nachname = '';
    this.klasseId = null;
  }
}
