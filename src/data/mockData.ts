import {
  PartnerItem,
  UserProfile,
  SosPostItem,
  AiMessage,
  TrainingEvent,
  TerritorialAlert,
  StatuteArticleItem,
  CondoQuoteInput,
  CondoQuoteResult,
  CondoQuoteLineItem,
  MemberAssemblyInfo,
  AssemblyPollItem,
  DelegatingMemberItem,
} from '../types';

export const DEMO_USERS: Record<string, UserProfile> = {
  ASSOCIATO: {
    id: 'usr-assoc-1042',
    codiceAssociato: 'BG-1042',
    email: 'studio.locatelli@anacibergamo.it',
    fullName: 'Dott. Marco Locatelli',
    studioName: 'Studio Amministrazioni Locatelli & Associati',
    role: 'ASSOCIATO',
    roleLabel: 'Associato ANACI BG (#BG-1042)',
    zonaOperativa: 'Bergamo Città & Isola Bergamasca',
    cfpMaturati: 12,
    cfpObiettivo: 15,
    condominiGestiti: [
      'Condominio Parco Suardi — Via B. Bono 14, Bergamo',
      'Supercondominio Le Terrazze — Via Borgo Palazzo 112, Bergamo',
      'Condominio Residenza Colle Aperto — Città Alta, Bergamo',
      'Condominio Villa Seriana — Via Italia 48, Seriate (BG)',
      'Condominio Il Naviglio — Viale Vittorio Emanuele II 32, Bergamo',
    ],
  },
  ESPERTO: {
    id: 'usr-esp-cs01',
    codiceAssociato: 'CS-BG-04',
    email: 'avv.belotti@centrostudianacibg.it',
    fullName: 'Avv. Chiara Belotti',
    studioName: 'Centro Studi Provinciale ANACI Bergamo — Sez. Legale',
    role: 'ESPERTO',
    roleLabel: 'Esperto Centro Studi (Avvocato)',
    zonaOperativa: 'Foro di Bergamo / Corte d’Appello Brescia',
    cfpMaturati: 15,
    cfpObiettivo: 15,
    specialty: 'Diritto Condominiale, Appalti e Recupero Crediti ex art. 63 disp. att. c.c.',
  },
  PARTNER: {
    id: 'usr-part-01',
    codiceAssociato: 'PARTNER-BG-01',
    email: 'ilario.centimerio@bergamogaseluce.it',
    fullName: 'Ilario Centimerio',
    studioName: 'Bergamo Gas e Luce — Partner ANACI Servizi Integrati srl',
    role: 'PARTNER',
    roleLabel: 'Partner / Sponsor Convenzionato',
    zonaOperativa: 'Bergamo e Provincia',
    cfpMaturati: 0,
    cfpObiettivo: 0,
  },
  ADMIN: {
    id: 'usr-adm-dir01',
    codiceAssociato: 'DIR-BG-01',
    email: 'presidenza@anacibergamo.it',
    fullName: 'Geom. Roberto Rota (Direttivo)',
    studioName: 'Direttivo Provinciale ANACI Bergamo — Via V. Bellini 43',
    role: 'ADMIN',
    roleLabel: 'Admin (Direttivo ANACI BG)',
    zonaOperativa: 'Intera Provincia di Bergamo',
    cfpMaturati: 15,
    cfpObiettivo: 15,
  },
};

