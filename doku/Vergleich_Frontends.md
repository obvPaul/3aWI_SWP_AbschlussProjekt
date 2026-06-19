# Vergleich der zwei Frontend-Varianten – Schulverwaltung (SWP-Abschlussprojekt 3aWI)

> **Zweck dieses Dokuments:** Vollständige Faktensammlung als Input für eine PowerPoint-Präsentation.
> Enthält: Projektkontext, Technologien, Architektur, Zeitaufwand, Probleme & Lösungen, Lessons learned,
> Vergleichstabellen und einen Foliengliederungs-Vorschlag.

---

## 1. Projektkontext

- **Schulprojekt:** SWP-Abschlussprojekt, 3. Jahrgang Wirtschaftsinformatik (3aWI), Einzelarbeit
- **Aufgabenstellung:**
  1. Manuelles Erstellen einer Angular-Applikation als Frontend für das Schulverwaltungs-Backend aus dem 1. Semester
  2. Erstellen derselben Applikation mittels „Low-Code" (KI-Tool, hier: **Claude Code**)
  3. Vergleich der beiden Ansätze (Präsentation)
- **Beide Frontends nutzen dasselbe Backend** – dadurch ist der Vergleich fair: gleiche Daten, gleiche API, gleicher Funktionsrahmen.

