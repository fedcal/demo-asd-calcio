import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { map } from 'rxjs';

import { MockDataService } from '../../data/mock-data.service';

// Calcola categoria suggerita da anno di nascita
function calcolaCategoria(dataNascita: string): string {
  if (!dataNascita) return '';
  const anno = new Date(dataNascita).getFullYear();
  const eta = new Date().getFullYear() - anno;
  if (eta <= 7) return 'piccoli-amici';
  if (eta <= 10) return 'pulcini';
  if (eta <= 12) return 'esordienti';
  if (eta <= 14) return 'giovanissimi';
  if (eta <= 16) return 'allievi';
  if (eta <= 19) return 'juniores';
  return '';
}

const TAGLIE_KIT = ['XS (4-5 anni)', 'S (6-8 anni)', 'M (9-11 anni)', 'L (12-14 anni)', 'XL (15-17 anni)', 'XXL (adulto S)', 'XXXL (adulto M/L)'] as const;

@Component({
  selector: 'app-iscrivi',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, NgFor, NgIf, ReactiveFormsModule],
  template: `
    <section class="page-header">
      <div class="demo-container">
        <h1>Iscriviti all'Aurora</h1>
        <p>Compila il modulo di pre-iscrizione. La segreteria ti contatterà entro 48 ore per confermare.</p>
      </div>
    </section>

    <article class="demo-container content">
      <div class="iscrivi-grid">

        <!-- Sidebar info quote -->
        <aside class="quote-sidebar" *ngIf="iscrizione$ | async as iscr">
          <h2>Quote stagionali 2026-2027</h2>
          <ul class="quote-list">
            <li *ngFor="let f of iscr.fascePrezzo" class="quote-item">
              <div class="quote-item__header">
                <span class="quote-categoria">{{ f.categoria }}</span>
                <strong class="quote-prezzo">{{ f.quotaAnnuale | currency: 'EUR' : 'symbol' : '1.0-0' }}</strong>
              </div>
              <p class="quote-note">{{ f.note }}</p>
            </li>
          </ul>

          <div class="inclusioni-block">
            <h3>Incluso nella quota</h3>
            <ul class="inclusioni-list">
              <li *ngFor="let inc of iscr.inclusioni">{{ inc }}</li>
            </ul>
          </div>

          <div class="docs-block">
            <h3>Documenti richiesti</h3>
            <ul class="docs-list">
              <li *ngFor="let d of iscr.documentazioneRichiesta">{{ d }}</li>
            </ul>
          </div>

          <p class="note-importante">{{ iscr.noteImportanti }}</p>

          <div class="provini-badge" *ngIf="iscr.proviniGratuiti">
            Provini gratuiti — nessun impegno
          </div>
        </aside>

        <!-- Form iscrizione -->
        <section class="form-block">
          <h2>Modulo di pre-iscrizione</h2>

          <form
            [formGroup]="form"
            (ngSubmit)="onSubmit()"
            *ngIf="!submitted(); else thankyou"
            novalidate
          >
            <!-- Dati bambino -->
            <fieldset class="fieldset">
              <legend>Dati dell'atleta</legend>

              <div class="row-2">
                <div class="field">
                  <label for="nomeBambino">Nome <span class="required" aria-label="obbligatorio">*</span></label>
                  <input
                    id="nomeBambino"
                    type="text"
                    formControlName="nomeBambino"
                    autocomplete="given-name"
                    [class.invalid]="isInvalid('nomeBambino')"
                    required
                  />
                  <span class="error-msg" *ngIf="isInvalid('nomeBambino')" role="alert">Nome obbligatorio (min 2 caratteri)</span>
                </div>
                <div class="field">
                  <label for="cognomeBambino">Cognome <span class="required" aria-label="obbligatorio">*</span></label>
                  <input
                    id="cognomeBambino"
                    type="text"
                    formControlName="cognomeBambino"
                    autocomplete="family-name"
                    [class.invalid]="isInvalid('cognomeBambino')"
                    required
                  />
                  <span class="error-msg" *ngIf="isInvalid('cognomeBambino')" role="alert">Cognome obbligatorio</span>
                </div>
              </div>

              <div class="row-2">
                <div class="field">
                  <label for="dataNascita">Data di nascita <span class="required" aria-label="obbligatorio">*</span></label>
                  <input
                    id="dataNascita"
                    type="date"
                    formControlName="dataNascita"
                    [class.invalid]="isInvalid('dataNascita')"
                    (change)="onDataNascitaChange()"
                    required
                  />
                  <span class="error-msg" *ngIf="isInvalid('dataNascita')" role="alert">Data di nascita obbligatoria</span>
                </div>
                <div class="field">
                  <label for="categoriaPreferita">Categoria suggerita</label>
                  <select id="categoriaPreferita" formControlName="categoriaPreferita">
                    <option value="">-- Seleziona --</option>
                    <option value="piccoli-amici">Piccoli Amici U5-U7 (5-7 anni)</option>
                    <option value="pulcini">Pulcini U8-U10 (8-10 anni)</option>
                    <option value="esordienti">Esordienti U11-U12 (11-12 anni)</option>
                    <option value="giovanissimi">Giovanissimi U13-U14 (13-14 anni)</option>
                    <option value="allievi">Allievi U15-U16 (15-16 anni)</option>
                    <option value="juniores">Juniores U17-U19 (17-19 anni)</option>
                  </select>
                  <p class="field-hint" *ngIf="form.value.categoriaPreferita">
                    Categoria auto-suggerita per eta. Lo staff valutera la collocazione definitiva al provino.
                  </p>
                </div>
              </div>

              <div class="field">
                <label for="sportPrecedente">Esperienze sportive precedenti</label>
                <input
                  id="sportPrecedente"
                  type="text"
                  formControlName="sportPrecedente"
                  placeholder="es. nuoto 2 anni, calcio Polisportiva Cividino stagione 2024-25"
                  autocomplete="off"
                />
              </div>

              <div class="field">
                <label for="tagliaKit">Taglia kit ufficiale <span class="required" aria-label="obbligatorio">*</span></label>
                <select
                  id="tagliaKit"
                  formControlName="tagliaKit"
                  [class.invalid]="isInvalid('tagliaKit')"
                  required
                >
                  <option value="">-- Seleziona taglia --</option>
                  <option *ngFor="let t of taglie" [value]="t">{{ t }}</option>
                </select>
                <span class="error-msg" *ngIf="isInvalid('tagliaKit')" role="alert">Seleziona la taglia del kit</span>
              </div>

              <div class="field">
                <label for="problemiMedici">Problemi di salute o allergie da segnalare allo staff</label>
                <textarea
                  id="problemiMedici"
                  formControlName="problemiMedici"
                  rows="2"
                  placeholder="es. asma lieve, allergia pollini — se nessuno, lasciare vuoto"
                ></textarea>
              </div>
            </fieldset>

            <!-- Dati genitore -->
            <fieldset class="fieldset">
              <legend>Dati del genitore / tutore legale</legend>

              <div class="field">
                <label for="nomeGenitore">Nome e cognome <span class="required" aria-label="obbligatorio">*</span></label>
                <input
                  id="nomeGenitore"
                  type="text"
                  formControlName="nomeGenitore"
                  autocomplete="name"
                  [class.invalid]="isInvalid('nomeGenitore')"
                  required
                />
                <span class="error-msg" *ngIf="isInvalid('nomeGenitore')" role="alert">Nome genitore obbligatorio</span>
              </div>

              <div class="row-2">
                <div class="field">
                  <label for="telefonoGenitore">Telefono <span class="required" aria-label="obbligatorio">*</span></label>
                  <input
                    id="telefonoGenitore"
                    type="tel"
                    formControlName="telefonoGenitore"
                    autocomplete="tel"
                    [class.invalid]="isInvalid('telefonoGenitore')"
                    placeholder="+39 333 000 0000"
                    required
                  />
                  <span class="error-msg" *ngIf="isInvalid('telefonoGenitore')" role="alert">Telefono non valido</span>
                </div>
                <div class="field">
                  <label for="emailGenitore">Email <span class="required" aria-label="obbligatorio">*</span></label>
                  <input
                    id="emailGenitore"
                    type="email"
                    formControlName="emailGenitore"
                    autocomplete="email"
                    [class.invalid]="isInvalid('emailGenitore')"
                    required
                  />
                  <span class="error-msg" *ngIf="isInvalid('emailGenitore')" role="alert">Email non valida</span>
                </div>
              </div>
            </fieldset>

            <!-- Privacy GDPR — DOPPIO CONSENSO -->
            <fieldset class="fieldset fieldset--privacy">
              <legend>Consenso al trattamento dei dati — GDPR (Reg. UE 2016/679)</legend>

              <div class="privacy-info">
                <p>
                  I dati raccolti sono trattati da <strong>ASD Polisportiva Aurora</strong> (titolare del trattamento,
                  C.F. 90012345678) per finalità di iscrizione, tesseramento FIGC, comunicazioni
                  organizzative e invio newsletter sportiva. I dati del minore sono trattati
                  ai sensi dell'art. 6 co. 1 lett. b) GDPR (esecuzione contratto) e art. 8 GDPR (minori).
                  Informativa completa disponibile in segreteria.
                </p>
              </div>

              <!-- Consenso 1: genitore per se stesso -->
              <div class="field field--checkbox privacy-consent">
                <input
                  id="privacyGenitore"
                  type="checkbox"
                  formControlName="privacyGenitore"
                  [class.invalid]="isInvalid('privacyGenitore')"
                  required
                />
                <label for="privacyGenitore">
                  <strong>Consenso del genitore/tutore:</strong>
                  accetto il trattamento dei miei dati personali (genitore/tutore) per finalità
                  di iscrizione, comunicazione e gestione dell'attivita sportiva del minore.
                  Dichiaro di essere il genitore/tutore legale dell'atleta indicato.
                  <span class="required" aria-label="obbligatorio">*</span>
                </label>
                <span class="error-msg" *ngIf="isInvalid('privacyGenitore')" role="alert">Consenso del genitore obbligatorio</span>
              </div>

              <!-- Consenso 2: genitore come rappresentante legale del minore -->
              <div class="field field--checkbox privacy-consent">
                <input
                  id="privacyAtleta"
                  type="checkbox"
                  formControlName="privacyAtleta"
                  [class.invalid]="isInvalid('privacyAtleta')"
                  required
                />
                <label for="privacyAtleta">
                  <strong>Consenso per il minore (art. 8 GDPR):</strong>
                  in qualita di genitore/tutore legale, presto il consenso al trattamento
                  dei dati personali dell'atleta minorenne per finalita di tesseramento FIGC,
                  assicurazione sportiva, partecipazione a competizioni e comunicazioni
                  relative all'attivita sportiva. Il minore e informato del trattamento.
                  <span class="required" aria-label="obbligatorio">*</span>
                </label>
                <span class="error-msg" *ngIf="isInvalid('privacyAtleta')" role="alert">Consenso per il minore obbligatorio</span>
              </div>
            </fieldset>

            <div class="form-footer">
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="form.invalid"
                [attr.aria-disabled]="form.invalid"
              >
                Invia pre-iscrizione
              </button>
              <p class="form-disclaimer">
                Demo non funzionale — nessun dato viene inviato o memorizzato.
                In un sito reale la segreteria riceve una notifica email e vi contatta entro 48 ore.
              </p>
            </div>
          </form>

          <ng-template #thankyou>
            <div class="thankyou" role="alert">
              <div class="thankyou__icon" aria-hidden="true">✓</div>
              <h3>Pre-iscrizione ricevuta!</h3>
              <p>
                Grazie <strong>{{ form.value['nomeGenitore'] }}</strong>!
                La richiesta di iscrizione per
                <strong>{{ form.value['nomeBambino'] }} {{ form.value['cognomeBambino'] }}</strong>
                nella categoria
                <strong>{{ categoriaLabel(form.value['categoriaPreferita']) }}</strong>
                e stata simulata.
              </p>
              <p>
                In un sito reale la segreteria Aurora vi contatterà entro 48 ore
                al numero <strong>{{ form.value['telefonoGenitore'] }}</strong>
                o via email <strong>{{ form.value['emailGenitore'] }}</strong>
                per confermare il provino e comunicare la documentazione necessaria.
              </p>
              <button type="button" class="btn btn-secondary" (click)="reset()">Nuova richiesta</button>
            </div>
          </ng-template>
        </section>
      </div>

      <!-- FAQ -->
      <section class="faq-section" *ngIf="faq$ | async as faq">
        <h2>Domande frequenti sull'iscrizione</h2>
        <ul class="faq-list">
          <li *ngFor="let f of faq.faq; let i = index" class="faq-item">
            <button
              class="faq-toggle"
              [attr.aria-expanded]="openFaq() === i"
              [attr.aria-controls]="'faq-answer-' + i"
              (click)="toggleFaq(i)"
              type="button"
            >
              <span>{{ f.domanda }}</span>
              <span class="faq-chevron" aria-hidden="true">{{ openFaq() === i ? '▲' : '▼' }}</span>
            </button>
            <div
              class="faq-answer"
              [id]="'faq-answer-' + i"
              [class.open]="openFaq() === i"
              role="region"
            >
              <p>{{ f.risposta }}</p>
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
      .iscrivi-grid {
        display: grid;
        grid-template-columns: 340px 1fr;
        gap: 3rem;
        align-items: flex-start;
        margin-bottom: 4rem;
      }

      /* Sidebar */
      .quote-sidebar {
        background: var(--color-bg-subtle);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        position: sticky;
        top: 1rem;
      }
      .quote-sidebar h2 {
        margin: 0 0 1rem;
        font-size: 1.1rem;
        color: var(--color-brand-blue);
      }
      .quote-list {
        list-style: none;
        padding: 0;
        margin: 0 0 1.5rem;
      }
      .quote-item {
        padding: 0.75rem 0;
        border-bottom: 1px dashed var(--color-border);
      }
      .quote-item:last-child {
        border-bottom: none;
      }
      .quote-item__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.2rem;
        gap: 0.5rem;
      }
      .quote-categoria {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--color-fg-default);
      }
      .quote-prezzo {
        color: var(--color-accent);
        font-size: 1rem;
        flex-shrink: 0;
      }
      .quote-note {
        font-size: 0.75rem;
        color: var(--color-fg-muted);
        margin: 0;
        line-height: 1.4;
      }
      .inclusioni-block,
      .docs-block {
        margin-bottom: 1.25rem;
      }
      .inclusioni-block h3,
      .docs-block h3 {
        font-size: 0.88rem;
        color: var(--color-brand-blue);
        margin: 0 0 0.5rem;
        font-weight: 700;
      }
      .inclusioni-list,
      .docs-list {
        padding-left: 1rem;
        margin: 0;
      }
      .inclusioni-list li,
      .docs-list li {
        font-size: 0.8rem;
        color: var(--color-fg-muted);
        margin-bottom: 0.25rem;
        line-height: 1.4;
      }
      .note-importante {
        font-size: 0.77rem;
        color: var(--color-fg-muted);
        font-style: italic;
        line-height: 1.4;
        margin: 0 0 1rem;
      }
      .provini-badge {
        background: linear-gradient(135deg, #f0fdf4, #dcfce7);
        border: 1px solid #bbf7d0;
        border-radius: var(--radius-sm);
        padding: 0.6rem 0.85rem;
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--color-success);
        text-align: center;
      }

      /* Form */
      .form-block h2 {
        margin: 0 0 1.5rem;
        font-size: 1.4rem;
        color: var(--color-brand-blue);
      }
      .fieldset {
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: 1.5rem;
        margin-bottom: 1.25rem;
      }
      .fieldset legend {
        font-weight: 700;
        font-size: 0.92rem;
        color: var(--color-brand-blue);
        padding: 0 0.5rem;
      }
      .fieldset--privacy {
        border-color: #bfdbfe;
        background: #f8faff;
      }
      .fieldset--privacy legend {
        color: var(--color-brand-blue);
      }
      .row-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }
      .field {
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
      }
      .field:last-child {
        margin-bottom: 0;
      }
      .field label {
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 0.3rem;
        color: var(--color-fg-default);
      }
      .field input,
      .field select,
      .field textarea {
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        font-family: inherit;
        font-size: 0.95rem;
        background: #ffffff;
        color: var(--color-fg-default);
        transition: border-color 0.12s ease, outline 0.12s ease;
      }
      .field input:focus,
      .field select:focus,
      .field textarea:focus {
        outline: 2px solid var(--color-accent);
        outline-offset: 1px;
        border-color: var(--color-accent);
      }
      .field input.invalid,
      .field select.invalid,
      .field textarea.invalid {
        border-color: var(--color-danger);
      }
      .error-msg {
        font-size: 0.78rem;
        color: var(--color-danger);
        margin-top: 0.25rem;
        font-weight: 600;
      }
      .field-hint {
        font-size: 0.78rem;
        color: var(--color-fg-muted);
        margin: 0.25rem 0 0;
        font-style: italic;
      }
      .required {
        color: var(--color-danger);
        margin-left: 0.1rem;
      }
      .field--checkbox {
        flex-direction: row;
        align-items: flex-start;
        gap: 0.6rem;
      }
      .field--checkbox input[type='checkbox'] {
        margin-top: 0.15rem;
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        accent-color: var(--color-accent);
        padding: 0;
      }
      .field--checkbox label {
        font-weight: 400;
        font-size: 0.85rem;
        color: var(--color-fg-muted);
        line-height: 1.5;
      }
      .field--checkbox label strong {
        color: var(--color-fg-default);
        display: block;
        margin-bottom: 0.2rem;
      }
      .privacy-info {
        background: #dbeafe;
        border: 1px solid #93c5fd;
        border-radius: var(--radius-sm);
        padding: 0.75rem 1rem;
        margin-bottom: 1rem;
      }
      .privacy-info p {
        font-size: 0.82rem;
        color: var(--color-brand-blue);
        margin: 0;
        line-height: 1.5;
      }
      .privacy-consent {
        background: #ffffff;
        border: 1px solid #bfdbfe;
        border-radius: var(--radius-sm);
        padding: 1rem;
        margin-bottom: 0.75rem;
        flex-direction: column;
        gap: 0;
      }
      .privacy-consent > div {
        display: flex;
        flex-direction: row;
        gap: 0.6rem;
        align-items: flex-start;
      }
      .form-footer {
        margin-top: 1.5rem;
      }
      .btn {
        display: inline-block;
        padding: 0.75rem 2rem;
        border-radius: var(--radius-md);
        text-decoration: none;
        font-weight: 600;
        border: none;
        cursor: pointer;
        font-size: 0.95rem;
        font-family: inherit;
        transition: all 0.15s ease;
      }
      .btn-primary {
        background: var(--color-accent);
        color: #ffffff;
      }
      .btn-primary:hover:not(:disabled) {
        background: var(--color-accent-hover);
      }
      .btn-primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .btn-secondary {
        background: #ffffff;
        color: var(--color-fg-default);
        border: 1px solid var(--color-border);
      }
      .btn-secondary:hover {
        background: var(--color-bg-subtle);
      }
      .form-disclaimer {
        font-size: 0.78rem;
        color: var(--color-fg-muted);
        font-style: italic;
        margin-top: 0.75rem;
        margin-bottom: 0;
      }

      /* Thank you */
      .thankyou {
        text-align: center;
        padding: 3rem 1.5rem;
        background: var(--color-bg-subtle);
        border-radius: var(--radius-lg);
        border: 1px solid #bbf7d0;
      }
      .thankyou__icon {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: var(--color-accent);
        color: #ffffff;
        font-size: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1rem;
        font-weight: 800;
      }
      .thankyou h3 {
        color: var(--color-success);
        font-size: 1.5rem;
        margin-bottom: 1rem;
      }
      .thankyou p {
        color: var(--color-fg-muted);
        line-height: 1.6;
        margin-bottom: 0.75rem;
        max-width: 520px;
        margin-left: auto;
        margin-right: auto;
      }
      .thankyou button {
        margin-top: 1rem;
      }

      /* FAQ */
      .faq-section {
        border-top: 1px solid var(--color-border);
        padding-top: 3rem;
      }
      .faq-section h2 {
        font-size: 1.5rem;
        color: var(--color-brand-blue);
        margin: 0 0 1.5rem;
      }
      .faq-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .faq-item {
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        margin-bottom: 0.5rem;
        overflow: hidden;
      }
      .faq-toggle {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        padding: 1rem 1.25rem;
        background: var(--color-bg-default);
        border: none;
        cursor: pointer;
        font-family: inherit;
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--color-fg-default);
        text-align: left;
        transition: background 0.1s ease;
      }
      .faq-toggle:hover {
        background: var(--color-bg-subtle);
      }
      .faq-toggle[aria-expanded='true'] {
        background: var(--color-bg-subtle);
        color: var(--color-brand-blue);
      }
      .faq-chevron {
        font-size: 0.65rem;
        flex-shrink: 0;
        color: var(--color-fg-muted);
      }
      .faq-answer {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.25s ease;
      }
      .faq-answer.open {
        max-height: 600px;
      }
      .faq-answer p {
        padding: 0.75rem 1.25rem 1.25rem;
        margin: 0;
        color: var(--color-fg-muted);
        font-size: 0.9rem;
        line-height: 1.7;
        border-top: 1px solid var(--color-border);
      }

      @media (max-width: 900px) {
        .iscrivi-grid {
          grid-template-columns: 1fr;
        }
        .quote-sidebar {
          position: static;
        }
      }
      @media (max-width: 600px) {
        .row-2 {
          grid-template-columns: 1fr;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IscriviComponent {
  private readonly mockData = inject(MockDataService);
  private readonly fb = inject(FormBuilder);

  readonly submitted = signal(false);
  readonly openFaq = signal<number | null>(null);
  readonly taglie = TAGLIE_KIT;

  readonly iscrizione$ = this.mockData.iscrizione$;
  readonly faq$ = this.mockData.faq$;

  readonly form: FormGroup = this.fb.nonNullable.group({
    nomeBambino: ['', [Validators.required, Validators.minLength(2)]],
    cognomeBambino: ['', [Validators.required, Validators.minLength(2)]],
    dataNascita: ['', Validators.required],
    sportPrecedente: [''],
    categoriaPreferita: [''],
    problemiMedici: [''],
    tagliaKit: ['', Validators.required],
    nomeGenitore: ['', [Validators.required, Validators.minLength(2)]],
    telefonoGenitore: ['', [Validators.required, Validators.pattern(/^[+0-9 ]{7,}$/)]],
    emailGenitore: ['', [Validators.required, Validators.email]],
    privacyGenitore: [false, Validators.requiredTrue],
    privacyAtleta: [false, Validators.requiredTrue]
  });

  isInvalid(controlName: string): boolean {
    const ctrl = this.form.get(controlName);
    return ctrl !== null && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  onDataNascitaChange(): void {
    const dataNascita = this.form.get('dataNascita')?.value as string;
    const categoria = calcolaCategoria(dataNascita);
    if (categoria) {
      this.form.patchValue({ categoriaPreferita: categoria });
    }
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.submitted.set(true);
    }
  }

  reset(): void {
    this.form.reset({
      privacyGenitore: false,
      privacyAtleta: false
    });
    this.submitted.set(false);
    this.openFaq.set(null);
  }

  toggleFaq(index: number): void {
    this.openFaq.set(this.openFaq() === index ? null : index);
  }

  categoriaLabel(id: string): string {
    const labels: Record<string, string> = {
      'piccoli-amici': 'Piccoli Amici U5-U7',
      pulcini: 'Pulcini U8-U10',
      esordienti: 'Esordienti U11-U12',
      giovanissimi: 'Giovanissimi U13-U14',
      allievi: 'Allievi U15-U16',
      juniores: 'Juniores U17-U19'
    };
    return labels[id] ?? id;
  }
}
