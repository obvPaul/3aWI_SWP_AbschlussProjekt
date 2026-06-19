# Schulverwaltung – Manuell erstelltes Angular-Frontend

⚠️ **Dies ist die MANUELL entwickelte Variante** des Frontends (im Gegensatz zur
KI-generierten Variante in `frontend-lowcode/`).

Einfaches Angular-Frontend für das Schulverwaltungs-Backend (`SWP_abschluss_projekt`).

## Starten

1. Backend starten (läuft auf http://localhost:5225)
2. Hier im Ordner:

```bash
npm install
npm start
```

3. Browser: http://localhost:4200 (bzw. anderer Port, wenn 4200 belegt ist)

## Aufbau

- Pro Entität eine Komponente: `schueler`, `lehrer`, `klassen`, `faecher`, `raeume`
- HTTP-Aufrufe direkt mit `HttpClient` in den Komponenten
- Klassisches Angular: `*ngFor`/`*ngIf`, `[(ngModel)]`, Constructor-Injection
