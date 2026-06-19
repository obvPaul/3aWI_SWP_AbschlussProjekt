import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lehrer',
  imports: [CommonModule, FormsModule],
  templateUrl: './lehrer.component.html'
})
export class LehrerComponent implements OnInit {
  lehrer: any[] = [];

  vorname = '';
  nachname = '';
  editId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.laden();
  }

  laden() {
    this.http.get<any[]>('http://localhost:5225/api/Lehrer').subscribe(daten => {
      this.lehrer = daten;
    });
  }

  speichern() {
    if (this.editId == null) {
      const body = { vorname: this.vorname, nachname: this.nachname };
      this.http.post('http://localhost:5225/api/Lehrer', body).subscribe(() => {
        this.zuruecksetzen();
        this.laden();
      });
    } else {
      const body = { id: this.editId, vorname: this.vorname, nachname: this.nachname };
      this.http.put('http://localhost:5225/api/Lehrer/' + this.editId, body).subscribe(() => {
        this.zuruecksetzen();
        this.laden();
      });
    }
  }

  bearbeiten(l: any) {
    this.editId = l.id;
    this.vorname = l.vorname;
    this.nachname = l.nachname;
  }

  loeschen(id: number) {
    if (confirm('Wirklich löschen?')) {
      this.http.delete('http://localhost:5225/api/Lehrer/' + id).subscribe(() => {
        this.laden();
      });
    }
  }

  zuruecksetzen() {
    this.editId = null;
    this.vorname = '';
    this.nachname = '';
  }
}
