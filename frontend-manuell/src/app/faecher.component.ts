import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-faecher',
  imports: [CommonModule, FormsModule],
  templateUrl: './faecher.component.html'
})
export class FaecherComponent implements OnInit {
  faecher: any[] = [];
  lehrer: any[] = [];

  bezeichnung = '';
  lehrerId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.laden();
  }

  laden() {
    this.http.get<any[]>('http://localhost:5225/api/Fach').subscribe(daten => {
      this.faecher = daten;
    });
    this.http.get<any[]>('http://localhost:5225/api/Lehrer').subscribe(daten => {
      this.lehrer = daten;
    });
  }

  anlegen() {
    const body = {
      bezeichnung: this.bezeichnung,
      lehrer: this.lehrerId ? { id: this.lehrerId } : null
    };
    this.http.post('http://localhost:5225/api/Fach', body).subscribe(() => {
      this.bezeichnung = '';
      this.lehrerId = null;
      this.laden();
    });
  }

  loeschen(id: number) {
    if (confirm('Wirklich löschen?')) {
      this.http.delete('http://localhost:5225/api/Fach/' + id).subscribe(() => {
        this.laden();
      });
    }
  }
}
