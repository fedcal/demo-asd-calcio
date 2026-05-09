import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="site-header">
      <div class="site-header__inner">
        <a routerLink="/" class="brand" aria-label="Home ASD Polisportiva Aurora">
          <span class="brand__icon" aria-hidden="true">⚽</span>
          <span class="brand__text">Aurora <span class="brand__year">1965</span></span>
        </a>
        <nav class="site-nav" aria-label="Navigazione principale">
          <a routerLink="/" routerLinkActive="is-active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          <a routerLink="/squadre" routerLinkActive="is-active">Squadre</a>
          <a routerLink="/chi-siamo" routerLinkActive="is-active">Chi siamo</a>
          <a routerLink="/calendario" routerLinkActive="is-active">Calendario</a>
          <a routerLink="/iscrivi" routerLinkActive="is-active" class="cta">Iscriviti</a>
        </nav>
      </div>
    </header>
  `,
  styles: [
    `
      .site-header {
        position: sticky;
        top: 0;
        z-index: 100;
        background: var(--color-brand-blue);
        border-bottom: 3px solid var(--color-accent);
      }
      .site-header__inner {
        max-width: 1080px;
        margin: 0 auto;
        padding: 0.85rem 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        color: #ffffff;
        font-weight: 700;
        font-size: 1.2rem;
        letter-spacing: 0.01em;
      }
      .brand:hover {
        text-decoration: none;
        opacity: 0.9;
      }
      .brand__icon {
        font-size: 1.5rem;
      }
      .brand__year {
        color: var(--color-accent);
        font-weight: 800;
      }
      .site-nav {
        display: flex;
        gap: 0.25rem;
        flex-wrap: wrap;
        align-items: center;
      }
      .site-nav a {
        color: rgba(255, 255, 255, 0.85);
        text-decoration: none;
        font-size: 0.95rem;
        padding: 0.4rem 0.75rem;
        border-radius: var(--radius-sm);
        transition: all 0.15s ease;
      }
      .site-nav a:hover {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.12);
        text-decoration: none;
      }
      .site-nav a.is-active {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.15);
        font-weight: 600;
      }
      .site-nav a.cta {
        background: var(--color-accent);
        color: #ffffff;
        font-weight: 600;
        padding: 0.45rem 1rem;
        margin-left: 0.5rem;
      }
      .site-nav a.cta:hover {
        background: var(--color-accent-hover);
        color: #ffffff;
      }
      @media (max-width: 640px) {
        .site-header__inner {
          flex-direction: column;
          padding: 0.75rem 1rem;
          gap: 0.5rem;
        }
        .site-nav {
          gap: 0.15rem;
          font-size: 0.85rem;
          justify-content: center;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {}
