// Datenmodelle – spiegeln die C#-Models des Backends (SWP_abschluss_projekt/Models)

export interface Lehrer {
  id: number;
  vorname: string;
  nachname: string;
}

export interface Klasse {
  id: number;
  name: string;
  klassenvorstand?: Lehrer | null;
  schueler?: Schueler[];
}

export interface Schueler {
  id: number;
  vorname: string;
  nachname: string;
  klasse?: Klasse | null;
}

export interface Fach {
  id: number;
  bezeichnung: string;
  lehrer?: Lehrer | null;
}

export interface Raum {
  id: number;
  bezeichnung: string;
}
