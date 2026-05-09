import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { MockDataService } from '../../data/mock-data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgFor, NgIf, RouterLink],
  template: `
    <!-- Hero -->
    <section class="hero">
      <div class="demo-container hero__inner">
        <div class="hero__badge">Dal 1965 · Affiliata FIGC LND</div>
        <h1>Crescere con il pallone<br />tra i piedi dal 1965</h1>
        <p class="hero-tagline">
          ASD Polisportiva Aurora — 6 squadre giovanili, 180 atleti, 12 allenatori.<br />
          Il calcio giovanile della provincia di Brescia, con passione e serietà.
        </p>
        <div class="hero-actions">
          <a routerLink="/iscrivi" class="btn btn-primary">Iscriviti ora</a>
          <a routerLink="/squadre" class="btn btn-secondary">Le nostre squadre</a>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="stats-band">
      <div class="demo-container">
        <ul class="stats-grid">
          <li class="stat-item">
            <span class="stat-number">180</span>
            <span class="stat-label">Atleti iscritti</span>
          </li>
          <li class="stat-item">
            <span class="stat-number">6</span>
            <span class="stat-label">Squadre giovanili</span>
          </li>
          <li class="stat-item">
            <span class="stat-number">12</span>
            <span class="stat-label">Allenatori qualificati</span>
          </li>
          <li class="stat-item">
            <span class="stat-number">60+</span>
            <span class="stat-label">Anni di storia</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Valori -->
    <section class="values demo-container">
      <h2 class="section-title">I nostri valori</h2>
      <ul class="values-grid">
        <li class="value-card">
          <span class="value-icon" aria-hidden="true">📚</span>
          <h3>Formazione</h3>
          <p>Ogni allenamento è prima di tutto una lezione di vita. I nostri tecnici qualificati FIGC costruiscono percorsi di crescita individuali.</p>
        </li>
        <li class="value-card">
          <span class="value-icon" aria-hidden="true">😄</span>
          <h3>Divertimento</h3>
          <p>Il calcio giovanile deve essere gioia. Mettiamo il sorriso dei ragazzi davanti a tutto, anche ai risultati.</p>
        </li>
        <li class="value-card">
          <span class="value-icon" aria-hidden="true">🤝</span>
          <h3>Rispetto</h3>
          <p>Rispetto per l'avversario, per l'arbitro, per i compagni e per lo staff. Insegniamo il fair play come stile di vita.</p>
        </li>
        <li class="value-card">
          <span class="value-icon" aria-hidden="true">🏆</span>
          <h3>Fair Play</h3>
          <p>Vinciamo e perdiamo con la stessa dignità. La lealtà sportiva è il nostro trofeo più importante.</p>
        </li>
      </ul>
    </section>

    <!-- Prossime partite -->
    <section class="prossime-partite" *ngIf="prossimePartite$ | async as partite">
      <div class="demo-container">
        <div class="section-header">
          <h2>Prossime partite</h2>
          <a routerLink="/calendario" class="link-more">Tutto il calendario →</a>
        </div>
        <ul class="partite-grid">
          <li *ngFor="let p of partite" class="partita-card">
            <div class="partita-card__meta">
              <span class="partita-card__categoria">{{ p.squadraNome }}</span>
              <span class="partita-card__tipo" [class.casa]="p.tipo === 'casa'" [class.trasferta]="p.tipo === 'trasferta'">
                {{ p.tipo === 'casa' ? 'Casa' : 'Trasferta' }}
              </span>
            </div>
            <div class="partita-card__match">
              <span class="partita-card__aurora">Aurora</span>
              <span class="partita-card__vs">vs</span>
              <span class="partita-card__avversario">{{ p.avversario }}</span>
            </div>
            <div class="partita-card__info">
              <time [dateTime]="p.data + 'T' + p.ora">
                {{ p.data | date: 'EEEE d MMMM' : '' : 'it' }} · {{ p.ora }}
              </time>
            </div>
            <p class="partita-card__competizione">{{ p.competizione }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- CTA band -->
    <section class="cta-band">
      <div class="demo-container">
        <h2>Provini gratuiti — nessun impegno</h2>
        <p>
          Porta il tuo bambino a provare. Accettiamo atleti dai 5 ai 19 anni,
          tutto l'anno. I nostri tecnici valuteranno la categoria più adatta.
        </p>
        <div class="hero-actions">
          <a routerLink="/iscrivi" class="btn btn-primary">Contattaci per un provino</a>
          <a routerLink="/chi-siamo" class="btn btn-secondary btn-secondary--light">Scopri la nostra storia</a>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      /* Hero */
      .hero {
        padding: 5rem 1rem;
        text-align: center;
        background: linear-gradient(160deg, #1e3a8a 0%, #1e40af 50%, #15803d 100%);
        border-bottom: 3px solid var(--color-accent);
        color: #ffffff;
      }
      .hero__inner {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .hero__badge {
        display: inline-block;
        background: rgba(255, 255, 255, 0.15);
        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.3);
        padding: 0.3rem 1rem;
        border-radius: 9999px;
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        letter-spacing: 0.03em;
      }
      .hero h1 {
        font-size: clamp(2rem, 5vw, 3.25rem);
        margin: 0 0 1rem;
        color: #ffffff;
        line-height: 1.2;
        font-weight: 800;
      }
      .hero-tagline {
        font-size: 1.1rem;
        color: rgba(255, 255, 255, 0.88);
        margin: 0 0 2.5rem;
        max-width: 600px;
        line-height: 1.6;
      }
      .hero-actions {
        display: flex;
        gap: 0.75rem;
        justify-content: center;
        flex-wrap: wrap;
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
        color: #ffffff;
      }
      .btn-secondary {
        background: #ffffff;
        color: var(--color-brand-blue);
        border: 1px solid var(--color-border);
      }
      .btn-secondary:hover {
        background: var(--color-bg-subtle);
        color: var(--color-brand-blue);
      }
      .btn-secondary--light {
        background: rgba(255, 255, 255, 0.15);
        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
      .btn-secondary--light:hover {
        background: rgba(255, 255, 255, 0.25);
        color: #ffffff;
      }

      /* Stats */
      .stats-band {
        background: var(--color-brand-blue);
        padding: 2.5rem 1rem;
      }
      .stats-grid {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
      }
      .stat-item {
        text-align: center;
        color: #ffffff;
      }
      .stat-number {
        display: block;
        font-size: clamp(2rem, 4vw, 2.75rem);
        font-weight: 800;
        color: var(--color-accent);
        line-height: 1;
        margin-bottom: 0.4rem;
      }
      .stat-label {
        font-size: 0.88rem;
        color: rgba(255, 255, 255, 0.78);
        font-weight: 500;
      }

      /* Values */
      .values {
        padding: 5rem 1rem;
      }
      .section-title {
        text-align: center;
        margin: 0 0 2.5rem;
        font-size: 1.75rem;
        color: var(--color-brand-blue);
      }
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.75rem;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      .section-header h2 {
        margin: 0;
        font-size: 1.5rem;
        color: var(--color-brand-blue);
      }
      .link-more {
        color: var(--color-accent);
        text-decoration: none;
        font-weight: 600;
        font-size: 0.95rem;
      }
      .link-more:hover {
        text-decoration: underline;
      }
      .values-grid {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1.5rem;
      }
      .value-card {
        padding: 1.75rem;
        background: var(--color-bg-default);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        text-align: center;
        transition: box-shadow 0.15s ease;
      }
      .value-card:hover {
        box-shadow: 0 4px 12px rgba(30, 64, 175, 0.1);
      }
      .value-icon {
        font-size: 2.5rem;
        display: block;
        margin-bottom: 0.75rem;
      }
      .value-card h3 {
        margin: 0 0 0.5rem;
        font-size: 1.1rem;
        color: var(--color-brand-blue);
      }
      .value-card p {
        margin: 0;
        color: var(--color-fg-muted);
        font-size: 0.9rem;
        line-height: 1.6;
      }

      /* Prossime partite */
      .prossime-partite {
        padding: 4rem 1rem;
        background: var(--color-bg-subtle);
        border-top: 1px solid var(--color-border);
        border-bottom: 1px solid var(--color-border);
      }
      .partite-grid {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
      }
      .partita-card {
        background: #ffffff;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: 1.25rem;
        border-left: 4px solid var(--color-accent);
      }
      .partita-card__meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
        gap: 0.5rem;
      }
      .partita-card__categoria {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--color-brand-blue);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .partita-card__tipo {
        font-size: 0.72rem;
        padding: 0.2rem 0.6rem;
        border-radius: 9999px;
        font-weight: 600;
      }
      .partita-card__tipo.casa {
        background: #dafbe1;
        color: var(--color-success);
      }
      .partita-card__tipo.trasferta {
        background: #dbeafe;
        color: var(--color-brand-blue);
      }
      .partita-card__match {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        margin-bottom: 0.6rem;
        flex-wrap: wrap;
      }
      .partita-card__aurora {
        font-weight: 700;
        font-size: 1rem;
        color: var(--color-brand-blue);
      }
      .partita-card__vs {
        font-size: 0.8rem;
        color: var(--color-fg-muted);
        font-weight: 600;
      }
      .partita-card__avversario {
        font-weight: 600;
        font-size: 1rem;
        color: var(--color-fg-default);
      }
      .partita-card__info {
        font-size: 0.85rem;
        color: var(--color-fg-muted);
        margin-bottom: 0.25rem;
      }
      .partita-card__info time {
        font-weight: 600;
      }
      .partita-card__competizione {
        font-size: 0.78rem;
        color: var(--color-fg-muted);
        margin: 0;
        font-style: italic;
      }

      /* CTA band */
      .cta-band {
        padding: 5rem 1rem;
        background: var(--color-fg-default);
        color: #ffffff;
        text-align: center;
      }
      .cta-band h2 {
        margin: 0 0 1rem;
        color: #ffffff;
        font-size: 1.75rem;
      }
      .cta-band p {
        color: rgba(255, 255, 255, 0.82);
        margin: 0 0 2.5rem;
        max-width: 520px;
        margin-left: auto;
        margin-right: auto;
        line-height: 1.6;
      }

      @media (max-width: 600px) {
        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private readonly mockData = inject(MockDataService);

  readonly prossimePartite$ = this.mockData.calendario$.pipe(
    map((cal) => cal.partite.slice(0, 3))
  );
}
