import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-klassen',
  imports: [CommonModule, FormsModule],
  templateUrl: './klassen.component.html'
})
export class KlassenComponent implements OnInit {
  klassen: any[] = [];
  lehrer: any[] = [];

  name = '';
  kvId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.laden();
  }

  laden() {
    this.http.get<any[]>('http://localhost:5225/api/Klasse').subscribe(daten => {
      this.klassen = daten;
    });
    this.http.get<any[]>('http://localhost:5225/api/Lehrer').subscribe(daten => {
      this.lehrer = daten;
    });
  }

  anlegen() {
    const body = {
      name: this.name,
      klassenvorstand: this.kvId ? { id: this.kvId } : null
    };
    this.http.post('http://localhost:5225/api/Klasse', body).subscribe(() => {
      this.name = '';
      this.kvId = null;
      this.laden();
    });
  }

  loeschen(id: number) {
    if (confirm('Wirklich löschen?')) {
      this.http.delete('http://localhost:5225/api/Klasse/' + id).subscribe(() => {
        this.laden();
      });
    }
  }
}