export const INITIAL_PARTNERS: PartnerItem[] = [
  // CATEGORIA 1: Energia Elettrica, Gas e Contabilizzazione Calore (1 - 6)
  {
    id: 1,
    slug: 'bergamo-gas-e-luce',
    companyName: 'Bergamo Gas e Luce',
    category: 'ENERGIA_CALORE',
    categoryLabel: 'Energia Elettrica, Gas e Contabilizzazione Calore',
    sector: 'Energia elettrica e gas',
    referentName: 'Ilario Centimerio',
    phone: '342 1623550',
    email: 'ilario.centimerio@bergamogaseluce.it',
    logoInitials: 'BGL',
    badgeConvenzione: 'Partner Territoriale ANACI BG',
    descrizioneServizi:
      'Fornitura energia elettrica e gas metano per centrali termiche condominiali e utenze parti comuni sul territorio bergamasco con referente dedicato in sede.',
    vantaggiAssociati:
      'Check-up gratuito delle fatture energetiche dei condomini amministrati, condizioni PUN/PSV dedicate agli studi ANACI BG e gestione prioritaria di volture, subentri e aliquote IVA/accise agevolate.',
    zoneCoperte: ['Bergamo Città', 'Val Seriana', 'Val Brembana', 'Isola Bergamasca', 'Bassa Bergamasca'],
    ratingMedio: 4.9,
    totaleRecensioni: 34,
    reviews: [
      {
        id: 'rev-101',
        authorAlias: 'Studio Associato #BG-1018',
        zonaCondominio: 'Bergamo Città (Borgo Santa Caterina)',
        rating: 5,
        intervento: 'Voltura massiva 14 POD/PDR e verifica accise gas centralizzato',
        comment:
          'Ilario Centimerio risponde direttamente al cellulare e ha risolto in 48 ore un blocco di fatturazione sul PDR della centrale termica che si trascinava col vecchio gestore.',
        date: '10 Ott 2026',
      },
      {
        id: 'rev-102',
        authorAlias: 'Studio Associato #BG-0892',
        zonaCondominio: 'Seriate (BG)',
        rating: 5,
        intervento: 'Revisione condizioni economiche fornitura gas invernale',
        comment:
          'Prospetto di confronto chiarissimo da portare in assemblea, i condomini hanno apprezzato la trasparenza.',
        date: '28 Set 2026',
      },
    ],
  },
  {
    id: 2,
    slug: 'dts-srl',
    companyName: 'DTS Srl',
    category: 'ENERGIA_CALORE',
    categoryLabel: 'Energia Elettrica, Gas e Contabilizzazione Calore',
    sector: 'Energia elettrica e gas',
    referentName: 'Gianluca Piro',
    phone: '339 5809660',
    email: 'gianluca.piro@dtssrl.com',
    logoInitials: 'DTS',
    badgeConvenzione: 'Convenzione ANACI Servizi',
    descrizioneServizi:
      'Consulenza energetica multi-condominio e fornitura di energia elettrica e gas naturale con monitoraggio dei picchi di consumo.',
    vantaggiAssociati:
      'Referente unico (Gianluca Piro) per l’intero portafoglio dello studio, reportistica pre-assembleare e allineamento flussi di fatturazione per gestionali condominiali.',
    zoneCoperte: ['Bergamo Città', 'Isola Bergamasca', 'Bassa Bergamasca'],
    ratingMedio: 4.8,
    totaleRecensioni: 22,
    reviews: [
      {
        id: 'rev-201',
        authorAlias: 'Studio Associato #BG-1104',
        zonaCondominio: 'Dalmine (BG)',
        rating: 5,
        intervento: 'Ottimizzazione potenza impegnata ascensori e corsello box',
        comment: 'Ottimo supporto di Gianluca Piro nella verifica dei costi fissi di potenza su un supercondominio di 80 unità.',
        date: '04 Ott 2026',
      },
    ],
  },
  {
    id: 3,
    slug: 'energy-up',
    companyName: 'Energy Up',
    category: 'ENERGIA_CALORE',
    categoryLabel: 'Energia Elettrica, Gas e Contabilizzazione Calore',
    sector: 'Energia elettrica e gas',
    phone: '800 567567',
    email: 'servizioclienti@energy-up.it',
    logoInitials: 'EUP',
    badgeConvenzione: 'Convenzione ANACI Servizi',
    descrizioneServizi:
      'Fornitura di energia elettrica 100% green e gas naturale per realtà condominiali con portale digitale multi-utenza.',
    vantaggiAssociati:
      'Numero Verde prioritario 800 567567 riservato agli studi di amministrazione e scarico massivo XML/PDF per importazione automatica.',
    zoneCoperte: ['Bergamo Città', 'Val Seriana', 'Val Brembana', 'Isola Bergamasca', 'Bassa Bergamasca'],
    ratingMedio: 4.75,
    totaleRecensioni: 19,
    reviews: [
      {
        id: 'rev-301',
        authorAlias: 'Studio Associato #BG-0741',
        zonaCondominio: 'Treviglio / Bassa Bergamasca',
        rating: 5,
        intervento: 'Portale fatturazione multi-condominio',
        comment: 'Molto comodo il portale unico per scaricare tutte le bollette del mese in un solo clic.',
        date: '19 Set 2026',
      },
    ],
  },
  {
    id: 4,
    slug: 'simecom',
    companyName: 'Simecom',
    category: 'ENERGIA_CALORE',
    categoryLabel: 'Energia Elettrica, Gas e Contabilizzazione Calore',
    sector: 'Energia elettrica e gas',
    referentName: 'Alessandro Gallo',
    phone: '348 5342800',
    email: 'alessandro.gallo@simecom.it',
    logoInitials: 'SIM',
    badgeConvenzione: 'Partner Storico Territorio',
    descrizioneServizi:
      'Storico operatore di energia elettrica e gas con forte radicamento tra Bergamo, Cremona e provincia, specializzato in forniture condominiali.',
    vantaggiAssociati:
      'Assistenza diretta tramite il referente Alessandro Gallo per pratiche termiche, riattivazioni contatori morosi e preventivi stagionali.',
    zoneCoperte: ['Bergamo Città', 'Bassa Bergamasca', 'Isola Bergamasca'],
    ratingMedio: 4.85,
    totaleRecensioni: 29,
    reviews: [
      {
        id: 'rev-401',
        authorAlias: 'Studio Associato #BG-0955',
        zonaCondominio: 'Caravaggio / Romano di Lombardia',
        rating: 5,
        intervento: 'Fornitura gas centralizzato 64 appartamenti',
        comment: 'Alessandro Gallo sempre reperibile e preparatissimo sulle pratiche fiscali accise usi civili.',
        date: '02 Ott 2026',
      },
    ],
  },
  {
    id: 5,
    slug: 'promax-energia',
    companyName: 'Promax Energia',
    category: 'ENERGIA_CALORE',
    categoryLabel: 'Energia Elettrica, Gas e Contabilizzazione Calore',
    sector: 'Energia elettrica e gas',
    referentName: 'Gregory Airopetyan',
    phone: '338 6097174',
    email: 'direzione@promaxenergia.com',
    logoInitials: 'PMX',
    badgeConvenzione: 'Convenzione ANACI Servizi',
    descrizioneServizi:
      'Fornitura e gestione strategica dei contratti di energia elettrica e gas per condomini con analisi predittiva di bilancio.',
    vantaggiAssociati:
      'Elaborazione gratuita del budget previsionale energetico per il bilancio preventivo annuale con il referente Gregory Airopetyan.',
    zoneCoperte: ['Bergamo Città', 'Val Seriana', 'Isola Bergamasca'],
    ratingMedio: 4.8,
    totaleRecensioni: 17,
    reviews: [
      {
        id: 'rev-501',
        authorAlias: 'Studio Associato #BG-1120',
        zonaCondominio: 'Bergamo (Loreto)',
        rating: 5,
        intervento: 'Simulazione spesa termica per preventivo 2026/2027',
        comment: 'Report previsionale utilissimo per evitare scostamenti a consuntivo.',
        date: '25 Set 2026',
      },
    ],
  },
  {
    id: 6,
    slug: 'infinity-control-service',
    companyName: 'Infinity Control Service',
    category: 'ENERGIA_CALORE',
    categoryLabel: 'Energia Elettrica, Gas e Contabilizzazione Calore',
    sector: 'Contabilizzazione del calore',
    phone: '035 0433829',
    email: 'info@infinitycontrolservice.com',
    logoInitials: 'ICS',
    badgeConvenzione: 'Specialista UNI 10200',
    descrizioneServizi:
      'Installazione, telelettura e gestione impianti di contabilizzazione del calore e termoregolazione secondo normativa UNI 10200.',
    vantaggiAssociati:
      'Verifica gratuita ripartitori in avaria, tabelle di riparto consumo volontario/involontario pronte per l’importazione in Danea/Kubik e assistenza in assemblea.',
    zoneCoperte: ['Bergamo Città', 'Città Alta', 'Val Seriana', 'Val Brembana'],
    ratingMedio: 4.92,
    totaleRecensioni: 41,
    reviews: [
      {
        id: 'rev-601',
        authorAlias: 'Studio Associato #BG-1042',
        zonaCondominio: 'Bergamo (Via Borgo Palazzo)',
        rating: 5,
        intervento: 'Telelettura walk-by e riparto spese riscaldamento + ACS',
        comment: 'Prospetti consegnati in 3 giorni lavorativi dalla chiusura letture, zero contestazioni in assemblea.',
        date: '12 Ott 2026',
      },
    ],
  },

  // CATEGORIA 2: Impianti, Manutenzione, Sicurezza e Certificazioni (7 - 12)
  {
    id: 7,
    slug: 'duelle-lift',
    companyName: 'Duelle Lift',
    category: 'IMPIANTI_SICUREZZA',
    categoryLabel: 'Impianti, Manutenzione, Sicurezza e Certificazioni',
    sector: 'Ascensori',
    referentName: 'Stefano Pegorari',
    phone: '335 1227655',
    email: 'stefano.pegorari@duellelift.com',
    logoInitials: 'DLL',
    badgeConvenzione: 'Partner Tecnico Ascensori',
    descrizioneServizi:
      'Manutenzione multimarca, riparazione, ammodernamento e installazione di ascensori, montascale e piattaforme elevatrici.',
    vantaggiAssociati:
      'Sopralluogo tecnico gratuito con Stefano Pegorari, reperibilità H24 per emergenze persone bloccate e condizioni agevolate sugli adeguamenti normativi.',
    zoneCoperte: ['Bergamo Città', 'Città Alta', 'Val Seriana', 'Isola Bergamasca', 'Bassa Bergamasca'],
    ratingMedio: 4.95,
    totaleRecensioni: 38,
    reviews: [
      {
        id: 'rev-701',
        authorAlias: 'Studio Associato #BG-0612',
        zonaCondominio: 'Bergamo Centro',
        rating: 5,
        intervento: 'Sostituzione quadro di manovra e combinatore GSM bidirezionale',
        comment: 'Stefano Pegorari ci ha seguito passo passo, preventivo inferiore del 18% rispetto alla multinazionale uscente e tempi rispettati.',
        date: '09 Ott 2026',
      },
    ],
  },
  {
    id: 8,
    slug: 'idromac',
    companyName: 'IDROMAC',
    category: 'IMPIANTI_SICUREZZA',
    categoryLabel: 'Impianti, Manutenzione, Sicurezza e Certificazioni',
    sector: 'Idraulica',
    phone: '0363 760086',
    email: 'idromac@gmail.com',
    logoInitials: 'IDR',
    badgeConvenzione: 'Pronto Intervento Idraulico',
    descrizioneServizi:
      'Interventi idraulici condominiali, ricerca perdite occulte con termocamera/gas tracciante, manutenzione autoclavi e colonne di scarico.',
    vantaggiAssociati:
      'Canale prioritario per emergenze infiltrazioni e rotture colonne montanti nei condomini gestiti dagli associati ANACI BG, con report fotografico per periti assicurativi.',
    zoneCoperte: ['Bassa Bergamasca', 'Bergamo Città', 'Isola Bergamasca'],
    ratingMedio: 4.85,
    totaleRecensioni: 27,
    reviews: [
      {
        id: 'rev-801',
        authorAlias: 'Studio Associato #BG-0881',
        zonaCondominio: 'Treviglio (BG)',
        rating: 5,
        intervento: 'Ricerca perdita occulta tra piano terzo e secondo + relazione assicurazione',
        comment: 'Individuata la perdita senza demolire l’intero bagno e redatta relazione perfetta per la polizza Globale Fabbricati.',
        date: '01 Ott 2026',
      },
    ],
  },
  {
    id: 9,
    slug: 'crotti-safety',
    companyName: 'Crotti Safety',
    category: 'IMPIANTI_SICUREZZA',
    categoryLabel: 'Impianti, Manutenzione, Sicurezza e Certificazioni',
    sector: 'Antincendio',
    phone: '035 6304701',
    email: 'info@crottisafety.it',
    logoInitials: 'CRS',
    badgeConvenzione: 'Sicurezza Antincendio BG',
    descrizioneServizi:
      'Manutenzione presidi antincendio (estintori, idranti, porte tagliafuoco REI, EFC), pratiche SCIA/CPI Vigili del Fuoco e adeguamenti D.M. 25/01/2019.',
    vantaggiAssociati:
      'Audit preliminare gratuito su autorimesse e centrali termiche soggette a controllo VVF e gestione digitale delle scadenze semestrali.',
    zoneCoperte: ['Bergamo Città', 'Val Seriana', 'Val Brembana', 'Isola Bergamasca', 'Bassa Bergamasca'],
    ratingMedio: 4.9,
    totaleRecensioni: 33,
    reviews: [
      {
        id: 'rev-901',
        authorAlias: 'Studio Associato #BG-1009',
        zonaCondominio: 'Alzano Lombardo (BG)',
        rating: 5,
        intervento: 'Rinnovo periodico conformità antincendio autorimessa 52 box',
        comment: 'Tecnici puntuali e precisi, ci hanno segnalato subito due maniglioni antipanico fuori norma prima del sopralluogo.',
        date: '14 Ott 2026',
      },
    ],
  },
  {
    id: 10,
    slug: 'rear-gsa',
    companyName: 'Rear GSA (Gruppo Rear)',
    category: 'IMPIANTI_SICUREZZA',
    categoryLabel: 'Impianti, Manutenzione, Sicurezza e Certificazioni',
    sector: 'Antincendio',
    phone: '035 344509',
    email: 'amministrazione@grupporear.it',
    logoInitials: 'RGR',
    badgeConvenzione: 'Convenzione Antincendio & GSA',
    descrizioneServizi:
      'Gestione Sicurezza Antincendio (GSA) per edifici civili di grande altezza, manutenzione presidi e piani di emergenza condominiali.',
    vantaggiAssociati:
      'Tariffe agevolate per la redazione e aggiornamento dei piani GSA obbligatori (Livelli 1, 2 e 3) e cartellonistica regolamentare.',
    zoneCoperte: ['Bergamo Città', 'Isola Bergamasca', 'Bassa Bergamasca'],
    ratingMedio: 4.82,
    totaleRecensioni: 24,
    reviews: [
      {
        id: 'rev-1001',
        authorAlias: 'Studio Associato #BG-0540',
        zonaCondominio: 'Bergamo (Zona Stazione)',
        rating: 5,
        intervento: 'Adeguamento GSA edificio altezza antincendio > 24m',
        comment: 'Documentazione pronta da allegare alla convocazione assembleare e ottima gestione delle verifiche semestrali.',
        date: '20 Set 2026',
      },
    ],
  },
  {
    id: 11,
    slug: 'sonzogni-sintesi',
    companyName: 'Sonzogni Sintesi',
    category: 'IMPIANTI_SICUREZZA',
    categoryLabel: 'Impianti, Manutenzione, Sicurezza e Certificazioni',
    sector: 'Dispositivi anticaduta e linee vita',
    phone: '035 0448433',
    email: 'info@sonzognisintesi.it',
    logoInitials: 'SNZ',
    badgeConvenzione: 'Sicurezza Coperture & Linee Vita',
    descrizioneServizi:
      'Progettazione, installazione, collaudo e ispezione periodica di sistemi anticaduta e linee vita su tetti e coperture condominiali.',
    vantaggiAssociati:
      'Verifica gratuita della conformità del Fascicolo Tecnico della copertura per tutelare la responsabilità penale dell’amministratore (committente lavori in quota).',
    zoneCoperte: ['Bergamo Città', 'Città Alta', 'Val Brembana', 'Val Seriana', 'Isola Bergamasca'],
    ratingMedio: 4.94,
    totaleRecensioni: 36,
    reviews: [
      {
        id: 'rev-1101',
        authorAlias: 'Studio Associato #BG-1042',
        zonaCondominio: 'Città Alta (Bergamo)',
        rating: 5,
        intervento: 'Revisione periodica linea vita copertura storica in coppi',
        comment: 'Fondamentali per non far salire antennisti o lattonieri su tetti privi di revisione certificata.',
        date: '06 Ott 2026',
      },
    ],
  },
  {
    id: 12,
    slug: 'csdm',
    companyName: 'CSDM',
    category: 'IMPIANTI_SICUREZZA',
    categoryLabel: 'Impianti, Manutenzione, Sicurezza e Certificazioni',
    sector: 'Ente di Certificazione e Ispezione',
    phone: '02 56816188',
    email: 'info@csdm.it',
    logoInitials: 'CSD',
    badgeConvenzione: 'Organismo Notificato & Ispezioni',
    descrizioneServizi:
      'Ente abilitato per verifiche ispettive obbligatorie: messa a terra (DPR 462/01), ascensori (DPR 162/99), analisi acque potabili e rischio Legionella (D.Lgs. 18/2023).',
    vantaggiAssociati:
      'Scadenzario centralizzato per tutti i condomini dello studio, assistenza caricamento portale CIVA INAIL e listino convenzionato ANACI BG.',
    zoneCoperte: ['Bergamo Città', 'Val Seriana', 'Val Brembana', 'Isola Bergamasca', 'Bassa Bergamasca'],
    ratingMedio: 4.88,
    totaleRecensioni: 45,
    reviews: [
      {
        id: 'rev-1201',
        authorAlias: 'Studio Associato #BG-0412',
        zonaCondominio: 'Bergamo e Provincia',
        rating: 5,
        intervento: 'Verifiche DPR 462/01 + Campionamento Legionella e D.Lgs. 18/2023',
        comment: 'Gestiscono anche l’abbinamento CIVA INAIL senza farci perdere ore sul portale.',
        date: '11 Ott 2026',
      },
    ],
  },

  // CATEGORIA 3: Pulizie, Disinfestazione e Servizi al Condominio (13 - 18)
  {
    id: 13,
    slug: 'life-srl',
    companyName: 'Life Srl',
    category: 'PULIZIE_MULTISERVIZI',
    categoryLabel: 'Pulizie, Disinfestazione e Servizi al Condominio',
    sector: 'Pulizie condominiali',
    phone: '039 5781260',
    email: 'lifesrlbergamo@gmail.com',
    logoInitials: 'LIF',
    badgeConvenzione: 'Convenzione Pulizie & Igiene',
    descrizioneServizi:
      'Servizi di pulizia ordinaria e straordinaria per stabili condominiali, gestione esposizione bidoni raccolta differenziata e sanificazioni.',
    vantaggiAssociati:
      'Sopralluogo gratuito entro 48 ore dalla richiesta e primo intervento di sgrosso/sanificazione incluso nei nuovi contratti annuali.',
    zoneCoperte: ['Bergamo Città', 'Isola Bergamasca', 'Bassa Bergamasca'],
    ratingMedio: 4.8,
    totaleRecensioni: 21,
    reviews: [
      {
        id: 'rev-1301',
        authorAlias: 'Studio Associato #BG-0988',
        zonaCondominio: 'Ponte San Pietro (BG)',
        rating: 5,
        intervento: 'Appalto pulizia scale e gestione bidoni Aprica/Comune',
        comment: 'Personale educato, divisa riconoscibile e foglio firma passaggi sempre aggiornato in bacheca.',
        date: '29 Set 2026',
      },
    ],
  },
  {
    id: 14,
    slug: 'mocit',
    companyName: 'MOCIT',
    category: 'PULIZIE_MULTISERVIZI',
    categoryLabel: 'Pulizie, Disinfestazione e Servizi al Condominio',
    sector: 'Disinfestazione e derattizzazione',
    phone: '035 212011',
    email: 'info@mocit.it',
    logoInitials: 'MOC',
    badgeConvenzione: 'Igiene Ambientale Bergamo',
    descrizioneServizi:
      'Derattizzazione certificata, disinfestazione zanzare/blatte/vespe, dissuasione piccioni e volatili per tetti e cortili storici.',
    vantaggiAssociati:
      'Intervento d’urgenza per nidi di imenotteri/vespe o infestazioni improvvise e piano annuale antilarvale conforme alle ordinanze del Comune di Bergamo.',
    zoneCoperte: ['Bergamo Città', 'Città Alta', 'Val Seriana', 'Val Brembana', 'Isola Bergamasca', 'Bassa Bergamasca'],
    ratingMedio: 4.91,
    totaleRecensioni: 39,
    reviews: [
      {
        id: 'rev-1401',
        authorAlias: 'Studio Associato #BG-0320',
        zonaCondominio: 'Bergamo (Redona)',
        rating: 5,
        intervento: 'Piano derattizzazione + trattamenti antilarvali tombini',
        comment: 'Una certezza storica a Bergamo: rilasciano sempre le schede di sicurezza dei prodotti per l’affissione in portineria.',
        date: '07 Ott 2026',
      },
    ],
  },
  {
    id: 15,
    slug: 'cmc-multiservice',
    companyName: 'CMC (Multiservice Condominio)',
    category: 'PULIZIE_MULTISERVIZI',
    categoryLabel: 'Pulizie, Disinfestazione e Servizi al Condominio',
    sector: 'Multiservizi',
    phone: '035 0390611',
    email: 'info@multiservicecondominio.it',
    logoInitials: 'CMC',
    badgeConvenzione: 'Partner Multiservizi Condominio',
    descrizioneServizi:
      'Manutenzione giardini e aree verdi, potature in quota, pulizie, piccole opere edili/fabbrili e servizio invernale sgombero neve/spargisale.',
    vantaggiAssociati:
      'Canone unico multiservizio (pulizie + verde + rotazione sacchi + cambio lampadine) con rendicontazione separata per tabelle millesimali.',
    zoneCoperte: ['Bergamo Città', 'Val Seriana', 'Isola Bergamasca', 'Bassa Bergamasca'],
    ratingMedio: 4.86,
    totaleRecensioni: 31,
    reviews: [
      {
        id: 'rev-1501',
        authorAlias: 'Studio Associato #BG-1075',
        zonaCondominio: 'Curno / Mozzo (BG)',
        rating: 5,
        intervento: 'Manutenzione parco condominiale 4.000 mq + pulizie',
        comment: 'Avere un unico interlocutore sia per il giardino che per le pulizie riduce drasticamente i rimpalli di responsabilità.',
        date: '03 Ott 2026',
      },
    ],
  },
  {
    id: 16,
    slug: 'soquick',
    companyName: 'SoQuick',
    category: 'PULIZIE_MULTISERVIZI',
    categoryLabel: 'Pulizie, Disinfestazione e Servizi al Condominio',
    sector: 'Servizi per condomini',
    referentName: 'Nadia Domanico',
    phone: '344 0414389',
    email: 'nadia.domanico@soquick.it',
    logoInitials: 'SOQ',
    badgeConvenzione: 'Gestione Rapida Interventi',
    descrizioneServizi:
      'Servizi operativi rapidi per il condominio, pronto intervento manutentivo multisettore e supporto operativo agli studi di amministrazione.',
    vantaggiAssociati:
      'Referente dedicato (Nadia Domanico) per presa in carico immediata delle segnalazioni guasti e invio report di fine lavori con foto prima/dopo.',
    zoneCoperte: ['Bergamo Città', 'Isola Bergamasca', 'Bassa Bergamasca', 'Val Seriana'],
    ratingMedio: 4.84,
    totaleRecensioni: 25,
    reviews: [
      {
        id: 'rev-1601',
        authorAlias: 'Studio Associato #BG-0670',
        zonaCondominio: 'Bergamo (Longuelo)',
        rating: 5,
        intervento: 'Ripristino serratura elettrica portone e chiudporta aereo',
        comment: 'Nadia Domanico gentilissima e super reattiva: guasto segnalato alle 9:00 e risolto entro il pomeriggio.',
        date: '13 Ott 2026',
      },
    ],
  },
  {
    id: 17,
    slug: 'tresessanta-group',
    companyName: 'Tresessanta Group',
    category: 'PULIZIE_MULTISERVIZI',
    categoryLabel: 'Pulizie, Disinfestazione e Servizi al Condominio',
    sector: 'Servizi per condomini',
    phone: '035 0086961',
    email: 'backoffice@tresessanta.com',
    logoInitials: '360',
    badgeConvenzione: 'Global Service Condominiale',
    descrizioneServizi:
      'Facility management integrato per grandi condomini e complessi direzionali: pulizie, portierato/custodia, verde e manutenzioni.',
    vantaggiAssociati:
      'Backoffice dedicato per gli associati ANACI Bergamo con tracciamento ticket e verifica DURC/documentazione sicurezza fornitori sempre aggiornata.',
    zoneCoperte: ['Bergamo Città', 'Val Seriana', 'Isola Bergamasca', 'Bassa Bergamasca'],
    ratingMedio: 4.87,
    totaleRecensioni: 28,
    reviews: [
      {
        id: 'rev-1701',
        authorAlias: 'Studio Associato #BG-0519',
        zonaCondominio: 'Stezzano (BG)',
        rating: 5,
        intervento: 'Global service pulizia e custodia complesso 120 unità',
        comment: 'Struttura organizzata e backoffice puntualissimo nell’invio di DURC e polizza RCT/RCO.',
        date: '22 Set 2026',
      },
    ],
  },
  {
    id: 18,
    slug: 'very-fast-people',
    companyName: 'Very Fast People',
    category: 'PULIZIE_MULTISERVIZI',
    categoryLabel: 'Pulizie, Disinfestazione e Servizi al Condominio',
    sector: 'Servizi per condomini',
    phone: '800 035452',
    logoInitials: 'VFP',
    badgeConvenzione: 'Partner Strategico ANACI',
    descrizioneServizi:
      'Società di outsourcing e servizi specialistici dedicata esclusivamente agli Amministratori di Condominio (gestione sinistri, segreteria remota, contabilità e adempimenti).',
    vantaggiAssociati:
      'Accesso diretto tramite Numero Verde 800 035452 alle condizioni quadro riservate agli associati ANACI per alleggerire il carico operativo di studio.',
    zoneCoperte: ['Bergamo Città', 'Val Seriana', 'Val Brembana', 'Isola Bergamasca', 'Bassa Bergamasca'],
    ratingMedio: 4.89,
    totaleRecensioni: 52,
    reviews: [
      {
        id: 'rev-1801',
        authorAlias: 'Studio Associato #BG-1042',
        zonaCondominio: 'Bergamo e Provincia',
        rating: 5,
        intervento: 'Gestione esternalizzata sinistri assicurativi e centralino di emergenza',
        comment: 'Ci ha liberato almeno 10 ore a settimana nella gestione dei periti e delle liquidazioni danni d’acqua.',
        date: '15 Ott 2026',
      },
    ],
  },

  // CATEGORIA 4: Servizi per lo Studio, Fisco e Recupero Crediti (19 - 21)
  {
    id: 19,
    slug: 'servizio-unico',
    companyName: 'Servizio Unico',
    category: 'STUDIO_FISCO_CREDITI',
    categoryLabel: 'Servizi per lo Studio, Fisco e Recupero Crediti',
    sector: 'Consulenza fiscale',
    phone: '035 794335',
    email: 'info@serviziounico.it',
    logoInitials: 'SVU',
    badgeConvenzione: 'Partner Fiscale & 770/CU',
    descrizioneServizi:
      'Elaborazione e trasmissione telematica Modello 770 condominiale, Certificazioni Uniche (CU), pratiche detrazioni fiscali Agenzia delle Entrate e consulenza tributaria.',
    vantaggiAssociati:
      'Tariffe forfettarie per condominio riservate ANACI BG, estrazione automatica dati da Danea Domustudio, Kubik e Pigreco, e rilascio immediato ricevute Entratel.',
    zoneCoperte: ['Bergamo Città', 'Val Seriana', 'Val Brembana', 'Isola Bergamasca', 'Bassa Bergamasca'],
    ratingMedio: 4.96,
    totaleRecensioni: 48,
    reviews: [
      {
        id: 'rev-1901',
        authorAlias: 'Studio Associato #BG-0214',
        zonaCondominio: 'Bergamo Centro',
        rating: 5,
        intervento: 'Elaborazione CU + Modelli 770 e pratiche bonus edilizi su 75 condomini',
        comment: 'Precisione chirurgica, conoscono a memoria tutte le casistiche delle ritenute d’acconto condominiali.',
        date: '11 Ott 2026',
      },
    ],
  },
  {
    id: 20,
    slug: 'studio-tj',
    companyName: 'Studio TJ',
    category: 'STUDIO_FISCO_CREDITI',
    categoryLabel: 'Servizi per lo Studio, Fisco e Recupero Crediti',
    sector: 'Recupero del credito',
    phone: '035 4139438',
    email: 'info@studiotj.it',
    logoInitials: 'STJ',
    badgeConvenzione: 'Tutela Crediti Condominiali',
    descrizioneServizi:
      'Gestione stragiudiziale e giudiziale delle morosità condominiali, visure patrimoniali/ipocatastali, rintraccio eredi e supporto decreti ingiuntivi ex art. 63 disp. att. c.c.',
    vantaggiAssociati:
      'Pre-analisi gratuita di solvibilità del condomino moroso per valutare la capienza prima di anticipare spese legali a carico del condominio.',
    zoneCoperte: ['Bergamo Città', 'Val Seriana', 'Val Brembana', 'Isola Bergamasca', 'Bassa Bergamasca'],
    ratingMedio: 4.9,
    totaleRecensioni: 35,
    reviews: [
      {
        id: 'rev-2001',
        authorAlias: 'Studio Associato #BG-0790',
        zonaCondominio: 'Albino / Nembro (Val Seriana)',
        rating: 5,
        intervento: 'Rintraccio eredi e piano rientro morosità storica € 8.400',
        comment: 'Recuperato l’intero importo con piano di rientro garantito senza dover arrivare al pignoramento immobiliare.',
        date: '08 Ott 2026',
      },
    ],
  },
  {
    id: 21,
    slug: 'tutto-ufficio',
    companyName: 'Tutto Ufficio',
    category: 'STUDIO_FISCO_CREDITI',
    categoryLabel: 'Servizi per lo Studio, Fisco e Recupero Crediti',
    sector: 'Forniture e servizi per l’amministratore',
    phone: '02 9092683',
    email: 'info@tutto-ufficio.it',
    logoInitials: 'TUF',
    badgeConvenzione: 'Forniture & Print Studio',
    descrizioneServizi:
      'Fornitura macchine per ufficio, multifunzione ad alta velocità per fascicolazione bilanci, cancelleria e servizi di postalizzazione convocazioni.',
    vantaggiAssociati:
      'Listino convenzionato ANACI per noleggio operativo multifunzione (costo copia bloccato per i picchi stagionali di convocazione assemblee) e consegna rapida.',
    zoneCoperte: ['Bergamo Città', 'Isola Bergamasca', 'Bassa Bergamasca', 'Val Seriana'],
    ratingMedio: 4.81,
    totaleRecensioni: 20,
    reviews: [
      {
        id: 'rev-2101',
        authorAlias: 'Studio Associato #BG-0633',
        zonaCondominio: 'Bergamo (Colognola)',
        rating: 5,
        intervento: 'Noleggio multifunzione con pinzatura automatica fascicoli assembleari',
        comment: 'Assistenza tecnica veloce e costo copia imbattibile nei mesi di marzo-maggio.',
        date: '18 Set 2026',
      },
    ],
  },
];

