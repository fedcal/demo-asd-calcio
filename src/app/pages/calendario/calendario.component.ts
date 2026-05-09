import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { map } from 'rxjs';

import { MockDataService } from '../../data/mock-data.service';

type FiltroSquadra = 'tutte' | string;

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgFor, NgIf],
  template: `
    <section class="page-header">
      <div class="demo-container">
        <h1>Calendario</h1>
        <p>Partite e eventi della stagione 2025-2026. Aggiornato in tempo reale.</p>
      </div>
    </section>

    <article class="demo-container content" *ngIf="calendario$ | async as cal">
      <!-- Partite -->
      <section class="partite-section">
        <div class="section-header">
          <h2>Prossime partite</h2>
          <div class="filtri" role="group" aria-label="Filtra per squadra">
            <button
              class="filtro-btn"
              [class.active]="filtroSquadra() === 'tutte'"
              (click)="setFiltro('tutte')"
              type="button"
            >
              Tutte
            </button>
            <button
              *ngFor="let s of squadreDisponibili$ | async"
              class="filtro-btn"
              [class.active]="filtroSquadra() === s"
              (click)="setFiltro(s)"
              type="button"
            >
              {{ s }}
            </button>
          </div>
        </div>

        <div class="table-wrapper" role="region" aria-label="Tabella partite">
          <table class="partite-table">
            <caption class="sr-only">Elenco prossime partite</caption>
            <thead>
              <tr>
                <th scope="col">Data</th>
                <th scope="col">Squadra</th>
                <th scope="col">Tipo</th>
                <th scope="col">Avversario</th>
                <th scope="col">Campo</th>
                <th scope="col">Competizione</th>
              </tr>
            </thead>
            <tbody>
              <ng-container *ngIf="partiteFiltrate$ | async as partite">
                <tr *ngFor="let p of partite" class="partita-row">
                  <td>
                    <time [dateTime]="p.data + 'T' + p.ora" class="partita-data">
                      <span class="data-giorno">{{ p.data | date: 'EEE d MMM' : '' : 'it' }}</span>
                      <span class="data-ora">{{ p.ora }}</span>
                    </time>
                  </td>
                  <td>
                    <span class="categoria-badge">{{ p.squadraNome }}</span>
                  </td>
                  <td>
                    <span class="tipo-badge" [class.casa]="p.tipo === 'casa'" [class.trasferta]="p.tipo === 'trasferta'">
                      {{ p.tipo === 'casa' ? 'Casa' : 'Trasferta' }}
                    </span>
                  </td>
                  <td class="avversario-cell">
                    <strong>Aurora</strong>
                    <span class="vs-sep">vs</span>
                    {{ p.avversario }}
                  </td>
                  <td class="campo-cell">{{ p.campo }}</td>
                  <td class="comp-cell">{{ p.competizione }}</td>
                </tr>
              </ng-container>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Divider -->
      <hr class="section-divider" />

      <!-- Eventi -->
      <section class="eventi-section">
        <h2>Eventi società</h2>
        <ul class="eventi-grid">
          <li *ngFor="let e of cal.eventi" class="evento-card" [class]="'evento-card--' + e.tipo">
            <div class="evento-card__date">
              <span class="evento-day">{{ e.data | date: 'd' : '' : 'it' }}</span>
              <span class="evento-month">{{ e.data | date: 'MMM' : '' : 'it' }}</span>
            </div>
            <div class="evento-card__body">
              <div class="evento-card__tipo-badge">{{ tipoLabel(e.tipo) }}</div>
              <h3>{{ e.titolo }}</h3>
              <p class="evento-ora-luogo">
                <time [dateTime]="e.data + 'T' + e.ora">{{ e.ora }}</time>
                · {{ e.luogo }}
              </p>
              <p class="evento-desc">{{ e.descrizione }}</p>
              <span *ngIf="e.aperto" class="evento-aperto-badge">Aperto al pubblico</span>
            </div>
          </li>
        </ul>
      </section>
    </article>
  `,
  styles: [
    `
      .page-header {
        padding: 4rem 1rem 3rem;
        background: linear-gradient(135deg, var(--color-brand-blue) 0%, #1e3a8a 100%);
        text-align: center;
        border-bottom: 3px solid var(--color-accent);
        color: #ffffff;
      }
      .page-header h1 {
        margin: 0 0 0.5rem;
        color: #ffffff;
        font-size: 2.25rem;
      }
      .page-header p {
        color: rgba(255, 255, 255, 0.85);
        margin: 0;
      }
      .content {
        padding: 3rem 1rem;
      }
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
        gap: 1rem;
      }
      .section-header h2 {
        margin: 0;
        font-size: 1.5rem;
        color: var(--color-brand-blue);
      }
      .filtri {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
      }
      .filtro-btn {
        background: var(--color-bg-subtle);
        border: 1px solid var(--color-border);
        border-radius: 9999px;
        padding: 0.3rem 0.85rem;
        font-size: 0.82rem;
        font-weight: 600;
        color: var(--color-fg-muted);
        cursor: pointer;
        transition: all 0.12s ease;
        font-family: inherit;
      }
      .filtro-btn:hover {
        background: #dbeafe;
        border-color: #93c5fd;
        color: var(--color-brand-blue);
      }
      .filtro-btn.active {
        background: var(--color-brand-blue);
        border-color: var(--color-brand-blue);
        color: #ffffff;
      }
      .table-wrapper {
        overflow-x: auto;
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border);
        margin-bottom: 0;
      }
      .partite-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.88rem;
      }
      .partite-table thead {
        background: var(--color-brand-blue);
        color: #ffffff;
      }
      .partite-table th {
        padding: 0.75rem 1rem;
        text-align: left;
        font-weight: 600;
        font-size: 0.8rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        white-space: nowrap;
      }
      .partita-row {
        border-bottom: 1px solid var(--color-border);
        transition: background 0.1s ease;
      }
      .partita-row:last-child {
        border-bottom: none;
      }
      .partita-row:hover {
        background: var(--color-bg-subtle);
      }
      .partite-table td {
        padding: 0.75rem 1rem;
        vertical-align: middle;
      }
      .partita-data {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
      }
      .data-giorno {
        font-weight: 600;
        color: var(--color-fg-default);
        font-size: 0.88rem;
        text-transform: capitalize;
      }
      .data-ora {
        font-family: var(--font-mono);
        font-size: 0.8rem;
        color: var(--color-fg-muted);
      }
      .categoria-badge {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--color-brand-blue);
        background: #dbeafe;
        padding: 0.2rem 0.55rem;
        border-radius: 9999px;
        white-space: nowrap;
      }
      .tipo-badge {
        font-size: 0.75rem;
        padding: 0.2rem 0.55rem;
        border-radius: 9999px;
        font-weight: 600;
        white-space: nowrap;
      }
      .tipo-badge.casa {
        background: #dafbe1;
        color: var(--color-success);
      }
      .tipo-badge.trasferta {
        background: #fff8c5;
        color: var(--color-warning);
      }
      .avversario-cell {
        white-space: nowrap;
      }
      .avversario-cell strong {
        color: var(--color-brand-blue);
      }
      .vs-sep {
        color: var(--color-fg-muted);
        font-size: 0.78rem;
        margin: 0 0.3rem;
      }
      .campo-cell {
        font-size: 0.82rem;
        color: var(--color-fg-muted);
        max-width: 220px;
      }
      .comp-cell {
        font-size: 0.82rem;
        color: var(--color-fg-muted);
        font-style: italic;
        white-space: nowrap;
      }

      /* Section divider */
      .section-divider {
        border: none;
        border-top: 1px solid var(--color-border);
        margin: 3rem 0;
      }

      /* Events */
      .eventi-section h2 {
        font-size: 1.5rem;
        color: var(--color-brand-blue);
        margin: 0 0 1.5rem;
      }
      .eventi-grid {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .evento-card {
        display: flex;
        gap: 1.25rem;
        padding: 1.25rem;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        background: var(--color-bg-default);
        align-items: flex-start;
        transition: box-shadow 0.15s ease;
      }
      .evento-card:hover {
        box-shadow: 0 2px 10px rgba(30, 64, 175, 0.08);
      }
      .evento-card--torneo {
        border-left: 4px solid var(--color-accent);
      }
      .evento-card--open-day {
        border-left: 4px solid var(--color-brand-blue);
      }
      .evento-card--riunione {
        border-left: 4px solid var(--color-warning);
      }
      .evento-card--premiazione {
        border-left: 4px solid #a855f7;
      }
      .evento-card__date {
        flex-shrink: 0;
        width: 52px;
        text-align: center;
        background: var(--color-brand-blue);
        color: #ffffff;
        border-radius: var(--radius-sm);
        padding: 0.5rem 0.25rem;
        line-height: 1;
      }
      .evento-day {
        display: block;
        font-size: 1.5rem;
        font-weight: 800;
        line-height: 1;
        margin-bottom: 0.2rem;
      }
      .evento-month {
        display: block;
        font-size: 0.72rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .evento-card__body {
        flex: 1;
        min-width: 0;
      }
      .evento-card__tipo-badge {
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--color-fg-muted);
        margin-bottom: 0.35rem;
      }
      .evento-card__body h3 {
        margin: 0 0 0.35rem;
        font-size: 1rem;
        color: var(--color-fg-default);
      }
      .evento-ora-luogo {
        font-size: 0.85rem;
        color: var(--color-fg-muted);
        margin: 0 0 0.5rem;
      }
      .evento-desc {
        font-size: 0.88rem;
        color: var(--color-fg-muted);
        line-height: 1.55;
        margin: 0 0 0.75rem;
      }
      .evento-aperto-badge {
        display: inline-block;
        font-size: 0.72rem;
        font-weight: 600;
        padding: 0.2rem 0.6rem;
        border-radius: 9999px;
        background: #dafbe1;
        color: var(--color-success);
        border: 1px solid #bbf7d0;
      }
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
      }

      @media (max-width: 640px) {
        .section-header {
          flex-direction: column;
        }
        .evento-card {
          flex-direction: column;
        }
        .evento-card__date {
          width: auto;
          display: flex;
          gap: 0.5rem;
          align-items: center;
          padding: 0.4rem 0.75rem;
          flex-direction: row;
        }
        .evento-day {
          font-size: 1.1rem;
          margin-bottom: 0;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarioComponent {
  private readonly mockData = inject(MockDataService);

  readonly filtroSquadra = signal<FiltroSquadra>('tutte');

  readonly calendario$ = this.mockData.calendario$;

  readonly squadreDisponibili$ = this.mockData.calendario$.pipe(
    map((cal) => {
      const unique = new Set(cal.partite.map((p) => p.squadraNome));
      return Array.from(unique);
    })
  );

  readonly partiteFiltrate$ = this.mockData.calendario$.pipe(
    map((cal) => {
      const filtro = this.filtroSquadra();
      if (filtro === 'tutte') {
        return cal.partite;
      }
      return cal.partite.filter((p) => p.squadraNome === filtro);
    })
  );

  setFiltro(squadra: FiltroSquadra): void {
    this.filtroSquadra.set(squadra);
  }

  tipoLabel(tipo: string): string {
    const labels: Record<string, string> = {
      torneo: 'Torneo',
      'open-day': 'Open Day',
      riunione: 'Riunione',
      premiazione: 'Premiazione',
      altro: 'Evento'
    };
    return labels[tipo] ?? 'Evento';
  }
}
