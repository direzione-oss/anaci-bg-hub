export type UserRole = 'ASSOCIATO' | 'ESPERTO' | 'PARTNER' | 'ADMIN';

export interface UserProfile {
  id: string;
  codiceAssociato: string;
  email: string;
  fullName: string;
  studioName: string;
  role: UserRole;
  roleLabel: string;
  zonaOperativa: string;
  cfpMaturati: number;
  cfpObiettivo: number;
  specialty?: string;
  condominiGestiti?: string[];
}

export type PartnerCategoryKey =
  | 'ENERGIA_CALORE'
  | 'IMPIANTI_SICUREZZA'
  | 'PULIZIE_MULTISERVIZI'
  | 'STUDIO_FISCO_CREDITI';

export interface PartnerReviewItem {
  id: string;
  authorAlias: string;
  zonaCondominio: string;
  rating: number;
  intervento: string;
  comment: string;
  date: string;
}

export interface PartnerItem {
  id: number;
  slug: string;
  companyName: string;
  category: PartnerCategoryKey;
  categoryLabel: string;
  sector: string;
  referentName?: string;
  phone: string;
  email?: string;
  logoInitials: string;
  badgeConvenzione: string;
  descrizioneServizi: string;
  vantaggiAssociati: string;
  zoneCoperte: string[];
  ratingMedio: number;
  totaleRecensioni: number;
  reviews: PartnerReviewItem[];
}

export type SosTag =
  | 'Morosità'
  | 'Infiltrazioni'
  | 'Parti Comuni'
  | 'Superbonus/Bonus Edilizi'
  | 'Distacchi';

export interface SosReplyItem {
  id: string;
  authorName: string;
  authorRole: UserRole;
  authorBadge: string;
  isAnonymous: boolean;
  isOfficialExpertOpinion: boolean;
  riferimentiNormativi?: string;
  content: string;
  helpfulVotes: number;
  userHasVoted?: boolean;
  createdAt: string;
}

export interface SosPostItem {
  id: string;
  authorName: string;
  authorCode: string;
  isAnonymous: boolean;
  anonymousAlias: string;
  title: string;
  content: string;
  primaryTag: SosTag;
  secondaryTags: string[];
  zonaCondominio: string;
  urgency: 'NORMALE' | 'ALTA' | 'CRITICA';
  status: 'APERTO' | 'IN_ANALISI_CS' | 'RISOLTO';
  richiedeParereCentroStudi: boolean;
  viewsCount: number;
  createdAt: string;
  replies: SosReplyItem[];
}

export interface CitedSource {
  code: string;
  title: string;
  type: 'CODICE_CIVILE' | 'CASSAZIONE' | 'COMUNE_BG' | 'CENTRO_STUDI' | 'STATUTO_ANACI';
  excerpt: string;
}

export interface AiMessage {
  id: string;
  sender: 'USER' | 'ASSISTANT';
  timestamp: string;
  content: string;
  citedSources?: CitedSource[];
  suggestedDraft?: {
    title: string;
    type: string;
    body: string;
  };
}

export interface EventSponsorItem {
  companyName: string;
  sector: string;
  logoInitials: string;
  referent?: string;
}

export interface EventScheduleSlot {
  ora: string;
  intervento: string;
}

export interface TrainingEvent {
  id: string;
  codice: string;
  titolo: string;
  sottotitolo?: string;
  tipologiaEvento?: 'CONVEGNO_PROVINCIALE' | 'SEMINARIO_SEDE' | 'WEBINAR_FORMATIVO' | 'TAVOLA_ROTONDA';
  relatori: string;
  data: string;
  orario: string;
  modalita: 'In Presenza (Via V. Bellini 43, BG)' | 'Webinar Live ANACI' | 'E-Learning On-Demand' | 'Convegno in Presenza (Bergamo)';
  luogoNome?: string;
  luogoIndirizzo?: string;
  mappaUrl?: string;
  cfp: number;
  materia: string;
  iscritto: boolean;
  postiRimasti: number;
  capienzaMassima?: number;
  locandinaColore?: 'GREEN' | 'RED' | 'NAVY' | 'GOLD';
  locandinaBadge?: string;
  locandinaImageUrl?: string;
  temiTrattati?: string[];
  programmaOrario?: EventScheduleSlot[];
  sponsorsEvento?: EventSponsorItem[];
  linkIscrizione?: string;
  quotaPartecipazione?: string;
  patrocinio?: string;
}

export interface TerritorialAlert {
  id: string;
  tipo: 'EMERGENZA_RETE' | 'BANDO' | 'ORDINANZA_BG';
  ente: string;
  zona: string;
  titolo: string;
  descrizione: string;
  data: string;
  condominiCoinvolti?: number;
}

