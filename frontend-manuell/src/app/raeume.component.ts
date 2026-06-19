import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-raeume',
  imports: [CommonModule, FormsModule],
  templateUrl: './raeume.component.html'
})
export class RaeumeComponent implements OnInit {
  raeume: any[] = [];

  bezeichnung = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.laden();
  }

  laden() {
    this.http.get<any[]>('http://localhost:5225/api/Raum').subscribe(daten => {
      this.raeume = daten;
    });
  }

  anlegen() {
    this.http.post('http://localhost:5225/api/Raum', { bezeichnung: this.bezeichnung }).subscribe(() => {
      this.bezeichnung = '';
      this.laden();
    });
  }
}