export const INITIAL_SOS_POSTS: SosPostItem[] = [
  {
    id: 'sos-bg-01',
    authorName: 'Dott. Marco Locatelli',
    authorCode: 'BG-1042',
    isAnonymous: true,
    anonymousAlias: 'Associato Verificato #BG-Anonimo (Città Alta)',
    title:
      'Infiltrazioni da lastrico solare ad uso esclusivo in immobile vincolato Soprintendenza (Città Alta): riparto spese indagini distruttive e rifacimento',
    content:
      'Colleghi, gestisco un condominio storico in Città Alta dove il proprietario dell’attico ha l’uso esclusivo della terrazza a livello che funge da copertura per 4 unità sottostanti. Si sono verificate infiltrazioni importanti. Il proprietario dell’attico sostiene che la causa sia un cedimento strutturale del solaio antico (quindi art. 1125 / 1123 c.c.) e rifiuta l’applicazione dell’art. 1126 c.c. (1/3 e 2/3) anche per le prove di allagamento e la sostituzione della guaina. Come vi comportate per l’imputazione provvisoria a bilancio straordinario in attesa della perizia tecnica?',
    primaryTag: 'Infiltrazioni',
    secondaryTags: ['Art. 1126 c.c.', 'Lastrico Solare', 'Città Alta / Vincolo Belle Arti'],
    zonaCondominio: 'Città Alta (Bergamo)',
    urgency: 'ALTA',
    status: 'IN_ANALISI_CS',
    richiedeParereCentroStudi: true,
    viewsCount: 142,
    createdAt: 'Oggi, 09:40',
    replies: [
      {
        id: 'rep-01',
        authorName: 'Avv. Chiara Belotti — Centro Studi ANACI BG',
        authorRole: 'ESPERTO',
        authorBadge: 'Parere Ufficiale Centro Studi ANACI BG',
        isAnonymous: false,
        isOfficialExpertOpinion: true,
        riferimentiNormativi: 'Art. 1126 c.c. | Cass. Civ. Sez. Unite n. 9449/2016 | Trib. Bergamo Sez. IV Civile',
        content:
          'Secondo il consolidato orientamento della Cassazione (SS.UU. n. 9449/2016) recepito costantemente anche dalla IV Sezione Civile del Tribunale di Bergamo, l’art. 1126 c.c. (1/3 a carico dell’usuario esclusivo e 2/3 a carico dei condomini della verticale sottostante) si applica a tutte le spese di impermeabilizzazione, pavimentazione e relative indagini tecniche connesse alla funzione di copertura, salvo che venga rigorosamente provato che il danno derivi da vizio costruttivo originario strutturale delle travi portanti o da colpa esclusiva del singolo (art. 2051 c.c.). In sede di delibera assembleare per il fondo speciale ex art. 1135 n. 4 c.c., è legittimo e prudenziale applicare il criterio legale ex art. 1126 c.c. specificando a verbale "salvo conguaglio all’esito delle risultanze peritali definitive".',
        helpfulVotes: 28,
        userHasVoted: true,
        createdAt: 'Oggi, 11:15',
      },
      {
        id: 'rep-02',
        authorName: 'Rag. Stefano Ghezzi (BG-0814)',
        authorRole: 'ASSOCIATO',
        authorBadge: 'Associato ANACI BG',
        isAnonymous: false,
        isOfficialExpertOpinion: false,
        riferimentiNormativi: 'Prassi Operativa Soprintendenza BG',
        content:
          'Aggiungo un consiglio pratico su Città Alta: fai eseguire prima una ricerca perdite non distruttiva con gas tracciante o termografia (in convenzione abbiamo IDROMAC che rilascia report fotografico peritale), così eviti demolizioni della pavimentazione storica prima del nulla osta e cristallizzi subito la causa nella guaina bituminosa.',
        helpfulVotes: 15,
        userHasVoted: false,
        createdAt: 'Oggi, 12:05',
      },
    ],
  },
  {
    id: 'sos-bg-02',
    authorName: 'Geom. Elena Rossi',
    authorCode: 'BG-0915',
    isAnonymous: false,
    anonymousAlias: 'Geom. Elena Rossi (#BG-0915)',
    title:
      'Morosità oltre 6 mesi su teleriscaldamento centralizzato e distacco fornitura minacciato: sospensione servizi ex art. 63 comma 3 disp. att. c.c.',
    content:
      'In una palazzina di 18 appartamenti a Seriate tre condomini accumulano una morosità superiore a 14.000 € complessivi (oltre due semestralità). Abbiamo già depositato ricorso per decreto ingiuntivo provvisoriamente esecutivo. Vorrei procedere alla sospensione della fruizione dei servizi comuni suscettibili di godimento separato (chiusura e piombatura valvole riscaldamento/acqua calda tramite elettrovalvole di piano esterne all’appartamento) ex art. 63 co. 3 disp. att. c.c. Qualcuno ha avuto recenti provvedimenti d’urgenza ex art. 700 c.p.c. presso il Tribunale di Bergamo in presenza di minori nell’unità immobiliare?',
    primaryTag: 'Morosità',
    secondaryTags: ['Art. 63 disp. att. c.c.', 'Sospensione Riscaldamento', 'Tribunale di Bergamo'],
    zonaCondominio: 'Val Seriana / Seriate',
    urgency: 'CRITICA',
    status: 'APERTO',
    richiedeParereCentroStudi: true,
    viewsCount: 98,
    createdAt: 'Ieri, 16:30',
    replies: [
      {
        id: 'rep-03',
        authorName: 'Avv. Chiara Belotti — Centro Studi ANACI BG',
        authorRole: 'ESPERTO',
        authorBadge: 'Parere Ufficiale Centro Studi ANACI BG',
        isAnonymous: false,
        isOfficialExpertOpinion: true,
        riferimentiNormativi: 'Art. 63 co. 3 disp. att. c.c. | Giurisprudenza Trib. Bergamo e Brescia',
        content:
          'Attenzione: mentre l’art. 63 co. 3 disp. att. c.c. attribuisce all’amministratore il potere-dovere di sospendere i servizi suscettibili di godimento separato senza preventiva autorizzazione giudiziale (purché senza introdursi nella proprietà privata), la giurisprudenza di merito lombarda (incluso il Tribunale di Bergamo in sede cautelare ex art. 700 c.p.c.) distingue nettamente tra servizi "non essenziali" (es. sbarra carraia, antenna centralizzata) e beni primari costituzionalmente tutelati ex art. 32 Cost. (acqua potabile e riscaldamento invernale in presenza di soggetti fragili o minori). Per l’acqua potabile vale inoltre il minimo vitale garantito (50 litri/giorno per abitante ex DPCM 13/10/2016). Ti suggerisco di attivare subito la pre-analisi patrimoniale/pignoramento presso terzi (stipendio/canoni locazione) tramite i partner convenzionati prima di piombare il riscaldamento se vi sono minori.',
        helpfulVotes: 34,
        userHasVoted: false,
        createdAt: 'Ieri, 18:10',
      },
    ],
  },
  {
    id: 'sos-bg-03',
    authorName: 'Rag. Davide Cortinovis',
    authorCode: 'BG-1188',
    isAnonymous: true,
    anonymousAlias: 'Associato Verificato #BG-Anonimo (Isola Bergamasca)',
    title:
      'Distacco unilaterale dall’impianto centralizzato (Art. 1118 co. 4 c.c.): asseverazione termotecnica contestata e quota consumo involontario UNI 10200',
    content:
      'Un condomino al quarto e ultimo piano a Ponte San Pietro mi ha inviato via PEC una perizia termotecnica comunicando il distacco dall’impianto centralizzato ai sensi dell’art. 1118 co. 4 c.c., sostenendo che non vi siano "notevoli squilibri di funzionamento né aggravi di spesa per gli altri condomini". Tuttavia il nostro terzo responsabile e il termotecnico condominiale rilevano che, trattandosi dell’ultimo piano, il distacco aumenta le dispersioni verso l’appartamento freddo sottostante. Come contestare formalmente la perizia di parte?',
    primaryTag: 'Distacchi',
    secondaryTags: ['Art. 1118 co. 4 c.c.', 'UNI 10200', 'Contabilizzazione Calore'],
    zonaCondominio: 'Isola Bergamasca',
    urgency: 'NORMALE',
    status: 'RISOLTO',
    richiedeParereCentroStudi: false,
    viewsCount: 116,
    createdAt: '14 Ott 2026',
    replies: [
      {
        id: 'rep-04',
        authorName: 'Ing. Paolo Milesi (Esperto Tecnico Centro Studi)',
        authorRole: 'ESPERTO',
        authorBadge: 'Parere Tecnico Centro Studi ANACI BG',
        isAnonymous: false,
        isOfficialExpertOpinion: true,
        riferimentiNormativi: 'Art. 1118 co. 4 c.c. | D.Lgs. 102/2014 | Norma UNI 10200 | Regolamento Regionale Lombardia',
        content:
          'Ricorda al condomino due punti fermi: 1) L’onere della prova rigorosa dell’assenza sia di notevoli squilibri termici sia di aggravi di spesa grava interamente sul distaccante (Cass. n. 22285/2016); se la perizia non include il ricalcolo del fabbisogno secondo UNI 10200 dell’intero fabbricato, il distacco è illegittimo. 2) Anche qualora il distacco fosse tecnicamente legittimo, il condomino resta obbligato in perpetuo a pagare le spese di manutenzione straordinaria, conservazione, messa a norma della centrale termica e la quota di consumo involontario (dispersioni della rete di distribuzione determinata ex UNI 10200). Puoi chiedere a Infinity Control Service (partner ANACI BG) la verifica strumentale del prospetto.',
        helpfulVotes: 22,
        userHasVoted: false,
        createdAt: '14 Ott 2026',
      },
    ],
  },
  {
    id: 'sos-bg-04',
    authorName: 'Dott.ssa Laura Vitali',
    authorCode: 'BG-0765',
    isAnonymous: false,
    anonymousAlias: 'Dott.ssa Laura Vitali (#BG-0765)',
    title:
      'Installazione colonnina ricarica veicolo elettrico in autorimessa soggetta a CPI (D.M. 25/01/2019 e Circolare VVF): limiti e prescrizioni su Parti Comuni',
    content:
      'Un condomino in Via Borgo Palazzo vuole installare una Wallbox nel proprio box privato collegandola al proprio contatore tramite canalina sulle parti comuni del corsello interrato (autorimessa con 38 box soggetta a SCIA VVF). Il professionista antincendio ci segnala la necessità del pulsante di sgancio di emergenza generale delle stazioni di ricarica e la verifica di compatibilità col CPI vigente. Chi sostiene il costo dell’adeguamento del pulsante di sgancio generale e dell’aggiornamento della pratica VVF?',
    primaryTag: 'Parti Comuni',
    secondaryTags: ['Colonnine Ricarica EV', 'Prevenzione Incendi VVF', 'Art. 1102 c.c.'],
    zonaCondominio: 'Bergamo Città',
    urgency: 'NORMALE',
    status: 'APERTO',
    richiedeParereCentroStudi: false,
    viewsCount: 84,
    createdAt: '12 Ott 2026',
    replies: [
      {
        id: 'rep-05',
        authorName: 'Dott. Marco Locatelli (BG-1042)',
        authorRole: 'ASSOCIATO',
        authorBadge: 'Associato ANACI BG',
        isAnonymous: false,
        isOfficialExpertOpinion: false,
        riferimentiNormativi: 'Art. 1102 c.c. | Circolare VVF n. 2/2018',
        content:
          'Affrontato caso identico il mese scorso con Crotti Safety: il condomino ha diritto ad eseguire l’intervento a proprie spese ex art. 1102 c.c., ma deve farsi carico integralmente del collegamento della bobina di sgancio della propria Wallbox al pulsante generale di emergenza VVF dell’autorimessa e consegnare all’amministratore la Dichiarazione di Conformità D.M. 37/08 con allegato progetto per il fascicolo antincendio.',
        helpfulVotes: 19,
        userHasVoted: false,
        createdAt: '13 Ott 2026',
      },
    ],
  },
  {
    id: 'sos-bg-05',
    authorName: 'Dott. Matteo Bonomi',
    authorCode: 'BG-1091',
    isAnonymous: true,
    anonymousAlias: 'Associato Verificato #BG-Anonimo (Bassa Bergamasca)',
    title:
      'Chiusura contabilità cantiere Bonus Facciate / Superbonus e ripartizione ritenute di garanzia a seguito di contestazione vizi su cappotto termico',
    content:
      'Abbiamo ultimato un intervento di riqualificazione energetica su un condominio di 24 unità a Treviglio. A distanza di 8 mesi sono emerse cavillature sull’intonaco armato del lato sud-ovest. Il contratto d’appalto ANACI prevede una ritenuta a garanzia del 10% svincolabile solo dopo collaudo definitivo positivo. L’impresa minaccia decreto ingiuntivo per il saldo della ritenuta. Quali cautele formali adottare ex art. 1667 e 1669 c.c. per non far decadere il condominio dalla garanzia?',
    primaryTag: 'Superbonus/Bonus Edilizi',
    secondaryTags: ['Appalto Condominiale', 'Art. 1667-1669 c.c.', 'Vizi Costruttivi'],
    zonaCondominio: 'Bassa Bergamasca',
    urgency: 'ALTA',
    status: 'APERTO',
    richiedeParereCentroStudi: true,
    viewsCount: 109,
    createdAt: '10 Ott 2026',
    replies: [],
  },
];