### Das gemeinsame Backend
- ASP.NET Core 8 Web-API (C#), Entity Framework Core, SQLite-Datenbank
- Swagger/OpenAPI-Dokumentation, CORS aktiviert
- Läuft auf `http://localhost:5225`
- REST-Endpoints mit **unterschiedlichem Funktionsumfang je Entität** (wichtig für beide UIs):

| Entität | GET | POST | PUT | DELETE |
|---|---|---|---|---|
| Schüler | ✅ | ✅ | ✅ | ✅ |
| Lehrer | ✅ | ✅ | ✅ | ✅ |
| Klasse | ✅ | ✅ | ❌ | ✅ |
| Fach | ✅ | ✅ | ❌ | ✅ |
| Raum | ✅ | ✅ | ❌ | ❌ |

---

## 2. Variante A: Manuell erstelltes Frontend (`frontend-manuell/`, Port 4300)

**Ansatz:** Klassische Angular-Entwicklung, wie man sie im Unterricht lernt. Bewusst einfach gehalten.

### Technologien & Code-Stil
- Angular 22 **mit zone.js** (klassische Change Detection)
- **Klassische Angular-Syntax:** `*ngFor` / `*ngIf` (Strukturdirektiven), `[(ngModel)]` (Template-driven Forms)
- **Constructor-Injection:** `constructor(private http: HttpClient) {}`
- **Keine Typisierung der API-Daten:** `any[]` statt Interfaces
- **HTTP-Aufrufe direkt in den Komponenten** – kein Service-Layer, URLs hartcodiert
- Pro Entität genau 2 Dateien: `xyz.component.ts` + `xyz.component.html`
- **Styling:** eine einzige globale `styles.css` mit einfachen Regeln (Arial, einfarbige Navigationsleiste, Tabellen mit Zebra-Streifen, zentriertes 800px-Layout) – kein Framework, keine Animationen, keine Lade-/Fehlerbehandlung

### Architektur (einfach)
```
app.ts (Nav)
 ├── schueler.component  → HttpClient direkt
 ├── lehrer.component    → HttpClient direkt
 ├── klassen.component   → HttpClient direkt
 ├── faecher.component   → HttpClient direkt
 └── raeume.component    → HttpClient direkt
```

### Funktionsumfang
- Alle 5 Entitäten mit allem, was das Backend hergibt (CRUD wo möglich)
- Dropdown-Zuordnungen (Schüler→Klasse, Klasse→Klassenvorstand, Fach→Lehrer)
- `confirm()`-Dialog vor dem Löschen
- **Bewusst NICHT vorhanden:** Dashboard, Ladeanzeigen, Fehlermeldungen im UI, Animationen, Responsive-Feinschliff

### Typischer Zeitaufwand bei manueller Entwicklung (Schätzung für eine:n Schüler:in im 3. Jahrgang)
| Tätigkeit | Aufwand |
|---|---|
| Projekt-Setup, Angular CLI, Routing verstehen | 1–2 h |
| Erste Entität komplett (Liste + Formular + HTTP) | 2–4 h |
| Restliche 4 Entitäten (Muster wiederholen) | 2–3 h |
| Fehlersuche (CORS, Datenbinding, Typfehler) | 1–3 h |
| Basis-Styling | 0,5–1 h |
| **Summe** | **ca. 1–2 Arbeitstage** |

---

## 3. Variante B: Low-Code-Frontend mit Claude Code (`frontend-lowcode/`, Port 4200)

**Ansatz:** Die gesamte App wurde von der KI (Claude Code) erstellt. Der Mensch gab nur Prompts in Alltagssprache.

### Technologien & Code-Stil
- Angular 22 **zoneless** (neueste Change-Detection-Strategie, ohne zone.js)
- **Moderne Angular-Syntax:** Signals (`signal()`, `set()`), `inject()` statt Constructor-Injection, neue Control-Flow-Syntax `@if` / `@for`
- **Saubere Architektur:** zentraler `SchulApiService` für alle HTTP-Aufrufe, typisierte Interfaces in `models.ts` (gespiegelt von den C#-Models)
- `forkJoin` (RxJS) für paralleles Laden mehrerer Endpoints
- Fehler- und Ladezustände überall als Signals modelliert

### Architektur (geschichtet)
```
app.ts (Sidebar-Layout)
 ├── models.ts            (typisierte Interfaces)
 ├── schul-api.service.ts (zentraler API-Layer)
 └── pages/
      ├── dashboard-page  (Kennzahlen, Count-up)
      ├── schueler-page / lehrer-page / klassen-page / faecher-page / raeume-page
```

### Funktionsumfang (deutlich mehr als Variante A)
- Alles aus Variante A **plus**:
- **Dashboard** mit Live-Kennzahlen aller 5 Entitäten
- **Fehlerbehandlung im UI** („Backend nicht erreichbar…"-Banner mit Shake-Animation)
- **Skeleton-/Shimmer-Ladeanimationen** (wie YouTube/Facebook)
- Hinweistexte, warum manche Aktionen fehlen (KI hat die Backend-Grenzen erkannt und dokumentiert!)

### Design: iOS „Liquid Glass"-Look (3 Design-Iterationen per Prompt)
1. **Iteration 1:** sauberes Standard-Design (Sidebar, Karten, Tabellen)
2. **Iteration 2** („verbessere drastisch, Animationen…"): Glassmorphism, Verlaufs-Hintergrund, Seitenübergänge, gestaffelte Zeilen-Animationen, hochzählende Dashboard-Zahlen (Count-up via `requestAnimationFrame`), Hover-Mikrointeraktionen
3. **Iteration 3** („repliziere den iOS-Glas-Look"): Frosted Glass im Apple-Stil – `backdrop-filter: blur(28px) saturate(180%)`, Lichtreflex-Kanten, Hairlines (0,5px), iOS-Systemfarben (#007AFF, #FF3B30), Pill-Buttons, helle Milchglas-Sidebar wie iPadOS, buntes „Wallpaper" im Hintergrund
- Alles **ohne Animations-Bibliothek** – reines CSS + ein `requestAnimationFrame`-Count-up

### Tatsächlich gemessener Zeitaufwand (real protokolliert)
| Schritt | Dauer |
|---|---|
| KI analysiert Backend selbstständig (Controller, Models, Ports) | ~5 min |
| Projekt-Scaffolding (`ng new`) | ~5 min |
| Generierung: Models, Service, 6 Seiten, Routing, Styling | ~10 min |
| Fehler 1 beheben: unvollständige npm-Installation | ~10 min |
| Fehler 2 beheben: TypeScript-Union-Type | ~2 min |
| Verifikation (Build, API-Tests, Dev-Server) | ~5 min |
| **Grundversion gesamt** | **~35–40 min** |
| Design-Iteration „drastisch verbessern" (Animationen) | ~10 min |
| Design-Iteration „iOS-Glas-Look" | ~10 min |
| **Gesamt inkl. allem Feinschliff** | **< 1 Stunde** |

### Die Prompts (wörtlich – zeigt den „Low-Code"-Charakter)
1. „bitte bau mir jetzt die lowcode app für das ganze ding"
2. „bitte verbessere das frontend von der lowcode variante drastisch, baue animationen ein, dynamische übergänge und einen schöneren look der beeindruckt"
3. „bitte repliziere den glas look vom apple betriebssystem iOS auf der gesamten website"

### Aufgetretene Probleme & wie die KI sie löste
| Problem | Ursache | Lösung (durch KI selbst) |
|---|---|---|
| Build-Fehler: „Could not find @angular/build" | Auf dem Rechner ist `NODE_ENV=production` gesetzt → npm installiert keine devDependencies | Diagnose über `npm config`, dann `npm ci --include=dev` |
| TS2349 „expression is not callable" | Union-Typ `Observable<Schueler> \| Observable<void>` – TypeScript kann `subscribe` nicht auflösen | Explizite Typisierung `Observable<unknown>` |
| Backend-Exe gesperrt beim Start | Eine Backend-Instanz lief bereits (Visual Studio) | Erkannt, dass die laufende Instanz nutzbar ist – kein Neustart nötig |

---

## 4. Direkter Vergleich (Kerntabelle für die Präsentation)

| Kriterium | Variante A: Manuell | Variante B: Low-Code (Claude Code) |
|---|---|---|
| **Zeitaufwand** | ca. 1–2 Arbeitstage (geschätzt) | **< 1 Stunde (gemessen)** |
| **Angular-Stil** | klassisch: `*ngFor`, `[(ngModel)]`, Constructor-DI, zone.js | modern: Signals, `@for`/`@if`, `inject()`, zoneless |
| **Typsicherheit** | `any[]` – keine | vollständige Interfaces |
| **Architektur** | HTTP direkt in Komponenten | Service-Layer + Models + Pages |
| **Fehlerbehandlung** | keine (nur Browser-Konsole) | UI-Banner, durchgängig |
| **Ladezustände** | keine | Skeleton-/Shimmer-Animationen |
| **Design** | Basic (Arial, einfache Tabellen) | iOS Liquid Glass, Animationen, Dashboard |
| **Funktionsumfang** | CRUD pur | CRUD + Dashboard + UX-Extras |
| **Lerneffekt** | hoch – man versteht jede Zeile | gering, wenn man den Code nicht aktiv nachvollzieht |
| **Code-Verständnis** | vollständig (selbst geschrieben) | muss nachträglich erarbeitet werden |
| **Kontrolle über Architektur** | vollständig | nur über Prompts & Code-Review |
| **Wartbarkeit** | mittel (Duplikate, keine Typen) | gut (zentraler Service, Typen) – aber nur wenn man ihn versteht |
| **Reproduzierbarkeit** | deterministisch | gleicher Prompt ≠ gleicher Code |
| **Kosten** | Arbeitszeit | Arbeitszeit + KI-Abo/Tokens |

### Paradoxe Erkenntnis (guter Diskussionspunkt!)
Die **KI schreibt moderneren und saubereren Code** als der typische Lernende (Signals, Typisierung, Service-Layer) –
aber der **Lernende versteht seinen eigenen einfachen Code besser** als den fremden sauberen.
Für die Schule ist das manuelle Schreiben durch nichts zu ersetzen; für die Produktivität ist die KI kaum zu schlagen.

---

## 5. Lessons learned

**Pro Low-Code:**
1. Faktor 10–20 schneller (unter 1 h statt 1–2 Tage)
2. KI analysierte das Backend selbstständig und passte die UI exakt an die vorhandenen Endpoints an (kein Bearbeiten-Button, wo es kein PUT gibt)
3. KI behebt eigene Fehler selbst (Build-Fehler, Typfehler)
4. Design-Iterationen kosten nur einen Satz („mach es schöner") statt Stunden

**Contra / Grenzen:**
1. **Umgebungsprobleme bleiben Handarbeit:** Das `NODE_ENV`-Problem hätte ohne npm-Wissen lange aufgehalten – die KI half, aber man muss die Diagnose verstehen können
2. **Verstehen ≠ Besitzen:** Wer den generierten Code präsentieren/warten muss, muss ihn trotzdem lesen und lernen
3. **Blindes Vertrauen riskant:** Architekturentscheidungen der KI sollte man bewusst abnehmen
4. **Prüfbarkeit:** In Prüfungssituationen ohne KI hilft nur, was man selbst kann

**Fazit-Satz für die letzte Folie:**
> „Low-Code mit KI ersetzt nicht das Lernen – aber es verändert, was es zu lernen gilt:
> weg vom Tippen von Boilerplate, hin zu Architekturverständnis, Code-Review und präzisem Formulieren."

---

## 6. Demo-Hinweise (für die Live-Präsentation)

- **Start:** Backend (`dotnet run` in `SWP_abschluss_projekt/`, Port 5225), dann beide Frontends:
  - Manuell: `npm start` in `frontend-manuell/` → http://localhost:4300
  - Low-Code: `npm start` in `frontend-lowcode/` → http://localhost:4200
  - Achtung auf diesem Rechner: ggf. `npm ci --include=dev` statt `npm install` (wegen `NODE_ENV=production`)
- **Wow-Momente Low-Code:** Dashboard öffnen (Zahlen zählen hoch), zwischen Seiten navigieren (Übergänge + gestaffelte Zeilen), Schüler anlegen (neue Zeile animiert herein), Hover über Kacheln (Glas-Lichtreflex)
- **Beweis der Echtheit:** F12 → Netzwerk-Tab (live API-Calls) oder Swagger auf http://localhost:5225/swagger
- **Beide nebeneinander** (zwei Browserfenster) ist der stärkste visuelle Vergleich
- Browser: **Chrome oder Edge** (wegen `backdrop-filter`)

---

## 7. Vorschlag Foliengliederung (für die PowerPoint-Erstellung)

1. **Titel** – Schulverwaltung: Manuell vs. Low-Code (Name, Klasse, Datum)
2. **Ausgangslage** – Backend aus dem 1. Semester (Diagramm: API + 2 Frontends)
3. **Aufgabenstellung** – die zwei Wege
4. **Variante A: Manuell** – Screenshot, Tech-Stack, Code-Snippet (`*ngFor`, Constructor-DI)
5. **Variante B: Low-Code** – Screenshot, Tech-Stack, die 3 Prompts wörtlich
6. **Entwicklungsschritte Low-Code** – Timeline 35 min → 1 h, inkl. der 2 Fehler + Lösungen
7. **Live-Demo** (beide Apps nebeneinander)
8. **Vergleichstabelle** (Kerntabelle aus Abschnitt 4, gekürzt auf 6–8 Zeilen)
9. **Paradoxe Erkenntnis** (sauberer Code vs. verstandener Code)
10. **Lessons learned** (je 3 Pro/Contra)
11. **Fazit** (Zitat aus Abschnitt 5)
12. **Fragen?** – mit Bereitschaft, direkt in den Code zu springen

### Material, das für Folien-Screenshots bereitsteht
- `frontend-manuell/` und `frontend-lowcode/` (laufende Apps)
- `frontend-lowcode/ENTWICKLUNG.md` (detailliertes Entwicklungsprotokoll)
- Code-Gegenüberstellung z. B.: `frontend-manuell/src/app/schueler.component.ts` (klassisch) vs. `frontend-lowcode/src/app/pages/schueler-page.ts` (Signals) vs. `frontend-lowcode/src/app/schul-api.service.ts` (Service-Layer)
