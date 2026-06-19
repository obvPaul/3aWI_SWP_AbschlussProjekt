# Entwicklungsprotokoll – Low-Code-Frontend mit Claude Code

Dieses Dokument protokolliert, wie diese Angular-App mit Claude Code (KI-Agent) erstellt wurde.
Es dient als Grundlage für den Präsentationsteil „Low-Code-Applikation: Entwicklungsschritte & Lessons learned".

**Datum:** 11./12. Juni 2026 · **Gesamtdauer: ca. 35–40 Minuten** (inkl. Fehlerbehebung)

## Der Prompt

Die gesamte App entstand aus einem einzigen Auftrag:

> „bitte bau mir jetzt die lowcode app für das ganze ding"

Alles Weitere (Anforderungen, API-Analyse, Architekturentscheidungen) hat die KI selbstständig
aus dem vorhandenen Backend-Code abgeleitet.

## Entwicklungsschritte (von der KI durchgeführt)

### 1. Analyse des Backends (~5 min)
- Alle Controller, Models und `launchSettings.json` gelesen
- Erkannt: API läuft auf `http://localhost:5225`, CORS bereits aktiviert
- **Wichtigste Erkenntnis:** Die Controller bieten unterschiedlich viele Operationen an:
  - Schüler/Lehrer: volle CRUD
  - Klassen/Fächer: kein PUT (Update)
  - Räume: nur GET + POST
- Die UI wurde exakt darauf zugeschnitten (z.B. kein „Bearbeiten"-Button bei Klassen)

### 2. Projekt-Scaffolding (~5 min)
- `npx @angular/cli new frontend-lowcode --defaults --skip-git --style css --ssr false`
- Ergebnis: Angular 22 mit Standalone Components und Signals

### 3. Code-Generierung (~10 min)
- `models.ts` – TypeScript-Interfaces, gespiegelt von den C#-Models
- `schul-api.service.ts` – ein zentraler Service für alle HTTP-Aufrufe
- 6 Seiten: Dashboard (mit Zählern via `forkJoin`) + je eine Seite pro Entität
- Routing, Sidebar-Layout, eigenes CSS (kein UI-Framework)
- Moderne Angular-Features: Signals, `inject()`, `@if`/`@for` Control Flow

### 4. Fehler 1: Unvollständige npm-Installation (~10 min Debugging)
- `ng build` schlug fehl: „Could not find the '@angular/build:application' builder"
- Ursache gefunden: Auf dem Rechner ist die Umgebungsvariable **`NODE_ENV=production`** gesetzt
  → npm installiert dann **keine devDependencies** (Angular CLI, Build-Tools fehlten)
- Lösung: `npm ci --include=dev`

### 5. Fehler 2: TypeScript-Union-Type (~2 min)
- `TS2349: This expression is not callable` bei `anfrage.subscribe(...)`
- Ursache: `Observable<Schueler> | Observable<void>` – auf einer Union verschiedener
  Observable-Typen kann TypeScript `subscribe` nicht auflösen
- Lösung: explizite Typisierung `const anfrage: Observable<unknown> = ...`

### 6. Verifikation (~5 min)
- `ng build` ✅ (Bundle: 322 kB)
- Backend gestartet, alle 5 Endpoints getestet ✅ (echte Daten: 4 Schüler, 4 Lehrer, 3 Klassen, 2 Fächer, 4 Räume)
- `ng serve` gestartet, App unter http://localhost:4200 erreichbar ✅

## Lessons learned

**Was gut funktioniert hat:**
1. **Geschwindigkeit:** ~35 Minuten für eine vollständige CRUD-App mit 6 Seiten –
   manuell wären dafür mehrere Stunden bis Tage nötig.
2. **Selbstständige Analyse:** Die KI hat das Backend gelesen und die UI exakt an die
   tatsächlich vorhandenen Endpoints angepasst – inklusive Hinweistexten in der UI,
   warum manche Buttons fehlen.
3. **Moderner Code:** Die KI verwendet aktuelle Angular-Idiome (Signals, Standalone,
   Control Flow), die man als Anfänger oft noch nicht kennt.
4. **Fehler werden selbst behoben:** Beide Build-Fehler hat die KI eigenständig
   diagnostiziert und gefixt.

**Was man kritisch sehen muss:**
1. **Umgebungsprobleme bleiben Handarbeit:** Das `NODE_ENV=production`-Problem ist ein
   lokales Konfigurationsproblem – ohne Verständnis von npm hätte man hier lange gesucht.
2. **Man muss den Code trotzdem verstehen:** Für Wartung, Erweiterung und (in unserem
   Fall) die Präsentation reicht „es funktioniert" nicht – Code-Review bleibt notwendig.
3. **Blindes Vertrauen ist riskant:** Die KI trifft Architekturentscheidungen
   (z.B. ein zentraler Service statt ein Service pro Entität), die man bewusst
   abnehmen oder ändern sollte.
4. **Reproduzierbarkeit:** Zweimal derselbe Prompt ergibt nicht zweimal denselben Code.

## Vergleich zum manuellen Ansatz (Kurzfassung für die Präsentation)

| Kriterium | Manuell | Low-Code (Claude Code) |
|---|---|---|
| Zeitaufwand | Stunden bis Tage | ~35 Minuten |
| Code-Verständnis | vollständig (selbst geschrieben) | muss nachträglich erarbeitet werden |
| Lerneffekt | hoch | gering (ohne aktives Nachvollziehen) |
| Codequalität | abhängig vom eigenen Können | konsistent, moderne Idiome |
| Fehlersuche | selbst | KI debuggt selbst, Umgebungsprobleme bleiben |
| Kontrolle über Architektur | vollständig | nur über Prompts / Review |
