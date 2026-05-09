import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MockDataService } from '../../data/mock-data.service';

@Component({
  selector: 'app-squadre',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, RouterLink],
  template: `
    <section class="page-header">
      <div class="demo-container">
        <h1>Le nostre squadre</h1>
        <p>6 categorie giovanili FIGC, dai Piccoli Amici ai Juniores. 180 atleti, 12 tecnici qualificati.</p>
      </div>
    </section>

    <article class="demo-container content" *ngIf="squadre$ | async as data">
      <ul class="squadre-grid">
        <li *ngFor="let s of data.squadre" class="squadra-card">
          <div class="squadra-card__header">
            <div class="squadra-card__sigla">{{ s.siglaFIGC }}</div>
            <div class="squadra-card__info">
              <h2>{{ s.categoria }}</h2>
              <span class="squadra-card__eta">{{ s.fasciaDiEta }}</span>
            </div>
          </div>

          <div class="squadra-card__tecnici">
            <span class="label">Allenatore:</span>
            <strong>{{ s.allenatore }}</strong>
            <span class="sep" aria-hidden="true">·</span>
            <span class="label">Assistente:</span>
            <span>{{ s.assistente }}</span>
          </div>

          <p class="squadra-card__obiettivi">{{ s.descrizioneObiettivi }}</p>

          <div class="squadra-card__footer">
            <ul class="squadra-card__allenamenti">
              <li *ngFor="let a of s.orariAllenamento" class="allenamento-slot">
                <span class="allenamento-slot__giorno">{{ a.giorno }}</span>
                <span class="allenamento-slot__orario">{{ a.orario }}</span>
              </li>
            </ul>
            <div class="squadra-card__stats">
              <span class="stat-pill">
                <strong>{{ s.numeroGiocatori }}</strong> atleti
              </span>
              <span class="stat-pill stat-pill--partita">
                Partita: {{ s.giornoPartita }}
              </span>
            </div>
          </div>
        </li>
      </ul>

      <aside class="info-note">
        <h3>Provini gratuiti tutto l'anno</h3>
        <p>
          Accettiamo bambini e ragazzi in prova in qualsiasi momento della stagione.
          Contatta la segreteria per concordare un accesso a un allenamento.
        </p>
        <a routerLink="/iscrivi" class="btn btn-primary">Richiedi un provino</a>
      </aside>
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
        font-size: 1.05rem;
      }
      .content {
        padding: 3rem 1rem;
      }
      .squadre-grid {
        list-style: none;
        margin: 0 0 3rem;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 1.5rem;
      }
      .squadra-card {
        background: var(--color-bg-default);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        border-top: 4px solid var(--color-accent);
        transition: box-shadow 0.15s ease;
      }
      .squadra-card:hover {
        box-shadow: 0 4px 16px rgba(22, 163, 74, 0.12);
      }
      .squadra-card__header {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .squadra-card__sigla {
        width: 64px;
        height: 64px;
        flex-shrink: 0;
        border-radius: var(--radius-md);
        background: var(--color-brand-blue);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.78rem;
        font-weight: 800;
        text-align: center;
        letter-spacing: 0.02em;
        line-height: 1.2;
      }
      .squadra-card__info h2 {
        margin: 0 0 0.25rem;
        font-size: 1.2rem;
        color: var(--color-brand-blue);
      }
      .squadra-card__eta {
        font-size: 0.82rem;
        color: var(--color-fg-muted);
        font-weight: 500;
      }
      .squadra-card__tecnici {
        display: flex;
        flex-wrap: wrap;
        gap: 0.3rem;
        align-items: center;
        font-size: 0.87rem;
        color: var(--color-fg-muted);
        background: var(--color-bg-subtle);
        padding: 0.6rem 0.85rem;
        border-radius: var(--radius-sm);
      }
      .squadra-card__tecnici strong {
        color: var(--color-fg-default);
      }
      .label {
        font-weight: 600;
        color: var(--color-fg-muted);
      }
      .sep {
        color: var(--color-border);
      }
      .squadra-card__obiettivi {
        margin: 0;
        font-size: 0.9rem;
        color: var(--color-fg-muted);
        line-height: 1.6;
        flex: 1;
      }
      .squadra-card__footer {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .squadra-card__allenamenti {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
      }
      .allenamento-slot {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.85rem;
        padding: 0.35rem 0;
        border-bottom: 1px dashed var(--color-border);
      }
      .allenamento-slot:last-child {
        border-bottom: none;
      }
      .allenamento-slot__giorno {
        font-weight: 600;
        color: var(--color-fg-default);
      }
      .allenamento-slot__orario {
        color: var(--color-fg-muted);
        font-family: var(--font-mono);
        font-size: 0.82rem;
      }
      .squadra-card__stats {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      .stat-pill {
        font-size: 0.78rem;
        padding: 0.25rem 0.65rem;
        border-radius: 9999px;
        background: var(--color-bg-subtle);
        color: var(--color-fg-muted);
        border: 1px solid var(--color-border);
      }
      .stat-pill strong {
        color: var(--color-accent);
      }
      .stat-pill--partita {
        background: #dbeafe;
        color: var(--color-brand-blue);
        border-color: #bfdbfe;
      }
      .info-note {
        background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
        border: 1px solid #bbf7d0;
        border-radius: var(--radius-lg);
        padding: 2rem;
        text-align: center;
      }
      .info-note h3 {
        margin: 0 0 0.75rem;
        color: var(--color-success);
        font-size: 1.2rem;
      }
      .info-note p {
        margin: 0 0 1.5rem;
        color: var(--color-fg-muted);
        max-width: 480px;
        margin-left: auto;
        margin-right: auto;
      }
      .btn {
        display: inline-block;
        padding: 0.7rem 1.5rem;
        border-radius: var(--radius-md);
        text-decoration: none;
        font-weight: 600;
        font-size: 0.95rem;
        transition: all 0.15s ease;
      }
      .btn:hover {
        text-decoration: none;
      }
      .btn-primary {
        background: var(--color-accent);
        color: #ffffff;
      }
      .btn-primary:hover {
        background: var(--color-accent-hover);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SquadreComponent {
  private readonly mockData = inject(MockDataService);

  readonly squadre$ = this.mockData.squadre$;
}