export const INITIAL_AI_MESSAGES: AiMessage[] = [
  {
    id: 'ai-welcome-1',
    sender: 'ASSISTANT',
    timestamp: 'Oggi, 08:30',
    content:
      'Buongiorno Collega! Sono **ANACI Bot Bergamo**, l’assistente RAG addestrato su:\n\n1. **Codice Civile (Artt. 1117–1139 e Artt. 61–72 disp. att. c.c.)**\n2. **Giurisprudenza di legittimità (Cassazione) e di merito (Tribunale di Bergamo e Corte d’Appello di Brescia)**\n3. **Regolamenti Edilizi, Igiene e Polizia Urbana del Comune di Bergamo**\n4. **Storico Pareri Ufficiali del Centro Studi ANACI Bergamo**\n\nPuoi sottopormi un quesito giuridico o tecnico, chiedermi il calcolo dei **quorum assembleari (art. 1136 c.c.)**, oppure generare istantaneamente una **bozza di verbale, diffida o avviso condominiale**.',
    citedSources: [
      {
        code: 'Artt. 1117-1139 c.c.',
        title: 'Codice Civile — Del Condominio negli Edifici (Riforma L. 220/2012)',
        type: 'CODICE_CIVILE',
        excerpt: 'Corpus normativo integrale aggiornato con disposizioni di attuazione (artt. 61-72 disp. att. c.c.).',
      },
      {
        code: 'Archivio CS-BG 2018-2026',
        title: 'Banca Dati Pareri Centro Studi ANACI Bergamo & Sentenze Trib. Bergamo',
        type: 'CENTRO_STUDI',
        excerpt: 'Massimario ragionato delle pronunce della Sez. III e IV Civile del Tribunale di Bergamo.',
      },
    ],
  },
];

