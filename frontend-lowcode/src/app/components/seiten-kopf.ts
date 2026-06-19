import { Component, input } from '@angular/core';

@Component({
  selector: 'app-seiten-kopf',
  template: `
    <h2>{{ titel() }}</h2>
    <p class="seiten-beschreibung">{{ beschreibung() }}</p>
  `
})
export class SeitenKopf {
  titel = input.required<string>();
  beschreibung = input('');
}
