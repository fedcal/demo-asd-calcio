import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';

import { MockDataService } from '../../data/mock-data.service';

@Component({
  selector: 'app-chi-siamo',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf],
  template: `
    <section class="page-header">
      <div class="demo-container">
        <h1>Chi siamo</h1>
        <p>Sessant'anni di passione sportiva nel cuore della provincia di Brescia.</p>
      </div>
    </section>

    <article class="demo-container content">
      <!-- Storia -->
      <section class="story">
        <h2>La storia dell'Aurora</h2>
        <p>
          Era il 1965 quando un gruppo di genitori e appassionati di calcio di Castegnato fondò
          l'ASD Polisportiva Aurora con un obiettivo semplice: dare ai bambini del paese un posto
          dove giocare, crescere e imparare i valori dello sport.
        </p>
        <p>
          Nei primi anni la società operava con un solo campo in terra battuta e una manciata di ragazzi.
          Gli anni '80 hanno portato la costruzione del Campo Principale "A. Moro", intitolato
          all'ex presidente del Consiglio, con il contributo della comunità locale e del Comune di Castegnato.
        </p>
        <p>
          Negli anni '90 l'Aurora affiliata FIGC LND ottiene il riconoscimento come Scuola Calcio Elite,
          strutturando per la prima volta un settore giovanile completo dalla categoria Pulcini
          ai Juniores. Nasce in quegli anni il torneo internazionale "Aurora Cup", arrivato oggi alla 21a edizione.
        </p>
        <p>
          Oggi l'Aurora conta 180 atleti, 6 squadre giovanili, uno staff tecnico di 12 allenatori qualificati
          FIGC e un campo sintetico secondario costruito nel 2019. La missione è rimasta la stessa di sessant'anni fa.
        </p>
      </section>

      <!-- Palmares -->
      <section class="palmares">
        <h2>Alcuni risultati recenti</h2>
        <ul class="palmares-list">
          <li>
            <span class="palmares-year">2023</span>
            <span class="palmares-text">Giovanissimi U14 — Vincitori Torneo Città di Brescia</span>
          </li>
          <li>
            <span class="palmares-year">2022</span>
            <span class="palmares-text">Allievi U16 — Finalisti Campionato Provinciale BS</span>
          </li>
          <li>
            <span class="palmares-year">2021</span>
            <span class="palmares-text">Juniores — Play-off Campionato Regionale LND</span>
          </li>
          <li>
            <span class="palmares-year">2019</span>
            <span class="palmares-text">Inaugurazione Campo Secondario Sintetico Via Olimpia</span>
          </li>
          <li>
            <span class="palmares-year">2018</span>
            <span class="palmares-text">Riconoscimento Scuola Calcio FIGC 3 stelle</span>
          </li>
        </ul>
      </section>

      <!-- Valori -->
      <section class="values">
        <h2>I nostri valori sportivi</h2>
        <ul class="values-grid">
          <li>
            <h3>Formazione prima dei risultati</h3>
            <p>Un 5-0 che non insegna niente vale meno di una sconfitta da cui si impara. I nostri tecnici sono valutati sulla crescita degli atleti, non sui piazzamenti.</p>
          </li>
          <li>
            <h3>Famiglia e comunità</h3>
            <p>L'Aurora è una famiglia. I genitori sono partner educativi, non spettatori passivi. Organizziamo riunioni, eventi sociali e momenti di condivisione durante tutto l'anno.</p>
          </li>
          <li>
            <h3>Inclusione</h3>
            <p>Nessun bambino viene escluso per capacità atletica o condizione economica. Disponiamo di borse studio per famiglie in difficoltà e accettiamo ragazzi con disabilità lievi.</p>
          </li>
          <li>
            <h3>Qualità tecnica FIGC</h3>
            <p>Tutti i nostri allenatori sono in possesso di patentino FIGC aggiornato. La formazione continua dello staff tecnico è un investimento prioritario della società.</p>
          </li>
        </ul>
      </section>

      <!-- Team -->
      <section class="team" *ngIf="team$ | async as data">
        <h2>Staff dirigenziale e tecnico</h2>
        <ul class="team-grid">
          <li *ngFor="let m of data.team" class="team-card">
            <div class="team-card__avatar" aria-hidden="true">{{ m.nome.charAt(0) }}</div>
            <h3>{{ m.nome }}</h3>
            <p class="team-card__role">{{ m.ruolo }}</p>
            <p class="team-card__qualifica">{{ m.qualificaFIGC }}</p>
            <p class="team-card__bio">{{ m.bio }}</p>
            <p class="team-card__exp">{{ m.anniEsperienza }} anni di esperienza</p>
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
      .story {
        max-width: 740px;
        margin: 0 auto 4rem;
      }
      .story h2,
      .palmares h2,
      .values h2,
      .team h2 {
        font-size: 1.5rem;
        color: var(--color-brand-blue);
        margin-bottom: 1.25rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid var(--color-accent);
        display: inline-block;
      }
      .story p {
        line-height: 1.75;
        margin-bottom: 1rem;
        color: var(--color-fg-default);
      }

      /* Palmares */
      .palmares {
        margin-bottom: 4rem;
      }
      .palmares-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0;
      }
      .palmares-list li {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.85rem 0;
        border-bottom: 1px dashed var(--color-border);
      }
      .palmares-year {
        flex-shrink: 0;
        font-weight: 800;
        font-size: 1rem;
        color: var(--color-accent);
        min-width: 48px;
      }
      .palmares-text {
        color: var(--color-fg-muted);
        font-size: 0.95rem;
      }

      /* Values */
      .values {
        margin-bottom: 4rem;
      }
      .values-grid {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.25rem;
      }
      .values-grid li {
        padding: 1.5rem;
        background: var(--color-bg-subtle);
        border-radius: var(--radius-md);
        border-left: 3px solid var(--color-accent);
      }
      .values-grid h3 {
        margin: 0 0 0.5rem;
        color: var(--color-brand-blue);
        font-size: 1rem;
      }
      .values-grid p {
        margin: 0;
        color: var(--color-fg-muted);
        font-size: 0.9rem;
        line-height: 1.6;
      }

      /* Team */
      .team h2 {
        text-align: left;
        margin-bottom: 1.5rem;
      }
      .team-grid {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 1.25rem;
      }
      .team-card {
        padding: 1.5rem;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        text-align: center;
        transition: box-shadow 0.15s ease;
      }
      .team-card:hover {
        box-shadow: 0 4px 12px rgba(30, 64, 175, 0.08);
      }
      .team-card__avatar {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background: var(--color-brand-blue);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.75rem;
        font-weight: 700;
        margin: 0 auto 1rem;
      }
      .team-card h3 {
        margin: 0 0 0.2rem;
        font-size: 1.05rem;
        color: var(--color-fg-default);
      }
      .team-card__role {
        margin: 0 0 0.3rem;
        color: var(--color-brand-blue);
        font-weight: 600;
        font-size: 0.88rem;
      }
      .team-card__qualifica {
        margin: 0 0 0.75rem;
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--color-accent);
        background: #f0fdf4;
        display: inline-block;
        padding: 0.2rem 0.6rem;
        border-radius: 9999px;
        border: 1px solid #bbf7d0;
      }
      .team-card__bio {
        font-size: 0.87rem;
        color: var(--color-fg-muted);
        margin-bottom: 0.5rem;
        text-align: left;
        line-height: 1.5;
      }
      .team-card__exp {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--color-fg-muted);
        margin: 0;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChiSiamoComponent {
  private readonly mockData = inject(MockDataService);

  readonly team$ = this.mockData.team$;
}
