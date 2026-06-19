import { Component, input } from '@angular/core';

@Component({
  selector: 'app-fehler-banner',
  template: `
    @if (meldung()) {
      <div class="fehler-banner">{{ meldung() }}</div>
    }
  `
})
export class FehlerBanner {
  meldung = input<string | null>(null);
}