export const TRAINING_EVENTS: TrainingEvent[] = [
  {
    id: 'ev-01',
    codice: 'DM140-BG-2026-09',
    titolo: 'Il Rendiconto Condominiale ex Art. 1130-bis c.c. e le impugnative avanti il Tribunale di Bergamo',
    sottotitolo: 'Criteri di cassa e competenza, nota sintetica esplicativa, giurisprudenza della IV Sezione Civile di Bergamo e revisione contabile',
    tipologiaEvento: 'SEMINARIO_SEDE',
    relatori: 'Avv. Chiara Belotti (Coord. Centro Studi ANACI BG) • Dott. Comm. Luca Manzoni (Revisore Condominiale)',
    data: 'Giovedì 29 Ottobre 2026',
    orario: '14:30 – 18:30 (Registrazione ore 14:00)',
    modalita: 'In Presenza (Via V. Bellini 43, BG)',
    luogoNome: 'Sala Conferenze Sede Provinciale ANACI Bergamo',
    luogoIndirizzo: 'Via Vincenzo Bellini 43, 24129 Bergamo (BG)',
    mappaUrl: 'https://maps.google.com/?q=Via+Vincenzo+Bellini+43+Bergamo',
    cfp: 4,
    materia: 'Area Giuridica & Contabile (DM 140/2014)',
    iscritto: true,
    postiRimasti: 12,
    capienzaMassima: 65,
    locandinaColore: 'GREEN',
    locandinaBadge: 'SEMINARIO IN SEDE • +4 CFP',
    patrocinio: 'Centro Studi Provinciale ANACI Bergamo • Ordine Dottori Commercialisti BG',
    quotaPartecipazione: 'Gratuito per Associati ANACI BG in regola con la quota 2026',
    linkIscrizione: 'https://formazione.anacibergamo.it/iscrizione/DM140-BG-2026-09',
    temiTrattati: [
      'Struttura obbligatoria del fascicolo di rendiconto ex art. 1130-bis c.c.: registro di contabilità, riepilogo finanziario e nota sintetica esplicativa',
      'Principio di cassa vs competenza: analisi delle ultime sentenze del Tribunale di Bergamo (Sez. IV Civile) sulle delibere annullabili',
      'Gestione dei residui passivi, fondi speciali ex art. 1135 n. 4 c.c. e riconciliazione bancaria del conto corrente condominiale',
      'Recupero crediti post-approvazione bilancio e opposizione a decreto ingiuntivo ex art. 63 disp. att. c.c.',
    ],
    programmaOrario: [
      { ora: '14:00 – 14:30', intervento: 'Accreditamento partecipanti tramite QR Code Tessera ANACI e Welcome Coffee offerto dagli Sponsor' },
      { ora: '14:30 – 16:15', intervento: 'Relazione Giuridica: Casistica dei vizi di annullabilità e nullità del rendiconto nel Foro di Bergamo (Avv. C. Belotti)' },
      { ora: '16:15 – 17:45', intervento: 'Relazione Contabile: Redazione della Nota Sintetica e quadratura patrimoniale (Dott. L. Manzoni)' },
      { ora: '17:45 – 18:30', intervento: 'Question Time sui casi critici degli Associati e test finale di verifica DM 140/2014' },
    ],
    sponsorsEvento: [
      { companyName: 'Servizio Unico', sector: 'Consulenza fiscale 770/CU', logoInitials: 'SVU', referent: 'Desk Fiscale ANACI BG' },
      { companyName: 'Studio TJ', sector: 'Recupero del credito condominiale', logoInitials: 'STJ', referent: 'Ufficio Legale Crediti' },
      { companyName: 'Very Fast People', sector: 'Outsourcing e servizi per condomini', logoInitials: 'VFP', referent: 'Numero Verde 800 035452' },
    ],
  },
  {
    id: 'ev-02',
    codice: 'DM140-BG-2026-10',
    titolo: 'Sicurezza Antincendio, Linee Vita e Responsabilità Penale del Committente in Condominio',
    sottotitolo: 'Adempimenti D.M. 25/01/2019 per facciate e autorimesse, verifiche ascensori DPR 162/99 e dispositivi anticaduta in copertura',
    tipologiaEvento: 'WEBINAR_FORMATIVO',
    relatori: 'Ing. Paolo Milesi (Centro Studi ANACI BG) • Tecnici Specialisti Partner Antincendio & Sicurezza',
    data: 'Venerdì 13 Novembre 2026',
    orario: '09:00 – 13:00 (Collegamento ore 08:45)',
    modalita: 'Webinar Live ANACI',
    luogoNome: 'Piattaforma Streaming Certificata FAD ANACI Bergamo',
    luogoIndirizzo: 'Diretta Live da Sede ANACI BG (Accesso con tracciamento presenza DM 140/2014)',
    mappaUrl: 'https://formazione.anacibergamo.it/live/DM140-BG-2026-10',
    cfp: 3,
    materia: 'Area Tecnica e Sicurezza (DM 140/2014)',
    iscritto: false,
    postiRimasti: 48,
    capienzaMassima: 250,
    locandinaColore: 'RED',
    locandinaBadge: 'FOCUS SICUREZZA & VVF • +3 CFP',
    patrocinio: 'Commissione Tecnica e Sicurezza ANACI Bergamo',
    quotaPartecipazione: 'Gratuito per Associati ANACI BG • Accesso con link personale univoco',
    linkIscrizione: 'https://formazione.anacibergamo.it/iscrizione/DM140-BG-2026-10',
    temiTrattati: [
      'Scadenze CPI / SCIA Antincendio per autorimesse condominiali (>300 mq) e centrali termiche: responsabilità dell’Amministratore',
      'Installazione colonnine di ricarica veicoli elettrici (Wallbox) nei box e pulsante di sgancio generale VVF',
      'Accesso in copertura per manutenzioni: fascicolo tecnico della Linea Vita (normativa Regione Lombardia) e controllo periodico DPI',
      'Verifiche periodiche biennali ascensori (DPR 162/99) e impianti di messa a terra (DPR 462/01)',
    ],
    programmaOrario: [
      { ora: '08:45 – 09:00', intervento: 'Check-in digitale su piattaforma FAD ANACI e saluti della Presidenza Provinciale' },
      { ora: '09:00 – 10:30', intervento: 'Prevenzione Incendi in Condominio e gestione registri controlli periodici (Ing. P. Milesi & Crotti Safety / Rear GSA)' },
      { ora: '10:30 – 11:45', intervento: 'Linee Vita, ancoraggi permanenti e responsabilità ex D.Lgs. 81/2008 per lavori in quota (Focus Sonzogni Sintesi)' },
      { ora: '11:45 – 13:00', intervento: 'Ispezioni obbligatorie DPR 462/01 e sicurezza impianti elevatori (Focus CSDM & Duelle Lift)' },
    ],
    sponsorsEvento: [
      { companyName: 'Crotti Safety', sector: 'Antincendio', logoInitials: 'CRS', referent: 'Tel. 035 6304701' },
      { companyName: 'Rear GSA (Gruppo Rear)', sector: 'Antincendio', logoInitials: 'REA', referent: 'Tel. 035 344509' },
      { companyName: 'Sonzogni Sintesi', sector: 'Dispositivi anticaduta e linee vita', logoInitials: 'SNZ', referent: 'Tel. 035 0448433' },
      { companyName: 'CSDM', sector: 'Ente di Certificazione e Ispezione', logoInitials: 'CSD', referent: 'Tel. 02 56816188' },
      { companyName: 'Duelle Lift', sector: 'Ascensori', logoInitials: 'DLL', referent: 'Stefano Pegorari' },
    ],
  },
  {
    id: 'ev-03',
    codice: 'DM140-BG-2026-11',
    titolo: 'Intelligenza Artificiale, Privacy GDPR e Videosorveglianza nelle Parti Comuni Condominiali',
    sottotitolo: 'Automazione dello studio professionale con l’IA, assemblee in modalità mista ex art. 66 disp. att. c.c. e ispezioni del Garante Privacy',
    tipologiaEvento: 'SEMINARIO_SEDE',
    relatori: 'Dott. Marco Locatelli • Commissione Digitalizzazione ANACI BG • Esperti DPO GDPR',
    data: 'Giovedì 26 Novembre 2026',
    orario: '15:00 – 18:00 (Registrazione ore 14:30)',
    modalita: 'In Presenza (Via V. Bellini 43, BG)',
    luogoNome: 'Sala Conferenze Sede Provinciale ANACI Bergamo',
    luogoIndirizzo: 'Via Vincenzo Bellini 43, 24129 Bergamo (BG)',
    mappaUrl: 'https://maps.google.com/?q=Via+Vincenzo+Bellini+43+Bergamo',
    cfp: 3,
    materia: 'Deontologia e Innovazione Digitale',
    iscritto: false,
    postiRimasti: 19,
    capienzaMassima: 65,
    locandinaColore: 'NAVY',
    locandinaBadge: 'INNOVAZIONE & AI • +3 CFP',
    patrocinio: 'Commissione Digitalizzazione & Gruppo Giovani ANACI Bergamo',
    quotaPartecipazione: 'Gratuito per Associati ANACI BG',
    linkIscrizione: 'https://formazione.anacibergamo.it/iscrizione/DM140-BG-2026-11',
    temiTrattati: [
      'Utilizzo pratico dell’Intelligenza Artificiale Generativa (ANACI Bot) per redazione verbali, diffide e comparazione capitolati d’appalto',
      'Installazione telecamere sulle parti comuni (art. 1122-ter c.c.): quorum deliberativo, cartellonistica, tempi di conservazione immagini e nomina Responsabile Esterno',
      'Bacheca condominiale digitale, sito internet del condominio (art. 71-ter disp. att. c.c.) e divieto di diffusione dati dei morosi',
      'Validità della convocazione e gestione dell’assemblea in videoconferenza / modalità mista ex art. 66 disp. att. c.c.',
    ],
    programmaOrario: [
      { ora: '14:30 – 15:00', intervento: 'Registrazione partecipanti in Via V. Bellini 43 e consegna kit operativo modulistica GDPR' },
      { ora: '15:00 – 16:30', intervento: 'Workshop Live: AI applicata allo Studio di Amministrazione Condominiale (Commissione Digitalizzazione)' },
      { ora: '16:30 – 17:30', intervento: 'Videosorveglianza e gestione richieste di accesso agli atti senza violare il GDPR' },
      { ora: '17:30 – 18:00', intervento: 'Dibattito, simulazione casi pratici e accreditamento 3 CFP DM 140/2014' },
    ],
    sponsorsEvento: [
      { companyName: 'Tutto Ufficio', sector: 'Forniture e sistemi stampa per l’amministratore', logoInitials: 'TUF', referent: 'Tel. 02 9092683' },
      { companyName: 'SoQuick', sector: 'Servizi operativi rapidi per condomini', logoInitials: 'SOQ', referent: 'Nadia Domanico' },
      { companyName: 'Tresessanta Group', sector: 'Global Service per condomini', logoInitials: '360', referent: 'Backoffice 035 0086961' },
    ],
  },
  {
    id: 'ev-04',
    codice: 'CONV-BG-2026-12',
    titolo: 'ANACI Bergamo Day 2026 — Convegno Provinciale Energia, Direttiva Case Green (EPBD) e Grandi Condomini',
    sottotitolo: 'Stagione termica 2026/2027, contabilizzazione del calore UNI 10200, contratti di fornitura gas/luce e riqualificazione del patrimonio edilizio bergamasco',
    tipologiaEvento: 'CONVEGNO_PROVINCIALE',
    relatori: 'Presidenza Nazionale e Provinciale ANACI • Magistrati Trib. Bergamo • Docenti Universitari & Partner Energetici',
    data: 'Venerdì 11 Dicembre 2026',
    orario: '09:00 – 17:30 (Light Lunch & Expo Partner inclusi)',
    modalita: 'Convegno in Presenza (Bergamo)',
    luogoNome: 'Centro Congressi Giovanni XXIII — Sala Oggioni',
    luogoIndirizzo: 'Viale Papa Giovanni XXIII 106, 24121 Bergamo (BG)',
    mappaUrl: 'https://maps.google.com/?q=Centro+Congressi+Giovanni+XXIII+Bergamo',
    cfp: 6,
    materia: 'Convegno Plenaria Multidisciplinare (6 CFP DM 140/2014)',
    iscritto: false,
    postiRimasti: 34,
    capienzaMassima: 300,
    locandinaColore: 'GOLD',
    locandinaBadge: 'EVENTO ANNUALE PLENARIO • +6 CFP',
    patrocinio: 'ANACI Sede Provinciale di Bergamo • Con il Patrocinio del Comune e della Provincia di Bergamo',
    quotaPartecipazione: 'Gratuito per Associati ANACI BG (Comprensivo di Kit Congressuale e Light Buffet)',
    linkIscrizione: 'https://formazione.anacibergamo.it/iscrizione/CONV-BG-2026-12',
    temiTrattati: [
      'Direttiva Europea Case Green (EPBD) e piano di efficientamento per il parco condominiale di Bergamo e provincia',
      'Gestione contratti di fornitura Energia Elettrica e Gas Condominiale: tutela dalla volatilità dei prezzi, accise agevolate e switching consapevole',
      'Contabilizzazione del calore, ripartitori wireless, diagnosi energetica e applicazione corretta della norma UNI 10200',
      'Tavola Rotonda con i Partner Ufficiali ANACI Servizi Integrati S.r.l. e premiazione anzianità associativa ANACI Bergamo',
    ],
    programmaOrario: [
      { ora: '08:30 – 09:15', intervento: 'Registrazione partecipanti presso Foyer Centro Congressi Giovanni XXIII e apertura Desk Sponsor' },
      { ora: '09:15 – 11:00', intervento: 'Sessione Mattutina: Scenari energetici 2027, centrali termiche e Direttiva Case Green' },
      { ora: '11:00 – 13:00', intervento: 'Tavola Rotonda Giuridico-Tecnica: Contabilizzazione calore, distacchi e morosità energetica' },
      { ora: '13:00 – 14:30', intervento: 'Light Lunch di Networking offerto dagli Sponsor negli spazi espositivi' },
      { ora: '14:30 – 17:30', intervento: 'Sessione Pomeridiana, Esame Finale DM 140/2014 in sede e Brindisi Natalizio Associati ANACI BG' },
    ],
    sponsorsEvento: [
      { companyName: 'Bergamo Gas e Luce', sector: 'Energia elettrica e gas', logoInitials: 'BGL', referent: 'Ilario Centimerio' },
      { companyName: 'DTS Srl', sector: 'Energia elettrica e gas', logoInitials: 'DTS', referent: 'Gianluca Piro' },
      { companyName: 'Energy Up', sector: 'Energia elettrica e gas', logoInitials: 'EUP', referent: 'Numero Verde 800 567567' },
      { companyName: 'Simecom', sector: 'Energia elettrica e gas', logoInitials: 'SIM', referent: 'Alessandro Gallo' },
      { companyName: 'Promax Energia', sector: 'Energia elettrica e gas', logoInitials: 'PMX', referent: 'Gregory Airopetyan' },
      { companyName: 'Infinity Control Service', sector: 'Contabilizzazione del calore', logoInitials: 'ICS', referent: 'Tel. 035 0433829' },
    ],
  },
];

