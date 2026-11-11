-- ============================================================================
-- ANACI BG HUB - POPOLAMENTO INIZIALE STATUTO E ARTICOLI PRINCIPALI
-- Statuto Associativo, Articolazione Provinciale di Bergamo e Deontologia
-- ============================================================================

-- 1. Inserimento del Documento Ufficiale dello Statuto
INSERT INTO institutional_documents (
    id, slug, tipo_documento, titolo, versione, data_approvazione,
    ente_approvazione, descrizione_sintetica, file_pdf_url, is_current, richiede_presa_visione
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'statuto-anaci-vigente',
    'STATUTO',
    'Statuto Nazionale ANACI e Ordinamento delle Sezioni Provinciali',
    'Edizione vigente',
    '2024-01-01',
    'Congresso Nazionale ANACI - Adottato dalla Sezione Provinciale di Bergamo',
    'Testo coordinato dello Statuto dell''Associazione Nazionale Amministratori Condominiali e Immobiliari (Legge 4/2013), comprensivo delle norme su requisiti di iscrizione, organi territoriali, obblighi formativi DM 140/2014 e procedimenti disciplinari.',
    '/assets/docs/Statuto_ANACI_Ufficiale.pdf',
    TRUE,
    TRUE
);

-- 2. Inserimento degli Articoli Principali dello Statuto (consultabili e filtrabili in-app)
INSERT INTO statute_articles (
    document_id, titolo_sezione, numero_articolo, etichetta_articolo,
    rubrica, contenuto_testo, parole_chiave, ordine_visualizzazione
) VALUES
(
    'a0000000-0000-0000-0000-000000000001',
    'TITOLO I - Costituzione, Sede e Finalità',
    1,
    'Art. 1',
    'Costituzione, Denominazione e Riferimenti Normativi',
    'È costituita l''Associazione Nazionale Amministratori Condominiali e Immobiliari (in sigla ANACI), libera associazione professionale di natura privatistica senza scopo di lucro ai sensi della Legge 14 gennaio 2013, n. 4. La Sezione Provinciale di Bergamo costituisce l''articolazione territoriale autonoma per la provincia di Bergamo, con sede in Via Vincenzo Bellini 43, Bergamo.',
    ARRAY['costituzione', 'legge 4/2013', 'sede', 'bergamo', 'scopo di lucro'],
    1
),
(
    'a0000000-0000-0000-0000-000000000001',
    'TITOLO I - Costituzione, Sede e Finalità',
    2,
    'Art. 2',
    'Scopi e Attività Istituzionali',
    'L''Associazione ha lo scopo di tutelare e promuovere la figura professionale dell''amministratore condominiale e immobiliare, curarne l''aggiornamento scientifico e culturale tramite il Centro Studi, vigilare sul rispetto del Codice Deontologico, rilasciare l''attestazione di qualità e qualificazione professionale dei servizi (ex L. 4/2013) e promuovere convenzioni a vantaggio degli associati e dei condomini amministrati.',
    ARRAY['scopi', 'tutela professionale', 'centro studi', 'attestazione qualità', 'formazione'],
    2
),
(
    'a0000000-0000-0000-0000-000000000001',
    'TITOLO II - I Soci',
    3,
    'Art. 3',
    'Requisiti di Ammissione e Qualifica di Associato',
    'Possono essere ammessi come Soci Ordinari i soggetti che esercitano l''attività di amministratore condominiale e immobiliare in possesso dei requisiti di onorabilità e professionalità previsti dall''art. 71-bis disp. att. c.c. e dal D.M. 140/2014, che abbiano superato il corso di formazione iniziale e accettino integralmente il presente Statuto e il Codice Deontologico.',
    ARRAY['ammissione', 'requisiti', 'art. 71-bis', 'dm 140/2014', 'soci ordinari'],
    3
),
(
    'a0000000-0000-0000-0000-000000000001',
    'TITOLO II - I Soci',
    4,
    'Art. 4',
    'Diritti e Doveri degli Associati',
    'Gli associati in regola con il versamento della quota associativa annuale e con gli obblighi di aggiornamento professionale continuo (almeno 15 CFP annui ex D.M. 140/2014) hanno diritto di elettorato attivo e passivo nelle assemblee, di utilizzo del marchio/bollino annuale ANACI e di accesso ai servizi del Centro Studi e dello Sportello del Consumatore.',
    ARRAY['diritti', 'doveri', 'quota associativa', '15 cfp', 'elettorato', 'bollino'],
    4
),
(
    'a0000000-0000-0000-0000-000000000001',
    'TITOLO II - I Soci',
    5,
    'Art. 5',
    'Perdita della Qualifica di Socio e Sanzioni Disciplinari',
    'La qualifica di Socio si perde per recesso volontario, mancato rinnovo della quota associativa entro i termini stabiliti, perdita dei requisiti di legge (art. 71-bis disp. att. c.c.), mancato assolvimento dell''obbligo formativo annuale o provvedimento definitivo di radiazione deliberato dagli organi di giustizia interna per gravi violazioni deontologiche.',
    ARRAY['decadenza', 'recesso', 'morosità quota', 'sanzioni', 'radiazione', 'deontologia'],
    5
),
(
    'a0000000-0000-0000-0000-000000000001',
    'TITOLO III - Struttura Territoriale e Sezione Provinciale',
    6,
    'Art. 6',
    'Organi della Sezione Provinciale',
    'Sono organi della Sezione Provinciale: l''Assemblea Provinciale degli Associati, il Presidente Provinciale, il Consiglio Provinciale, il Segretario Provinciale, il Tesoriere Provinciale e il Centro Studi Provinciale. Tutte le cariche associative sono elettive e hanno durata quadriennale.',
    ARRAY['organi provinciali', 'assemblea', 'presidente', 'consiglio provinciale', 'tesoriere', 'durata cariche'],
    6
),
(
    'a0000000-0000-0000-0000-000000000001',
    'TITOLO III - Struttura Territoriale e Sezione Provinciale',
    7,
    'Art. 7',
    'Assemblea Provinciale dei Soci',
    'L''Assemblea Provinciale è costituita da tutti i Soci iscritti alla Sezione di Bergamo in regola con il pagamento della quota annuale. Si riunisce in via ordinaria almeno una volta l''anno per l''approvazione del rendiconto economico-finanziario consuntivo e preventivo, e ogni quattro anni per l''elezione degli organi provinciali e dei delegati.',
    ARRAY['assemblea provinciale', 'voto', 'bilancio', 'rendiconto', 'elezioni', 'convocazione'],
    7
),
(
    'a0000000-0000-0000-0000-000000000001',
    'TITOLO IV - Trasparenza, Deontologia e Sportello del Cittadino',
    8,
    'Art. 8',
    'Codice Deontologico, Formazione Continua e Tutela dell''Utenza',
    'L''Associazione garantisce la trasparenza del proprio operato attraverso la pubblicazione dell''elenco aggiornato degli associati, del Codice Deontologico e l''attivazione dello Sportello di riferimento per il cittadino-consumatore (art. 2, comma 4, Legge 4/2013), presso il quale i committenti possono rivolgersi in caso di contenzioso o per ottenere informazioni sull''attività professionale.',
    ARRAY['codice deontologico', 'sportello consumatore', 'trasparenza', 'elenco soci', 'tutela utenza'],
    8
);
