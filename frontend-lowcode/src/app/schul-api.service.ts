import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fach, Klasse, Lehrer, Raum, Schueler } from './models';

/**
 * Zentraler Service für alle Aufrufe an die Schul-API (ASP.NET Core Backend).
 *
 * Wichtig: Die Methoden bilden genau das ab, was das Backend anbietet –
 * z.B. gibt es für Räume kein Update/Delete, für Klassen/Fächer kein Update.
 */
@Injectable({ providedIn: 'root' })
export class SchulApiService {
  private http = inject(HttpClient);

  // Port aus SWP_abschluss_projekt/Properties/launchSettings.json (Profil "http")
  private baseUrl = 'http://localhost:5225/api';

  // ---------- Schüler (volle CRUD) ----------

  getSchueler(): Observable<Schueler[]> {
    return this.http.get<Schueler[]>(`${this.baseUrl}/Schueler`);
  }

  createSchueler(vorname: string, nachname: string, klasseId: number | null): Observable<Schueler> {
    // Das Backend lädt die Klasse anhand der Id selbst aus der DB
    const body = { vorname, nachname, klasse: klasseId ? { id: klasseId } : null };
    return this.http.post<Schueler>(`${this.baseUrl}/Schueler`, body);
  }

  updateSchueler(id: number, vorname: string, nachname: string, klasseId: number | null): Observable<void> {
    const body = { id, vorname, nachname, klasse: klasseId ? { id: klasseId } : null };
    return this.http.put<void>(`${this.baseUrl}/Schueler/${id}`, body);
  }

  deleteSchueler(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Schueler/${id}`);
  }

  // ---------- Lehrer (volle CRUD) ----------

  getLehrer(): Observable<Lehrer[]> {
    return this.http.get<Lehrer[]>(`${this.baseUrl}/Lehrer`);
  }

  createLehrer(vorname: string, nachname: string): Observable<Lehrer> {
    return this.http.post<Lehrer>(`${this.baseUrl}/Lehrer`, { vorname, nachname });
  }

  updateLehrer(id: number, vorname: string, nachname: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/Lehrer/${id}`, { id, vorname, nachname });
  }

  deleteLehrer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Lehrer/${id}`);
  }

  // ---------- Klassen (kein Update im Backend) ----------

  getKlassen(): Observable<Klasse[]> {
    return this.http.get<Klasse[]>(`${this.baseUrl}/Klasse`);
  }

  createKlasse(name: string, klassenvorstandId: number | null): Observable<Klasse> {
    const body = { name, klassenvorstand: klassenvorstandId ? { id: klassenvorstandId } : null };
    return this.http.post<Klasse>(`${this.baseUrl}/Klasse`, body);
  }

  deleteKlasse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Klasse/${id}`);
  }

  // ---------- Fächer (kein Update im Backend) ----------

  getFaecher(): Observable<Fach[]> {
    return this.http.get<Fach[]>(`${this.baseUrl}/Fach`);
  }

  createFach(bezeichnung: string, lehrerId: number | null): Observable<Fach> {
    const body = { bezeichnung, lehrer: lehrerId ? { id: lehrerId } : null };
    return this.http.post<Fach>(`${this.baseUrl}/Fach`, body);
  }

  deleteFach(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Fach/${id}`);
  }

  // ---------- Räume (nur Lesen + Anlegen im Backend) ----------

  getRaeume(): Observable<Raum[]> {
    return this.http.get<Raum[]>(`${this.baseUrl}/Raum`);
  }

  createRaum(bezeichnung: string): Observable<Raum> {
    return this.http.post<Raum>(`${this.baseUrl}/Raum`, { bezeichnung });
  }
}