export const TERRITORIAL_ALERTS: TerritorialAlert[] = [
  {
    id: 'al-01',
    tipo: 'EMERGENZA_RETE',
    ente: 'Uniacque S.p.A. — Bergamo',
    zona: 'Bergamo Città (Quartiere Loreto / Via Broseta)',
    titolo: 'Interruzione programmata e cali di pressione rete idrica per sostituzione valvole',
    descrizione:
      'Attenzione agli impianti autoclave condominiali privi di protezione marcia a secco: interruzione prevista martedì 20/10 dalle 08:30 alle 15:30.',
    data: 'Attivo • 20 Ott 2026',
    condominiCoinvolti: 24,
  },
  {
    id: 'al-02',
    tipo: 'ORDINANZA_BG',
    ente: 'Comune di Bergamo & Regione Lombardia',
    zona: 'Bergamo Città e Comuni Fascia 1',
    titolo: 'Stagione Termica 2026/2027: limiti orari accensione impianti centralizzati (14 ore/giorno, 19°C + 2°C tolleranza)',
    descrizione:
      'Indicazioni operative per i Terzi Responsabili e deroghe per edifici dotati di contabilizzazione e termoregolazione evoluta.',
    data: 'Ordinanza Sindacale • Ott 2026',
    condominiCoinvolti: 410,
  },
  {
    id: 'al-03',
    tipo: 'BANDO',
    ente: 'Regione Lombardia / Comune di Bergamo',
    zona: 'Intera Provincia di Bergamo',
    titolo: 'Bando Regionale Eliminazione Barriere Architettoniche (L. 13/89 e Fondo Regionale Montascale/Ascensori)',
    descrizione:
      'Finestra aperta per la presentazione delle domande condominiali relative a rampe, servoscala e adeguamento ascensori esistenti.',
    data: 'Scadenza 30 Nov 2026',
  },
];

export const STATUTE_ARTICLES: StatuteArticleItem[] = [
  {
    id: 'stat-art-1',
    titoloSezione: 'TITOLO I - Costituzione, Sede e Finalità',
    numeroArticolo: 1,
    etichettaArticolo: 'Art. 1',
    rubrica: 'Costituzione, Denominazione e Riferimenti Normativi',
    contenutoTesto:
      "È costituita l'Associazione Nazionale Amministratori Condominiali e Immobiliari (in sigla ANACI), libera associazione professionale di natura privatistica senza scopo di lucro ai sensi della Legge 14 gennaio 2013, n. 4. La Sezione Provinciale di Bergamo costituisce l'articolazione territoriale autonoma per la provincia di Bergamo, con sede in Via Vincenzo Bellini 43, Bergamo.",
    paroleChiave: ['costituzione', 'legge 4/2013', 'sede', 'bergamo', 'scopo di lucro'],
  },
  {
    id: 'stat-art-2',
    titoloSezione: 'TITOLO I - Costituzione, Sede e Finalità',
    numeroArticolo: 2,
    etichettaArticolo: 'Art. 2',
    rubrica: 'Scopi e Attività Istituzionali',
    contenutoTesto:
      "L'Associazione ha lo scopo di tutelare e promuovere la figura professionale dell'amministratore condominiale e immobiliare, curarne l'aggiornamento scientifico e culturale tramite il Centro Studi, vigilare sul rispetto del Codice Deontologico, rilasciare l'attestazione di qualità e qualificazione professionale dei servizi (ex L. 4/2013) e promuovere convenzioni a vantaggio degli associati e dei condomini amministrati.",
    paroleChiave: ['scopi', 'tutela professionale', 'centro studi', 'attestazione qualità', 'formazione'],
  },
  {
    id: 'stat-art-3',
    titoloSezione: 'TITOLO II - I Soci',
    numeroArticolo: 3,
    etichettaArticolo: 'Art. 3',
    rubrica: 'Requisiti di Ammissione e Qualifica di Associato',
    contenutoTesto:
      "Possono essere ammessi come Soci Ordinari i soggetti che esercitano l'attività di amministratore condominiale e immobiliare in possesso dei requisiti di onorabilità e professionalità previsti dall'art. 71-bis disp. att. c.c. e dal D.M. 140/2014, che abbiano superato il corso di formazione iniziale e accettino integralmente il presente Statuto e il Codice Deontologico.",
    paroleChiave: ['ammissione', 'requisiti', 'art. 71-bis', 'dm 140/2014', 'soci ordinari'],
  },
  {
    id: 'stat-art-4',
    titoloSezione: 'TITOLO II - I Soci',
    numeroArticolo: 4,
    etichettaArticolo: 'Art. 4',
    rubrica: 'Diritti e Doveri degli Associati',
    contenutoTesto:
      'Gli associati in regola con il versamento della quota associativa annuale e con gli obblighi di aggiornamento professionale continuo (almeno 15 CFP annui ex D.M. 140/2014) hanno diritto di elettorato attivo e passivo nelle assemblee, di utilizzo del marchio/bollino annuale ANACI e di accesso ai servizi del Centro Studi e dello Sportello del Consumatore.',
    paroleChiave: ['diritti', 'doveri', 'quota associativa', '15 cfp', 'elettorato', 'bollino'],
  },
  {
    id: 'stat-art-5',
    titoloSezione: 'TITOLO II - I Soci',
    numeroArticolo: 5,
    etichettaArticolo: 'Art. 5',
    rubrica: 'Perdita della Qualifica di Socio e Sanzioni Disciplinari',
    contenutoTesto:
      "La qualifica di Socio si perde per recesso volontario, mancato rinnovo della quota associativa entro i termini stabiliti, perdita dei requisiti di legge (art. 71-bis disp. att. c.c.), mancato assolvimento dell'obbligo formativo annuale o provvedimento definitivo di radiazione deliberato dagli organi di giustizia interna per gravi violazioni deontologiche.",
    paroleChiave: ['decadenza', 'recesso', 'morosità quota', 'sanzioni', 'radiazione', 'deontologia'],
  },
  {
    id: 'stat-art-6',
    titoloSezione: 'TITOLO III - Struttura Territoriale e Sezione Provinciale',
    numeroArticolo: 6,
    etichettaArticolo: 'Art. 6',
    rubrica: 'Organi della Sezione Provinciale',
    contenutoTesto:
      "Sono organi della Sezione Provinciale: l'Assemblea Provinciale degli Associati, il Presidente Provinciale, il Consiglio Provinciale, il Segretario Provinciale, il Tesoriere Provinciale e il Centro Studi Provinciale. Tutte le cariche associative sono elettive e hanno durata quadriennale.",
    paroleChiave: ['organi provinciali', 'assemblea', 'presidente', 'consiglio provinciale', 'tesoriere', 'durata cariche'],
  },
  {
    id: 'stat-art-7',
    titoloSezione: 'TITOLO III - Struttura Territoriale e Sezione Provinciale',
    numeroArticolo: 7,
    etichettaArticolo: 'Art. 7',
    rubrica: 'Assemblea Provinciale dei Soci',
    contenutoTesto:
      "L'Assemblea Provinciale è costituita da tutti i Soci iscritti alla Sezione di Bergamo in regola con il pagamento della quota annuale. Si riunisce in via ordinaria almeno una volta l'anno per l'approvazione del rendiconto economico-finanziario consuntivo e preventivo, e ogni quattro anni per l'elezione degli organi provinciali e dei delegati.",
    paroleChiave: ['assemblea provinciale', 'voto', 'bilancio', 'rendiconto', 'elezioni', 'convocazione'],
  },
  {
    id: 'stat-art-8',
    titoloSezione: 'TITOLO IV - Trasparenza, Deontologia e Sportello del Cittadino',
    numeroArticolo: 8,
    etichettaArticolo: 'Art. 8',
    rubrica: "Codice Deontologico, Formazione Continua e Tutela dell'Utenza",
    contenutoTesto:
      "L'Associazione garantisce la trasparenza del proprio operato attraverso la pubblicazione dell'elenco aggiornato degli associati, del Codice Deontologico e l'attivazione dello Sportello di riferimento per il cittadino-consumatore (art. 2, comma 4, Legge 4/2013), presso il quale i committenti possono rivolgersi in caso di contenzioso o per ottenere informazioni sull'attività professionale.",
    paroleChiave: ['codice deontologico', 'sportello consumatore', 'trasparenza', 'elenco soci', 'tutela utenza'],
  },
];

