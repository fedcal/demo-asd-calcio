// Tipi TypeScript per i dati mock di ASD Polisportiva Aurora

export interface Indirizzo {
  readonly via: string;
  readonly citta: string;
  readonly provincia: string;
  readonly cap: string;
  readonly regione: string;
  readonly paese: string;
  readonly lat: number;
  readonly lng: number;
}

export interface Affiliazione {
  readonly federazione: string;
  readonly lega: string;
  readonly settore: string;
  readonly comitato: string;
  readonly matricola: string;
}

export interface ContattiSociale {
  readonly instagram?: string;
  readonly facebook?: string;
}

export interface ContattiASD {
  readonly telefonoPrincipe: string;
  readonly emailSegreteria: string;
  readonly emailPresidente: string;
  readonly social: ContattiSociale;
}

export interface OrariSegreteria {
  readonly martedi: string;
  readonly mercoledi: string;
  readonly giovedi: string;
  readonly sabato: string;
  readonly altriGiorni: string;
}

export interface Campo {
  readonly id: string;
  readonly nome: string;
  readonly indirizzo: string;
  readonly fondo: string;
  readonly principale: boolean;
  readonly accessibile: boolean;
  readonly tribune: boolean;
  readonly spogliatoi: boolean;
}

export interface MetaSeo {
  readonly title: string;
  readonly description: string;
  readonly keywords: readonly string[];
}

export interface InfoASD {
  readonly ragioneSociale: string;
  readonly nomeCommerciale: string;
  readonly tagline: string;
  readonly indirizzo: Indirizzo;
  readonly codiceFiscale: string;
  readonly affiliazione: Affiliazione;
  readonly contatti: ContattiASD;
  readonly orariSegreteria: OrariSegreteria;
  readonly campi: readonly Campo[];
  readonly metaSeo: MetaSeo;
}

export interface OrarioAllenamento {
  readonly giorno: string;
  readonly orario: string;
}

export interface Squadra {
  readonly id: string;
  readonly categoria: string;
  readonly siglaFIGC: string;
  readonly fasciaDiEta: string;
  readonly allenatore: string;
  readonly assistente: string;
  readonly numeroGiocatori: number;
  readonly orariAllenamento: readonly OrarioAllenamento[];
  readonly giornoPartita: string;
  readonly campo: string;
  readonly colori: string;
  readonly descrizioneObiettivi: string;
  readonly annoFondazione: number;
}

export interface Squadre {
  readonly squadre: readonly Squadra[];
}

export interface Allenatore {
  readonly id: number;
  readonly nome: string;
  readonly ruolo: string;
  readonly qualificaFIGC: string;
  readonly bio: string;
  readonly anniEsperienza: number;
  readonly email: string;
}

export interface Team {
  readonly team: readonly Allenatore[];
}

export interface Partita {
  readonly id: string;
  readonly data: string;
  readonly ora: string;
  readonly squadraId: string;
  readonly squadraNome: string;
  readonly tipo: 'casa' | 'trasferta';
  readonly avversario: string;
  readonly campo: string;
  readonly competizione: string;
  readonly risultato: string | null;
}

export interface Evento {
  readonly id: string;
  readonly data: string;
  readonly ora: string;
  readonly titolo: string;
  readonly tipo: 'riunione' | 'open-day' | 'torneo' | 'premiazione' | 'altro';
  readonly luogo: string;
  readonly descrizione: string;
  readonly aperto: boolean;
}

export interface Calendario {
  readonly partite: readonly Partita[];
  readonly eventi: readonly Evento[];
}

export interface FasciaPrezzo {
  readonly id: string;
  readonly categoria: string;
  readonly quotaAnnuale: number;
  readonly note: string;
}

export interface InfoIscrizione {
  readonly fascePrezzo: readonly FasciaPrezzo[];
  readonly inclusioni: readonly string[];
  readonly esclusioniNoteVarie: readonly string[];
  readonly modalitaPagamento: readonly string[];
  readonly documentazioneRichiesta: readonly string[];
  readonly noteImportanti: string;
  readonly rateizzazione: boolean;
  readonly scontoFratelli: number;
  readonly proviniGratuiti: boolean;
  readonly inizioStagione: string;
  readonly fineStagione: string;
}

export interface FaqItem {
  readonly domanda: string;
  readonly risposta: string;
}

export interface Faq {
  readonly faq: readonly FaqItem[];
}

// View model per la form di iscrizione
export interface FormIscrizione {
  readonly nomeBambino: string;
  readonly cognomeBambino: string;
  readonly dataNascita: string;
  readonly sportPrecedente: string;
  readonly categoriaPreferita: string;
  readonly problemiMedici: string;
  readonly tagliaKit: string;
  readonly nomeGenitore: string;
  readonly telefonoGenitore: string;
  readonly emailGenitore: string;
  readonly privacyGenitore: boolean;
  readonly privacyAtleta: boolean;
}