export interface StatuteArticleItem {
  id: string;
  titoloSezione: string;
  numeroArticolo: number;
  etichettaArticolo: string;
  rubrica: string;
  contenutoTesto: string;
  paroleChiave: string[];
}

export interface CondoQuoteInput {
  condominioNome: string;
  indirizzoCondominio: string;
  zona: string;
  unitaPrincipali: number;
  pertinenzeBoxCantine: number;
  scalePalazzine: number;
  numAscensori: number;
  riscaldamentoCentralizzato: boolean;
  contabilizzazioneCaloreUni10200: boolean;
  areaVerdeCondominiale: boolean;
  portineriaCustode: boolean;
  supercondominio: boolean;
  includiPassaggioConsegne: boolean;
  regimeFiscale: 'ORDINARIO_IVA' | 'FORFETTARIO_ESENTE';
  cassaPrevidenzialePct: number;
  aliquotaIvaPct: number;
}

export interface CondoQuoteLineItem {
  codice: string;
  categoria: 'COMPENSO_BASE' | 'IMPIANTI' | 'FISCALE' | 'SPESE_VIVE';
  descrizione: string;
  quantita: number;
  importoUnitario: number;
  totaleVoce: number;
  riferimentoNormativo: string;
}

export interface CondoOrdinaryBudgetEstimate {
  puliziaPartiComuni: number;
  luceAcquaPartiComuni: number;
  assicurazioneFabbricato: number;
  manutenzioneAscensori: number;
  riscaldamentoCentralizzato: number;
  manutenzioneOrdinariaEVerde: number;
  compensoAmministratoreLordo: number;
  totaleBudgetOrdinarioAnnuo: number;
  rataMediaMensilePerUnita: number;
}

export interface CondoQuoteResult {
  numeroPreventivo: string;
  vociAnalitiche: CondoQuoteLineItem[];
  compensoBaseAnnuo: number;
  maggiorazioneImpianti: number;
  compensoAdempimentiFiscali: number;
  rimborsoSpeseForfettario: number;
  totaleImponibileStudio: number;
  importoCassaPrevidenziale: number;
  importoIva: number;
  totaleLordoAnnuoStudio: number;
  costoMensileStudioPerUnita: number;
  stimaBudgetCondominio: {
    puliziaPartiComuni: number;
    luceAcquaPartiComuni: number;
    assicurazioneFabbricato: number;
    manutenzioneAscensori: number;
    riscaldamentoCentralizzato: number;
    manutenzioneOrdinariaEVerde: number;
    compensoAmministratoreLordo: number;
    totaleBudgetOrdinarioAnnuo: number;
    rataMediaMensilePerUnita: number;
  };
  tariffeAccessorieExtra: {
    assembleaStraordinaria: number;
    percentualeLavoriStraordinari: number;
    sollecitoMorosita: number;
  };
  testoPropostaMandatoArt1129: string;
}

export type QrAccreditationMode = 'QR_INGRESSO_CONVEGNO' | 'QR_PUBBLICATO_ONLINE';

export interface AssemblyPollOption {
  id: string;
  label: string;
  subLabel?: string;
  badge?: string;
  votiCount: number;
  colorClass?: string;
}

export interface AssemblyPollItem {
  id: string;
  numeroPuntoOdg: number;
  titolo: string;
  descrizione: string;
  riferimentoStatuto: string;
  tipoScrutinio: 'VOTO_PALESE' | 'SCRUTINIO_SEGRETO_ELEZIONI' | 'MOZIONE_ISTITUZIONALE';
  maxPreferenze: number;
  stato: 'APERTA' | 'CHIUSA';
  opzioni: AssemblyPollOption[];
  userSelectedIds?: string[];
  userVoteHash?: string;
  userVoteTimestamp?: string;
  userVoteWeight?: number;
}

export interface DelegatingMemberItem {
  codiceAssociato: string;
  fullName: string;
  studioName: string;
  zona: string;
  regolareQuotaECfp: boolean;
}

export interface MemberAssemblyInfo {
  id: string;
  codiceAssemblea: string;
  titolo: string;
  sottotitolo: string;
  dataOra: string;
  luogoFisico: string;
  piattaformaOnline: string;
  qrTokenIngresso: string;
  qrTokenOnline: string;
  cfpRiconosciuti: number;
  aventiDirittoTotali: number;
  quorumCostitutivoRichiesto: number;
  presentiInSalaQr: number;
  presentiOnlineQr: number;
  delegheValidateTotali: number;
}


