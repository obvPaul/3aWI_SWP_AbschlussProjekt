# Schulverwaltung – Low-Code-Frontend (Angular)

Dieses Frontend wurde im Rahmen des SWP-Abschlussprojekts **vollständig mit Claude Code (KI / "Low-Code")** erstellt –
im Gegensatz zum manuell entwickelten Angular-Frontend (`frontend-manuell`).

Die Entwicklungsschritte und Lessons learned sind in [ENTWICKLUNG.md](ENTWICKLUNG.md) dokumentiert.

## Voraussetzungen

- Node.js (installiert: v25)
- Das Backend `SWP_abschluss_projekt` muss laufen (Port **5225**, Profil "http")

## Starten

```bash
# 1. Backend starten (in SWP_abschluss_projekt/)
dotnet run --launch-profile http

# 2. Frontend starten (in frontend-lowcode/)
npm install          # nur beim ersten Mal
npm start            # startet ng serve auf http://localhost:4200
```

Danach im Browser öffnen: **http://localhost:4200**

> Hinweis: Auf diesem Rechner ist `NODE_ENV=production` gesetzt. Falls `npm install` die
> devDependencies weglässt, stattdessen `npm ci --include=dev` verwenden.

## Funktionen

| Seite | Funktionen | Begrenzung durch Backend |
|---|---|---|
| Dashboard | Anzahl aller Datensätze | – |
| Schüler | Anlegen, Bearbeiten, Löschen, Klassenzuordnung | volle CRUD |
| Lehrer | Anlegen, Bearbeiten, Löschen | volle CRUD |
| Klassen | Anlegen (mit KV-Auswahl), Löschen | kein Update-Endpoint |
| Fächer | Anlegen (mit Lehrer-Auswahl), Löschen | kein Update-Endpoint |
| Räume | Anzeigen, Anlegen | kein Update/Delete-Endpoint |

## Technik

- Angular 22, Standalone Components, Signals, neue Control-Flow-Syntax (`@if`/`@for`)
- Ein zentraler `SchulApiService` (`src/app/schul-api.service.ts`) für alle HTTP-Aufrufe
- Datenmodelle in `src/app/models.ts` spiegeln die C#-Models des Backends
- Kein UI-Framework – eigenes CSS in `src/styles.css`
