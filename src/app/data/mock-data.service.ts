import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

import type { InfoASD, Squadre, Team, Calendario, InfoIscrizione, Faq } from './types';

@Injectable({ providedIn: 'root' })
export class MockDataService {
  private readonly http = inject(HttpClient);

  // Cache stream con shareReplay per evitare richieste duplicate
  readonly info$: Observable<InfoASD> = this.http
    .get<InfoASD>('/assets/mock/info.json')
    .pipe(shareReplay(1));

  readonly squadre$: Observable<Squadre> = this.http
    .get<Squadre>('/assets/mock/squadre.json')
    .pipe(shareReplay(1));

  readonly team$: Observable<Team> = this.http
    .get<Team>('/assets/mock/team.json')
    .pipe(shareReplay(1));

  readonly calendario$: Observable<Calendario> = this.http
    .get<Calendario>('/assets/mock/calendario.json')
    .pipe(shareReplay(1));

  readonly iscrizione$: Observable<InfoIscrizione> = this.http
    .get<InfoIscrizione>('/assets/mock/iscrizione.json')
    .pipe(shareReplay(1));

  readonly faq$: Observable<Faq> = this.http
    .get<Faq>('/assets/mock/faq.json')
    .pipe(shareReplay(1));
}