export const DEFAULT_CONDO_QUOTE_INPUT: CondoQuoteInput = {
  condominioNome: 'Condominio Residenza Parco Suardi',
  indirizzoCondominio: 'Via Bartolomeo Bono 14, 24121 Bergamo (BG)',
  zona: 'Bergamo Città',
  unitaPrincipali: 24,
  pertinenzeBoxCantine: 28,
  scalePalazzine: 2,
  numAscensori: 2,
  riscaldamentoCentralizzato: true,
  contabilizzazioneCaloreUni10200: true,
  areaVerdeCondominiale: true,
  portineriaCustode: false,
  supercondominio: false,
  includiPassaggioConsegne: false,
  regimeFiscale: 'ORDINARIO_IVA',
  cassaPrevidenzialePct: 4,
  aliquotaIvaPct: 22,
};

export function calculateCondoQuote(
  input: CondoQuoteInput,
  studioName = 'Studio Associato ANACI Bergamo'
): CondoQuoteResult {
  const voci: CondoQuoteLineItem[] = [];
  const u = Math.max(1, input.unitaPrincipali);
  const p = Math.max(0, input.pertinenzeBoxCantine);
  const scale = Math.max(1, input.scalePalazzine);
  const asc = Math.max(0, input.numAscensori);

  // 1. Quota fissa e scaglioni unità
  const quotaFissa = 450;
  voci.push({
    codice: 'QUOTA_FISSA_STUDIO',
    categoria: 'COMPENSO_BASE',
    descrizione: 'Quota fissa annua di apertura e tenuta gestione condominiale ordinaria',
    quantita: 1,
    importoUnitario: quotaFissa,
    totaleVoce: quotaFissa,
    riferimentoNormativo: 'Art. 1129 c. 14 c.c. - Gestione base',
  });

  const uiFino15 = Math.min(u, 15);
  const ui16a40 = u > 15 ? Math.min(u - 15, 25) : 0;
  const uiOltre40 = u > 40 ? u - 40 : 0;

  if (uiFino15 > 0) {
    voci.push({
      codice: 'SCAGLIONE_UI_FINO_15',
      categoria: 'COMPENSO_BASE',
      descrizione: 'Gestione ordinaria unità principali (1° scaglione fino a 15 u.i.)',
      quantita: uiFino15,
      importoUnitario: 95,
      totaleVoce: uiFino15 * 95,
      riferimentoNormativo: 'Art. 1129 c. 14 c.c.',
    });
  }
  if (ui16a40 > 0) {
    voci.push({
      codice: 'SCAGLIONE_UI_16_40',
      categoria: 'COMPENSO_BASE',
      descrizione: 'Gestione ordinaria unità principali (2° scaglione da 16 a 40 u.i.)',
      quantita: ui16a40,
      importoUnitario: 80,
      totaleVoce: ui16a40 * 80,
      riferimentoNormativo: 'Art. 1129 c. 14 c.c.',
    });
  }
  if (uiOltre40 > 0) {
    voci.push({
      codice: 'SCAGLIONE_UI_OLTRE_40',
      categoria: 'COMPENSO_BASE',
      descrizione: 'Gestione ordinaria unità principali (3° scaglione oltre 40 u.i.)',
      quantita: uiOltre40,
      importoUnitario: 68,
      totaleVoce: uiOltre40 * 68,
      riferimentoNormativo: 'Art. 1129 c. 14 c.c.',
    });
  }
  if (p > 0) {
    voci.push({
      codice: 'QUOTA_PERTINENZA_BOX',
      categoria: 'COMPENSO_BASE',
      descrizione: 'Gestione pertinenze separate (box, posti auto, cantine autonome)',
      quantita: p,
      importoUnitario: 18,
      totaleVoce: p * 18,
      riferimentoNormativo: 'Art. 1129 c. 14 c.c.',
    });
  }

  // 2. Maggiorazioni impianti e complessità
  if (scale > 1) {
    const extraScale = scale - 1;
    voci.push({
      codice: 'MAGG_SCALA_EXTRA',
      categoria: 'IMPIANTI',
      descrizione: 'Maggiorazione gestione corpi di fabbrica/scale aggiuntive e tabelle separate',
      quantita: extraScale,
      importoUnitario: 150,
      totaleVoce: extraScale * 150,
      riferimentoNormativo: 'Art. 1123 c. 3 c.c.',
    });
  }
  if (asc > 0) {
    voci.push({
      codice: 'MAGG_ASCENSORE',
      categoria: 'IMPIANTI',
      descrizione: 'Gestione amministrativa impianti elevatori e verifiche periodiche DPR 162/99',
      quantita: asc,
      importoUnitario: 120,
      totaleVoce: asc * 120,
      riferimentoNormativo: 'D.P.R. 162/1999 e Art. 1124 c.c.',
    });
  }
  if (input.riscaldamentoCentralizzato) {
    voci.push({
      codice: 'MAGG_RISC_CENTRALIZZATO',
      categoria: 'IMPIANTI',
      descrizione: 'Gestione centrale termica, contratti combustibile e Terzo Responsabile',
      quantita: 1,
      importoUnitario: 280,
      totaleVoce: 280,
      riferimentoNormativo: 'D.P.R. 74/2013',
    });
  }
  if (input.riscaldamentoCentralizzato && input.contabilizzazioneCaloreUni10200) {
    voci.push({
      codice: 'MAGG_CONTABILIZZAZIONE_UNI10200',
      categoria: 'IMPIANTI',
      descrizione: 'Elaborazione riparto consumi volontari/involontari riscaldamento UNI 10200',
      quantita: u,
      importoUnitario: 12,
      totaleVoce: u * 12,
      riferimentoNormativo: 'D.Lgs. 102/2014 - Norma UNI 10200',
    });
  }
  if (input.areaVerdeCondominiale) {
    voci.push({
      codice: 'MAGG_AREA_VERDE',
      categoria: 'IMPIANTI',
      descrizione: 'Gestione appalti manutenzione area verde / giardino condominiale',
      quantita: 1,
      importoUnitario: 110,
      totaleVoce: 110,
      riferimentoNormativo: 'Art. 1117 c.c.',
    });
  }
  if (input.portineriaCustode) {
    voci.push({
      codice: 'MAGG_PORTINERIA_CUSTODE',
      categoria: 'IMPIANTI',
      descrizione: 'Gestione amministrativa servizio portineria/custodia e adempimenti CCNL',
      quantita: 1,
      importoUnitario: 420,
      totaleVoce: 420,
      riferimentoNormativo: 'CCNL Proprietari Fabbricati',
    });
  }
  if (input.supercondominio) {
    voci.push({
      codice: 'MAGG_SUPERCONDOMINIO',
      categoria: 'IMPIANTI',
      descrizione: 'Coordinamento e gestione rapporti di Supercondominio',
      quantita: 1,
      importoUnitario: 250,
      totaleVoce: 250,
      riferimentoNormativo: 'Art. 1117-bis e 67 disp. att. c.c.',
    });
  }

  // 3. Adempimenti fiscali obbligatori
  voci.push(
    {
      codice: 'FISC_MOD_770_BASE',
      categoria: 'FISCALE',
      descrizione: 'Predisposizione e invio telematico Modello 770 Condominiale',
      quantita: 1,
      importoUnitario: 180,
      totaleVoce: 180,
      riferimentoNormativo: 'D.P.R. 322/1998',
    },
    {
      codice: 'FISC_CERTIFICAZIONE_UNICA',
      categoria: 'FISCALE',
      descrizione: 'Elaborazione, invio telematico e consegna Certificazioni Uniche (CU)',
      quantita: 1,
      importoUnitario: 120,
      totaleVoce: 120,
      riferimentoNormativo: 'D.P.R. 322/1998',
    },
    {
      codice: 'FISC_QUADRO_AC_K',
      categoria: 'FISCALE',
      descrizione: 'Prospetto Quadro AC / K e aggiornamento Registro Anagrafe Condominiale',
      quantita: 1,
      importoUnitario: 110,
      totaleVoce: 110,
      riferimentoNormativo: 'Art. 1130 n. 6 c.c.',
    }
  );

  // 4. Spese vive e passaggio consegne
  voci.push({
    codice: 'SPESE_CANCELLERIA_SOFTWARE_UI',
    categoria: 'SPESE_VIVE',
    descrizione: 'Forfait annuo piattaforma cloud condomini, archiviazione digitale e cancelleria',
    quantita: u,
    importoUnitario: 14,
    totaleVoce: u * 14,
    riferimentoNormativo: 'Art. 1129 c. 14 c.c.',
  });

  if (input.includiPassaggioConsegne) {
    voci.push({
      codice: 'EXTRA_PASSAGGIO_CONSEGNE',
      categoria: 'SPESE_VIVE',
      descrizione: 'Una tantum subentro, riallineamento contabile iniziale e presa in carico',
      quantita: 1,
      importoUnitario: 250,
      totaleVoce: 250,
      riferimentoNormativo: 'Art. 1129 c. 8 c.c.',
    });
  }

  const compensoBaseAnnuo = voci
    .filter((v) => v.categoria === 'COMPENSO_BASE')
    .reduce((acc, v) => acc + v.totaleVoce, 0);
  const maggiorazioneImpianti = voci
    .filter((v) => v.categoria === 'IMPIANTI')
    .reduce((acc, v) => acc + v.totaleVoce, 0);
  const compensoAdempimentiFiscali = voci
    .filter((v) => v.categoria === 'FISCALE')
    .reduce((acc, v) => acc + v.totaleVoce, 0);
  const rimborsoSpeseForfettario = voci
    .filter((v) => v.categoria === 'SPESE_VIVE')
    .reduce((acc, v) => acc + v.totaleVoce, 0);

  const totaleImponibileStudio =
    compensoBaseAnnuo + maggiorazioneImpianti + compensoAdempimentiFiscali + rimborsoSpeseForfettario;

  const importoCassaPrevidenziale = Math.round(
    totaleImponibileStudio * (input.cassaPrevidenzialePct / 100) * 100
  ) / 100;

  const baseImponibileIva = totaleImponibileStudio + importoCassaPrevidenziale;
  const importoIva =
    input.regimeFiscale === 'ORDINARIO_IVA'
      ? Math.round(baseImponibileIva * (input.aliquotaIvaPct / 100) * 100) / 100
      : 0;

  const totaleLordoAnnuoStudio = Math.round((baseImponibileIva + importoIva) * 100) / 100;
  const costoMensileStudioPerUnita = Math.round((totaleLordoAnnuoStudio / u / 12) * 100) / 100;

  // Benchmark stima budget ordinario condominio (Provincia di Bergamo)
  const puliziaPartiComuni = u * 145;
  const luceAcquaPartiComuni = u * 95;
  const assicurazioneFabbricato = u * 110;
  const manutenzioneAscensori = asc * 1250;
  const riscaldamentoCentralizzato = input.riscaldamentoCentralizzato ? u * 920 : 0;
  const manutenzioneOrdinariaEVerde = u * 65 + (input.areaVerdeCondominiale ? 950 : 0) + (input.portineriaCustode ? 18500 : 0);

  const totaleBudgetOrdinarioAnnuo = Math.round(
    puliziaPartiComuni +
      luceAcquaPartiComuni +
      assicurazioneFabbricato +
      manutenzioneAscensori +
      riscaldamentoCentralizzato +
      manutenzioneOrdinariaEVerde +
      totaleLordoAnnuoStudio
  );

  const rataMediaMensilePerUnita = Math.round(totaleBudgetOrdinarioAnnuo / u / 12);

  const numeroPreventivo = `PREV-BG-2026-${String(u).padStart(2, '0')}${String(scale)}${asc}`;

  const testoPropostaMandatoArt1129 = `PROPOSTA DI MANDATO PROFESSIONALE E DETERMINAZIONE ANALITICA DEL COMPENSO
(Ai sensi dell'Art. 1129, comma 14, Codice Civile e Legge n. 4/2013)

Spett.le Assemblea dei Condomini del "${input.condominioNome}"
Indirizzo: ${input.indirizzoCondominio} (${input.zona})
Composizione: ${u} unità immobiliari principali • ${p} pertinenze • ${scale} scala/e • ${asc} ascensore/i

Lo scrivente ${studioName}, iscritto ad ANACI Sezione Provinciale di Bergamo (in regola con gli obblighi di formazione periodica ex D.M. 140/2014 e coperto da Polizza RC Professionale), sottopone all'Assemblea la seguente determinazione analitica del compenso per l'incarico annuale di amministrazione:

1. Compenso Base Ordinario (Art. 1130 c.c.): € ${compensoBaseAnnuo.toFixed(2)}
2. Maggiorazioni per Impianti e Complessità Stabile: € ${maggiorazioneImpianti.toFixed(2)}
3. Adempimenti Fiscali Obbligatori (Mod. 770, CU, Quadro AC/K): € ${compensoAdempimentiFiscali.toFixed(2)}
4. Spese Forfettarie, Cloud Condomini e Cancelleria: € ${rimborsoSpeseForfettario.toFixed(2)}
--------------------------------------------------------------------------------
TOTALE IMPONIBILE ANNUO STUDIO: € ${totaleImponibileStudio.toFixed(2)}
Cassa Previdenziale (${input.cassaPrevidenzialePct}%): € ${importoCassaPrevidenziale.toFixed(2)}
IVA (${input.regimeFiscale === 'ORDINARIO_IVA' ? `${input.aliquotaIvaPct}%` : 'Esente ex L. 190/2014'}): € ${importoIva.toFixed(2)}
TOTALE LORDO ANNUO OMNICOMPRENSIVO: € ${totaleLordoAnnuoStudio.toFixed(2)} (pari a € ${costoMensileStudioPerUnita.toFixed(2)} / mese per u.i. principale)

Prestazioni Straordinarie/Accessorie (solo ove deliberate o necessarie):
• Assemblea straordinaria ulteriore: € 220,00 oltre oneri
• Gestione amministrativa lavori straordinari (Art. 1135 c.c.): 2,50% sull'importo deliberato
• Diffida e messa in mora individuale condomino moroso: € 25,00 (a carico del singolo moroso)`;

  return {
    numeroPreventivo,
    vociAnalitiche: voci,
    compensoBaseAnnuo,
    maggiorazioneImpianti,
    compensoAdempimentiFiscali,
    rimborsoSpeseForfettario,
    totaleImponibileStudio,
    importoCassaPrevidenziale,
    importoIva,
    totaleLordoAnnuoStudio,
    costoMensileStudioPerUnita,
    stimaBudgetCondominio: {
      puliziaPartiComuni,
      luceAcquaPartiComuni,
      assicurazioneFabbricato,
      manutenzioneAscensori,
      riscaldamentoCentralizzato,
      manutenzioneOrdinariaEVerde,
      compensoAmministratoreLordo: totaleLordoAnnuoStudio,
      totaleBudgetOrdinarioAnnuo,
      rataMediaMensilePerUnita,
    },
    tariffeAccessorieExtra: {
      assembleaStraordinaria: 220,
      percentualeLavoriStraordinari: 2.5,
      sollecitoMorosita: 25,
    },
    testoPropostaMandatoArt1129,
  };
}

export const CURRENT_MEMBER_ASSEMBLY: MemberAssemblyInfo = {
  id: 'ass-bg-2026-ord',
  codiceAssemblea: 'ASS-BG-2026-ORD01',
  titolo: 'Assemblea Ordinaria ed Elettiva dei Soci ANACI Bergamo 2026',
  sottotitolo:
    'Approvazione Rendiconto Economico-Finanziario, Integrazione Organi Provinciali e Mozioni Territoriali (Art. 7 Statuto ANACI)',
  dataOra: 'Sessione Attiva • Oggi, ore 14:30 – 19:00',
  luogoFisico: 'Centro Congressi Giovanni XXIII (Viale Papa Giovanni XXIII, 106 - Bergamo) & Sede Via V. Bellini 43',
  piattaformaOnline: 'Diretta Streaming ANACI Bergamo Live (QR Code in sovraimpressione regia)',
  qrTokenIngresso: 'ANACI-BG-VARCO-INGRESSO-2026',
  qrTokenOnline: 'ANACI-BG-DIRETTA-ONLINE-2026',
  cfpRiconosciuti: 3,
  aventiDirittoTotali: 318,
  quorumCostitutivoRichiesto: 106,
  presentiInSalaQr: 94,
  presentiOnlineQr: 48,
  delegheValidateTotali: 29,
};

export const AVAILABLE_DELEGATING_MEMBERS: DelegatingMemberItem[] = [
  {
    codiceAssociato: 'BG-0814',
    fullName: 'Rag. Stefano Ghezzi',
    studioName: 'Studio Ghezzi Amministrazioni S.r.l.',
    zona: 'Bergamo Città',
    regolareQuotaECfp: true,
  },
  {
    codiceAssociato: 'BG-0915',
    fullName: 'Geom. Elena Rossi',
    studioName: 'Studio Tecnico Immobiliare Rossi',
    zona: 'Val Seriana / Seriate',
    regolareQuotaECfp: true,
  },
  {
    codiceAssociato: 'BG-0765',
    fullName: 'Dott.ssa Laura Vitali',
    studioName: 'Vitali Gestione Patrimoni Condominiali',
    zona: 'Bergamo Centro',
    regolareQuotaECfp: true,
  },
  {
    codiceAssociato: 'BG-1188',
    fullName: 'Rag. Davide Cortinovis',
    studioName: 'Studio Cortinovis Condomini',
    zona: 'Isola Bergamasca',
    regolareQuotaECfp: true,
  },
];

export const INITIAL_ASSEMBLY_POLLS: AssemblyPollItem[] = [
  {
    id: 'poll-bg-01',
    numeroPuntoOdg: 1,
    titolo: 'Approvazione Rendiconto Consuntivo 2025 e Bilancio Preventivo 2026 Sezione di Bergamo',
    descrizione:
      'Deliberazione ai sensi dell’Art. 7 dello Statuto ANACI sulla relazione del Tesoriere Provinciale, del Collegio dei Revisori dei Conti e sul budget 2026 destinato a formazione gratuita DM 140/2014 e potenziamento del Centro Studi Provinciale.',
    riferimentoStatuto: 'Art. 7 Statuto ANACI — Assemblea Provinciale Ordinaria',
    tipoScrutinio: 'VOTO_PALESE',
    maxPreferenze: 1,
    stato: 'APERTA',
    opzioni: [
      {
        id: 'opt-p1-fav',
        label: 'FAVOREVOLE (Approvo il Bilancio)',
        subLabel: 'Approvazione integrale della relazione contabile e del preventivo 2026',
        votiCount: 148,
        colorClass: 'bg-[#008051]',
      },
      {
        id: 'opt-p1-con',
        label: 'CONTRARIO',
        subLabel: 'Non approvo il rendiconto presentato',
        votiCount: 4,
        colorClass: 'bg-[#C23030]',
      },
      {
        id: 'opt-p1-ast',
        label: 'ASTENUTO',
        subLabel: 'Presente ai fini del quorum ma astenuto dalla votazione',
        votiCount: 11,
        colorClass: 'bg-[#6B7280]',
      },
    ],
  },
  {
    id: 'poll-bg-02',
    numeroPuntoOdg: 2,
    titolo: 'Elezione Supplpletiva Consiglieri Provinciali & Delegati Congresso Nazionale (Max 2 Preferenze)',
    descrizione:
      'Scrutinio elettronico segreto e crittografato ai sensi degli Artt. 6 e 7 dello Statuto. Ciascun socio accreditato (in sala tramite QR ingresso o da remoto tramite QR online) può esprimere fino a 2 preferenze.',
    riferimentoStatuto: 'Artt. 4, 6 e 7 Statuto ANACI — Elettorato Attivo e Passivo',
    tipoScrutinio: 'SCRUTINIO_SEGRETO_ELEZIONI',
    maxPreferenze: 2,
    stato: 'APERTA',
    opzioni: [
      {
        id: 'cand-01',
        label: 'Dott. Alessandro Rota (#BG-0312)',
        subLabel: 'Bergamo Città • Delega Rapporti Enti Locali, A2A e Uniacque',
        badge: 'Candidato Consiglio Provinciale',
        votiCount: 92,
      },
      {
        id: 'cand-02',
        label: 'Avv. Francesca Milesi (#BG-0544)',
        subLabel: 'Città Alta & Colli • Commissione Giuridica e Contenzioso Condominiale',
        badge: 'Candidata Consiglio Provinciale',
        votiCount: 87,
      },
      {
        id: 'cand-03',
        label: 'Ing. Giorgio Cattaneo (#BG-0689)',
        subLabel: 'Val Seriana • Commissione Tecnica Impianti, Antincendio e UNI 10200',
        badge: 'Candidato Consiglio Provinciale',
        votiCount: 69,
      },
      {
        id: 'cand-04',
        label: 'Dott.ssa Paola Belotti (#BG-0902)',
        subLabel: 'Bassa Bergamasca / Treviglio • Commissione Fisco, 770 e Giovani Amministratori',
        badge: 'Candidata Consiglio Provinciale',
        votiCount: 64,
      },
    ],
  },
  {
    id: 'poll-bg-03',
    numeroPuntoOdg: 3,
    titolo: 'Mozione Istituzionale: Tavolo Permanente con Tribunale di Bergamo (Sez. IV Civile ed Esecuzioni)',
    descrizione:
      'Mandato al Presidente e al Consiglio Provinciale di sottoscrivere il nuovo Protocollo Operativo con il Tribunale di Bergamo per la velocizzazione dei Decreti Ingiuntivi ex Art. 63 disp. att. c.c. e delle procedure esecutive immobiliari con nomina custodi/delegati.',
    riferimentoStatuto: 'Art. 2 Statuto ANACI — Tutela della Professione e Rapporti Istituzionali',
    tipoScrutinio: 'MOZIONE_ISTITUZIONALE',
    maxPreferenze: 1,
    stato: 'APERTA',
    opzioni: [
      {
        id: 'opt-p3-fav',
        label: 'FAVOREVOLE (Approvo il Protocollo)',
        subLabel: 'Conferisco mandato per la sottoscrizione del Protocollo col Tribunale di Bergamo',
        votiCount: 159,
        colorClass: 'bg-[#008051]',
      },
      {
        id: 'opt-p3-con',
        label: 'CONTRARIO',
        subLabel: 'Contrario alla mozione proposta',
        votiCount: 2,
        colorClass: 'bg-[#C23030]',
      },
      {
        id: 'opt-p3-ast',
        label: 'ASTENUTO',
        subLabel: 'Astenuto sulla mozione',
        votiCount: 5,
        colorClass: 'bg-[#6B7280]',
      },
    ],
  },
];

